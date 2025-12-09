# 🚀 Quick Start Guide - AI Interview Portal

## System Setup (Already Complete ✅)

### Backend is Running on Port 5000
```
http://localhost:5000
- Express.js server
- SQLite database ready
- All 14 tables initialized
- Resume parser service active
- AI question generator active
```

### Frontend is Running on Port 3000
```
http://localhost:3000
- React + Vite application
- Ready for user interactions
- Connected to backend API
```

---

## How to Use the System

### 🎯 FOR CANDIDATES

#### 1️⃣ Register & Login
```
Go to: http://localhost:3000/register
Enter:
  - Email: candidate@example.com
  - Password: password123
  - Name: John Doe
  - Role: Candidate
```

#### 2️⃣ Upload Resume
```
Go to: /candidate/profile
- Upload your resume (or paste resume text)
- Add phone, location, skills
- Click Save
```

#### 3️⃣ Browse & Apply for Jobs
```
Go to: /browse-jobs
- See all available jobs posted by companies
- Click "Apply" on any job
- This will redirect to AI interview
```

#### 4️⃣ Take AI Interview
```
Go to: /interview/:jobId/ai-multimedia

Choose interview type:
  ⌨️ Text Mode
     - Type your answers in textarea
     - 20 personalized questions
     - ~40 minutes total
  
  🎤 Voice Mode
     - AI reads questions using Speech Synthesis
     - You record answers with microphone
     - ~40 minutes total
  
  📹 Video Mode
     - Camera + Microphone + Text
     - Record yourself answering
     - Premium feature

Interview Process:
  1. AI extracts skills from your resume
  2. AI generates 20 personalized questions based on:
     - Your skills & experience
     - The job role you applied for
  3. You answer all 20 questions
  4. AI evaluates each answer in real-time
  5. Final score is calculated as average
```

#### 5️⃣ View Scores & Download Report
```
Go to: /candidate-interview-scores
- See all your interview attempts
- View final scores (passing ≥70%)
- Download PDF report for each interview
- See AI feedback and recommendations
```

---

### 🏢 FOR COMPANIES

#### 1️⃣ Register & Login
```
Go to: http://localhost:3000/register
Enter:
  - Email: company@example.com
  - Password: password123
  - Name: Tech Corp
  - Role: Company
```

#### 2️⃣ Post Job Requirements
```
Go to: /company/post-job
- Job Title: "Senior Software Engineer"
- Description: "Looking for 5+ years experience"
- Location: "San Francisco, CA"
- Salary: "$150,000 - $200,000"
- Experience Level: "5+ years"
- Requirements: "Python, React, AWS"
- Click Post Job
```

#### 3️⃣ Review AI-Shortlisted Candidates
```
Go to: /company/candidates

Left Panel: Candidate List
  - Shows all candidates who applied
  - Color-coded by AI score:
    🟢 Green (≥70%): Shortlisted
    🟡 Yellow (<70%): Not shortlisted
  - Score displayed for each

Right Panel: Candidate Details
  - Email, phone, location
  - Interview score & status
  - Interview type (text/voice/video)
  - AI feedback from interview
  - View resume link
  - View detailed report
```

#### 4️⃣ Make Hiring Decisions
```
For each candidate:
  - Click ✅ HIRE → Record as hired
  - Click ❌ REJECT → Record as rejected
  - Click 🔄 RE-INTERVIEW → Ask candidate to retake test

Database Records:
  - Decision saved in hiring_decisions table
  - Timestamp recorded
  - Feedback added
```

---

## 🤖 How the AI System Works

### STEP 1: Resume Parsing (Automatic)
When candidate uploads resume, AI extracts:
```
SKILLS:
  - Programming: Python, JavaScript, Java, Go, Rust
  - Frameworks: React, Django, Spring, FastAPI
  - Databases: MySQL, PostgreSQL, MongoDB, Redis
  - Cloud: AWS, Azure, GCP
  - Tools: Docker, Kubernetes, Git, Jenkins

EXPERIENCE:
  - Senior Developer @ Google (5 years)
  - Lead Engineer @ Microsoft (3 years)
  - Software Engineer @ Startup (2 years)

EDUCATION:
  - B.Tech Computer Science, MIT
  - M.Tech AI/ML, Stanford

PROJECTS:
  - Built e-commerce platform (Full-stack)
  - Developed mobile app (React Native)

CERTIFICATES:
  - AWS Solutions Architect
  - Certified Kubernetes Administrator
```

### STEP 2: Dynamic Question Generation (Automatic)
AI generates 20 questions PERSONALIZED to candidate + job role:

```
INPUT: 
  - Candidate Skills: [Python, React, AWS, Docker]
  - Candidate Experience: 5 years
  - Job Role: "Senior Software Engineer"

OUTPUT: 20 Questions:

🔧 TECHNICAL (6-7 questions)
  Q1: "Explain microservices architecture using Docker & Kubernetes"
  Q2: "Design a real-time notification system with AWS services"
  Q3: "How do you optimize React application performance?"
  Q4: "Describe your experience with Python async programming"
  Q5: "What's your approach to CI/CD pipeline setup?"
  Q6: "How do you handle database scaling and migration?"

💼 HR (4-5 questions)
  Q7: "Tell us about your greatest professional achievement"
  Q8: "How do you handle team conflicts and difficult situations?"
  Q9: "Why are you interested in this role?"
  Q10: "How do you stay updated with tech trends?"

🧠 APTITUDE (4-5 questions)
  Q11: "If 5 workers complete project in 10 days, how many days for 10 workers?"
  Q12: "What's next in sequence: 2, 4, 8, 16, ?"
  Q13: "Calculate: (100 × 1.25) - (50 / 2)"
  Q14: "Logical puzzle about crossing river with constraints"

🎯 SCENARIO (4-5 questions)
  Q15: "Project deadline moved up, requirements changing - what do you do?"
  Q16: "Production bug affecting 1M users - your approach?"
  Q17: "Team member underperforming - how do you address it?"
  Q18: "You disagree with team on technical approach - resolution?"
  Q19: "Limited budget and timeline - how to prioritize features?"
  Q20: "Code review reveals major architectural issue - next steps?"
```

### STEP 3: Interview Session (Real-time Evaluation)
For each answer:
```
QUESTION: "Explain microservices architecture"

CANDIDATE ANSWER:
"Microservices is an architectural style that structures an application 
as a collection of loosely coupled, independently deployable services. 
Each service handles specific business capability and communicates via 
APIs. Benefits include scalability, flexibility, and faster deployment..."

EXPECTED KEYWORDS:
["architecture", "loosely coupled", "independent", "services", "scalable"]

KEYWORD MATCHING:
✅ "architecture" - Found
✅ "loosely coupled" - Found
✅ "independent" - Found (as "independently deployable")
✅ "services" - Found
✅ "scalable" - Not found explicitly
Match: 4/5 = 80%

AI SCORE: 85/100
FEEDBACK: "✅ Good! You covered most key points. Consider mentioning scalability challenges."
```

### STEP 4: Final Score Calculation
```
All 20 Question Scores:
Q1: 85  Q2: 92  Q3: 78  Q4: 88  Q5: 91  Q6: 82
Q7: 75  Q8: 88  Q9: 92  Q10: 85
Q11: 90 Q12: 95 Q13: 88 Q14: 72
Q15: 82 Q16: 95 Q17: 78 Q18: 85 Q19: 88 Q20: 91

FINAL SCORE = (Sum of all) / 20 = 1654 / 20 = 82.7%

STATUS: PASSED ✅ (≥70%)
RECOMMENDATION:
  - ≥85%: Strong Hire 🌟
  - ≥75%: Hire ✅
  - ≥60%: Maybe ⚠️
  - <60%: Do Not Hire ❌
  
  This candidate: 82.7% → HIRE ✅
```

---

## 📊 Features Summary

### Candidate Features
✅ Register and create profile
✅ Upload resume (AI extracts info)
✅ Browse available jobs
✅ Apply for jobs (instant AI interview)
✅ Take AI interviews (text/voice/video modes)
✅ View all scores and feedback
✅ Download PDF reports
✅ Track interview history

### Company Features
✅ Register company account
✅ Post job requirements
✅ View AI shortlist (auto-filtered by score)
✅ Review candidate details & reports
✅ Make hiring decisions (hire/reject/re-interview)
✅ Track hiring pipeline
✅ Analytics dashboard (optional)

### AI Features
✅ Resume parsing & extraction
✅ Dynamic question generation (4 types)
✅ Personalized to candidate skills & job role
✅ Real-time answer evaluation
✅ Keyword matching scoring
✅ Automated candidate shortlisting
✅ Final recommendations
✅ Complete audit trail

---

## 🔑 Important Credentials (For Testing)

### Test Company Account
```
Email: company@test.com
Password: company123
Role: Company
```

### Test Candidate Account
```
Email: candidate@test.com
Password: candidate123
Role: Candidate
```

### Test Job Roles for Question Generation
```
- "Senior Software Engineer"
- "Full Stack Developer"
- "Data Scientist"
- "DevOps Engineer"
- "Frontend Developer"
- "Backend Developer"
- "Mobile Developer"
```

---

## 🐛 Troubleshooting

### Backend not starting?
```powershell
# Kill any running Node processes
Get-Process node | Stop-Process -Force

# Delete old database
Remove-Item "path/to/interview_portal.db"

# Restart backend
cd interview-portal-backend
npm start
```

### Frontend not loading?
```powershell
# Kill existing frontend process
Get-Process node | Stop-Process -Force

# Restart frontend
cd interview-portal-frontend
npm run dev
```

### API connection errors?
- Check backend is running on port 5000
- Check frontend is running on port 3000
- Verify CORS is enabled in backend
- Check Bearer token in localStorage

### Resume not parsing?
- Ensure resume text format is correct
- Try with more detailed resume content
- Check browser console for errors

### Questions not generating?
- Verify resume parsing was successful
- Check job_role parameter is provided
- Try with common job titles

---

## 📝 Example Interview Workflow

```
Time: 10:00 AM
=================
Candidate: Alice Johnson logs in
  - Registered: alice@company.com
  - Upload resume (detailed, 5+ years experience)
  
AI Processing:
  ✅ Resume parsed → Skills: [Python, React, AWS, Docker]
  ✅ Questions generated → 20 personalized questions
  
Interview Started: 10:05 AM
  Mode: Voice Interview
  Questions: 20 technical + HR + aptitude + scenario
  
Interview Progress:
  Q1: 85% ✅
  Q2: 92% ✅
  Q3: 78% ✅
  ... (continuing through all 20)
  
Interview Completed: 10:42 AM (37 minutes)

Final Score: 82.7%
Status: PASSED ✅
Recommendation: HIRE ✅

Company Notification:
  Bob (Recruiter) logs in
  Sees Alice in shortlisted candidates
  Reviews AI feedback
  Makes HIRE decision → Sends offer
  
Result: Candidate hired! 🎉
```

---

## 📚 API Documentation

### Available Endpoints

#### Authentication
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
```

#### AI Interview (NEW)
```
POST /api/ai-interview/parse-resume       # Extract from resume
POST /api/ai-interview/generate-questions # Generate personalized questions
POST /api/ai-interview/start               # Start interview session
POST /api/ai-interview/submit-answer       # Submit answer for evaluation
POST /api/ai-interview/complete            # Complete interview & calculate score
GET  /api/ai-interview/session/:id         # Retrieve session details
```

#### Jobs
```
GET  /api/jobs                # List all jobs
POST /api/jobs                # Create job (company)
GET  /api/jobs/:id           # Job details
POST /api/jobs/:id/apply     # Apply for job
```

#### Candidate
```
GET  /api/candidate/profile  # Get candidate profile
POST /api/candidate/profile  # Update profile
```

#### Company
```
GET  /api/company/candidates           # Get shortlisted candidates
POST /api/hiring-decision             # Record hiring decision
```

---

## 🎓 Learning Resources

### Understanding the System
1. Read: `AI_INTERVIEW_WORKFLOW.md` - Detailed workflow explanation
2. Read: `SYSTEM_ARCHITECTURE.md` - Complete system design
3. Explore: Backend code in `routes/aiInterview.js`
4. Explore: Frontend code in `pages/AIInterviewMultimedia.jsx`
5. Check: Services in `services/resumeParser.js` and `aiQuestionGenerator.js`

### Development Tips
- Resume parsing works best with detailed, structured resumes
- Question generation takes ~2-3 seconds per job role
- Interview sessions are stored with all responses for audit trail
- Scores are calculated using keyword matching algorithm
- All data is persisted in SQLite database

---

## ✅ System Verification Checklist

- [x] Backend running on http://localhost:5000
- [x] Frontend running on http://localhost:3000
- [x] Database initialized with 14 tables
- [x] Resume parser service active
- [x] AI question generator service active
- [x] AI interview endpoints working
- [x] Authentication working
- [x] Candidates can register & login
- [x] Companies can register & login
- [x] Candidates can upload resumes
- [x] Candidates can browse jobs
- [x] Candidates can take AI interviews
- [x] Companies can post jobs
- [x] Companies can review candidates
- [x] Companies can make hiring decisions
- [x] Scores calculated correctly
- [x] Reports generated successfully

## 🎉 System is Ready for Use!

Start by visiting: **http://localhost:3000/register**
