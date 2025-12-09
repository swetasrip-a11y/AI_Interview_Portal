/**
 * Real-Time Chat & Conversation Service
 * Manages text-based interview conversations with AI responses
 */

/**
 * Parse user message and generate AI response
 */
const generateAIResponse = (userMessage, conversationContext = [], sessionData = {}) => {
  if (!userMessage || typeof userMessage !== 'string') {
    return {
      success: false,
      error: 'Invalid message',
      response: '',
    };
  }

  const cleanMessage = userMessage.trim();

  // Simulate AI response with context-aware replies
  let response = '';
  let responseType = 'general';

  // Extract session context
  const { currentQuestion, jobRole, candidateSkills = [] } = sessionData;

  // Response patterns based on question type
  if (currentQuestion) {
    const questionLower = currentQuestion.toLowerCase();

    if (questionLower.includes('experience') || questionLower.includes('years')) {
      response = generateExperienceResponse(cleanMessage);
      responseType = 'experience';
    } else if (questionLower.includes('problem') || questionLower.includes('challenge')) {
      response = generateProblemSolvingResponse(cleanMessage);
      responseType = 'problem-solving';
    } else if (questionLower.includes('skill') || questionLower.includes('proficient')) {
      response = generateSkillValidationResponse(cleanMessage, candidateSkills);
      responseType = 'skill-validation';
    } else if (questionLower.includes('scenario') || questionLower.includes('situation')) {
      response = generateScenarioResponse(cleanMessage);
      responseType = 'scenario';
    } else {
      response = generateGenericFollowUp(cleanMessage);
      responseType = 'follow-up';
    }
  } else {
    response = generateGreeting(cleanMessage);
    responseType = 'greeting';
  }

  return {
    success: true,
    userMessage: cleanMessage,
    aiResponse: response,
    responseType,
    timestamp: new Date().toISOString(),
    confidence: calculateConfidenceScore(cleanMessage),
  };
};

/**
 * Generate response for experience-related questions
 */
const generateExperienceResponse = (message) => {
  const responses = [
    'That sounds like valuable experience. Can you tell me more about the technical challenges you faced?',
    'Interesting. How did this experience help you develop your skills in this area?',
    'I see. How many projects have you worked on similar to this?',
    "That's impressive. Could you describe your specific role and responsibilities?",
  ];

  // Extract year mentions for validation
  const yearMatch = message.match(/\d+\s*(years?|yrs?)/i);
  if (yearMatch) {
    return `So you have around ${yearMatch[0]} of experience in this area. ${
      responses[Math.floor(Math.random() * responses.length)]
    }`;
  }

  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Generate response for problem-solving questions
 */
const generateProblemSolvingResponse = (message) => {
  const hasApproach = /approach|method|strategy|steps/i.test(message);
  const hasTechnical = /code|api|database|algorithm/i.test(message);

  if (hasApproach && hasTechnical) {
    return 'Your approach is clear. Can you explain the trade-offs in your chosen solution?';
  }

  if (hasApproach) {
    return 'That approach sounds methodical. What tools or technologies would you use to implement this?';
  }

  return 'Tell me more about your problem-solving process. What would be your first step?';
};

/**
 * Generate response for skill-related questions
 */
const generateSkillValidationResponse = (message, candidateSkills = []) => {
  const mentionedSkills = extractMentionedSkills(message);

  if (mentionedSkills.length > 0) {
    return `Great! So you're proficient with ${mentionedSkills.join(', ')}. Can you rate your expertise level with each?`;
  }

  return 'Can you provide specific examples of projects where you used these skills?';
};

/**
 * Generate response for scenario-based questions
 */
const generateScenarioResponse = (message) => {
  const hasSolution = /would|could|should|can|may/i.test(message);
  const hasJustification = /because|since|reason|why|due to/i.test(message);

  if (hasSolution && hasJustification) {
    return 'That solution is well-reasoned. How would you handle unexpected obstacles?';
  }

  if (hasSolution) {
    return 'Interesting solution. What would be the benefits and drawbacks of this approach?';
  }

  return 'What would be your approach to this scenario? Think through the steps involved.';
};

/**
 * Generate generic follow-up response
 */
const generateGenericFollowUp = (message) => {
  const followUps = [
    'Can you provide more details or examples?',
    'How did that experience shape your approach to problem-solving?',
    'What would you do differently if faced with this situation again?',
    'Could you elaborate on the technical aspects of your solution?',
    'What was the outcome or result of your approach?',
  ];

  return followUps[Math.floor(Math.random() * followUps.length)];
};

/**
 * Generate greeting response
 */
const generateGreeting = (message) => {
  if (/hello|hi|hey/i.test(message)) {
    return "Hello! I'm your AI interviewer. Let's begin with the first question. Please feel free to ask for clarifications at any point.";
  }

  if (/ready|start|begin|commence/i.test(message)) {
    return 'Great! Let me ask you the first question. Take your time to think through your answer.';
  }

  return 'Welcome to your interview session. Are you ready to begin?';
};

/**
 * Extract mentioned skills from message
 */
const extractMentionedSkills = (message) => {
  const commonSkills = [
    'javascript',
    'python',
    'java',
    'react',
    'angular',
    'vue',
    'node',
    'express',
    'sql',
    'mongodb',
    'docker',
    'kubernetes',
    'aws',
    'azure',
    'gcp',
    'git',
    'rest',
    'graphql',
    'html',
    'css',
  ];

  const lowerMessage = message.toLowerCase();
  return commonSkills.filter((skill) => lowerMessage.includes(skill));
};

/**
 * Calculate confidence score for response
 */
const calculateConfidenceScore = (message) => {
  let score = 50; // Base score

  // Longer messages indicate more thoughtful response
  const wordCount = message.split(/\s+/).length;
  if (wordCount > 20) score += 15;
  else if (wordCount > 10) score += 10;

  // Technical terms increase confidence
  const technicalTerms = /code|api|database|algorithm|framework|architecture|design pattern/i;
  if (technicalTerms.test(message)) score += 15;

  // Specific examples increase confidence
  if (/example|instance|specifically|such as|like when/i.test(message)) score += 10;

  return Math.min(100, score);
};

/**
 * Evaluate message quality and relevance
 */
const evaluateMessageQuality = (message, expectedKeywords = []) => {
  const quality = {
    relevance: 0,
    completeness: 0,
    clarity: 0,
    technicalDepth: 0,
  };

  // Relevance check against keywords
  const lowerMessage = message.toLowerCase();
  let keywordMatches = 0;
  expectedKeywords.forEach((keyword) => {
    if (lowerMessage.includes(keyword.toLowerCase())) keywordMatches += 1;
  });
  quality.relevance = Math.round((keywordMatches / Math.max(1, expectedKeywords.length)) * 100);

  // Completeness check (length-based)
  const wordCount = message.split(/\s+/).length;
  quality.completeness = Math.min(100, Math.round((wordCount / 30) * 100));

  // Clarity check (punctuation and structure)
  const punctuationCount = (message.match(/[.!?]/g) || []).length;
  quality.clarity = punctuationCount > 0 ? 85 : 60;

  // Technical depth check
  const technicalTermCount = (message.match(/\b(algorithm|data structure|api|framework|pattern)\b/gi) || [])
    .length;
  quality.technicalDepth = Math.min(100, technicalTermCount * 20);

  // Overall score
  const overallScore = Math.round(
    (quality.relevance + quality.completeness + quality.clarity + quality.technicalDepth) / 4
  );

  return {
    ...quality,
    overallScore,
    wordCount,
  };
};

/**
 * Store conversation message
 */
const storeMessage = (sessionId, sender, message, metadata = {}) => {
  if (!sessionId || !sender || !message) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  return {
    success: true,
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionId,
    sender, // 'user' or 'ai'
    message,
    timestamp: new Date().toISOString(),
    metadata: {
      ...metadata,
      quality: evaluateMessageQuality(message, metadata.expectedKeywords || []),
    },
  };
};

/**
 * Generate conversation summary
 */
const generateConversationSummary = (messages) => {
  if (!messages || messages.length === 0) {
    return {
      success: false,
      error: 'No messages to summarize',
    };
  }

  const userMessages = messages.filter((m) => m.sender === 'user');
  const aiMessages = messages.filter((m) => m.sender === 'ai');

  const totalWords = userMessages.reduce((sum, m) => sum + m.message.split(/\s+/).length, 0);
  const avgWordsPerMessage = Math.round(totalWords / userMessages.length);

  // Extract key topics
  const allText = userMessages.map((m) => m.message).join(' ');
  const technicalMentions = (allText.match(/\b(code|api|database|algorithm|framework|pattern)\b/gi) || [])
    .length;

  return {
    success: true,
    totalMessages: messages.length,
    userMessages: userMessages.length,
    aiMessages: aiMessages.length,
    averageMessageLength: avgWordsPerMessage,
    totalWordsSpoken: totalWords,
    technicalMentions,
    engagementLevel: avgWordsPerMessage > 25 ? 'high' : avgWordsPerMessage > 15 ? 'moderate' : 'low',
    duration: 'varies',
  };
};

module.exports = {
  generateAIResponse,
  generateExperienceResponse,
  generateProblemSolvingResponse,
  generateSkillValidationResponse,
  generateScenarioResponse,
  generateGenericFollowUp,
  generateGreeting,
  extractMentionedSkills,
  calculateConfidenceScore,
  evaluateMessageQuality,
  storeMessage,
  generateConversationSummary,
};
