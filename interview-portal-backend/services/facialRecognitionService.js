/**
 * Real-Time Facial Recognition & Emotion Detection Service
 * Analyzes face data, eye tracking, and emotions during video interviews
 */

/**
 * Process facial detection data from client
 * Validates and scores facial presence and position
 */
const processFacialData = (facialMetrics) => {
  if (!facialMetrics) {
    return {
      success: false,
      error: 'No facial data provided',
      faceDetected: false,
    };
  }

  const { x, y, width, height, confidence, landmarks } = facialMetrics;

  // Validate face detection quality
  if (!confidence || confidence < 0.5) {
    return {
      success: false,
      error: 'Low confidence face detection',
      confidence: confidence || 0,
      faceDetected: false,
    };
  }

  // Check if face is centered (for eye contact simulation)
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const screenCenterX = 320; // Assuming 640px width
  const screenCenterY = 240; // Assuming 480px height

  const distanceFromCenter = Math.sqrt(
    Math.pow(centerX - screenCenterX, 2) + Math.pow(centerY - screenCenterY, 2)
  );

  let eyeContact = 'good';
  if (distanceFromCenter > 150) eyeContact = 'poor';
  else if (distanceFromCenter > 100) eyeContact = 'moderate';

  return {
    success: true,
    faceDetected: true,
    confidence: Math.round(confidence * 100),
    position: { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) },
    eyeContact,
    centered: distanceFromCenter < 100,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Analyze facial landmarks for expressions
 */
const analyzeFacialExpression = (landmarks) => {
  if (!landmarks || landmarks.length === 0) {
    return {
      success: false,
      error: 'No landmarks detected',
    };
  }

  // Simplified expression detection based on landmark positions
  // In production, use ml5.js or face-api.js

  let smiling = false;
  let eyesClosed = false;
  let mouthOpen = false;

  // Check mouth corners (landmarks 48-68 in dlib)
  if (landmarks[54] && landmarks[48]) {
    const mouthHeight = Math.abs(landmarks[54][1] - landmarks[48][1]);
    if (mouthHeight > 10) mouthOpen = true;
    if (landmarks[62] && landmarks[66]) {
      const smileScore =
        (landmarks[48][1] + landmarks[54][1]) / 2 - (landmarks[62][1] + landmarks[66][1]) / 2;
      if (smileScore < -5) smiling = true;
    }
  }

  // Check eyes (landmarks 36-47 in dlib)
  if (landmarks[37] && landmarks[40]) {
    const eyeHeight = Math.abs(landmarks[37][1] - landmarks[40][1]);
    if (eyeHeight < 3) eyesClosed = true;
  }

  return {
    success: true,
    expressions: {
      smiling,
      eyesClosed,
      mouthOpen,
      neutral: !smiling && !mouthOpen && !eyesClosed,
    },
    landmarkCount: landmarks.length,
  };
};

/**
 * Detect emotions from facial data
 * Maps expressions to emotions
 */
const detectEmotions = (facialMetrics, expressions) => {
  const emotions = {
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0,
    neutral: 0,
    confident: 0,
    stressed: 0,
  };

  // Expression to emotion mapping
  if (expressions && expressions.expressions) {
    if (expressions.expressions.smiling) emotions.happy += 30;
    if (expressions.expressions.mouthOpen && facialMetrics.eyeContact === 'good')
      emotions.confident += 25;
    if (expressions.expressions.eyesClosed) emotions.sad += 20;
  }

  // Eye contact indicates confidence
  if (facialMetrics.eyeContact === 'good') {
    emotions.confident += 20;
    emotions.neutral += 10;
  } else if (facialMetrics.eyeContact === 'poor') {
    emotions.stressed += 15;
    emotions.fearful += 10;
  }

  // Normalize to percentages (max 100)
  const total = Object.values(emotions).reduce((a, b) => a + b, 0);
  if (total > 0) {
    Object.keys(emotions).forEach((key) => {
      emotions[key] = Math.round((emotions[key] / total) * 100);
    });
  }

  // Find dominant emotion
  let dominantEmotion = 'neutral';
  let maxScore = 0;
  for (const [emotion, score] of Object.entries(emotions)) {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  }

  return {
    emotions,
    dominantEmotion,
    confidence: Math.round(maxScore),
  };
};

/**
 * Track eye gaze for engagement scoring
 */
const trackEyeGaze = (facialMetrics, consecutiveFrames = 1) => {
  if (!facialMetrics || !facialMetrics.eyeContact) {
    return {
      engagementScore: 0,
      lookingAtCamera: false,
      frameCount: 0,
    };
  }

  let engagementScore = 0;
  if (facialMetrics.eyeContact === 'good') engagementScore = 90;
  else if (facialMetrics.eyeContact === 'moderate') engagementScore = 60;
  else engagementScore = 30;

  return {
    engagementScore,
    lookingAtCamera: facialMetrics.eyeContact === 'good',
    frameCount: consecutiveFrames,
    trend: 'stable', // Can be 'improving', 'declining', 'stable'
  };
};

/**
 * Aggregate facial metrics over time
 */
const calculateFacialMetricsAggregate = (metricsHistory) => {
  if (!metricsHistory || metricsHistory.length === 0) {
    return {
      success: false,
      error: 'No metrics history',
    };
  }

  const avgEyeContact = {
    good: 0,
    moderate: 0,
    poor: 0,
  };

  const emotions = {
    happy: [],
    sad: [],
    angry: [],
    surprised: [],
    fearful: [],
    disgusted: [],
    neutral: [],
    confident: [],
    stressed: [],
  };

  metricsHistory.forEach((metric) => {
    if (metric.eyeContact) avgEyeContact[metric.eyeContact] += 1;
    if (metric.emotions) {
      Object.keys(metric.emotions).forEach((emotion) => {
        if (emotions[emotion]) emotions[emotion].push(metric.emotions[emotion]);
      });
    }
  });

  // Calculate averages
  const total = metricsHistory.length;
  const avgEmotions = {};
  Object.keys(emotions).forEach((emotion) => {
    if (emotions[emotion].length > 0) {
      avgEmotions[emotion] = Math.round(
        emotions[emotion].reduce((a, b) => a + b, 0) / emotions[emotion].length
      );
    }
  });

  // Most common eye contact
  let dominantEyeContact = 'neutral';
  let maxCount = 0;
  Object.entries(avgEyeContact).forEach(([contact, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantEyeContact = contact;
    }
  });

  const overallEngagement = Math.round(
    (avgEyeContact.good / total) * 100 + (avgEyeContact.moderate / total) * 50
  );

  return {
    success: true,
    framesAnalyzed: total,
    averageEyeContact: dominantEyeContact,
    eyeContactDistribution: {
      good: Math.round((avgEyeContact.good / total) * 100),
      moderate: Math.round((avgEyeContact.moderate / total) * 100),
      poor: Math.round((avgEyeContact.poor / total) * 100),
    },
    averageEmotions: avgEmotions,
    overallEngagement: Math.min(100, overallEngagement),
    faceDuration: `${total} frames`,
  };
};

module.exports = {
  processFacialData,
  analyzeFacialExpression,
  detectEmotions,
  trackEyeGaze,
  calculateFacialMetricsAggregate,
};
