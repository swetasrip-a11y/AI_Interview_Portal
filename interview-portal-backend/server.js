const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import error handling utilities
const { errorMiddleware, asyncHandler, logError } = require('./utils/errorHandler');
const Logger = require('./utils/logger');

// Initialize services
const db = require('./models/database');
const realtime = require('./realtime');
const logger = new Logger('SERVER');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    logger[logLevel](`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  next();
});

// Load routes safely with error handling
const loadRoute = (path) => {
  try {
    const route = require(path);
    logger.info(`Route loaded: ${path}`);
    return route;
  } catch (e) {
    logger.error(`Failed to load route: ${path}`, e, { path });
    // Return empty router instead of failing
    return require('express').Router();
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling']
});

realtime.setIO(io);

// Socket.IO error handling
io.on('connection', (socket) => {
  logger.info('Socket connected', { socketId: socket.id });
  
  socket.on('error', (error) => {
    logger.error('Socket error', error, { socketId: socket.id });
  });
  
  socket.on('disconnect', (reason) => {
    logger.info('Socket disconnected', { socketId: socket.id, reason });
  });
});

// Initialize application
(async () => {
  try {
    logger.info('Initializing database...');
    await db.init();
    logger.success('Database initialized successfully');

    // Load all routes after database initialization
    const routes = [
      ['/api/auth', './routes/auth'],
      ['/api/questions', './routes/questions'],
      ['/api/submissions', './routes/submissions'],
      ['/api/interviews', './routes/interviews'],
      ['/api/interview-manager', './routes/dynamicInterviewManager'],
      ['/api/materials', './routes/materials'],
      ['/api/jobs', './routes/jobs'],
      ['/api/ai-interview', './routes/aiInterview'],
      ['/api/multimodal-interview', './routes/multimodalInterview'],
      ['/api/resume', './routes/resume'],
      ['/api/aiChat', './routes/aiChat'],
      ['/api/dynamic-interview', './routes/dynamicInterview'],
      ['/api/health', './routes/health']
    ];

    routes.forEach(([path, route]) => {
      app.use(path, loadRoute(route));
    });

    logger.success(`${routes.length} routes loaded`);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Route ${req.method} ${req.path} not found`,
          timestamp: new Date().toISOString()
        }
      });
    });

    // Global error middleware (must be last)
    app.use(errorMiddleware);

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      logger.success(`Server running on http://localhost:${PORT}`);
      logger.info('Environment', { NODE_ENV: process.env.NODE_ENV || 'development' });
    });

  } catch (error) {
    logger.error('Failed to initialize application', error);
    console.error(error.stack);
    process.exit(1);
  }
})();

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', reason, { promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  // Graceful shutdown
  setTimeout(() => process.exit(1), 1000);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.success('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.success('HTTP server closed');
    process.exit(0);
  });
});
