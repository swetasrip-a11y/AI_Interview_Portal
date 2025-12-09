/**
 * Dynamic AI Interview Routes with Voice Integration
 * Handles real-time dynamic questions, answer evaluation, and Murf voice responses
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { generateDynamicQuestions, evaluateAnswer } = require('../services/aiQuestionGenerator');
const { generateInterviewerResponse, getAvailableVoices } = require('../services/murf');

/**
 * @route POST /api/dynamic-interview/start
 * @desc Start a dynamic interview session
 * @param {object} candidateProfile - Candidate info { name, skills, experience, jobRole }
 * @returns {object} { sessionId, firstQuestion, voiceOptions }
 */
router.post('/start', authenticate, async (req, res) => {
  try {
    const { candidateProfile, jobRole } = req.body;

    if (!candidateProfile || !jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Candidate profile and job role are required',
      });
    }

    // Generate initial questions based on candidate profile
    const questions = generateDynamicQuestions(candidateProfile, jobRole, 25);

    // Create session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store session data (in production, use database)
    global.interviewSessions = global.interviewSessions || {};
    global.interviewSessions[sessionId] = {
      candidateProfile,
      jobRole,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      scores: [],
    };

    const firstQuestion = questions[0];

    res.json({
      success: true,
      message: 'Interview session started',
      data: {
        sessionId,
        firstQuestion,
        voiceOptions: getAvailableVoices(),
        totalQuestions: questions.length,
        currentQuestionNumber: 1,
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
 * @route POST /api/dynamic-interview/submit-answer
 * @desc Submit candidate answer and get next question with voice feedback
 * @param {string} sessionId - Interview session ID
 * @param {string} answer - Candidate's answer
 * @param {string} voiceId - Selected voice ID for AI response
 * @returns {object} { feedback, nextQuestion, audioUrl, score, sessionProgress }
 */
router.post('/submit-answer', authenticate, async (req, res) => {
  try {
    const { sessionId, answer, voiceId = 'en-US-thomas' } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and answer are required',
      });
    }

    // Get session
    const session = global.interviewSessions?.[sessionId];
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Get current question
    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message: 'No current question found',
      });
    }

    // Evaluate answer
    const evaluation = evaluateAnswer(answer, currentQuestion);
    const score = evaluation.score || 0;

    // Store answer
    session.answers.push({
      questionIndex: session.currentQuestionIndex,
      question: currentQuestion.question,
      answer: answer,
      score: score,
      timestamp: new Date(),
    });
    session.scores.push(score);

    // Generate AI response with voice
    const aiResponse = await generateInterviewerResponse(
      answer,
      session.candidateProfile,
      currentQuestion,
      session.answers
    );

    // Move to next question
    session.currentQuestionIndex++;

    // Prepare response
    const isLastQuestion = session.currentQuestionIndex >= session.questions.length;
    const nextQuestion = isLastQuestion ? null : session.questions[session.currentQuestionIndex];

    let responseData = {
      success: true,
      feedback: aiResponse.feedback || '',
      answerScore: score,
      evaluation: evaluation,
      audioUrl: aiResponse.audioUrl || null,
      sessionProgress: {
        currentQuestion: session.currentQuestionIndex,
        totalQuestions: session.questions.length,
        questionsAnswered: session.answers.length,
        averageScore: (session.scores.reduce((a, b) => a + b, 0) / session.scores.length).toFixed(2),
      },
    };

    if (!isLastQuestion) {
      responseData.nextQuestion = nextQuestion;
      responseData.nextQuestionNumber = session.currentQuestionIndex + 1;
    } else {
      responseData.interviewComplete = true;
      responseData.finalScore = calculateFinalScore(session.scores);
      responseData.recommendation = generateRecommendation(calculateFinalScore(session.scores));
    }

    res.json(responseData);
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
 * @route GET /api/dynamic-interview/session/:sessionId
 * @desc Get current interview session status
 */
router.get('/session/:sessionId', authenticate, (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = global.interviewSessions?.[sessionId];
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: {
        sessionId,
        candidateName: session.candidateProfile.name,
        jobRole: session.jobRole,
        progress: {
          currentQuestion: session.currentQuestionIndex + 1,
          totalQuestions: session.questions.length,
          answeredQuestions: session.answers.length,
          averageScore: (session.scores.reduce((a, b) => a + b, 0) / session.scores.length || 0).toFixed(2),
        },
        startTime: session.startTime,
        elapsedTime: Math.floor((Date.now() - session.startTime) / 1000),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message,
    });
  }
});

/**
 * @route POST /api/dynamic-interview/end-session
 * @desc End interview session and get full report
 */
router.post('/end-session', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = global.interviewSessions?.[sessionId];
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    const finalScore = calculateFinalScore(session.scores);
    const report = generateInterviewReport(session, finalScore);

    // Clean up session
    delete global.interviewSessions[sessionId];

    res.json({
      success: true,
      message: 'Interview ended successfully',
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error ending session',
      error: error.message,
    });
  }
});

/**
 * @route GET /api/dynamic-interview/voices
 * @desc Get available voice options
 */
router.get('/voices', (req, res) => {
  try {
    res.json({
      success: true,
      data: getAvailableVoices(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching voices',
      error: error.message,
    });
  }
});

// ============ Helper Functions ============

/**
 * Calculate final interview score
 */
const calculateFinalScore = (scores = []) => {
  if (scores.length === 0) return 0;
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(average);
};

/**
 * Generate hiring recommendation based on score
 */
const generateRecommendation = (score) => {
  if (score >= 85) return 'STRONG HIRE - Exceptional performance';
  if (score >= 75) return 'HIRE - Good performance, ready for role';
  if (score >= 65) return 'MAYBE - Needs additional discussion';
  if (score >= 50) return 'REVIEW - Borderline, needs evaluation';
  return 'NO HIRE - Below expectations';
};

/**
 * Generate comprehensive interview report
 */
const generateInterviewReport = (session, finalScore) => {
  const answersGroupedByCategory = groupAnswersByCategory(session.answers);
  const categoryScores = calculateCategoryScores(answersGroupedByCategory);

  return {
    sessionId: session.sessionId,
    candidateName: session.candidateProfile.name,
    jobRole: session.jobRole,
    interviewDate: session.startTime,
    totalDuration: Math.floor((Date.now() - session.startTime) / 1000),
    finalScore: finalScore,
    recommendation: generateRecommendation(finalScore),
    totalQuestionsAsked: session.answers.length,
    categoryScores: categoryScores,
    answers: session.answers,
    strengths: extractStrengths(session.answers),
    weaknesses: extractWeaknesses(session.answers),
    notes: generateInterviewNotes(finalScore, categoryScores),
  };
};

/**
 * Group answers by question category
 */
const groupAnswersByCategory = (answers) => {
  const grouped = {};
  answers.forEach((ans) => {
    const category = ans.category || 'general';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(ans);
  });
  return grouped;
};

/**
 * Calculate scores by category
 */
const calculateCategoryScores = (grouped) => {
  const scores = {};
  Object.entries(grouped).forEach(([category, answers]) => {
    const avgScore = answers.reduce((sum, ans) => sum + ans.score, 0) / answers.length;
    scores[category] = Math.round(avgScore);
  });
  return scores;
};

/**
 * Extract candidate strengths from answers
 */
const extractStrengths = (answers) => {
  const highScoreAnswers = answers.filter((ans) => ans.score >= 80);
  const strengths = highScoreAnswers.slice(0, 3).map((ans) => ({
    area: ans.question.substring(0, 50) + '...',
    score: ans.score,
  }));
  return strengths.length > 0 ? strengths : [{ area: 'Good overall performance', score: 75 }];
};

/**
 * Extract candidate weaknesses from answers
 */
const extractWeaknesses = (answers) => {
  const lowScoreAnswers = answers.filter((ans) => ans.score < 60);
  const weaknesses = lowScoreAnswers.slice(0, 2).map((ans) => ({
    area: ans.question.substring(0, 50) + '...',
    score: ans.score,
  }));
  return weaknesses;
};

/**
 * Generate interview summary notes
 */
const generateInterviewNotes = (finalScore, categoryScores) => {
  let notes = '';

  if (finalScore >= 85) {
    notes = 'Candidate demonstrated excellent technical knowledge and communication skills.';
  } else if (finalScore >= 75) {
    notes = 'Candidate showed good understanding with room for improvement in specific areas.';
  } else if (finalScore >= 65) {
    notes = 'Candidate needs further assessment for specific technical skills.';
  } else {
    notes = 'Candidate may not be the best fit for this role at this time.';
  }

  return notes;
};

module.exports = router;
