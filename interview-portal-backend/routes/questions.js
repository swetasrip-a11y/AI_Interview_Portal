const express = require('express');
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all questions (without answers - for candidates)
router.get('/', authenticate, async (req, res) => {
  try {
    const questions = await db.all(`
      SELECT id, title, question_text, option_a, option_b, option_c, option_d, difficulty 
      FROM questions 
      ORDER BY created_at DESC
    `);
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get single question with answer (admin only)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const question = await db.get(
      'SELECT * FROM questions WHERE id = ?',
      [req.params.id]
    );
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Create question (admin only)
router.post('/', authenticate, async (req, res) => {
  const { title, description, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty } = req.body;

  if (!title || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user is admin
    const user = await db.get('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create questions' });
    }

    await db.run(
      `INSERT INTO questions (title, description, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty || 'medium', req.userId]
    );

    res.json({ message: 'Question created successfully' });
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Update question (admin only)
router.put('/:id', authenticate, async (req, res) => {
  const { title, description, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty } = req.body;

  try {
    // Check if user is admin
    const user = await db.get('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update questions' });
    }

    await db.run(
      `UPDATE questions SET title = ?, description = ?, question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, difficulty = ? 
       WHERE id = ?`,
      [title, description, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, req.params.id]
    );

    res.json({ message: 'Question updated successfully' });
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete question (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    const user = await db.get('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete questions' });
    }

    await db.run('DELETE FROM questions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

module.exports = router;
