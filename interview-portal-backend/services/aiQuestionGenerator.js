/**
 * AI Question Generator Service
 * Dynamically generates technical, HR, aptitude, and scenario-based questions
 * based on resume data and job role
 */

const generateDynamicQuestions = (resumeData, jobRole, count = 20) => {
  const questions = [];

  // Generate Technical Questions (6-7 questions)
  questions.push(...generateTechnicalQuestions(resumeData, jobRole, 6));

  // Generate HR Questions (4-5 questions)
  questions.push(...generateHRQuestions(resumeData, jobRole, 5));

  // Generate Aptitude Questions (4-5 questions)
  questions.push(...generateAptitudeQuestions(jobRole, 5));

  // Generate Scenario-Based Questions (4-5 questions)
  questions.push(...generateScenarioQuestions(resumeData, jobRole, 4));

  return questions.slice(0, count);
};

/**
 * Generate Technical Questions based on skills and experience
 */
const generateTechnicalQuestions = (resumeData, jobRole, count) => {
  const questions = [];
  const { skills = [], experience = [] } = resumeData;
  const topSkills = skills.slice(0, 5);
  const jobRoleLower = jobRole.toLowerCase();

  const technicalTemplates = [
    {
      template: (skill) =>
        `Explain the key concepts and use cases of ${skill}. How have you applied it in your previous projects?`,
      category: 'technical',
      difficulty: 'medium',
    },
    {
      template: (skill) =>
        `What are the main advantages and disadvantages of using ${skill} compared to its alternatives?`,
      category: 'technical',
      difficulty: 'medium',
    },
    {
      template: (skill) => `Describe a complex problem you solved using ${skill}. What was your approach?`,
      category: 'technical',
      difficulty: 'hard',
    },
    {
      template: (skill) =>
        `How do you keep updated with the latest trends and best practices in ${skill}?`,
      category: 'technical',
      difficulty: 'easy',
    },
    {
      template: () => generateRoleSpecificTechnicalQuestion(jobRoleLower),
      category: 'technical',
      difficulty: 'medium',
    },
    {
      template: () => generateSystemDesignQuestion(topSkills, jobRoleLower),
      category: 'technical',
      difficulty: 'hard',
    },
  ];

  for (let i = 0; i < count && i < technicalTemplates.length; i++) {
    const template = technicalTemplates[i];
    const skill = topSkills[i % topSkills.length] || 'Software Development';

    questions.push({
      type: 'technical',
      difficulty: template.difficulty,
      question: template.template(skill),
      expected_answer_keywords: generateKeywords(skill, template.category),
      follow_up: generateFollowUp(skill, 'technical'),
    });
  }

  return questions;
};

/**
 * Generate HR Questions based on experience and soft skills
 */
const generateHRQuestions = (resumeData, jobRole, count) => {
  const questions = [];
  const { experience = [] } = resumeData;
  const yearsOfExperience = experience.reduce((sum, exp) => sum + (exp.years || 0), 0);

  const hrTemplates = [
    {
      question: `Tell us about your most significant achievement in your ${yearsOfExperience > 0 ? yearsOfExperience + ' years of' : ''} professional career.`,
      keywords: [
        'achievement',
        'success',
        'impact',
        'result',
        'contributed',
        'improved',
        'delivered',
      ],
    },
    {
      question: `Describe a situation where you had to work with a difficult team member. How did you handle it?`,
      keywords: ['conflict', 'resolution', 'communication', 'compromise', 'collaborative', 'respectful'],
    },
    {
      question: `What attracts you to the ${jobRole} role, and why do you think you are a good fit for it?`,
      keywords: ['role', 'interested', 'fit', 'skills', 'passion', 'motivated', 'aligned'],
    },
    {
      question: `How do you prioritize your work when you have multiple deadlines?`,
      keywords: [
        'prioritize',
        'organize',
        'manage',
        'deadline',
        'efficient',
        'plan',
        'communicate',
      ],
    },
    {
      question: `Tell us about a time when you failed and what you learned from it.`,
      keywords: ['failure', 'learned', 'improved', 'honest', 'growth', 'experience', 'reflection'],
    },
  ];

  return hrTemplates
    .slice(0, count)
    .map((item) => ({
      type: 'hr',
      difficulty: 'medium',
      question: item.question,
      expected_answer_keywords: item.keywords,
      follow_up: 'Can you provide more specific examples or metrics?',
    }));
};

/**
 * Generate Aptitude Questions
 */
const generateAptitudeQuestions = (jobRole, count) => {
  const questions = [];

  const aptitudeQuestions = [
    {
      question: `If a train travels 120 km in 2 hours, what is its average speed?`,
      type: 'aptitude',
      difficulty: 'easy',
      keywords: ['speed', 'km/h', '60', 'calculation'],
    },
    {
      question: `A company hires 20% more employees this year than last year. If it hired 100 people last year, how many did it hire this year?`,
      type: 'aptitude',
      difficulty: 'easy',
      keywords: ['percentage', 'increase', '120', 'calculation'],
    },
    {
      question: `What is the next number in the sequence: 2, 4, 8, 16, 32, ?`,
      type: 'aptitude',
      difficulty: 'easy',
      keywords: ['sequence', 'pattern', '64', 'doubling'],
    },
    {
      question: `If 5 workers can complete a project in 10 days, how many days will 10 workers take to complete the same project?`,
      type: 'aptitude',
      difficulty: 'medium',
      keywords: ['inverse', 'proportion', '5', 'days', 'worker'],
    },
    {
      question: `A product costs $100 and is sold at 25% profit. What is the selling price?`,
      type: 'aptitude',
      difficulty: 'easy',
      keywords: ['profit', 'percentage', '125', 'selling price'],
    },
  ];

  return aptitudeQuestions
    .slice(0, count)
    .map((item) => ({
      type: 'aptitude',
      difficulty: item.difficulty,
      question: item.question,
      expected_answer_keywords: item.keywords,
      follow_up: 'Can you explain your reasoning step-by-step?',
    }));
};

/**
 * Generate Scenario-Based Questions
 */
const generateScenarioQuestions = (resumeData, jobRole, count) => {
  const questions = [];
  const { skills = [], experience = [] } = resumeData;
  const jobRoleLower = jobRole.toLowerCase();

  const scenarioTemplates = [
    {
      scenario: (role) =>
        `You are assigned to ${role}. The project deadline is 2 weeks away, but the requirements keep changing. How would you approach this situation?`,
      keywords: ['prioritize', 'stakeholder', 'communicate', 'planning', 'flexibility', 'timeline'],
    },
    {
      scenario: (role) =>
        `While working on a critical task, you discover a security vulnerability in the codebase. What steps would you take?`,
      keywords: ['security', 'report', 'team', 'protocol', 'urgent', 'document', 'escalate'],
    },
    {
      scenario: (role) =>
        `A client reports a production issue affecting thousands of users. You have limited information. How would you debug and resolve this?`,
      keywords: [
        'systematic',
        'logs',
        'debug',
        'communication',
        'documentation',
        'testing',
        'monitoring',
      ],
    },
    {
      scenario: (role) =>
        `Your team disagreed on the technical approach for implementing a new feature. How would you resolve this?`,
      keywords: [
        'discussion',
        'data-driven',
        'compromise',
        'consensus',
        'documentation',
        'collaborative',
        'decision',
      ],
    },
  ];

  return scenarioTemplates
    .slice(0, count)
    .map((item) => ({
      type: 'scenario',
      difficulty: 'hard',
      question: item.scenario(jobRoleLower),
      expected_answer_keywords: item.keywords,
      follow_up: 'What would be your second approach if the first one failed?',
    }));
};

/**
 * Helper: Generate role-specific technical question
 */
const generateRoleSpecificTechnicalQuestion = (jobRole) => {
  const roleQuestions = {
    'software developer': 'How do you approach code review and ensure code quality in a team environment?',
    developer: 'What is your experience with API design and REST principles?',
    'full stack': 'How do you handle state management in complex applications?',
    'devops':
      'Describe your experience with containerization and orchestration platforms.',
    'data engineer': 'How do you optimize data pipelines for performance and scalability?',
    'data scientist': 'Explain your approach to handling imbalanced datasets in machine learning.',
    'frontend': 'How do you ensure optimal performance and user experience in web applications?',
    'backend': 'What strategies do you use to ensure API security and reliability?',
  };

  for (const [key, question] of Object.entries(roleQuestions)) {
    if (jobRole.includes(key)) {
      return question;
    }
  }

  return `Describe your experience with building scalable systems for ${jobRole} roles.`;
};

/**
 * Helper: Generate system design question
 */
const generateSystemDesignQuestion = (skills, jobRole) => {
  if (skills.some((s) => s.toLowerCase().includes('microservice'))) {
    return 'Design a microservices architecture for a high-traffic e-commerce platform. What would you consider?';
  }

  if (skills.some((s) => s.toLowerCase().includes('database'))) {
    return 'How would you design a database schema for a real-time notification system handling millions of users?';
  }

  return `Design a system for ${jobRole}. What technologies and patterns would you use?`;
};

/**
 * Helper: Generate keywords based on skill
 */
const generateKeywords = (skill, category) => {
  const skillLower = skill.toLowerCase();

  if (skillLower.includes('python')) {
    return ['syntax', 'libraries', 'performance', 'use case', 'implemented', 'project'];
  }
  if (skillLower.includes('react')) {
    return ['components', 'state', 'hooks', 'jsx', 'performance', 'optimization'];
  }
  if (skillLower.includes('database')) {
    return ['query', 'optimization', 'index', 'performance', 'design', 'scalability'];
  }

  return ['implementation', 'experience', 'project', 'challenge', 'learning', 'result'];
};

/**
 * Helper: Generate follow-up questions
 */
const generateFollowUp = (skill, type) => {
  if (type === 'technical') {
    return `Can you elaborate on the specific implementation details and challenges you faced with ${skill}?`;
  }
  return 'Can you provide additional context or examples?';
};

/**
 * Evaluate candidate answer against expected keywords
 */
const evaluateAnswer = (candidateAnswer, expectedKeywords, questionType) => {
  if (!candidateAnswer || candidateAnswer.trim().length === 0) {
    return {
      score: 0,
      feedback: 'Answer is empty. Please provide a detailed response.',
      matchedKeywords: [],
    };
  }

  const answerLower = candidateAnswer.toLowerCase();
  const matchedKeywords = expectedKeywords.filter((keyword) =>
    answerLower.includes(keyword.toLowerCase())
  );

  const matchPercentage = (matchedKeywords.length / expectedKeywords.length) * 100;

  let score = Math.min(100, Math.round(matchPercentage * 1.2)); // 120% max at all keywords
  let feedback = '';

  if (matchPercentage === 100) {
    feedback = '🌟 Excellent! You covered all the key points.';
    score = 100;
  } else if (matchPercentage >= 70) {
    feedback = '✅ Good! You covered most key points. Consider adding more technical depth.';
    score = 85;
  } else if (matchPercentage >= 50) {
    feedback =
      '⚠️ Satisfactory response. You covered some key areas but missed important aspects.';
    score = 65;
  } else if (matchPercentage >= 25) {
    feedback = '❌ Needs improvement. Try to cover more of the expected topics.';
    score = 45;
  } else {
    feedback = '❌ This answer does not adequately address the question.';
    score = 20;
  }

  // Adjust score based on answer length
  const wordCount = candidateAnswer.split(/\s+/).length;
  if (wordCount < 20 && questionType === 'technical') {
    score = Math.max(20, score - 15);
    feedback += ' Your answer was too brief.';
  } else if (wordCount < 10) {
    score = Math.max(10, score - 20);
    feedback += ' Please provide more detailed explanations.';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    feedback,
    matchedKeywords,
    answerQuality: wordCount > 50 ? 'detailed' : wordCount > 20 ? 'good' : 'brief',
  };
};

module.exports = {
  generateDynamicQuestions,
  generateTechnicalQuestions,
  generateHRQuestions,
  generateAptitudeQuestions,
  generateScenarioQuestions,
  evaluateAnswer,
};
