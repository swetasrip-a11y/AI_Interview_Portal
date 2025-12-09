/**
 * Global Error Handler - Centralized error management for the application
 * Provides consistent error responses, logging, and recovery mechanisms
 */

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
  }
}

// Log errors to file with rotation
const logError = (error, context = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message: error.message || 'Unknown error',
    errorCode: error.errorCode || 'UNKNOWN',
    statusCode: error.statusCode || 500,
    stack: error.stack,
    context,
    url: context.url || 'unknown',
    method: context.method || 'unknown'
  };

  // Write to log file
  const logFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n', (err) => {
    if (err) console.error('Failed to write log:', err);
  });

  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${timestamp}] ${error.message}`, error.stack);
  }
};

// Enhanced error middleware
const errorMiddleware = (err, req, res, next) => {
  try {
    // Set default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorCode = err.errorCode || 'INTERNAL_ERROR';

    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
      message = err.message || 'Validation failed';
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      errorCode = 'UNAUTHORIZED';
      message = 'Unauthorized access';
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      errorCode = 'NOT_FOUND';
      message = 'Resource not found';
    } else if (err.name === 'ConflictError') {
      statusCode = 409;
      errorCode = 'CONFLICT';
      message = 'Resource conflict';
    } else if (err.name === 'DatabaseError') {
      statusCode = 500;
      errorCode = 'DATABASE_ERROR';
      message = 'Database operation failed';
    }

    // Log error with context
    logError(err, {
      url: req.originalUrl,
      method: req.method,
      userId: req.userId || 'anonymous',
      ip: req.ip
    });

    // Send error response
    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  } catch (fallbackErr) {
    console.error('Error in error handler:', fallbackErr);
    res.status(500).json({
      success: false,
      error: {
        code: 'ERROR_HANDLER_FAILURE',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Async route wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    // Ensure error is an AppError instance
    if (!(err instanceof AppError)) {
      err = new AppError(
        err.message || 'An unexpected error occurred',
        err.statusCode || 500,
        err.errorCode || 'INTERNAL_ERROR'
      );
    }
    next(err);
  });
};

// Database error handler
const handleDatabaseError = (error, operation = 'Database operation') => {
  console.error(`Database Error in ${operation}:`, error);
  
  // Handle specific database errors
  if (error.code === 'ER_DUP_ENTRY') {
    throw new AppError('This record already exists', 409, 'DUPLICATE_RECORD');
  }
  if (error.code === 'ER_NO_REFERENCED_ROW') {
    throw new AppError('Referenced record does not exist', 404, 'INVALID_REFERENCE');
  }
  if (error.errno === 1040 || error.code === 'PROTOCOL_CONNECTION_LOST') {
    throw new AppError('Database connection failed. Please try again.', 503, 'DB_CONNECTION_ERROR');
  }
  
  throw new AppError(
    `${operation} failed: ${error.message}`,
    500,
    'DATABASE_ERROR'
  );
};

// API error handler
const handleApiError = (error, endpoint = 'API call') => {
  console.error(`API Error in ${endpoint}:`, error);
  
  if (error.response) {
    // Server responded with error status
    throw new AppError(
      error.response.data?.message || error.message,
      error.response.status || 500,
      'API_ERROR'
    );
  } else if (error.request) {
    // Request made but no response
    throw new AppError(
      'No response from server. Please check your connection.',
      503,
      'NO_RESPONSE'
    );
  }
  
  throw new AppError(
    `${endpoint} failed: ${error.message}`,
    500,
    'API_ERROR'
  );
};

// Validation error handler
const validateRequired = (fields, data) => {
  const missing = fields.filter(field => !data[field] || data[field].toString().trim() === '');
  if (missing.length > 0) {
    throw new AppError(
      `Missing required fields: ${missing.join(', ')}`,
      400,
      'MISSING_REQUIRED_FIELDS'
    );
  }
};

// Safe JSON parse
const safeJsonParse = (jsonString, defaultValue = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn('JSON parse error:', err.message);
    return defaultValue;
  }
};

// Safe async database operations
const safeDbOperation = async (operation, operationName = 'Database operation') => {
  try {
    return await operation();
  } catch (err) {
    handleDatabaseError(err, operationName);
  }
};

// Get error logs
const getErrorLogs = (days = 7) => {
  try {
    const logsPath = logsDir;
    const files = fs.readdirSync(logsPath)
      .filter(f => f.startsWith('error-') && f.endsWith('.log'))
      .sort()
      .reverse()
      .slice(0, days);

    const logs = [];
    files.forEach(file => {
      const content = fs.readFileSync(path.join(logsPath, file), 'utf8');
      content.split('\n').filter(Boolean).forEach(line => {
        try {
          logs.push(JSON.parse(line));
        } catch (e) {
          // Skip malformed log entries
        }
      });
    });
    return logs;
  } catch (err) {
    console.error('Error reading logs:', err);
    return [];
  }
};

// Clear old logs
const clearOldLogs = (days = 30) => {
  try {
    const logsPath = logsDir;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    fs.readdirSync(logsPath).forEach(file => {
      const filePath = path.join(logsPath, file);
      const stats = fs.statSync(filePath);
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    });
  } catch (err) {
    console.error('Error clearing old logs:', err);
  }
};

module.exports = {
  AppError,
  errorMiddleware,
  asyncHandler,
  handleDatabaseError,
  handleApiError,
  validateRequired,
  safeJsonParse,
  safeDbOperation,
  logError,
  getErrorLogs,
  clearOldLogs
};
