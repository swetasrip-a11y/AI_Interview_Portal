const express = require('express');
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', authenticate, async (req, res) => {
  try {
    const jobs = await db.all(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    );
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create job (interviewer only)
router.post('/', authenticate, async (req, res) => {
  const { title, description, company, location, salary, requirements } = req.body;

  if (!title || !company) {
    return res.status(400).json({ error: 'Title and company are required' });
  }

  try {
    const user = await db.get('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (user?.role !== 'interviewer') {
      return res.status(403).json({ error: 'Only interviewers can post jobs' });
    }

    await db.run(
      'INSERT INTO jobs (title, description, company, location, salary, requirements, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, company, location, salary, requirements, req.userId]
    );

    res.json({ message: 'Job posted successfully' });
  } catch (err) {
    console.error('Error posting job:', err);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

module.exports = router;
