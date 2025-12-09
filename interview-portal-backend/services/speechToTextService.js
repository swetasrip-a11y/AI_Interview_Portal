/**
 * Real-Time Speech Recognition Service
 * Converts speech to text for voice interviews
 * Uses Web Speech API on frontend, but backend manages processing
 */

const processSpeechToText = (audioData) => {
  // Backend stub - actual processing happens in frontend with Web Speech API
  // This function validates and processes transcribed text
  if (!audioData || typeof audioData !== 'string') {
    return {
      success: false,
      error: 'Invalid audio data',
      transcript: '',
    };
  }

  const transcript = audioData.trim();

  return {
    success: true,
    transcript,
    length: transcript.length,
    wordCount: transcript.split(/\s+/).length,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Convert audio blob to base64 for transmission
 */
const encodeAudioToBase64 = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
};

/**
 * Validate speech transcript quality
 */
const validateTranscript = (transcript, questionType = 'technical') => {
  if (!transcript || transcript.trim().length === 0) {
    return {
      valid: false,
      reason: 'Empty transcript',
      score: 0,
    };
  }

  const wordCount = transcript.split(/\s+/).length;
  const minWords = {
    technical: 15,
    hr: 15,
    aptitude: 10,
    scenario: 20,
  };

  const minWord = minWords[questionType] || 10;

  if (wordCount < minWord) {
    return {
      valid: false,
      reason: `Too short. Minimum ${minWord} words required. Got ${wordCount}`,
      wordCount,
      score: Math.round((wordCount / minWord) * 30),
    };
  }

  return {
    valid: true,
    wordCount,
    quality: wordCount > 50 ? 'detailed' : wordCount > 30 ? 'good' : 'brief',
    score: Math.min(30, 10 + Math.round((wordCount / 50) * 20)),
  };
};

/**
 * Analyze sentiment and confidence in response
 */
const analyzeSpeechQuality = (transcript) => {
  const hesitationWords = ['um', 'uh', 'er', 'like', 'you know'];
  const confidenceWords = [
    'definitely',
    'absolutely',
    'certainly',
    'obviously',
    'clearly',
    'without a doubt',
  ];

  const lowerTranscript = transcript.toLowerCase();
  let hesitationCount = 0;
  let confidenceCount = 0;

  hesitationWords.forEach((word) => {
    const matches = lowerTranscript.match(new RegExp(`\\b${word}\\b`, 'g'));
    hesitationCount += matches ? matches.length : 0;
  });

  confidenceWords.forEach((word) => {
    if (lowerTranscript.includes(word)) {
      confidenceCount += 1;
    }
  });

  const totalWords = transcript.split(/\s+/).length;
  const hesitationRatio = hesitationCount / totalWords;
  const confidenceScore = Math.min(100, confidenceCount * 15);

  let fluency = 'moderate';
  if (hesitationRatio < 0.05) fluency = 'excellent';
  else if (hesitationRatio < 0.1) fluency = 'good';
  else if (hesitationRatio < 0.2) fluency = 'fair';
  else fluency = 'needs improvement';

  return {
    fluency,
    hesitationCount,
    confidenceCount,
    confidenceScore: Math.round(confidenceScore),
    hesitationRatio: Math.round(hesitationRatio * 100),
  };
};

module.exports = {
  processSpeechToText,
  encodeAudioToBase64,
  validateTranscript,
  analyzeSpeechQuality,
};
