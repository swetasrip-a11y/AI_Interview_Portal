/**
 * System Health Check Route
 * Provides comprehensive system diagnostics and status
 */

const express = require('express');
const router = express.Router();
const { asyncHandler, AppError } = require('../utils/errorHandler');
const DatabaseHealth = require('../utils/databaseHealth');
const ConfigValidator = require('../utils/configValidator');
const Logger = require('../utils/logger');

const logger = new Logger('HEALTH_CHECK');

/**
 * Basic health check
 */
router.get('/health', asyncHandler(async (req, res) => {
  const health = await DatabaseHealth.checkHealth();
  
  res.json({
    success: health.healthy,
    status: health.healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: health.healthy ? 'connected' : 'disconnected',
    tables: health.tables,
    uptime: process.uptime()
  });
}));

/**
 * Comprehensive system status
 */
router.get('/status', asyncHandler(async (req, res) => {
  const [dbHealth, dbStats, config] = await Promise.all([
    DatabaseHealth.checkHealth(),
    DatabaseHealth.getStats(),
    ConfigValidator.getSummary()
  ]);

  res.json({
    success: true,
    status: dbHealth.healthy ? 'operational' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      healthy: dbHealth.healthy,
      tables: dbHealth.tables,
      stats: dbStats.stats
    },
    configuration: {
      valid: config.valid,
      environment: config.environment,
      database: config.database,
      warnings: config.warnings
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  });
}));

/**
 * Database diagnostics
 */
router.get('/database', asyncHandler(async (req, res) => {
  const [health, tables, storage] = await Promise.all([
    DatabaseHealth.checkHealth(),
    DatabaseHealth.verifyTables(),
    DatabaseHealth.getStorageInfo()
  ]);

  res.json({
    success: tables.valid,
    database: {
      healthy: health.healthy,
      tablesCount: health.tables,
      requiredTablesValid: tables.valid,
      missingTables: tables.missing || [],
      storage: storage
    }
  });
}));

/**
 * Configuration check
 */
router.get('/config', asyncHandler(async (req, res) => {
  const validation = ConfigValidator.validateEnv();
  const config = ConfigValidator.getConfig();

  res.json({
    success: validation.valid,
    validation,
    config: {
      environment: config.NODE_ENV,
      port: config.PORT,
      database: config.DB_TYPE,
      jwtConfigured: !!config.JWT_SECRET
    }
  });
}));

/**
 * Auto-repair and optimization
 */
router.post('/repair', asyncHandler(async (req, res) => {
  logger.warn('Auto-repair initiated');
  
  const result = await DatabaseHealth.autoRepair();
  
  res.json({
    success: result.success,
    message: 'Auto-repair completed',
    repairs: result.repairs,
    errors: result.error ? [result.error] : []
  });
}));

/**
 * Backup database
 */
router.post('/backup', asyncHandler(async (req, res) => {
  logger.info('Database backup initiated');
  
  const result = await DatabaseHealth.backup();
  
  if (result.success) {
    res.json({
      success: true,
      message: 'Database backed up successfully',
      backup: result.backup
    });
  } else {
    throw new AppError('Backup failed: ' + result.error, 500, 'BACKUP_FAILED');
  }
}));

/**
 * Full system diagnostics
 */
router.get('/diagnostics', asyncHandler(async (req, res) => {
  const timestamp = new Date().toISOString();

  const [dbHealth, dbStats, tables, config, storage] = await Promise.all([
    DatabaseHealth.checkHealth(),
    DatabaseHealth.getStats(),
    DatabaseHealth.verifyTables(),
    ConfigValidator.validateEnv(),
    DatabaseHealth.getStorageInfo()
  ]);

  const systemStatus = {
    timestamp,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      percent: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
    },
    database: {
      healthy: dbHealth.healthy,
      tables: dbHealth.tables,
      stats: dbStats.stats,
      storage: storage
    },
    configuration: {
      valid: config.valid,
      environment: config.config?.NODE_ENV,
      warnings: config.warnings,
      missing: config.missing
    },
    system: {
      os: process.platform,
      nodeVersion: process.version,
      cwd: process.cwd()
    }
  };

  res.json({
    success: dbHealth.healthy && config.valid,
    diagnostics: systemStatus
  });
}));

/**
 * Error logs
 */
router.get('/logs', asyncHandler(async (req, res) => {
  const errorHandler = require('../utils/errorHandler');
  const logs = errorHandler.getErrorLogs(7); // Last 7 days

  res.json({
    success: true,
    count: logs.length,
    logs: logs.slice(0, 100) // Return last 100
  });
}));

module.exports = router;
