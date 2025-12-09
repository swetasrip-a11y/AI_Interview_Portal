/**
 * Configuration Validator - Ensures all required configurations are present
 * and provides safe defaults
 */

const Logger = require('./logger');
const logger = new Logger('CONFIG');

class ConfigValidator {
  /**
   * Validate all required environment variables
   */
  static validateEnv() {
    const required = [
      'JWT_SECRET',
      'NODE_ENV',
      'PORT'
    ];

    const optional = [
      'DB_TYPE',
      'DB_HOST',
      'DB_USER',
      'DB_PASSWORD',
      'DB_NAME',
      'DB_PORT',
      'MURF_API_KEY',
      'GOOGLE_CLOUD_API_KEY'
    ];

    const missing = [];
    const warnings = [];

    // Check required vars
    required.forEach(key => {
      if (!process.env[key]) {
        missing.push(key);
        logger.warn(`Missing required environment variable: ${key}`);
      }
    });

    // Check optional vars
    optional.forEach(key => {
      if (!process.env[key]) {
        warnings.push(key);
        logger.warn(`Optional environment variable not set: ${key}`);
      }
    });

    if (missing.length > 0) {
      logger.error(`Missing ${missing.length} required environment variables`, new Error(missing.join(', ')));
      return {
        valid: false,
        missing,
        message: `Missing required config: ${missing.join(', ')}`
      };
    }

    logger.success('Environment configuration valid');
    return {
      valid: true,
      missing: [],
      warnings,
      config: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 5000,
        DB_TYPE: process.env.DB_TYPE || 'sqlite',
        JWT_SECRET: process.env.JWT_SECRET ? '***' : 'MISSING'
      }
    };
  }

  /**
   * Get all current configurations with defaults
   */
  static getConfig() {
    return {
      // Server config
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: parseInt(process.env.PORT || '5000'),
      
      // JWT config
      JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-me',
      JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
      
      // Database config
      DB_TYPE: process.env.DB_TYPE || 'sqlite',
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_PORT: parseInt(process.env.DB_PORT || '3306'),
      DB_USER: process.env.DB_USER || 'root',
      DB_PASSWORD: process.env.DB_PASSWORD || '',
      DB_NAME: process.env.DB_NAME || 'interview_portal',
      
      // API config
      API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
      MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB
      
      // External services
      MURF_API_KEY: process.env.MURF_API_KEY || '',
      GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY || '',
      
      // Session config
      SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT || '3600000'), // 1 hour
      
      // Logging config
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      LOG_DIR: process.env.LOG_DIR || './logs'
    };
  }

  /**
   * Validate specific configuration sections
   */
  static validateSection(section) {
    const config = this.getConfig();
    
    switch (section) {
      case 'database':
        return {
          valid: !!config.DB_NAME,
          config: {
            type: config.DB_TYPE,
            host: config.DB_HOST,
            port: config.DB_PORT,
            database: config.DB_NAME
          }
        };

      case 'jwt':
        return {
          valid: !!config.JWT_SECRET && config.JWT_SECRET !== 'your-secret-key-change-me',
          config: {
            secret: config.JWT_SECRET ? '***' : 'MISSING',
            expiration: config.JWT_EXPIRATION
          }
        };

      case 'server':
        return {
          valid: !!config.PORT,
          config: {
            port: config.PORT,
            environment: config.NODE_ENV
          }
        };

      default:
        return { valid: false, error: 'Unknown section' };
    }
  }

  /**
   * Create .env file with defaults if missing
   */
  static initializeEnv() {
    const fs = require('fs');
    const path = require('path');

    const envFile = path.join(process.cwd(), '.env');

    if (!fs.existsSync(envFile)) {
      const template = `# Server Configuration
NODE_ENV=development
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Database Configuration (SQLite is default)
DB_TYPE=sqlite
# For MySQL, uncomment and configure:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=interview_portal

# API Configuration
API_TIMEOUT=10000
MAX_FILE_SIZE=52428800

# External Services (optional)
# MURF_API_KEY=your-api-key
# GOOGLE_CLOUD_API_KEY=your-api-key

# Session Configuration
SESSION_TIMEOUT=3600000

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
`;

      fs.writeFileSync(envFile, template);
      logger.success('.env file created with default configuration');
      return { created: true, path: envFile };
    }

    return { created: false, path: envFile };
  }

  /**
   * Get configuration summary
   */
  static getSummary() {
    const validation = this.validateEnv();
    const config = this.getConfig();

    return {
      valid: validation.valid,
      environment: config.NODE_ENV,
      database: config.DB_TYPE,
      port: config.PORT,
      warnings: validation.warnings || [],
      missing: validation.missing || []
    };
  }
}

module.exports = ConfigValidator;
