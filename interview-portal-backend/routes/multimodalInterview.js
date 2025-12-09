/**
 * Real-Time Multimodal Interview API Routes
 * Handles voice, video, chat, and emotion tracking
 */

const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');
const speechService = require('../services/speechToTextService');
const facialService = require('../services/facialRecognitionService');
const chatService = require('../services/chatService');

// Store active sessions for real-time data
const activeSessions = new Map();

/**
 * POST /api/multimodal-interview/start-session
 * Initialize real-time multimodal interview session
 */
router.post('/start-session', authenticate, (req, res) => {
  try {
    const { sessionId, jobId, interviewType } = req.body;
    const candidateId = req.user.id;

    if (!sessionId || !jobId) {
      return res.status(400).json({
        success: false,
        error: 'Missing sessionId or jobId',
      });
    }

    // Create session tracker
    const session = {
      sessionId,
      candidateId,
      jobId,
      interviewType, // 'voice' | 'video' | 'chat' | 'multimodal'
      startTime: new Date(),
      speechMetrics: [],
      facialMetrics: [],
      chatHistory: [],
      emotionHistory: [],
      engagement: {
        eyeContact: 0,
        attentiveness: 0,
        confidence: 0,
      },
      active: true,
    };

    activeSessions.set(sessionId, session);

    res.json({
      success: true,
      message: 'Session started',
      sessionId,
      interviewType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start session',
    });
  }
});

/**
 * POST /api/multimodal-interview/process-speech
 * Process speech-to-text transcription in real-time
 */
router.post('/process-speech', authenticate, (req, res) => {
  try {
    const { sessionId, transcript, audioData } = req.body;

    if (!sessionId || !transcript) {
      return res.status(400).json({
        success: false,
        error: 'Missing sessionId or transcript',
      });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Process speech quality
    const speechData = speechService.processSpeechToText(transcript);
    const quality = speechService.validateTranscript(transcript);
    const analysis = speechService.analyzeSpeechQuality(transcript);

    // Store in session
    session.speechMetrics.push({
      timestamp: new Date(),
      transcript,
      quality,
      analysis,
      audioDataLength: audioData ? audioData.length : 0,
    });

    res.json({
      success: true,
      transcript,
      quality,
      analysis,
      metrics: {
        wordCount: speechData.wordCount,
        length: speechData.length,
        fluency: analysis.fluency,
        confidenceScore: analysis.confidenceScore,
      },
    });
  } catch (error) {
    console.error('Error processing speech:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process speech',
    });
  }
});

/**
 * POST /api/multimodal-interview/process-facial
 * Process facial recognition and emotion detection in real-time
 */
router.post('/process-facial', authenticate, (req, res) => {
  try {
    const { sessionId, facialMetrics, landmarks } = req.body;

    if (!sessionId || !facialMetrics) {
      return res.status(400).json({
        success: false,
        error: 'Missing sessionId or facialMetrics',
      });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Process facial data
    const facialData = facialService.processFacialData(facialMetrics);
    let expressions = {};
    let emotions = {};
    let eyeGaze = {};

    if (facialData.success) {
      expressions = facialService.analyzeFacialExpression(landmarks);
      emotions = facialService.detectEmotions(facialData, expressions);
      eyeGaze = facialService.trackEyeGaze(facialData);

      // Store in session
      session.facialMetrics.push({
        timestamp: new Date(),
        facialData,
        expressions: expressions.expressions,
        emotions,
        eyeGaze,
      });

      session.engagement.eyeContact = eyeGaze.engagementScore;
      session.emotionHistory.push(emotions.dominantEmotion);
    }

    res.json({
      success: facialData.success,
      facialData,
      expressions: expressions.expressions,
      emotions,
      eyeGaze,
      engagement: session.engagement.eyeContact,
    });
  } catch (error) {
    console.error('Error processing facial data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process facial data',
    });
  }
});

/**
 * POST /api/multimodal-interview/send-message
 * Send chat message and get AI response
 */
router.post('/send-message', authenticate, (req, res) => {
  try {
    const { sessionId, message, currentQuestion, expectedKeywords } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing sessionId or message',
      });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Generate AI response
    const aiResponse = chatService.generateAIResponse(message, session.chatHistory, {
      currentQuestion,
    });

    // Evaluate message quality
    const quality = chatService.evaluateMessageQuality(message, expectedKeywords || []);

    // Store messages
    chatService.storeMessage(sessionId, 'user', message, { expectedKeywords });
    chatService.storeMessage(sessionId, 'ai', aiResponse.aiResponse);

    session.chatHistory.push({
      role: 'user',
      message,
      quality,
      timestamp: new Date(),
    });

    session.chatHistory.push({
      role: 'ai',
      message: aiResponse.aiResponse,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      userMessage: message,
      aiResponse: aiResponse.aiResponse,
      responseType: aiResponse.responseType,
      quality,
      confidence: aiResponse.confidence,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
});

/**
 * GET /api/multimodal-interview/session-metrics/:sessionId
 * Get real-time metrics for current session
 */
router.get('/session-metrics/:sessionId', authenticate, (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Calculate aggregated metrics
    let facialAggregate = {};
    if (session.facialMetrics.length > 0) {
      facialAggregate = facialService.calculateFacialMetricsAggregate(
        session.facialMetrics.map((m) => ({
          eyeContact: m.eyeGaze ? (m.eyeGaze.lookingAtCamera ? 'good' : 'poor') : 'moderate',
          emotions: m.emotions ? m.emotions.emotions : {},
        }))
      );
    }

    // Calculate chat summary
    let chatSummary = {};
    if (session.chatHistory.length > 0) {
      chatSummary = chatService.generateConversationSummary(
        session.chatHistory.map((h) => ({
          sender: h.role,
          message: h.message,
        }))
      );
    }

    const sessionDuration = Math.round((new Date() - session.startTime) / 1000);

    res.json({
      success: true,
      sessionId,
      sessionDuration,
      metrics: {
        speech: {
          totalUtterances: session.speechMetrics.length,
          averageFluency:
            session.speechMetrics.length > 0
              ? session.speechMetrics[session.speechMetrics.length - 1].analysis.fluency
              : 'none',
          averageConfidence:
            session.speechMetrics.length > 0
              ? Math.round(
                  session.speechMetrics.reduce((sum, m) => sum + m.analysis.confidenceScore, 0) /
                    session.speechMetrics.length
                )
              : 0,
        },
        facial: facialAggregate,
        chat: chatSummary,
        engagement: session.engagement,
        dominantEmotions: session.emotionHistory.slice(-10),
      },
    });
  } catch (error) {
    console.error('Error getting session metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session metrics',
    });
  }
});

/**
 * POST /api/multimodal-interview/end-session
 * End session and save final metrics
 */
router.post('/end-session', authenticate, (req, res) => {
  try {
    const { sessionId, finalScore } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing sessionId',
      });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    const sessionDuration = Math.round((new Date() - session.startTime) / 1000);

    // Calculate final metrics
    const avgEngagement =
      (session.engagement.eyeContact + session.engagement.attentiveness + session.engagement.confidence) /
      3;

    // Get emotion distribution
    const emotionCounts = {};
    session.emotionHistory.forEach((emotion) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const dominantEmotion =
      Object.keys(emotionCounts).length > 0
        ? Object.keys(emotionCounts).reduce((a, b) =>
            emotionCounts[a] > emotionCounts[b] ? a : b
          )
        : 'neutral';

    // Store session in database
    db.run(
      `INSERT INTO ai_interview_sessions 
       (candidate_id, job_id, interview_type, status, final_score, ai_feedback, started_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.candidateId,
        session.jobId,
        session.interviewType,
        'completed',
        Math.round(finalScore || avgEngagement),
        JSON.stringify({
          duration: sessionDuration,
          speechUtterances: session.speechMetrics.length,
          facialMetrics: session.facialMetrics.length,
          messages: session.chatHistory.length,
          averageEngagement: Math.round(avgEngagement),
          dominantEmotion,
        }),
        session.startTime.toISOString(),
        new Date().toISOString(),
      ],
      function (err) {
        if (err) {
          console.error('Error saving session:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to save session',
          });
        }

        // Remove from active sessions
        activeSessions.delete(sessionId);

        res.json({
          success: true,
          message: 'Session ended',
          sessionId,
          metrics: {
            duration: sessionDuration,
            finalScore: Math.round(finalScore || avgEngagement),
            speechUtterances: session.speechMetrics.length,
            facialMetrics: session.facialMetrics.length,
            messages: session.chatHistory.length,
            dominantEmotion,
          },
        });
      }
    );
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end session',
    });
  }
});

module.exports = router;
