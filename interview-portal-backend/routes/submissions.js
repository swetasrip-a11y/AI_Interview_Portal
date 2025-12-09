const express = require('express');
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');
const realtime = require('../realtime');

const router = express.Router();

// Submit answer
router.post('/', authenticate, async (req, res) => {
  const { question_id, selected_option } = req.body;

  if (!question_id || selected_option === undefined) {
    return res.status(400).json({ error: 'Question ID and selected option are required' });
  }

  try {
    // Get correct answer
    const question = await db.get(
      'SELECT correct_option FROM questions WHERE id = ?',
      [question_id]
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const is_correct = String(selected_option) === String(question.correct_option);

    // Save submission
    const result = await db.run(
      `INSERT INTO submissions (user_id, question_id, selected_option, is_correct) 
       VALUES (?, ?, ?, ?)`,
      [req.userId, question_id, selected_option, is_correct ? 1 : 0]
    );

    // Emit realtime event
    const io = realtime.getIO();
    if (io) {
      io.emit('submission:created', {
        submissionId: result.lastID,
        userId: req.userId,
        question_id,
        selected_option,
        is_correct,
        created_at: new Date().toISOString()
      });
    }

    res.json({ 
      is_correct, 
      correct_option: question.correct_option,
      message: is_correct ? 'Correct!' : 'Incorrect!'
    });
  } catch (err) {
    console.error('Error submitting answer:', err);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Get user results
router.get('/user/results', authenticate, async (req, res) => {
  try {
    const results = await db.all(`
      SELECT q.title, q.question_text, s.selected_option, s.is_correct, s.submitted_at
      FROM submissions s
      JOIN questions q ON s.question_id = q.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
    `, [req.userId]);

    const total = results.length;
    const correct = results.filter(r => r.is_correct).length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    res.json({ results, total, correct, score });
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
