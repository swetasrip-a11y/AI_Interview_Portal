# Interview Portal Backend - Setup & Configuration

## Quick Start (SQLite - Default)

SQLite is the default and requires no extra setup.

```powershell
cd interview-portal-backend
npm install
npm run dev
```

Server will start on `http://localhost:5000`.

---

## Setup with XAMPP MySQL

### 1. Start XAMPP MySQL

- Open XAMPP Control Panel
- Click **Start** next to MySQL

### 2. Create Database

Open **phpMyAdmin** (usually `http://localhost/phpmyadmin`) and run:

```sql
CREATE DATABASE interview_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or via command line (if MySQL is in PATH):

```powershell
mysql -u root -e "CREATE DATABASE interview_portal;"
```

### 3. Configure Backend

Copy `.env.example` to `.env` and update:

```env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=interview_portal
PORT=5000
JWT_SECRET=your_secret_key_here
```

### 4. Install & Run

```powershell
cd interview-portal-backend
npm install
npm run dev
```

**Expected output:**
```
Connected to MySQL database
Database initialized
✓ Loaded ./routes/auth
✓ Loaded ./routes/resume
... (other routes)
Server running on http://localhost:5000
```

---

## Database Schema Overview

### Core Tables

- **users** - Candidates & Admins (username, password, email, full_name, role)
- **resumes** - Resume & audio files (user_id, filename, file_path, size, status)
- **ai_interview_sessions** - Interview sessions (candidate_id, job_id, status, final_score)
- **ai_interview_responses** - Q&A responses (session_id, candidate_answer, ai_evaluation, score)
- **hiring_decisions** - Interview decisions (candidate_id, job_id, ai_score, decision)
- **performance_metrics** - Interview scores (candidate_id, technical_score, soft_skills_score, overall_score)
- **submissions** - Quiz answers (user_id, question_id, selected_option, is_correct)
- **questions** - Interview/quiz questions (question_text, correct_option, difficulty)
- **jobs** - Job listings (title, description, company_id, salary, status)
- **candidate_profiles** - Candidate details (candidate_id, resume_path, skills, education, phone, location)

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login & get JWT token

### Resume Upload

- `POST /api/resume/upload` - Upload resume/audio file
- `GET /api/resume/list` - List user's resumes
- `DELETE /api/resume/delete/:id` - Delete resume

### AI Interview

- `POST /api/ai-interview/start` - Start interview session
- `POST /api/ai-interview/submit-answer` - Submit answer & store in DB
- `POST /api/ai-interview/complete` - Complete interview, save final score & decision

### Submissions

- `POST /api/submissions` - Submit quiz answer
- `GET /api/submissions/user/results` - Get user's quiz results

### Questions

- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question (admin only)

---

## Real-Time Events (Socket.IO)

The backend emits real-time events on Socket.IO. Connect with:

```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

socket.on('resume:uploaded', (data) => console.log('Resume uploaded:', data));
socket.on('ai-interview:started', (data) => console.log('Interview started:', data));
socket.on('ai-interview:response', (data) => console.log('Response saved:', data));
socket.on('ai-interview:completed', (data) => console.log('Interview done:', data));
socket.on('submission:created', (data) => console.log('Submission saved:', data));
```

---

## File Storage

- Uploaded files (resumes, audio) are saved to `interview-portal-backend/uploads/resumes/`
- Paths are stored in the `resumes` table as relative URLs

---

## Troubleshooting

### MySQL Connection Error

If you see "Could not connect to MySQL":
1. Ensure MySQL is running in XAMPP
2. Check credentials in `.env`
3. Verify database exists: `mysql -u root -e "SHOW DATABASES;"`

### Port Already in Use

Change `PORT` in `.env` or use:
```powershell
netstat -ano | findstr :5000  # Find process
taskkill /PID <PID> /F          # Kill it
```

### Database Locked

Clear SQLite lock:
```powershell
Remove-Item .\interview_portal.db
```

---

## Production Notes

- Set `JWT_SECRET` to a strong random string in `.env`
- Use MySQL in production (better scalability than SQLite)
- Configure CORS properly (don't use `*` in production)
- Add env validation before startup
- Use HTTPS in production (configure reverse proxy)

---

## Next Steps

1. **Frontend setup** - See `interview-portal-frontend` README
2. **Study materials** - Add API to fetch from internet
3. **Admin dashboard** - View all interview data, scores, offers
4. **Real-time sync** - Ensure frontend uses Socket.IO for live updates
