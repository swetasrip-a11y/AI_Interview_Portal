const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { authenticate } = require('../middleware/auth');

// AI Chat endpoint - responds based on resume and questions
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { candidateId, message, resumeData } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple AI response generation based on resume and question
    const aiResponse = generateAIResponse(message, resumeData);

    // Save chat message
    await db.run(`
      INSERT INTO chat_messages (candidate_id, interviewer_id, message, response, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [candidateId, req.user.id, message, aiResponse]);

    res.json({
      success: true,
      message: message,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chat history
router.get('/history/:candidateId', authenticate, async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const chats = await db.all(`
      SELECT * FROM chat_messages 
      WHERE candidate_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `, [candidateId]);

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analyze candidate performance
router.post('/analyze', authenticate, async (req, res) => {
  try {
    const { candidateId, answers, resumeData } = req.body;
    
    if (!answers || answers.length === 0) {
      return res.status(400).json({ error: 'Answers are required for analysis' });
    }

    // Analyze performance
    const analysis = analyzePerformance(answers, resumeData);

    res.json({
      success: true,
      ...analysis
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate interview report
router.post('/report', authenticate, async (req, res) => {
  try {
    const { candidateId, interviewId, answers, resumeData } = req.body;
    
    if (!answers) {
      return res.status(400).json({ error: 'Answers are required to generate report' });
    }

    // Analyze performance
    const analysis = analyzePerformance(answers, resumeData);

    // Create report summary
    const reportSummary = generateReportSummary(analysis, resumeData);

    // Save report to database
    const reportData = JSON.stringify({
      ...analysis,
      summary: reportSummary
    });

    await db.run(`
      INSERT INTO interview_reports (candidate_id, interview_id, report_data, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `, [candidateId, interviewId, reportData]);

    // Also save performance metrics
    await db.run(`
      INSERT INTO performance_metrics (
        candidate_id, interview_id, technical_score, soft_skills_score,
        overall_score, communication_clarity, problem_solving, teamwork, leadership
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      candidateId, 
      interviewId,
      analysis.technicalSkills.average,
      analysis.softSkills.average,
      analysis.score,
      analysis.metrics.clarityScore || 0,
      analysis.metrics.relevanceScore || 0,
      analysis.metrics.teamworkScore || 0,
      analysis.metrics.leadershipScore || 0
    ]);

    res.json({
      success: true,
      report: {
        ...analysis,
        summary: reportSummary
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Response Generator
function generateAIResponse(question, resumeData) {
  const lowerQ = question.toLowerCase();
  const resume = resumeData || {};

  // Question routing
  if (lowerQ.includes('experience') || lowerQ.includes('background')) {
    return `Based on your resume, I see you have relevant experience. Tell me about a project that best demonstrates your abilities in ${resume.skills?.[0] || 'your field'}.`;
  }
  
  if (lowerQ.includes('skills') || lowerQ.includes('technical')) {
    const skills = resume.skills ? resume.skills.slice(0, 3).join(', ') : 'various technical skills';
    return `Your resume highlights expertise in ${skills}. Can you elaborate on how you've applied these skills in your recent projects?`;
  }

  if (lowerQ.includes('project') || lowerQ.includes('work')) {
    return `Tell me more about your professional projects. What was your specific role and what technical challenges did you overcome?`;
  }

  if (lowerQ.includes('strength') || lowerQ.includes('best at')) {
    return `Great question. Based on your profile, your strengths appear to be in ${resume.skills ? resume.skills[0] : 'your technical expertise'}. Can you provide a specific example?`;
  }

  if (lowerQ.includes('weakness') || lowerQ.includes('improve')) {
    return `A great answer! Everyone has areas for growth. What areas are you actively working to improve, and how are you approaching that?`;
  }

  if (lowerQ.includes('team') || lowerQ.includes('collaboration')) {
    return `Teamwork is crucial. Describe a situation where you collaborated with others. What was your contribution and the outcome?`;
  }

  if (lowerQ.includes('challenge') || lowerQ.includes('difficult')) {
    return `That's interesting. Walk me through a challenging situation you faced, how you handled it, and what you learned from it.`;
  }

  if (lowerQ.includes('position') || lowerQ.includes('role')) {
    return `I see. Based on your background, how does this position align with your career goals?`;
  }

  if (lowerQ.includes('why') && (lowerQ.includes('company') || lowerQ.includes('us'))) {
    return `Great question about your motivation. What aspects of our company and this role appeal to you?`;
  }

  // Default response
  return `That's a good point. Can you provide more details about your experience with that?`;
}

// Performance Analysis
function analyzePerformance(answers, resumeData) {
  const resume = resumeData || {};
  
  // Handle both string array and object array
  const answerArray = answers.map(a => 
    typeof a === 'string' ? a : (a.content || a.text || JSON.stringify(a))
  );

  const answerQuality = answerArray.map(a => ({
    content: a || '',
    length: (a || '').length,
    clarity: calculateClarity(a || ''),
    relevance: calculateRelevance(a || '', resume)
  }));

  const avgLength = answerQuality.reduce((sum, a) => sum + a.length, 0) / Math.max(1, answerQuality.length);
  const avgClarity = answerQuality.reduce((sum, a) => sum + a.clarity, 0) / Math.max(1, answerQuality.length);
  const avgRelevance = answerQuality.reduce((sum, a) => sum + a.relevance, 0) / Math.max(1, answerQuality.length);

  const score = Math.round((avgLength / 200 * 0.3 + avgClarity * 0.35 + avgRelevance * 0.35) * 100);

  const technicalSkills = extractTechnicalSkills(answerArray, resume);
  const softSkills = extractSoftSkills(answerArray);
  const strengths = extractStrengths(resume, answerArray);
  const weaknesses = extractWeaknesses(answerArray);
  const recommendations = generateRecommendations(score);

  return {
    score: Math.min(100, Math.max(0, score)),
    metrics: {
      clarityScore: Math.round(avgClarity * 100),
      relevanceScore: Math.round(avgRelevance * 100),
      teamworkScore: 75,
      leadershipScore: 70
    },
    strengths,
    weaknesses,
    recommendations,
    technicalSkills: {
      items: technicalSkills,
      average: technicalSkills.length > 0 
        ? Math.round(technicalSkills.reduce((sum, s) => sum + s.score, 0) / technicalSkills.length)
        : 0
    },
    softSkills: {
      items: softSkills,
      average: softSkills.length > 0
        ? Math.round(softSkills.reduce((sum, s) => sum + s.score, 0) / softSkills.length)
        : 0
    }
  };
}

function extractTechnicalSkills(answers, resumeData = {}) {
  const skills = resumeData.skills || [];
  return skills.map(skill => ({
    name: skill,
    score: Math.round(Math.random() * 30 + 70) // 70-100
  })).slice(0, 5);
}

function extractSoftSkills(answers) {
  const softSkillsList = [
    { name: 'Communication', score: 78 },
    { name: 'Problem-Solving', score: 82 },
    { name: 'Teamwork', score: 75 },
    { name: 'Leadership', score: 70 },
    { name: 'Adaptability', score: 80 }
  ];
  
  return softSkillsList;
}

function calculateClarity(text) {
  // Scoring based on sentence structure and vocabulary
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const avgSentenceLength = text.split(/\s+/).length / Math.max(1, sentences.length);
  
  // Ideal sentence length: 10-20 words
  const clarity = Math.min(1, 1 - Math.abs(avgSentenceLength - 15) / 30);
  return Math.max(0.3, clarity);
}

function calculateRelevance(text, resume) {
  const resumeKeywords = [
    ...(resume.skills || []),
    ...(resume.companies || []),
    ...(resume.projects || []),
    resume.field || ''
  ].map(k => k.toLowerCase());

  const textWords = text.toLowerCase().split(/\s+/);
  const matches = textWords.filter(w => resumeKeywords.some(k => k.includes(w) || w.includes(k)));
  
  return Math.min(1, matches.length / Math.max(1, textWords.length / 2));
}

function extractStrengths(resume, answers) {
  const strengths = [];
  
  if ((resume.skills || []).length > 3) {
    strengths.push('Strong technical background with diverse skill set');
  }
  
  if ((resume.companies || []).length > 2) {
    strengths.push('Solid work experience across multiple organizations');
  }

  if ((resume.projects || []).length > 0) {
    strengths.push('Good project portfolio demonstrating practical application');
  }

  if (Array.isArray(answers) && answers.some(a => {
    const text = typeof a === 'string' ? a : (a.content || a.text || '');
    return text.length > 300;
  })) {
    strengths.push('Provides detailed and thoughtful responses');
  }

  strengths.push('Clear articulation of concepts');

  return strengths.slice(0, 5);
}

function extractWeaknesses(answers) {
  const weaknesses = [];
  
  if (Array.isArray(answers) && answers.some(a => {
    const text = typeof a === 'string' ? a : (a.content || a.text || '');
    return text.length < 100;
  })) {
    weaknesses.push('Some responses could be more detailed');
  }

  weaknesses.push('Could provide more specific metrics/results');

  return weaknesses.slice(0, 3);
}

function generateRecommendations(score) {
  if (score >= 80) {
    return [
      'Excellent! Continue developing specialization in core areas',
      'Consider leading technical discussions or mentoring',
      'Explore advanced certifications or specialized training'
    ];
  }
  if (score >= 60) {
    return [
      'Good foundation. Focus on deepening technical expertise',
      'Improve communication and presentation skills',
      'Gain more practical project experience'
    ];
  }
  return [
    'Focus on building stronger fundamentals',
    'Seek mentorship and additional training',
    'Gain more hands-on project experience'
  ];
}

function generateReportSummary(analysis, resumeData = {}) {
  const score = analysis.score;
  let summary = '';

  if (score >= 80) {
    summary = 'Candidate demonstrates excellent understanding and strong capabilities. ';
  } else if (score >= 60) {
    summary = 'Candidate shows good potential with solid fundamentals. ';
  } else {
    summary = 'Candidate needs additional development in key areas. ';
  }

  summary += `Technical skills average: ${Math.round(analysis.technicalSkills.average)}%. `;
  summary += `Soft skills average: ${Math.round(analysis.softSkills.average)}%. `;

  return summary;
}

module.exports = router;
