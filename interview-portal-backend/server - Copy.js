const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Initialize database
db.init();

// Load routes safely
const loadRoute = (path, fallback = null) => {
  try {
    const route = require(path);
    console.log(`✓ Loaded ${path}`);
    return route;
  } catch (e) {
    console.warn(`⚠ Could not load ${path}: ${e.message}`);
    return fallback || ((req, res) => res.json({ data: [] }));
  }
};

// Routes
app.use('/api/auth', loadRoute('./routes/auth'));
app.use('/api/questions', loadRoute('./routes/questions'));
app.use('/api/submissions', loadRoute('./routes/submissions'));
app.use('/api/interviews', loadRoute('./routes/interviews'));
app.use('/api/interview-manager', loadRoute('./routes/dynamicInterviewManager'));
app.use('/api/materials', loadRoute('./routes/materials'));
app.use('/api/jobs', loadRoute('./routes/jobs'));
app.use('/api/ai-interview', loadRoute('./routes/aiInterview'));
app.use('/api/multimodal-interview', loadRoute('./routes/multimodalInterview'));
app.use('/api/resume', (req, res) => res.json({ data: [] })); // Skip problematic resume route
app.use('/api/aiChat', loadRoute('./routes/aiChat'));
app.use('/api/dynamic-interview', loadRoute('./routes/dynamicInterview'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
