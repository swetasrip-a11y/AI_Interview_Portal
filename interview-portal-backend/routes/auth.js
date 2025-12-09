const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/database');
const { asyncHandler, AppError, validateRequired, handleDatabaseError } = require('../utils/errorHandler');
const Logger = require('../utils/logger');

const router = express.Router();
const logger = new Logger('AUTH');

// Register endpoint
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, full_name, role } = req.body;

  // Validate required fields
  validateRequired(['email', 'password', 'full_name'], req.body);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
  }

  // Validate password strength
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400, 'WEAK_PASSWORD');
  }

  try {
    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
    }

    // Hash password with salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user with default role
    const result = await db.run(
      'INSERT INTO users (email, password, full_name, role, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [email.toLowerCase(), hashedPassword, full_name.trim(), role || 'candidate']
    );

    logger.success('User registered', {
      email: email.toLowerCase(),
      role: role || 'candidate'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: result.lastID
    });
  } catch (err) {
    handleDatabaseError(err, 'User registration');
  }
}));

// Login endpoint
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  validateRequired(['email', 'password'], req.body);

  try {
    // Find user
    const user = await db.get(
      'SELECT id, email, password, full_name, role FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Compare passwords with timing-safe comparison
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.warn('Login attempt with wrong password', { email });
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      throw new AppError('Server configuration error', 500, 'CONFIG_ERROR');
    }

    // Generate JWT with expiration
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.success('User logged in', { userId: user.id, email });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    handleDatabaseError(err, 'User login');
  }
}));

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  const { authenticate } = require('../middleware/auth');
  
  // Use middleware to verify token
  authenticate(req, res, async () => {
    try {
      const user = await db.get(
        'SELECT id, email, full_name, role FROM users WHERE id = ?',
        [req.userId]
      );

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      res.json({
        success: true,
        user
      });
    } catch (err) {
      handleDatabaseError(err, 'Fetch current user');
    }
  });
}));

// Verify token
router.post('/verify', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Token is required', 400, 'MISSING_TOKEN');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      valid: true,
      user: decoded
    });
  } catch (err) {
    res.json({
      success: false,
      valid: false,
      message: 'Token is invalid or expired'
    });
  }
}));

// Logout (optional - for frontend token cleanup)
router.post('/logout', asyncHandler(async (req, res) => {
  // Token-based auth doesn't require server-side logout
  // But we can log the action for auditing
  logger.info('User logged out');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

module.exports = router;
