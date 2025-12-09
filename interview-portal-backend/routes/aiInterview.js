const express = require('express');
const router = express.Router();
const db = require('../models/database');
const realtime = require('../realtime');
const { authenticate } = require('../middleware/auth');
const { parseResume } = require('../services/resumeParser');
const {
  generateDynamicQuestions,
  evaluateAnswer,
} = require('../services/aiQuestionGenerator');

/**
 * @route POST /api/ai-interview/parse-resume
 * @desc Parse resume and extract candidate profile (Step 1)
 * @param {string} resume_text - Resume content as text
 * @returns {object} Extracted profile data (skills, experience, education, projects, certificates)
 */
router.post('/parse-resume', authenticate, async (req, res) => {
  try {
    const { resume_text } = req.body;

    if (!resume_text || resume_text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required',
      });
    }

    const profileData = parseResume(resume_text);

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: profileData,
    });
  } catch (error) {
    console.error('Error parsing resume:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error parsing resume',
      error: error.message,
    });
  }
});

/**
 * @route POST /api/ai-interview/generate-questions
 * @desc Generate dynamic questions based on resume and job role (Step 2)
 * @param {object} resume_data - Parsed resume data (from Step 1)
 * @param {string} job_role - Job role for which interview is being conducted
 * @param {number} count - Number of questions to generate (default: 20)
 * @returns {array} Array of dynamically generated questions
 */
router.post('/generate-questions', authenticate, async (req, res) => {
  try {
    const { resume_data, job_role, count = 20 } = req.body;

    if (!resume_data || !job_role) {
      return res.status(400).json({
        success: false,
        message: 'Resume data and job role are required',
      });
    }

    const questions = generateDynamicQuestions(resume_data, job_role, count);

    res.json({
      success: true,
      message: 'Questions generated successfully',
      data: {
        total_questions: questions.length,
        questions: questions,
        distribution: {
          technical: questions.filter((q) => q.type === 'technical').length,
          hr: questions.filter((q) => q.type === 'hr').length,
          aptitude: questions.filter((q) => q.type === 'aptitude').length,
          scenario: questions.filter((q) => q.type === 'scenario').length,
        },
      },
    });
  } catch (error) {
    console.error('Error generating questions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error generating questions',
      error: error.message,
    });
  }
});

/**
 * @route POST /api/ai-interview/start
 * @desc Start an AI interview session for a candidate applying to a job
 * @param {number} job_id - Job ID
 * @param {string} interview_type - Interview type (text, voice, video)
 * @param {array} questions - Array of questions for this interview
 * @returns {object} Interview session with questions
 */
router.post('/start', authenticate, async (req, res) => {
  try {
    const candidate_id = req.userId;
    const { job_id, interview_type = 'text', questions } = req.body;

    if (!job_id || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Job ID and questions are required',
      });
    }

    // Create AI interview session
    const result = await db.run(
      `
      INSERT INTO ai_interview_sessions 
      (candidate_id, job_id, interview_type, status, total_questions, started_at)
      VALUES (?, ?, ?, 'in_progress', ?, CURRENT_TIMESTAMP)
      `,
      [candidate_id, job_id, interview_type, questions.length]
    );

    const session_id = result.lastID;

    // Emit realtime event
    const io = realtime.getIO();
    if (io) io.emit('ai-interview:started', { session_id, candidate_id, job_id, interview_type });

    res.json({
      success: true,
      message: 'Interview session started',
      data: {
        session_id,
        interview_type,
        total_questions: questions.length,
        questions: questions.map((q, index) => ({
          question_number: index + 1,
          type: q.type,
          difficulty: q.difficulty,
          question: q.question,
          follow_up: q.follow_up,
        })),
      },
    });
  } catch (error) {
    console.error('Error starting interview:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error starting interview',
      error: error.message,
    });
  }
});

/**
 * @route POST /api/ai-interview/submit-answer
 * @desc Submit answer for a specific question in the interview
 * @param {number} session_id - Interview session ID
 * @param {number} question_index - Question index (0-based)
 * @param {string} candidate_answer - Candidate's answer
 * @param {string} question_text - The question text
 * @param {array} expected_keywords - Expected keywords in answer
 * @param {string} question_type - Type of question (technical, hr, aptitude, scenario)
 * @returns {object} Score and AI evaluation
 */
router.post('/submit-answer', authenticate, async (req, res) => {
  try {
    const { session_id, question_index, candidate_answer, expected_keywords, question_type } =
      req.body;

    if (!session_id || candidate_answer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and answer are required',
      });
    }

    // Evaluate the answer
    const evaluation = evaluateAnswer(candidate_answer, expected_keywords, question_type);

    // Create a temporary question for this response
    const tempResult = await db.run(
      `
      INSERT INTO ai_interview_responses 
      (session_id, question_id, candidate_answer, ai_evaluation, score, confidence_level)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        session_id,
        question_index + 1,
        candidate_answer,
        evaluation.feedback,
        evaluation.score,
        expected_keywords && expected_keywords.length ? (evaluation.matchedKeywords.length / expected_keywords.length) * 100 : 0,
      ]
    );

    // Emit realtime event for new response
    const io = realtime.getIO();
    if (io) io.emit('ai-interview:response', {
      response_id: tempResult.lastID,
      session_id,
      question_index,
      candidate_id: req.userId,
      score: evaluation.score,
      feedback: evaluation.feedback,
      matched_keywords: evaluation.matchedKeywords,
      created_at: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        response_id: tempResult.lastID,
        score: evaluation.score,
        feedback: evaluation.feedback,
        matched_keywords: evaluation.matchedKeywords,
        answer_quality: evaluation.answerQuality,
      },
    });
  } catch (error) {
    console.error('Error submitting answer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message,
    });
  }
});

/**
 * @route POST /api/ai-interview/complete
 * @desc Complete interview session and generate final score
 * @param {number} session_id - Interview session ID
 * @returns {object} Final interview score and feedback
 */
router.post('/complete', authenticate, async (req, res) => {
  try {
    const { session_id, interview_duration = 0 } = req.body;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    // Get all responses for this session
    const responses = await db.all(
      `
      SELECT score FROM ai_interview_responses WHERE session_id = ?
      `,
      [session_id]
    );

    if (responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No responses found for this session',
      });
    }

    // Calculate final score
    const final_score = responses.reduce((sum, r) => sum + r.score, 0) / responses.length;
    const correct_answers = responses.filter((r) => r.score >= 70).length;

    // Update session with final score
    await db.run(
      `
      UPDATE ai_interview_sessions 
      SET status = 'completed', 
          final_score = ?, 
          correct_answers = ?,
          interview_duration = ?,
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [final_score, correct_answers, interview_duration, session_id]
    );

    // Get session details for report
    const session = await db.get(
      `
      SELECT * FROM ai_interview_sessions WHERE id = ?
      `,
      [session_id]
    );

    // Generate AI feedback
    const feedback = generateInterviewFeedback(final_score, correct_answers, responses.length);

    // Create hiring decision record
    if (session) {
      await db.run(
        `
        INSERT INTO hiring_decisions (candidate_id, job_id, company_id, ai_score, decision, feedback)
        VALUES (?, ?, ?, ?, 'pending', ?)
        `,
        [session.candidate_id, session.job_id, session.company_id || 1, final_score, feedback]
      );
    }

    // Emit realtime completion event
    const io = realtime.getIO();
    if (io) io.emit('ai-interview:completed', {
      session_id,
      final_score,
      total_questions: responses.length,
      correct_answers,
      interview_duration,
      feedback
    });

    res.json({
      success: true,
      message: 'Interview completed successfully',
      data: {
        session_id,
        final_score: Math.round(final_score * 100) / 100,
        total_questions: responses.length,
        correct_answers,
        interview_duration,
        feedback,
        status: final_score >= 70 ? 'PASSED' : 'FAILED',
        recommendation: generateRecommendation(final_score),
      },
    });
  } catch (error) {
    console.error('Error completing interview:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error completing interview',
      error: error.message,
    });
  }
});

/**
 * @route GET /api/ai-interview/session/:session_id
 * @desc Get interview session details and all responses
 */
router.get('/session/:session_id', authenticate, async (req, res) => {
  try {
    const { session_id } = req.params;

    const session = await db.get(
      `
      SELECT * FROM ai_interview_sessions WHERE id = ?
      `,
      [session_id]
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    const responses = await db.all(
      `
      SELECT * FROM ai_interview_responses WHERE session_id = ?
      `,
      [session_id]
    );

    res.json({
      success: true,
      message: 'Session retrieved successfully',
      data: {
        session,
        responses,
      },
    });
  } catch (error) {
    console.error('Error retrieving session:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error retrieving session',
      error: error.message,
    });
  }
});

/**
 * Helper: Generate interview feedback
 */
const generateInterviewFeedback = (score, correct_answers, total_questions) => {
  if (score >= 85) {
    return `Excellent performance! You scored ${score}% and answered ${correct_answers}/${total_questions} questions correctly. You demonstrated strong technical knowledge and communication skills.`;
  } else if (score >= 70) {
    return `Good performance! You scored ${score}% and answered ${correct_answers}/${total_questions} questions correctly. Consider improving in specific technical areas.`;
  } else if (score >= 50) {
    return `Satisfactory performance. You scored ${score}% with ${correct_answers}/${total_questions} correct answers. We recommend further preparation before your next interview.`;
  } else {
    return `Needs improvement. You scored ${score}% with ${correct_answers}/${total_questions} correct answers. Please review the feedback and prepare better for your next attempt.`;
  }
};

/**
 * Helper: Generate recommendation
 */
const generateRecommendation = (score) => {
  if (score >= 80) return 'Strong Hire';
  if (score >= 70) return 'Hire';
  if (score >= 60) return 'Maybe';
  return 'Do Not Hire';
};

module.exports = router;
