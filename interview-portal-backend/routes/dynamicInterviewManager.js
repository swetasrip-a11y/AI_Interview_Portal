const express = require('express');
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ============ INTERVIEW CREATION & MANAGEMENT ============

// Create dynamic interview session
router.post('/create', authenticate, async (req, res) => {
  try {
    const { 
      title, 
      job_title, 
      description, 
      interview_type, 
      duration, 
      num_questions, 
      difficulty, 
      category, 
      candidate_ids 
    } = req.body;

    if (!title || !job_title || !candidate_ids || candidate_ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create interview session
    const result = await db.run(
      `INSERT INTO interviews (title, description, interviewer_id, job_title, status, interview_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, req.userId, job_title, 'active', interview_type]
    );

    const interviewId = result.lastID;

    // Assign candidates to interview
    const candidatePromises = candidate_ids.map(candidateId =>
      db.run(
        `INSERT INTO interview_candidates (interview_id, candidate_id, status, joined_at)
         VALUES (?, ?, ?, ?)`,
        [interviewId, candidateId, 'assigned', new Date().toISOString()]
      )
    );

    await Promise.all(candidatePromises);

    // Store interview metadata
    await db.run(
      `INSERT INTO ai_interview_sessions (
        candidate_id, job_id, company_id, interview_type, status, started_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [candidate_ids[0], 0, req.userId, interview_type, 'created', new Date().toISOString()]
    );

    res.json({
      success: true,
      message: 'Interview session created successfully',
      data: {
        interview_id: interviewId,
        title,
        job_title,
        candidate_count: candidate_ids.length,
        interview_type,
        duration,
        num_questions,
        difficulty,
        category
      }
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create interview session',
      error: error.message 
    });
  }
});

// Get all interviews for user
router.get('/list', authenticate, async (req, res) => {
  try {
    const interviews = await db.all(
      `SELECT i.*, COUNT(DISTINCT ic.candidate_id) as candidate_count
       FROM interviews i
       LEFT JOIN interview_candidates ic ON i.id = ic.interview_id
       WHERE i.interviewer_id = ?
       GROUP BY i.id
       ORDER BY i.created_at DESC`,
      [req.userId]
    );

    res.json({ success: true, data: interviews });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch interviews' 
    });
  }
});

// Get interview details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const interviewId = req.params.id;

    const interview = await db.get(
      `SELECT * FROM interviews WHERE id = ?`,
      [interviewId]
    );

    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }

    const candidates = await db.all(
      `SELECT ic.*, u.full_name, u.email
       FROM interview_candidates ic
       JOIN users u ON ic.candidate_id = u.id
       WHERE ic.interview_id = ?`,
      [interviewId]
    );

    res.json({
      success: true,
      data: {
        ...interview,
        candidates
      }
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch interview' 
    });
  }
});

// ============ CANDIDATE ASSIGNMENT ============

// Assign candidate to interview
router.post('/:interviewId/assign-candidate', authenticate, async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { candidate_id } = req.body;

    // Check if interview exists
    const interview = await db.get(
      `SELECT * FROM interviews WHERE id = ?`,
      [interviewId]
    );

    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }

    // Check if candidate already assigned
    const existing = await db.get(
      `SELECT * FROM interview_candidates 
       WHERE interview_id = ? AND candidate_id = ?`,
      [interviewId, candidate_id]
    );

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Candidate already assigned to this interview' 
      });
    }

    // Assign candidate
    await db.run(
      `INSERT INTO interview_candidates 
       (interview_id, candidate_id, status, joined_at)
       VALUES (?, ?, ?, ?)`,
      [interviewId, candidate_id, 'assigned', new Date().toISOString()]
    );

    res.json({
      success: true,
      message: 'Candidate assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning candidate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to assign candidate',
      error: error.message 
    });
  }
});

// Remove candidate from interview
router.post('/:interviewId/remove-candidate/:candidateId', authenticate, async (req, res) => {
  try {
    const { interviewId, candidateId } = req.params;

    await db.run(
      `DELETE FROM interview_candidates 
       WHERE interview_id = ? AND candidate_id = ?`,
      [interviewId, candidateId]
    );

    res.json({
      success: true,
      message: 'Candidate removed successfully'
    });
  } catch (error) {
    console.error('Error removing candidate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove candidate' 
    });
  }
});

// ============ INTERVIEW EXECUTION ============

// Start interview for candidate
router.post('/:interviewId/start', authenticate, async (req, res) => {
  try {
    const { interviewId } = req.params;
    const candidateId = req.userId;

    // Update candidate status
    await db.run(
      `UPDATE interview_candidates 
       SET status = ?, joined_at = ?
       WHERE interview_id = ? AND candidate_id = ?`,
      ['in-progress', new Date().toISOString(), interviewId, candidateId]
    );

    // Create interview session
    const session = await db.run(
      `INSERT INTO ai_interview_sessions 
       (candidate_id, job_id, company_id, interview_type, status, started_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [candidateId, 0, null, 'dynamic', 'in-progress', new Date().toISOString()]
    );

    res.json({
      success: true,
      message: 'Interview started',
      data: {
        session_id: session.lastID,
        interview_id: interviewId
      }
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to start interview' 
    });
  }
});

// ============ TIMER MANAGEMENT ============

// Get interview timer status
router.get('/:interviewId/timer', authenticate, async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await db.get(
      `SELECT i.*, 
              (SELECT COUNT(*) FROM interview_candidates 
               WHERE interview_id = i.id AND status = 'completed') as completed_count
       FROM interviews i
       WHERE i.id = ?`,
      [interviewId]
    );

    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }

    const session = await db.get(
      `SELECT * FROM ai_interview_sessions 
       WHERE id = (SELECT MAX(id) FROM ai_interview_sessions 
                   WHERE created_at >= (SELECT created_at FROM interviews WHERE id = ?))`,
      [interviewId]
    );

    const startTime = session?.started_at ? new Date(session.started_at).getTime() : null;
    const currentTime = new Date().getTime();
    const elapsedSeconds = startTime ? Math.floor((currentTime - startTime) / 1000) : 0;

    res.json({
      success: true,
      data: {
        interview_id: interviewId,
        status: interview.status,
        elapsed_seconds: elapsedSeconds,
        completed_count: interview.completed_count,
        total_candidates: null
      }
    });
  } catch (error) {
    console.error('Error getting timer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get timer status' 
    });
  }
});

// ============ REPORT GENERATION ============

// Generate interview report for candidate
router.post('/:interviewId/generate-report', authenticate, async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { candidateId, final_score, performance_metrics, feedback } = req.body;

    // Get interview details
    const interview = await db.get(
      `SELECT * FROM interviews WHERE id = ?`,
      [interviewId]
    );

    // Generate report data
    const reportData = {
      interview_id: interviewId,
      candidate_id: candidateId,
      interview_title: interview.title,
      job_title: interview.job_title,
      final_score,
      performance_metrics,
      feedback,
      generated_at: new Date().toISOString(),
      recommendations: generateRecommendations(final_score, performance_metrics)
    };

    // Store report
    await db.run(
      `INSERT INTO interview_reports (candidate_id, interview_id, report_data)
       VALUES (?, ?, ?)`,
      [candidateId, interviewId, JSON.stringify(reportData)]
    );

    // Update candidate status
    await db.run(
      `UPDATE interview_candidates 
       SET status = ?, score = ?, submitted_at = ?
       WHERE interview_id = ? AND candidate_id = ?`,
      ['completed', final_score, new Date().toISOString(), interviewId, candidateId]
    );

    // Store performance metrics
    await db.run(
      `INSERT INTO performance_metrics 
       (candidate_id, interview_id, technical_score, soft_skills_score, overall_score, 
        communication_clarity, problem_solving, teamwork, leadership)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        candidateId,
        interviewId,
        performance_metrics?.technical_score || 0,
        performance_metrics?.soft_skills_score || 0,
        final_score,
        performance_metrics?.communication || 0,
        performance_metrics?.problem_solving || 0,
        performance_metrics?.teamwork || 0,
        performance_metrics?.leadership || 0
      ]
    );

    res.json({
      success: true,
      message: 'Report generated successfully',
      data: reportData
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate report',
      error: error.message 
    });
  }
});

// Get candidate report
router.get('/:interviewId/report/:candidateId', authenticate, async (req, res) => {
  try {
    const { interviewId, candidateId } = req.params;

    const report = await db.get(
      `SELECT * FROM interview_reports 
       WHERE interview_id = ? AND candidate_id = ?
       ORDER BY created_at DESC LIMIT 1`,
      [interviewId, candidateId]
    );

    if (!report) {
      return res.status(404).json({ 
        success: false, 
        message: 'Report not found' 
      });
    }

    const metrics = await db.get(
      `SELECT * FROM performance_metrics 
       WHERE interview_id = ? AND candidate_id = ?
       ORDER BY created_at DESC LIMIT 1`,
      [interviewId, candidateId]
    );

    res.json({
      success: true,
      data: {
        report: JSON.parse(report.report_data),
        metrics
      }
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch report' 
    });
  }
});

// ============ COMPANY RECRUITMENT ============

// Get high performers for recruitment
router.get('/recruitment/high-performers', authenticate, async (req, res) => {
  try {
    // Get candidates with scores > 70
    const highPerformers = await db.all(
      `SELECT DISTINCT 
        u.id, u.full_name, u.email,
        MAX(pm.overall_score) as best_score,
        AVG(pm.overall_score) as avg_score,
        i.job_title,
        COUNT(DISTINCT i.id) as interview_count
       FROM users u
       JOIN interview_candidates ic ON u.id = ic.candidate_id
       JOIN interviews i ON ic.interview_id = i.id
       JOIN performance_metrics pm ON u.id = pm.candidate_id
       WHERE pm.overall_score >= 70 AND u.role = 'candidate'
       GROUP BY u.id
       ORDER BY best_score DESC`
    );

    res.json({
      success: true,
      data: highPerformers
    });
  } catch (error) {
    console.error('Error fetching high performers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch candidates' 
    });
  }
});

// Create hiring decision based on performance
router.post('/recruitment/hiring-decision', authenticate, async (req, res) => {
  try {
    const { candidate_id, job_id, ai_score, decision, feedback } = req.body;

    await db.run(
      `INSERT INTO hiring_decisions 
       (candidate_id, job_id, company_id, ai_score, decision, feedback, decision_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [candidate_id, job_id, req.userId, ai_score, decision, feedback, new Date().toISOString()]
    );

    res.json({
      success: true,
      message: `Hiring decision recorded: ${decision}`
    });
  } catch (error) {
    console.error('Error recording hiring decision:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to record hiring decision' 
    });
  }
});

// Get recruitment analytics
router.get('/recruitment/analytics', authenticate, async (req, res) => {
  try {
    const stats = await db.get(
      `SELECT 
        COUNT(DISTINCT hd.candidate_id) as total_candidates,
        SUM(CASE WHEN hd.decision = 'hired' THEN 1 ELSE 0 END) as hired_count,
        SUM(CASE WHEN hd.decision = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
        SUM(CASE WHEN hd.decision = 'pending' THEN 1 ELSE 0 END) as pending_count,
        AVG(hd.ai_score) as avg_score
       FROM hiring_decisions hd
       WHERE hd.company_id = ?`,
      [req.userId]
    );

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch analytics' 
    });
  }
});

// ============ HELPER FUNCTIONS ============

function generateRecommendations(score, metrics) {
  const recommendations = [];

  if (score >= 90) {
    recommendations.push('Excellent performance. Candidate is ready for immediate hire.');
  } else if (score >= 75) {
    recommendations.push('Good performance. Candidate is suitable for the role.');
  } else if (score >= 60) {
    recommendations.push('Average performance. Consider additional training or assessment.');
  } else {
    recommendations.push('Below average performance. Recommend further evaluation.');
  }

  if (metrics?.technical_score < 50) {
    recommendations.push('Needs technical skill improvement.');
  }

  if (metrics?.soft_skills_score < 50) {
    recommendations.push('Needs soft skill development.');
  }

  if (metrics?.communication < 50) {
    recommendations.push('Work on communication skills.');
  }

  return recommendations;
}

module.exports = router;
