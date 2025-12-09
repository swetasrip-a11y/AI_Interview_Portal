/**
 * System Initialization & Verification Script
 * Ensures everything is properly configured and working
 * Run: node initialize-system.js
 */

const path = require('path');
require('dotenv').config();

// Import utilities
const ConfigValidator = require('./interview-portal-backend/utils/configValidator');
const DatabaseHealth = require('./interview-portal-backend/utils/databaseHealth');
const Logger = require('./interview-portal-backend/utils/logger');

const logger = new Logger('INITIALIZATION');

/**
 * Color output helpers
 */
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}`)
};

/**
 * Check environment configuration
 */
async function checkEnvironment() {
  log.header('Environment Configuration');
  
  const validation = ConfigValidator.validateEnv();
  
  if (validation.valid) {
    log.success('All required environment variables configured');
  } else {
    validation.missing.forEach(v => log.error(`Missing: ${v}`));
    return false;
  }

  (validation.warnings || []).forEach(w => log.warn(`Not configured: ${w}`));
  
  const config = ConfigValidator.getConfig();
  log.info(`Environment: ${config.NODE_ENV}`);
  log.info(`Database: ${config.DB_TYPE}`);
  log.info(`Port: ${config.PORT}`);
  
  return validation.valid;
}

/**
 * Check database connectivity
 */
async function checkDatabase() {
  log.header('Database Connectivity');
  
  try {
    const db = require('./interview-portal-backend/models/database');
    await db.init();
    
    const health = await DatabaseHealth.checkHealth();
    
    if (health.healthy) {
      log.success('Database connected');
      log.info(`Tables: ${health.tables}`);
    } else {
      log.error('Database connection failed');
      return false;
    }

    const tables = await DatabaseHealth.verifyTables();
    if (tables.valid) {
      log.success('All required tables exist');
    } else {
      log.warn(`Missing tables: ${tables.missing?.join(', ')}`);
    }

    return true;
  } catch (err) {
    log.error(`Database error: ${err.message}`);
    return false;
  }
}

/**
 * Check file system
 */
async function checkFileSystem() {
  log.header('File System');
  
  const fs = require('fs');
  const dirs = [
    './interview-portal-backend/uploads',
    './interview-portal-backend/logs',
    './interview-portal-backend/data',
    './interview-portal-frontend/src'
  ];

  let allValid = true;
  
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      log.success(`${dir}`);
    } else {
      log.warn(`${dir} - will be created if needed`);
      try {
        fs.mkdirSync(dir, { recursive: true });
        log.success(`${dir} - created`);
      } catch (err) {
        log.error(`${dir} - failed to create`);
        allValid = false;
      }
    }
  });

  return allValid;
}

/**
 * Check dependencies
 */
async function checkDependencies() {
  log.header('Dependencies');
  
  const requiredPackages = [
    'express',
    'axios',
    'bcrypt',
    'jsonwebtoken',
    'socket.io',
    'dotenv',
    'cors'
  ];

  let allValid = true;

  requiredPackages.forEach(pkg => {
    try {
      require(pkg);
      log.success(`${pkg}`);
    } catch (err) {
      log.error(`${pkg} - not installed`);
      allValid = false;
    }
  });

  return allValid;
}

/**
 * Check application structure
 */
async function checkStructure() {
  log.header('Application Structure');
  
  const fs = require('fs');
  const required = [
    './interview-portal-backend/server.js',
    './interview-portal-frontend/src/App.jsx',
    './interview-portal-backend/models/database.js',
    './interview-portal-backend/middleware/auth.js'
  ];

  let allValid = true;

  required.forEach(file => {
    if (fs.existsSync(file)) {
      log.success(`${file}`);
    } else {
      log.error(`${file} - missing`);
      allValid = false;
    }
  });

  return allValid;
}

/**
 * Database repair and optimization
 */
async function optimizeDatabase() {
  log.header('Database Optimization');
  
  try {
    const result = await DatabaseHealth.autoRepair();
    
    if (result.success) {
      log.success('Database optimization complete');
      result.repairs.forEach(repair => {
        if (repair.success) {
          log.success(`${repair.issue}`);
        } else {
          log.warn(`${repair.issue}`);
        }
      });
    } else {
      log.error(`Optimization failed: ${result.error}`);
    }
  } catch (err) {
    log.error(`Optimization error: ${err.message}`);
  }
}

/**
 * Create .env if missing
 */
function ensureEnvFile() {
  log.header('Environment File');
  
  const result = ConfigValidator.initializeEnv();
  
  if (result.created) {
    log.success(`.env file created at ${result.path}`);
    log.warn('Please review and update .env with your configuration');
  } else {
    log.success(`.env file already exists at ${result.path}`);
  }
}

/**
 * System summary
 */
async function showSummary() {
  log.header('System Summary');
  
  try {
    const config = ConfigValidator.getSummary();
    const db = require('./interview-portal-backend/models/database');
    await db.init();
    const health = await DatabaseHealth.checkHealth();
    const stats = await DatabaseHealth.getStats();

    console.log(`
${colors.cyan}Configuration:${colors.reset}
  - Environment: ${config.environment}
  - Database Type: ${config.database}
  - Port: ${config.PORT}
  - Valid: ${config.valid ? colors.green + '✓' + colors.reset : colors.red + '✗' + colors.reset}

${colors.cyan}Database:${colors.reset}
  - Status: ${health.healthy ? colors.green + 'Connected' + colors.reset : colors.red + 'Disconnected' + colors.reset}
  - Tables: ${health.tables}
  - Users: ${stats.stats.users || 0}
  - Interviews: ${stats.stats.interviews || 0}
  - Questions: ${stats.stats.questions || 0}

${colors.cyan}Status:${colors.reset}
  - ${health.healthy && config.valid ? colors.green + '✓ System Ready' + colors.reset : colors.red + '✗ Issues Found' + colors.reset}
`);
  } catch (err) {
    log.error(`Error getting summary: ${err.message}`);
  }
}

/**
 * Main initialization function
 */
async function initialize() {
  console.clear();
  console.log(`${colors.cyan}
╔════════════════════════════════════════╗
║   INTERVIEW PORTAL - SYSTEM INIT       ║
║   Comprehensive System Verification    ║
╚════════════════════════════════════════╝
${colors.reset}`);

  try {
    const checks = [
      ['File System', checkFileSystem],
      ['Dependencies', checkDependencies],
      ['Environment Configuration', checkEnvironment],
      ['Application Structure', checkStructure],
      ['Database Connectivity', checkDatabase]
    ];

    let allPassed = true;
    
    for (const [name, check] of checks) {
      try {
        const result = await check();
        if (!result) {
          allPassed = false;
        }
      } catch (err) {
        log.error(`${name} check failed: ${err.message}`);
        allPassed = false;
      }
    }

    // Ensure .env exists
    ensureEnvFile();

    // Optimize database
    try {
      await optimizeDatabase();
    } catch (err) {
      log.warn(`Database optimization skipped: ${err.message}`);
    }

    // Show summary
    await showSummary();

    // Final status
    console.log(`
${allPassed ? colors.green : colors.red}
╔════════════════════════════════════════╗
║   ${allPassed ? 'SYSTEM READY FOR LAUNCH' : 'ISSUES DETECTED'} ${allPassed ? '✓' : '✗'}         ║
╚════════════════════════════════════════╝
${colors.reset}`);

    if (!allPassed) {
      console.log(`
${colors.yellow}Please resolve the issues above before starting the server.${colors.reset}
`);
      process.exit(1);
    }

    console.log(`
${colors.green}Next steps:
1. Backend: cd interview-portal-backend && npm run dev
2. Frontend: cd interview-portal-frontend && npm run dev
3. Open: http://localhost:3000${colors.reset}
`);

  } catch (err) {
    log.error(`Fatal error: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

// Run initialization
initialize();
