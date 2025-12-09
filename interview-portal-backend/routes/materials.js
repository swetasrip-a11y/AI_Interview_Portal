const express = require('express');
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all materials
router.get('/', authenticate, async (req, res) => {
  try {
    const materials = await db.all(
      'SELECT * FROM materials ORDER BY created_at DESC'
    );
    res.json(materials);
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Create material (interviewer only)
router.post('/', authenticate, async (req, res) => {
  const { title, description, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const user = await db.get('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (user?.role !== 'interviewer') {
      return res.status(403).json({ error: 'Only interviewers can create materials' });
    }

    await db.run(
      'INSERT INTO materials (title, description, content, category, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, description, content, category, req.userId]
    );

    res.json({ message: 'Material created successfully' });
  } catch (err) {
    console.error('Error creating material:', err);
    res.status(500).json({ error: 'Failed to create material' });
  }
});

module.exports = router;
