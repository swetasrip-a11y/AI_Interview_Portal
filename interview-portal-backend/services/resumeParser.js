/**
 * Resume Parser Service
 * Extracts skills, experience, education, projects, certificates from resume text
 */

const parseResume = (resumeText) => {
  if (!resumeText || typeof resumeText !== 'string') {
    return getDefaultProfile();
  }

  const text = resumeText.toLowerCase();

  return {
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    projects: extractProjects(text),
    certificates: extractCertificates(text),
  };
};

const extractSkills = (text) => {
  const skillPatterns = [
    // Programming Languages
    /\b(python|java|javascript|typescript|c\+\+|c#|php|ruby|go|rust|kotlin|swift|scala)\b/gi,
    // Frameworks & Libraries
    /\b(react|angular|vue|django|flask|spring|express|node\.?js|fastapi|tensorflow|pytorch|keras)\b/gi,
    // Databases
    /\b(sql|mysql|postgresql|mongodb|redis|oracle|cassandra|elasticsearch|dynamodb)\b/gi,
    // Tools & Platforms
    /\b(git|docker|kubernetes|aws|azure|gcp|jenkins|gitlab|github|linux|windows|mac|figma|jira)\b/gi,
    // Data & Analytics
    /\b(machine learning|deep learning|nlp|computer vision|data science|analytics|tableau|power bi|excel)\b/gi,
    // Other Technologies
    /\b(rest api|graphql|microservices|cloud|devops|agile|scrum|ci\/cd|agile|iot|blockchain)\b/gi,
  ];

  const skillsSet = new Set();

  skillPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((skill) => {
        const normalized = skill.trim().toLowerCase();
        if (normalized && normalized.length > 2) {
          skillsSet.add(normalized);
        }
      });
    }
  });

  return Array.from(skillsSet).slice(0, 20); // Return top 20 skills
};

const extractExperience = (text) => {
  const experiences = [];

  // Pattern: "Title at Company for X years" or "Position at Organization"
  const experiencePattern = /(\b(?:senior|junior|lead|principal|staff|manager|director|developer|engineer|analyst|architect|specialist|lead|intern|associate|consultant)\s+\w+[\w\s]*?)(?:\s+at\s+|,\s*|@\s*)([a-zA-Z0-9\s&.,-]+?)(?:\s+for\s+(\d+)\s*(?:years?|yrs?)|\s*\(([^)]+)\)|\n|$)/gi;

  let match;
  while ((match = experiencePattern.exec(text)) !== null) {
    const position = match[1].trim();
    const company = match[2].trim();
    const years = match[3] || extractYearsFromDate(match[4]) || '1';

    if (position && company && position.length > 3 && company.length > 2) {
      experiences.push({
        position,
        company,
        years: parseInt(years) || 1,
      });
    }
  }

  return experiences.slice(0, 10); // Return top 10 experiences
};

const extractEducation = (text) => {
  const education = [];

  // Pattern: "Degree in Subject from University"
  const educationPattern = /\b(bachelor|b\.?a|b\.?sc|b\.?tech|master|m\.?a|m\.?sc|m\.?tech|mba|phd|diploma)\b[\w\s.,]*?(?:in|of)\s+([\w\s]+?)(?:\s+from\s+|,\s*)([\w\s&.,()'-]+?)(?:\n|$|,)/gi;

  let match;
  while ((match = educationPattern.exec(text)) !== null) {
    const degree = match[1].trim();
    const field = match[2].trim();
    const university = match[3].trim();

    if (degree && field && university && field.length > 2 && university.length > 2) {
      education.push({
        degree,
        field,
        university,
      });
    }
  }

  return education.slice(0, 5); // Return top 5 educational qualifications
};

const extractProjects = (text) => {
  const projects = [];

  // Pattern: "Project Title - Description" or "Project: Title"
  const projectPattern = /(?:project|built|developed|created|worked on)[\s:]*([^\n]+?)(?:\s*[-–]\s*|\n\s*)([^\n]{0,150})(?:\n|$)/gi;

  let match;
  while ((match = projectPattern.exec(text)) !== null) {
    const title = match[1].trim();
    const description = match[2].trim();

    if (title && title.length > 3 && title.length < 100) {
      projects.push({
        title,
        description: description || 'No description provided',
      });
    }
  }

  return projects.slice(0, 8); // Return top 8 projects
};

const extractCertificates = (text) => {
  const certificates = [];

  // Pattern: "Certificate Name from Organization" or "Certified in Something"
  const certPattern = /(?:certifi(?:ed|cation)|awarded|completed)[\s:]*([^\n,]+?)(?:\s+(?:from|by|issued by)\s+|,\s*)?([^\n,]*?)(?:\n|,|$)/gi;

  let match;
  while ((match = certPattern.exec(text)) !== null) {
    const name = match[1].trim();
    const issuer = match[2].trim();

    if (name && name.length > 3 && name.length < 100) {
      certificates.push({
        name,
        issuer: issuer || 'Not specified',
      });
    }
  }

  return certificates.slice(0, 10); // Return top 10 certificates
};

const extractYearsFromDate = (dateString) => {
  if (!dateString) return null;

  const yearMatch = dateString.match(/\d{4}/g);
  if (yearMatch && yearMatch.length === 2) {
    const startYear = parseInt(yearMatch[0]);
    const endYear = parseInt(yearMatch[1]);
    return Math.max(0, endYear - startYear);
  }

  const yearsMatch = dateString.match(/(\d+)\s*(?:years?|yrs?)/i);
  return yearsMatch ? parseInt(yearsMatch[1]) : null;
};

const getDefaultProfile = () => ({
  skills: [
    'Communication',
    'Problem Solving',
    'Team Work',
    'Critical Thinking',
    'Leadership',
  ],
  experience: [
    {
      position: 'Professional Experience',
      company: 'Not provided',
      years: 0,
    },
  ],
  education: [
    {
      degree: 'Graduate',
      field: 'Not specified',
      university: 'Not specified',
    },
  ],
  projects: [
    {
      title: 'Not provided',
      description: 'Please provide resume details',
    },
  ],
  certificates: [
    {
      name: 'Not provided',
      issuer: 'Not specified',
    },
  ],
});

module.exports = {
  parseResume,
  extractSkills,
  extractExperience,
  extractEducation,
  extractProjects,
  extractCertificates,
};
