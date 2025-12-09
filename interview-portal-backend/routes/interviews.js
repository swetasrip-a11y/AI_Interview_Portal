const express = require('express');
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create interview (interviewer only)
router.post('/', authenticate, async (req, res) => {
  const { title, description, job_title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Check if user is interviewer
    const user = await db.get('SELECT role FROM users WHERE id = ?', [req.userId]);
    if (user?.role !== 'interviewer') {
      return res.status(403).json({ error: 'Only interviewers can create interviews' });
    }

    await db.run(
      'INSERT INTO interviews (title, description, job_title, interviewer_id) VALUES (?, ?, ?, ?)',
      [title, description, job_title, req.userId]
    );

    res.json({ message: 'Interview created successfully' });
  } catch (err) {
    console.error('Error creating interview:', err);
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

// Get all interviews
router.get('/', authenticate, async (req, res) => {
  try {
    const interviews = await db.all(
      'SELECT * FROM interviews ORDER BY created_at DESC'
    );
    res.json(interviews);
  } catch (err) {
    console.error('Error fetching interviews:', err);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// Get interview by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const interview = await db.get(
      'SELECT * FROM interviews WHERE id = ?',
      [req.params.id]
    );
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json(interview);
  } catch (err) {
    console.error('Error fetching interview:', err);
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
});

// Join interview (candidate)
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const interview = await db.get(
      'SELECT * FROM interviews WHERE id = ?',
      [req.params.id]
    );

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Check if already joined
    const existing = await db.get(
      'SELECT * FROM interview_candidates WHERE interview_id = ? AND candidate_id = ?',
      [req.params.id, req.userId]
    );

    if (existing) {
      return res.status(400).json({ error: 'Already joined this interview' });
    }

    await db.run(
      'INSERT INTO interview_candidates (interview_id, candidate_id, joined_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [req.params.id, req.userId]
    );

    res.json({ message: 'Successfully joined interview' });
  } catch (err) {
    console.error('Error joining interview:', err);
    res.status(500).json({ error: 'Failed to join interview' });
  }
});

// Get candidates for interview (interviewer)
router.get('/:id/candidates', authenticate, async (req, res) => {
  try {
    const candidates = await db.all(`
      SELECT ic.*, u.full_name, u.email 
      FROM interview_candidates ic
      JOIN users u ON ic.candidate_id = u.id
      WHERE ic.interview_id = ?
      ORDER BY ic.created_at DESC
    `, [req.params.id]);

    res.json(candidates);
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Update candidate evaluation (interviewer)
router.put('/:id/candidate/:candidateId', authenticate, async (req, res) => {
  const { score, comments, decision, marks_obtained } = req.body;

  try {
    await db.run(
      `UPDATE interview_candidates 
       SET score = ?, comments = ?, decision = ?, marks_obtained = ?
       WHERE interview_id = ? AND candidate_id = ?`,
      [score, comments, decision, marks_obtained, req.params.id, req.params.candidateId]
    );

    res.json({ message: 'Candidate evaluation updated' });
  } catch (err) {
    console.error('Error updating candidate:', err);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Get candidate's interview history
router.get('/history/candidate', authenticate, async (req, res) => {
  try {
    const history = await db.all(`
      SELECT i.*, ic.status, ic.score, ic.decision, ic.marks_obtained
      FROM interview_candidates ic
      JOIN interviews i ON ic.interview_id = i.id
      WHERE ic.candidate_id = ?
      ORDER BY i.created_at DESC
    `, [req.userId]);

    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
