# 🤖 AI Interview Portal - Dynamic Question Generation System

## Overview

The AI Interview Portal now features a sophisticated two-step workflow for intelligent candidate interviews:

### **Step 1: Resume Parsing & Profile Extraction**
AI extracts structured data from resumes:
- **Skills** (programming languages, frameworks, tools, platforms, technologies)
- **Experience** (positions, companies, duration)
- **Education** (degrees, fields, universities)
- **Projects** (titles, descriptions)
- **Certificates** (names, issuers)

### **Step 2: Dynamic Question Generation**
AI generates 20 personalized questions based on extracted profile + job role:
- **Technical Questions** (6-7): Role-specific and skill-based
- **HR Questions** (4-5): Behavioral and soft skills
- **Aptitude Questions** (4-5): Logical reasoning and problem-solving
- **Scenario-Based Questions** (4-5): Real-world problem scenarios

---

## Backend Implementation

### **1. Resume Parser Service** (`services/resumeParser.js`)

**Exports:**
```javascript
parseResume(resumeText) // Main function to parse resume
extractSkills(text) // Extract 20 top skills
extractExperience(text) // Extract 10 top experiences
extractEducation(text) // Extract 5 educational qualifications
extractProjects(text) // Extract 8 projects
extractCertificates(text) // Extract 10 certificates
```

**Features:**
- Uses regex patterns to identify skills, experience, education
- Handles various resume formats (free-text, structured)
- Returns default profile if no resume provided
- Normalizes and deduplicates extracted data

**Example Output:**
```json
{
  "skills": ["Python", "React", "SQL", "AWS", "Docker"],
  "experience": [
    { "position": "Senior Developer", "company": "TechCorp", "years": 3 },
    { "position": "Junior Developer", "company": "StartupXYZ", "years": 2 }
  ],
  "education": [
    { "degree": "B.Tech", "field": "Computer Science", "university": "MIT" }
  ],
  "projects": [
    { "title": "E-commerce Platform", "description": "Full-stack MERN application" }
  ],
  "certificates": [
    { "name": "AWS Solutions Architect", "issuer": "Amazon" }
  ]
}
```

---

### **2. AI Question Generator Service** (`services/aiQuestionGenerator.js`)

**Exports:**
```javascript
generateDynamicQuestions(resumeData, jobRole, count)
generateTechnicalQuestions(resumeData, jobRole, count)
generateHRQuestions(resumeData, jobRole, count)
generateAptitudeQuestions(jobRole, count)
generateScenarioQuestions(resumeData, jobRole, count)
evaluateAnswer(candidateAnswer, expectedKeywords, questionType)
```

**Question Generation Examples:**

#### Technical Questions:
```
Q: "Explain the key concepts and use cases of Python. How have you applied it in your previous projects?"
Expected Keywords: ["syntax", "libraries", "performance", "use case", "implemented", "project"]
```

#### HR Questions:
```
Q: "Tell us about your most significant achievement in your professional career."
Expected Keywords: ["achievement", "success", "impact", "result", "contributed", "improved", "delivered"]
```

#### Aptitude Questions:
```
Q: "If 5 workers can complete a project in 10 days, how many days will 10 workers take to complete the same project?"
Expected Keywords: ["inverse", "proportion", "5", "days", "worker"]
```

#### Scenario Questions:
```
Q: "You are assigned to software developer role. The project deadline is 2 weeks away, but the requirements keep changing. How would you approach this situation?"
Expected Keywords: ["prioritize", "stakeholder", "communicate", "planning", "flexibility", "timeline"]
```

**Evaluation System:**
```javascript
evaluateAnswer(candidateAnswer, expectedKeywords, questionType)
// Returns:
{
  score: 85,  // 0-100
  feedback: "✅ Good! You covered most key points.",
  matchedKeywords: ["prioritize", "communicate"],
  answerQuality: "detailed" | "good" | "brief"
}
```

---

### **3. AI Interview Route Handler** (`routes/aiInterview.js`)

#### **Endpoints:**

**POST `/api/ai-interview/parse-resume`**
- **Purpose**: Parse resume text and extract profile data (Step 1)
- **Input**: `{ resume_text: string }`
- **Output**: Extracted profile with skills, experience, education, projects, certificates
- **Auth**: Required (Bearer token)

**POST `/api/ai-interview/generate-questions`**
- **Purpose**: Generate dynamic questions (Step 2)
- **Input**: `{ resume_data: object, job_role: string, count: number }`
- **Output**: 20 personalized questions with types and difficulty levels
- **Auth**: Required

**POST `/api/ai-interview/start`**
- **Purpose**: Initialize interview session
- **Input**: `{ job_id: number, interview_type: string, questions: array }`
- **Output**: Session ID and questions for interview
- **Auth**: Required

**POST `/api/ai-interview/submit-answer`**
- **Purpose**: Submit and evaluate a single answer
- **Input**: `{ session_id, question_index, candidate_answer, expected_keywords, question_type }`
- **Output**: Score and AI feedback for that answer
- **Auth**: Required

**POST `/api/ai-interview/complete`**
- **Purpose**: Complete interview and calculate final score
- **Input**: `{ session_id, interview_duration }`
- **Output**: Final score, feedback, recommendation, and hiring decision
- **Auth**: Required

**GET `/api/ai-interview/session/:session_id`**
- **Purpose**: Retrieve complete interview session details
- **Output**: Session data with all responses and scores
- **Auth**: Required

---

## Frontend Integration

### **Updated Component: AIInterviewMultimedia.jsx**

**Workflow:**

1. **Load Interview Setup**
   - Fetch job details
   - Fetch candidate profile

2. **Initialize Interview**
   ```javascript
   await axios.post('/api/ai-interview/parse-resume', { resume_text })
   await axios.post('/api/ai-interview/generate-questions', { resume_data, job_role })
   await axios.post('/api/ai-interview/start', { job_id, interview_type, questions })
   ```

3. **Interview Session**
   - Display questions (one at a time)
   - Collect answers (text/voice/video)
   - Submit each answer for evaluation
   - Show real-time feedback

4. **Complete & Score**
   ```javascript
   await axios.post('/api/ai-interview/complete', { session_id, interview_duration })
   // Returns final score, feedback, recommendation
   ```

**Interview Types:**
- **Text Mode**: Type answers in textarea
- **Voice Mode**: Speak questions (Speech Synthesis), record answers (MediaRecorder)
- **Video Mode**: Camera + audio + text input (premium)

---

## Database Schema

### New Tables:

**ai_interview_sessions**
```sql
id (PK)
candidate_id (FK)
job_id (FK)
company_id (FK)
interview_type (text, voice, video)
status (pending, in_progress, completed)
final_score (0-100)
total_questions
correct_answers
interview_duration (seconds)
ai_feedback
started_at, completed_at
```

**ai_interview_responses**
```sql
id (PK)
session_id (FK)
question_id
candidate_answer (TEXT)
ai_evaluation
score (0-100 per question)
confidence_level (0-100)
```

**hiring_decisions**
```sql
id (PK)
candidate_id (FK)
job_id (FK)
company_id (FK)
ai_score (final score)
decision (pending, hired, rejected, re-interview)
feedback
```

---

## Complete Workflow Example

### User Journey:

1. **Candidate registers** → Login
2. **Upload resume** → Clicks "Browse Jobs"
3. **Selects job** → Clicks "Take AI Interview"
4. **Chooses interview type** → Clicks "Text/Voice/Video"

### Backend Processing:

```
Step 1: PARSE RESUME
├── AI extracts: Skills, Experience, Education, Projects, Certificates
└── Returns structured profile data

Step 2: GENERATE QUESTIONS
├── Input: Resume profile + Job role (e.g., "Senior Software Developer")
├── Generates:
│   ├── 6 Technical questions (Python, React, System Design, etc.)
│   ├── 5 HR questions (Achievements, Teamwork, Leadership, etc.)
│   ├── 5 Aptitude questions (Math, Logic, Problem-solving)
│   └── 4 Scenario questions (Real-world situations)
└── Total: 20 personalized questions

Step 3: INTERVIEW SESSION
├── Question 1 → Submit Answer → AI Evaluates → Score: 85%
├── Question 2 → Submit Answer → AI Evaluates → Score: 72%
├── ...
├── Question 20 → Submit Answer → AI Evaluates → Score: 90%
└── Calculate Average: 82%

Step 4: FINAL RESULT
├── Final Score: 82%
├── Status: PASSED (≥70%)
├── Recommendation: "Hire"
├── Feedback: "Excellent technical knowledge, strong communication skills"
└── Store in hiring_decisions table for company review
```

---

## API Call Examples

### Example 1: Parse Resume
```bash
POST /api/ai-interview/parse-resume
Authorization: Bearer <token>
Content-Type: application/json

{
  "resume_text": "Senior Python Developer with 5 years experience at Google, Expert in Flask, Docker, AWS. BS Computer Science from MIT. Certified AWS Solutions Architect."
}

Response:
{
  "success": true,
  "data": {
    "skills": ["Python", "Flask", "Docker", "AWS", ...],
    "experience": [{"position": "Senior Developer", "company": "Google", "years": 5}],
    "education": [{"degree": "BS", "field": "Computer Science", "university": "MIT"}],
    "projects": [...],
    "certificates": [{"name": "AWS Solutions Architect", "issuer": "Amazon"}]
  }
}
```

### Example 2: Generate Questions
```bash
POST /api/ai-interview/generate-questions
Authorization: Bearer <token>

{
  "resume_data": {...parsed resume data...},
  "job_role": "Senior Software Engineer",
  "count": 20
}

Response:
{
  "success": true,
  "data": {
    "total_questions": 20,
    "questions": [
      {
        "type": "technical",
        "difficulty": "hard",
        "question": "Design a microservices architecture for...",
        "expected_answer_keywords": ["scalability", "APIs", "Docker"],
        "follow_up": "Can you elaborate on deployment strategies?"
      },
      ...20 questions total...
    ],
    "distribution": {
      "technical": 6,
      "hr": 5,
      "aptitude": 5,
      "scenario": 4
    }
  }
}
```

### Example 3: Complete Interview
```bash
POST /api/ai-interview/complete
Authorization: Bearer <token>

{
  "session_id": 42,
  "interview_duration": 1800
}

Response:
{
  "success": true,
  "data": {
    "session_id": 42,
    "final_score": 82.5,
    "total_questions": 20,
    "correct_answers": 17,
    "interview_duration": 1800,
    "feedback": "Excellent performance! You scored 82.5% and answered 17/20 questions correctly...",
    "status": "PASSED",
    "recommendation": "Strong Hire"
  }
}
```

---

## Key Features

✅ **Resume Parsing**: Extracts skills, experience, education automatically
✅ **Dynamic Question Generation**: 20 personalized questions based on profile + role
✅ **4 Question Types**: Technical, HR, Aptitude, Scenario-based
✅ **Real-time Evaluation**: Keyword matching and AI feedback per question
✅ **Multiple Interview Modes**: Text, Voice, Video
✅ **Final Score & Recommendation**: Hiring recommendation based on score
✅ **Automated Candidate Shortlisting**: Company can filter candidates by AI score
✅ **Complete Audit Trail**: All responses, scores, and feedback stored

---

## Technical Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Axios
- **Database**: SQLite3
- **AI/NLP**: Custom regex-based extractors + keyword matching
- **Multimedia**: Web Speech API + MediaRecorder API
- **Auth**: JWT + Bearer tokens

---

## Usage Instructions

### For Candidates:
1. Register as Candidate
2. Upload resume and complete profile
3. Browse jobs
4. Click "Take AI Interview"
5. Choose interview mode (Text/Voice/Video)
6. Answer all questions
7. View final score and AI feedback
8. Download interview report

### For Companies:
1. Register as Company
2. Post job requirements
3. View AI-generated shortlist of candidates
4. Review candidate details and AI scores
5. Make hiring decisions (Hire/Reject/Re-interview)
6. Track all candidates in hiring pipeline

---

## Score Calculation

**Per Question**: Keyword matching algorithm
- 100% keywords matched = 100 points
- 70% keywords matched = 85 points (adjusted)
- 50% keywords matched = 65 points
- 25% keywords matched = 45 points
- 0% keywords matched = 20 points

**Final Score**: Average of all question scores
**Pass Threshold**: ≥ 70%
**Hire Recommendation**: ≥ 80%

---

## Next Steps (Optional Enhancements)

1. **Advanced NLP**: Integrate Google Cloud Speech-to-Text API for voice interviews
2. **Answer Quality Analysis**: Use sentiment analysis and entity recognition
3. **Machine Learning**: Train model on past hiring outcomes to improve scoring
4. **Video Analysis**: Add facial expression and engagement tracking
5. **Real-time Alerts**: Notify companies when candidates complete interviews
6. **Analytics Dashboard**: Detailed hiring metrics and candidate analytics

---

## System Verification

✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:3000
✅ All 14 database tables created
✅ Resume parser working
✅ Question generator working
✅ AI interview endpoints functional
✅ Interview session tracking operational
✅ Hiring decision recording active

**System Status**: 🟢 OPERATIONAL - Ready for use
