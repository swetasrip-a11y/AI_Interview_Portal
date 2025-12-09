/**
 * Logger Service - Centralized logging for debugging and monitoring
 * Supports console, file, and remote logging
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(serviceName = 'App') {
    this.serviceName = serviceName;
    this.logsDir = path.join(__dirname, '../logs');
    
    // Ensure logs directory exists
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Format log message with timestamp and service name
   */
  formatMessage(level, message, data = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      data
    };
  }

  /**
   * Write log to file
   */
  writeToFile(logEntry) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logsDir, `${this.serviceName}-${logEntry.level.toLowerCase()}-${date}.log`);
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) console.error('Failed to write log file:', err);
      });
    } catch (err) {
      console.error('Logger write error:', err);
    }
  }

  /**
   * Log info level message
   */
  info(message, data = {}) {
    const logEntry = this.formatMessage('INFO', message, data);
    console.log(`[${logEntry.timestamp}] ℹ️ [${this.serviceName}] ${message}`, data);
    this.writeToFile(logEntry);
  }

  /**
   * Log warning level message
   */
  warn(message, data = {}) {
    const logEntry = this.formatMessage('WARN', message, data);
    console.warn(`[${logEntry.timestamp}] ⚠️ [${this.serviceName}] ${message}`, data);
    this.writeToFile(logEntry);
  }

  /**
   * Log error level message
   */
  error(message, error, data = {}) {
    const logEntry = this.formatMessage('ERROR', message, {
      ...data,
      error: error?.message || error,
      stack: error?.stack
    });
    console.error(`[${logEntry.timestamp}] ❌ [${this.serviceName}] ${message}`, error, data);
    this.writeToFile(logEntry);
  }

  /**
   * Log debug level message
   */
  debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this.formatMessage('DEBUG', message, data);
      console.debug(`[${logEntry.timestamp}] 🐛 [${this.serviceName}] ${message}`, data);
      this.writeToFile(logEntry);
    }
  }

  /**
   * Log success message
   */
  success(message, data = {}) {
    const logEntry = this.formatMessage('SUCCESS', message, data);
    console.log(`[${logEntry.timestamp}] ✅ [${this.serviceName}] ${message}`, data);
    this.writeToFile(logEntry);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit = 100) {
    try {
      const files = fs.readdirSync(this.logsDir)
        .filter(f => f.startsWith(this.serviceName))
        .sort()
        .reverse();

      const logs = [];
      for (const file of files) {
        if (logs.length >= limit) break;
        const content = fs.readFileSync(path.join(this.logsDir, file), 'utf8');
        content.split('\n').filter(Boolean).forEach(line => {
          if (logs.length < limit) {
            try {
              logs.push(JSON.parse(line));
            } catch (e) {
              // Skip malformed entries
            }
          }
        });
      }
      return logs;
    } catch (err) {
      console.error('Error reading logs:', err);
      return [];
    }
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    try {
      const files = fs.readdirSync(this.logsDir)
        .filter(f => f.startsWith(this.serviceName));
      files.forEach(f => {
        fs.unlinkSync(path.join(this.logsDir, f));
      });
      this.info('Logs cleared');
    } catch (err) {
      this.error('Error clearing logs', err);
    }
  }
}

module.exports = Logger;
