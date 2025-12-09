/**
 * Murf AI Voice Service
 * Converts text responses to realistic AI voice using Murf API
 */

const axios = require('axios');

const MURF_API_KEY = process.env.MURF_API_KEY || 'your-murf-api-key';
const MURF_BASE_URL = 'https://api.murf.ai/v1';

/**
 * Generate speech from text using Murf AI
 * @param {string} text - Text to convert to speech
 * @param {object} options - Voice options
 * @returns {Promise<string>} Audio URL
 */
const generateSpeech = async (text, options = {}) => {
  try {
    const {
      voiceId = 'en-US-thomas', // Default male voice
      rate = 1.0, // Speech rate
      pitch = 1.0, // Pitch
      emotion = 'neutral', // Emotion
    } = options;

    console.log(`[Murf] Generating speech for: "${text.substring(0, 50)}..."`);

    const response = await axios.post(
      `${MURF_BASE_URL}/speech/generate`,
      {
        text: text,
        voiceId: voiceId,
        rate: rate,
        pitch: pitch,
        emotion: emotion,
        audioFormat: 'mp3',
      },
      {
        headers: {
          'api-key': MURF_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.audioUrl) {
      console.log('[Murf] Speech generated successfully');
      return response.data.audioUrl;
    }

    throw new Error('No audio URL in response');
  } catch (error) {
    console.error('[Murf Error]', error.message);
    // Fallback to Web Speech API on frontend if Murf fails
    return null;
  }
};

/**
 * Generate AI interviewer response with voice
 * @param {string} candidateAnswer - What candidate said
 * @param {object} candidateProfile - Candidate info
 * @param {object} currentQuestion - Current question being asked
 * @param {array} conversationHistory - Previous Q&A
 * @returns {Promise<object>} { response, audioUrl, nextQuestion }
 */
const generateInterviewerResponse = async (candidateAnswer, candidateProfile, currentQuestion, conversationHistory = []) => {
  try {
    // Generate AI feedback
    const feedback = generateFeedback(candidateAnswer, currentQuestion);

    // Determine next question based on answer quality
    const nextQuestion = generateFollowUpQuestion(candidateAnswer, currentQuestion, conversationHistory);

    // Generate voice for the response
    const responseText = `${feedback} ${nextQuestion.question}`;
    const audioUrl = await generateSpeech(responseText, {
      voiceId: 'en-US-thomas', // Professional male voice
      rate: 0.95,
      pitch: 1.0,
      emotion: 'professional',
    });

    return {
      success: true,
      feedback: feedback,
      nextQuestion: nextQuestion,
      responseText: responseText,
      audioUrl: audioUrl || null, // Will be null if Murf fails (fallback to browser TTS)
    };
  } catch (error) {
    console.error('[Murf Response Generation Error]', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Generate feedback for candidate answer
 */
const generateFeedback = (answer, question) => {
  const answerLength = answer.trim().split(' ').length;
  const isComprehensive = answerLength > 30;

  const feedbacks = [
    isComprehensive
      ? 'Good detailed response. '
      : 'I see. ',
    Math.random() > 0.5
      ? 'Let me ask you a follow-up question. '
      : 'Now, let me dig deeper. ',
  ];

  return feedbacks.join('');
};

/**
 * Generate follow-up question based on candidate's answer
 */
const generateFollowUpQuestion = (answer, currentQuestion, conversationHistory = []) => {
  // Analyze answer to generate relevant follow-up
  const answerLength = answer.trim().split(' ').length;
  const keywordCount = countKeywords(answer, currentQuestion.expected_answer_keywords || []);

  const followUpQuestions = [
    {
      question: 'Can you provide a specific example of that?',
      type: 'technical',
      difficulty: 'medium',
    },
    {
      question: 'How would you approach this differently if the requirements changed?',
      type: 'technical',
      difficulty: 'hard',
    },
    {
      question: 'What challenges did you face and how did you overcome them?',
      type: 'technical',
      difficulty: 'medium',
    },
    {
      question: 'How would you explain this concept to someone less technical?',
      type: 'communication',
      difficulty: 'medium',
    },
    {
      question: 'What would you do if this approach didn\'t work?',
      type: 'problem-solving',
      difficulty: 'hard',
    },
  ];

  // Select based on question type
  const typeBasedFollowUps = followUpQuestions.filter(
    (q) => q.type === (currentQuestion.type || 'technical')
  );

  return typeBasedFollowUps.length > 0
    ? typeBasedFollowUps[Math.floor(Math.random() * typeBasedFollowUps.length)]
    : followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
};

/**
 * Count keywords in answer
 */
const countKeywords = (answer, keywords = []) => {
  if (!keywords || keywords.length === 0) return 0;
  const answerLower = answer.toLowerCase();
  return keywords.filter((keyword) => answerLower.includes(keyword.toLowerCase())).length;
};

/**
 * Get available Murf voices
 */
const getAvailableVoices = () => {
  return {
    male: [
      { id: 'en-US-thomas', name: 'Thomas (Professional Male)', emotion: 'professional' },
      { id: 'en-US-matthew', name: 'Matthew (Friendly Male)', emotion: 'friendly' },
      { id: 'en-US-mike', name: 'Mike (Casual Male)', emotion: 'casual' },
    ],
    female: [
      { id: 'en-US-sarah', name: 'Sarah (Professional Female)', emotion: 'professional' },
      { id: 'en-US-emma', name: 'Emma (Friendly Female)', emotion: 'friendly' },
      { id: 'en-US-olivia', name: 'Olivia (Energetic Female)', emotion: 'energetic' },
    ],
  };
};

module.exports = {
  generateSpeech,
  generateInterviewerResponse,
  getAvailableVoices,
};
