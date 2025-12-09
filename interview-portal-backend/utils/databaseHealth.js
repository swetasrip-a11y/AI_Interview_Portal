/**
 * Database Health Check & Recovery
 * Monitors and maintains database integrity and connection health
 */

const db = require('../models/database');
const Logger = require('./logger');

const logger = new Logger('DB_HEALTH');

class DatabaseHealth {
  /**
   * Check if database is healthy
   */
  static async checkHealth() {
    try {
      const result = await db.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'");
      if (!result) {
        throw new Error('Database query failed');
      }
      logger.success('Database health check passed');
      return { healthy: true, tables: result.count };
    } catch (err) {
      logger.error('Database health check failed', err);
      return { healthy: false, error: err.message };
    }
  }

  /**
   * Verify all required tables exist
   */
  static async verifyTables() {
    const requiredTables = [
      'users',
      'questions',
      'interviews',
      'submissions',
      'materials',
      'jobs',
      'interview_reports',
      'performance_metrics'
    ];

    try {
      const existingTables = await db.all(
        "SELECT name FROM sqlite_master WHERE type='table'"
      );
      const existingNames = existingTables.map(t => t.name);

      const missing = requiredTables.filter(t => !existingNames.includes(t));
      
      if (missing.length > 0) {
        logger.warn('Missing tables', { tables: missing });
        return { valid: false, missing };
      }

      logger.success('All required tables exist');
      return { valid: true, tables: existingNames };
    } catch (err) {
      logger.error('Table verification failed', err);
      return { valid: false, error: err.message };
    }
  }

  /**
   * Validate database schema
   */
  static async validateSchema() {
    try {
      const tables = await db.all(
        "SELECT name FROM sqlite_master WHERE type='table'"
      );

      const schema = {};
      for (const table of tables) {
        const columns = await db.all(`PRAGMA table_info(${table.name})`);
        schema[table.name] = columns.map(col => ({
          name: col.name,
          type: col.type,
          notnull: col.notnull,
          pk: col.pk
        }));
      }

      logger.success('Schema validation complete');
      return { valid: true, schema };
    } catch (err) {
      logger.error('Schema validation failed', err);
      return { valid: false, error: err.message };
    }
  }

  /**
   * Get database statistics
   */
  static async getStats() {
    try {
      const stats = {};

      const tables = ['users', 'interviews', 'questions', 'submissions', 'jobs'];
      for (const table of tables) {
        try {
          const result = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
          stats[table] = result?.count || 0;
        } catch (err) {
          logger.warn(`Failed to get count for ${table}`, err.message);
          stats[table] = 0;
        }
      }

      logger.info('Database statistics retrieved', stats);
      return { success: true, stats };
    } catch (err) {
      logger.error('Failed to get database statistics', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Check database file size and fragmentation
   */
  static async getStorageInfo() {
    try {
      const fs = require('fs');
      const path = require('path');

      const dbPath = path.join(__dirname, '../data/database.db');
      if (fs.existsSync(dbPath)) {
        const stats = fs.statSync(dbPath);
        return {
          path: dbPath,
          sizeBytes: stats.size,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          created: stats.birthtime,
          modified: stats.mtime
        };
      }

      return { path: dbPath, exists: false };
    } catch (err) {
      logger.error('Failed to get storage info', err);
      return { error: err.message };
    }
  }

  /**
   * Detect and repair common database issues
   */
  static async autoRepair() {
    const repairs = [];

    try {
      // Check for orphaned records
      logger.info('Running auto-repair checks...');

      // Check for null required fields
      const nullUsers = await db.all(
        "SELECT id FROM users WHERE email IS NULL OR password IS NULL"
      );
      if (nullUsers.length > 0) {
        logger.warn('Found users with null required fields', { count: nullUsers.length });
        repairs.push({
          issue: 'Null required fields in users table',
          found: nullUsers.length,
          action: 'Manual review needed'
        });
      }

      // Optimize database
      try {
        await db.run('PRAGMA optimize');
        logger.success('Database optimized');
        repairs.push({
          issue: 'Database optimization',
          action: 'Completed',
          success: true
        });
      } catch (err) {
        logger.warn('Database optimization failed', err.message);
      }

      // Check integrity
      try {
        const result = await db.get('PRAGMA integrity_check');
        if (result?.integrity_check === 'ok') {
          logger.success('Database integrity check passed');
          repairs.push({
            issue: 'Database integrity',
            status: 'OK',
            success: true
          });
        }
      } catch (err) {
        logger.warn('Integrity check failed', err.message);
      }

      return { success: true, repairs };
    } catch (err) {
      logger.error('Auto-repair failed', err);
      return { success: false, error: err.message, repairs };
    }
  }

  /**
   * Backup database
   */
  static async backup() {
    try {
      const fs = require('fs');
      const path = require('path');

      const source = path.join(__dirname, '../data/database.db');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backup = path.join(__dirname, '../backups', `database-${timestamp}.db`);

      // Create backups directory if needed
      const backupDir = path.dirname(backup);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Copy database file
      fs.copyFileSync(source, backup);

      logger.success('Database backed up', { backup });
      return { success: true, backup };
    } catch (err) {
      logger.error('Backup failed', err);
      return { success: false, error: err.message };
    }
  }
}

module.exports = DatabaseHealth;
