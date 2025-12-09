# Interview Portal - Complete API Documentation

## Overview

This is a full-stack interview portal with real-time data sync, AI-powered interviews, and a comprehensive admin dashboard.

- **Backend**: Node.js + Express (supports SQLite & MySQL/XAMPP)
- **Frontend**: React + Vite
- **Real-Time**: Socket.IO for live event streaming
- **Database**: MySQL (XAMPP) or SQLite

---

## Backend API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "candidate"  // "candidate", "interviewer", "admin"
}

Response:
{
  "message": "User registered successfully"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "candidate"
  }
}
```

---

### Resume & File Upload

#### Upload Resume/Audio
```
POST /api/resume/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: <binary PDF/DOC/MP3>

Response:
{
  "message": "File uploaded successfully",
  "resume": {
    "id": 1,
    "filename": "resume.pdf",
    "file_path": "/uploads/resumes/1234567-resume.pdf",
    "size": 245000,
    "uploaded_at": "2025-12-09T10:30:00.000Z",
    "status": "completed"
  }
}
```

#### List User's Resumes
```
GET /api/resume/list
Authorization: Bearer {token}

Response:
{
  "resumes": [
    {
      "id": 1,
      "filename": "resume.pdf",
      "file_path": "/uploads/resumes/1234567-resume.pdf",
      "size": 245000,
      "uploaded_at": "2025-12-09T10:30:00.000Z",
      "status": "completed"
    }
  ],
  "count": 1
}
```

#### Delete Resume
```
DELETE /api/resume/delete/{resumeId}
Authorization: Bearer {token}

Response:
{
  "message": "Resume deleted successfully"
}
```

---

### AI Interview

#### Parse Resume
```
POST /api/ai-interview/parse-resume
Content-Type: application/json
Authorization: Bearer {token}

{
  "resume_text": "Full resume text..."
}

Response:
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "skills": ["Java", "Python", "SQL"],
    "experience": "5 years in software development",
    "education": "B.Tech Computer Science",
    "projects": ["Project 1", "Project 2"]
  }
}
```

#### Generate Dynamic Questions
```
POST /api/ai-interview/generate-questions
Content-Type: application/json
Authorization: Bearer {token}

{
  "resume_data": {
    "skills": ["Java", "Python"],
    "experience": "5 years"
  },
  "job_role": "Senior Software Engineer",
  "count": 20
}

Response:
{
  "success": true,
  "message": "Questions generated successfully",
  "data": {
    "total_questions": 20,
    "questions": [
      {
        "type": "technical",
        "difficulty": "medium",
        "question": "Explain...",
        "follow_up": "Why is..."
      }
    ],
    "distribution": {
      "technical": 10,
      "hr": 5,
      "aptitude": 3,
      "scenario": 2
    }
  }
}
```

#### Start Interview Session
```
POST /api/ai-interview/start
Content-Type: application/json
Authorization: Bearer {token}

{
  "job_id": 1,
  "interview_type": "text",  // "text", "voice", "video"
  "questions": [
    {
      "type": "technical",
      "difficulty": "medium",
      "question": "What is...",
      "follow_up": "Why..."
    }
  ]
}

Response:
{
  "success": true,
  "message": "Interview session started",
  "data": {
    "session_id": 5,
    "interview_type": "text",
    "total_questions": 20,
    "questions": [...]
  }
}
```

#### Submit Answer
```
POST /api/ai-interview/submit-answer
Content-Type: application/json
Authorization: Bearer {token}

{
  "session_id": 5,
  "question_index": 0,
  "candidate_answer": "My answer is...",
  "expected_keywords": ["keyword1", "keyword2"],
  "question_type": "technical"
}

Response:
{
  "success": true,
  "message": "Answer submitted successfully",
  "data": {
    "response_id": 12,
    "score": 85,
    "feedback": "Good answer, but consider...",
    "matched_keywords": ["keyword1"],
    "answer_quality": "good"
  }
}
```

#### Complete Interview
```
POST /api/ai-interview/complete
Content-Type: application/json
Authorization: Bearer {token}

{
  "session_id": 5,
  "interview_duration": 1800  // seconds
}

Response:
{
  "success": true,
  "message": "Interview completed successfully",
  "data": {
    "session_id": 5,
    "final_score": 82.5,
    "total_questions": 20,
    "correct_answers": 16,
    "interview_duration": 1800,
    "feedback": "Great performance!",
    "status": "PASSED",
    "recommendation": "Strong Hire"
  }
}
```

#### Get Session Details
```
GET /api/ai-interview/session/{sessionId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Session retrieved successfully",
  "data": {
    "session": {
      "id": 5,
      "candidate_id": 1,
      "job_id": 1,
      "interview_type": "text",
      "status": "completed",
      "final_score": 82.5,
      "total_questions": 20,
      "correct_answers": 16,
      "interview_duration": 1800,
      "started_at": "2025-12-09T10:00:00.000Z",
      "completed_at": "2025-12-09T10:30:00.000Z"
    },
    "responses": [
      {
        "id": 1,
        "session_id": 5,
        "question_id": 1,
        "candidate_answer": "My answer...",
        "ai_evaluation": "Good",
        "score": 85,
        "confidence_level": 90
      }
    ]
  }
}
```

---

### Quiz/Questions Submissions

#### Submit Quiz Answer
```
POST /api/submissions
Content-Type: application/json
Authorization: Bearer {token}

{
  "question_id": 1,
  "selected_option": "B"
}

Response:
{
  "is_correct": true,
  "correct_option": "B",
  "message": "Correct!"
}
```

#### Get User Results
```
GET /api/submissions/user/results
Authorization: Bearer {token}

Response:
{
  "results": [
    {
      "title": "Question 1",
      "question_text": "What is...",
      "selected_option": "B",
      "is_correct": true,
      "submitted_at": "2025-12-09T10:30:00.000Z"
    }
  ],
  "total": 20,
  "correct": 18,
  "score": 90
}
```

---

### Questions Management

#### Get All Questions
```
GET /api/questions
Authorization: Bearer {token}

Response:
{
  "questions": [
    {
      "id": 1,
      "title": "Question 1",
      "description": "Description",
      "question_text": "What is...",
      "option_a": "Option A",
      "option_b": "Option B",
      "option_c": "Option C",
      "option_d": "Option D",
      "correct_option": "B",
      "difficulty": "medium",
      "created_by": 1,
      "created_at": "2025-12-09T10:00:00.000Z"
    }
  ]
}
```

#### Create Question (Admin)
```
POST /api/questions
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "New Question",
  "description": "Description",
  "question_text": "What is...",
  "option_a": "Option A",
  "option_b": "Option B",
  "option_c": "Option C",
  "option_d": "Option D",
  "correct_option": "B",
  "difficulty": "medium"
}

Response:
{
  "question": {
    "id": 2,
    "title": "New Question",
    ...
  }
}
```

---

### Jobs

#### Get All Jobs
```
GET /api/jobs
Authorization: Bearer {token}

Response:
{
  "jobs": [
    {
      "id": 1,
      "title": "Software Engineer",
      "description": "Job description",
      "company_id": 1,
      "location": "New York",
      "salary": "$100,000 - $150,000",
      "requirements": "Java, SQL, Microservices",
      "experience_level": "5+ years",
      "status": "open",
      "created_at": "2025-12-09T10:00:00.000Z"
    }
  ]
}
```

#### Post a Job (Company Admin)
```
POST /api/jobs
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Software Engineer",
  "description": "We are looking for...",
  "location": "New York",
  "salary": "$100,000 - $150,000",
  "requirements": "Java, SQL",
  "experience_level": "5+ years"
}

Response:
{
  "job": {
    "id": 2,
    "title": "Software Engineer",
    ...
  }
}
```

---

## Real-Time Events (Socket.IO)

Connect to `http://localhost:5000` and listen for events:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Resume uploaded
socket.on('resume:uploaded', (data) => {
  console.log('Resume uploaded:', data);
  // data: { userId, resumeId, filename, file_path, mimetype }
});

// Resume deleted
socket.on('resume:deleted', (data) => {
  console.log('Resume deleted:', data);
  // data: { userId, resumeId }
});

// AI Interview started
socket.on('ai-interview:started', (data) => {
  console.log('Interview started:', data);
  // data: { session_id, candidate_id, job_id, interview_type }
});

// AI Interview response saved
socket.on('ai-interview:response', (data) => {
  console.log('Response saved:', data);
  // data: { response_id, session_id, question_index, score, feedback }
});

// AI Interview completed
socket.on('ai-interview:completed', (data) => {
  console.log('Interview completed:', data);
  // data: { session_id, final_score, total_questions, correct_answers }
});

// Quiz submission
socket.on('submission:created', (data) => {
  console.log('Submission created:', data);
  // data: { submissionId, userId, question_id, is_correct }
});
```

---

## Frontend Usage

### Import API Modules

```javascript
import * as authAPI from './api/auth';
import * as resumeAPI from './api/resume';
import * as aiInterviewAPI from './api/aiInterview';
import * as submissionsAPI from './api/submissions';
import * as adminAPI from './api/admin';
import { useRealtime } from './hooks/useRealtime';
```

### Example: Upload Resume & Listen for Real-Time Updates

```jsx
import { useState } from 'react';
import * as resumeAPI from './api/resume';
import { useRealtime } from './hooks/useRealtime';

export function ResumeUploader() {
  const [file, setFile] = useState(null);
  const { subscribe } = useRealtime();

  // Listen for upload events
  subscribe('resume:uploaded', (event) => {
    console.log('Real-time update:', event);
    // Refresh resume list
  });

  const handleUpload = async () => {
    try {
      const result = await resumeAPI.uploadResume(file);
      console.log('Uploaded:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Resume</button>
    </div>
  );
}
```

### Example: AI Interview Flow

```jsx
import { useState } from 'react';
import * as aiInterviewAPI from './api/aiInterview';

export function AIInterview() {
  const [sessionId, setSessionId] = useState(null);
  const [answers, setAnswers] = useState([]);

  // Start interview
  const startInterview = async (jobId, questions) => {
    const { data } = await aiInterviewAPI.startInterview(jobId, 'text', questions);
    setSessionId(data.session_id);
  };

  // Submit answer
  const submitAnswer = async (index, answer) => {
    const result = await aiInterviewAPI.submitAnswer(sessionId, index, answer);
    setAnswers([...answers, result.data]);
  };

  // Complete interview
  const completeInterview = async () => {
    const result = await aiInterviewAPI.completeInterview(sessionId, 1800);
    console.log('Final Score:', result.data.final_score);
    console.log('Recommendation:', result.data.recommendation);
  };

  return (
    // UI components here
  );
}
```

---

## Database Schema

### Core Tables

#### users
- `id` (PK)
- `email` (UNIQUE)
- `password` (hashed)
- `full_name`
- `role` (candidate, interviewer, admin)
- `created_at`

#### resumes
- `id` (PK)
- `user_id` (FK)
- `filename`
- `file_path`
- `size`
- `status` (pending, completed)
- `uploaded_at`

#### ai_interview_sessions
- `id` (PK)
- `candidate_id` (FK)
- `job_id` (FK)
- `interview_type` (text, voice, video)
- `status` (pending, in_progress, completed)
- `final_score`
- `total_questions`
- `correct_answers`
- `interview_duration`
- `started_at`
- `completed_at`

#### ai_interview_responses
- `id` (PK)
- `session_id` (FK)
- `question_id` (FK)
- `candidate_answer`
- `ai_evaluation`
- `score`
- `confidence_level`

#### hiring_decisions
- `id` (PK)
- `candidate_id` (FK)
- `job_id` (FK)
- `ai_score`
- `decision` (pending, hire, reject)
- `feedback`
- `decision_date`

#### performance_metrics
- `id` (PK)
- `candidate_id` (FK)
- `interview_id` (FK)
- `technical_score`
- `soft_skills_score`
- `overall_score`
- `communication_clarity`
- `problem_solving`
- `teamwork`
- `leadership`

#### candidate_profiles
- `id` (PK)
- `candidate_id` (FK, UNIQUE)
- `resume_path`
- `skills`
- `experience`
- `education`
- `phone`
- `location`

#### jobs
- `id` (PK)
- `title`
- `description`
- `company_id` (FK)
- `location`
- `salary`
- `requirements`
- `experience_level`
- `status` (open, closed)

---

## Error Handling

All endpoints return error responses in this format:

```json
{
  "error": "Error message",
  "success": false,
  "data": null
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Environment Variables

### Backend (.env)

```env
DB_TYPE=sqlite  # or mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=interview_portal
PORT=5000
JWT_SECRET=your_secret_key_here
```

### Frontend (.env or vite config)

```
VITE_API_BASE=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Installation & Running

### Backend

```bash
cd interview-portal-backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend

```bash
cd interview-portal-frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Upload Resume
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer {TOKEN}" \
  -F "file=@resume.pdf"
```

### Using Postman

1. Create a collection for Interview Portal API
2. Add requests for each endpoint
3. Set up environment variables for `{token}` and `{baseUrl}`
4. Use Body > form-data for file uploads

---

## Production Deployment

1. **Backend**
   - Use MySQL instead of SQLite
   - Set strong `JWT_SECRET`
   - Enable HTTPS
   - Use environment variables for all config
   - Add rate limiting
   - Enable CORS for specific domains

2. **Frontend**
   - Build with `npm run build`
   - Deploy to CDN (Vercel, Netlify, AWS S3 + CloudFront)
   - Set API_BASE to production backend URL

3. **Database**
   - Use managed MySQL (AWS RDS, Azure Database, etc.)
   - Enable backups
   - Set up read replicas for scaling

---

## Support & Troubleshooting

### Backend won't start
- Check `.env` file exists and has JWT_SECRET
- Verify PORT is not already in use
- Check database connection (MySQL running if using MySQL)

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS is enabled in backend
- Verify API URLs in frontend config

### Real-Time events not working
- Ensure Socket.IO is connected (`console.log` in browser DevTools)
- Check firewall is not blocking WebSocket connections
- Verify `socket.io-client` is installed in frontend

---

## License

This project is provided as-is for educational and commercial use.
