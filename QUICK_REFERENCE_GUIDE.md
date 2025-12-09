# 🚀 QUICK REFERENCE GUIDE

**Everything You Need in One Place**

---

## 🌐 Live URLs

```
Frontend Application:    http://localhost:3000
Backend API:            http://localhost:5000
Admin Dashboard:        http://localhost:3000 (after login)
API Health Check:       http://localhost:5000/api/health
phpMyAdmin (MySQL):     http://localhost/phpmyadmin
```

---

## 🔑 Default Test Account

After creating admin user:
```
Email: admin@interview.com
Password: admin123
Role: admin
```

---

## 📂 Key File Locations

### Backend
```
Main Server:           ./interview-portal-backend/server.js
Database Config:       ./interview-portal-backend/models/database.js
Configuration:         ./interview-portal-backend/.env
Database File:         ./interview-portal-backend/interview_portal.db
Routes:                ./interview-portal-backend/routes/
Services:              ./interview-portal-backend/services/
```

### Frontend
```
Main App:              ./interview-portal-frontend/src/App.jsx
Pages:                 ./interview-portal-frontend/src/pages/
API Modules:           ./interview-portal-frontend/src/api/
Styles:                ./interview-portal-frontend/src/styles/
Vite Config:           ./interview-portal-frontend/vite.config.js
```

---

## 💻 Start/Stop Commands

### Start Backend
```powershell
cd interview-portal-backend
npm run dev
```

### Start Frontend
```powershell
cd interview-portal-frontend
npm run dev
```

### Stop Either Server
```
Press Ctrl+C in the terminal
```

### Create Admin User
```powershell
cd interview-portal-backend
node create-admin.js
```

### Build Frontend for Production
```powershell
cd interview-portal-frontend
npm run build
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000                           # Backend port
JWT_SECRET=your_secret_key          # JWT secret key
DB_PATH=./interview_portal.db       # SQLite path
DB_TYPE=sqlite                      # Database type (or 'mysql')

# MySQL Configuration (when DB_TYPE=mysql)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=interview_portal
```

---

## 📊 API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/register           Register new user
POST   /api/auth/login              Login & get token
GET    /api/auth/health             Health check
```

### Resume
```
POST   /api/resume/upload           Upload file (PDF/DOC/MP3)
GET    /api/resume/list             List user's resumes
DELETE /api/resume/delete/:id        Delete resume
GET    /api/resume/download/:id      Download resume
```

### AI Interview
```
POST   /api/ai-interview/parse-resume         Parse resume
POST   /api/ai-interview/generate-questions   Get questions
POST   /api/ai-interview/start                Start interview
POST   /api/ai-interview/submit-answer        Submit answer
POST   /api/ai-interview/complete             Finish interview
GET    /api/ai-interview/session/:id          Get details
```

### Submissions
```
POST   /api/submissions              Submit quiz answer
GET    /api/submissions/user/results Get user scores
```

### Questions
```
GET    /api/questions                Get all questions
POST   /api/questions                Create question (admin)
```

### Jobs
```
GET    /api/jobs                     Get job listings
POST   /api/jobs                     Post new job (admin)
```

---

## 🔌 Real-Time Socket.IO Events

### Listen For Events
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Resume events
socket.on('resume:uploaded', (data) => {
  console.log('Resume uploaded:', data);
});

socket.on('resume:deleted', (data) => {
  console.log('Resume deleted:', data);
});

// Interview events
socket.on('ai-interview:started', (data) => {
  console.log('Interview started:', data);
});

socket.on('ai-interview:response', (data) => {
  console.log('Answer submitted:', data);
});

socket.on('ai-interview:completed', (data) => {
  console.log('Interview finished:', data);
});

// Submission events
socket.on('submission:created', (data) => {
  console.log('Answer recorded:', data);
});
```

---

## 🧪 Quick Tests

### Test 1: Backend Running
```
Open: http://localhost:5000/api/health
Expected: {"message":"Backend is running"}
```

### Test 2: Frontend Loading
```
Open: http://localhost:3000
Expected: Login/Register page loads
```

### Test 3: Create Account
```
1. Click Register
2. Fill form (email, password, name, role)
3. Submit
Expected: Account created, redirect to login
```

### Test 4: Login
```
1. Enter email and password
2. Click Login
Expected: Token stored, redirect to dashboard
```

### Test 5: Upload Resume
```
1. Go to upload page
2. Select any PDF/DOC/MP3 file
3. Click Upload
Expected: File uploaded, appears in list
```

### Test 6: Real-Time Check
```
1. Open dashboard in two browser windows
2. Upload file in first window
3. Check second window
Expected: Dashboard updates without refresh
```

---

## ⚠️ Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| Backend won't start | Check if port 5000 is free, verify .env exists |
| Frontend won't load | Clear cache (Ctrl+Shift+Del), hard refresh (Ctrl+Shift+R) |
| API calls failing | Ensure backend is running before frontend |
| Socket.IO not connecting | Restart both servers, clear browser cache |
| Database locked | Delete interview_portal.db and restart |
| 401 Unauthorized | Re-login, token may have expired |
| File upload fails | Check file size < 50MB and type is PDF/DOC/MP3 |
| CORS errors | Verify CORS is enabled in server.js |

---

## 📦 Dependencies Summary

### Backend (11 packages)
- express, cors, dotenv, jsonwebtoken, bcrypt
- multer, sqlite3, mysql2, socket.io, axios

### Frontend (7 packages)
- react, react-dom, react-router-dom
- axios, socket.io-client, vite, @vitejs/plugin-react

---

## 🗄️ Database Tables (16)

```
users, questions, interviews, interview_candidates,
submissions, materials, jobs, candidate_profiles,
job_applications, ai_interview_sessions, resumes,
ai_interview_responses, hiring_decisions, chat_messages,
interview_reports, performance_metrics
```

---

## 📄 Frontend Pages (48)

```
AdminDashboard, Login, Register, CandidateDashboard,
AIInterview, AIInterviewRealtime, ResumeUpload,
+ 40 more pages for different roles and features
```

---

## 🔗 API Modules (7)

```
auth.js              - Login/Register
resume.js            - File operations
aiInterview.js       - Interview workflow
admin.js             - Admin operations
realtime.js          - Socket.IO connection
interviews.js        - Interview queries
questions.js         - Question queries
```

---

## 🎨 Stylesheets (8)

```
AdminDashboard.css, global.css, pages.css,
dashboard-enhanced.css, candidate-dashboard.css,
ai-chat.css, materials.css, resume-upload.css
```

---

## 🔐 Security Checklist

- [x] JWT authentication enabled
- [x] Password hashing (bcrypt) configured
- [x] CORS enabled for development
- [x] File upload validation implemented
- [x] Protected routes with middleware
- [x] Input validation on endpoints
- [x] Error handling without exposing details

---

## 📱 Role-Based Features

### Candidate Role
- Register/Login
- Upload resume
- Take AI interviews
- View scores
- Apply for jobs
- Browse materials
- View job offers

### Interviewer Role
- Create interviews
- View candidate sessions
- Provide feedback
- Rate candidates
- Manage questions

### Admin Role
- Manage all users
- View all interviews
- Make hiring decisions
- Create job offers
- Monitor system performance
- Access analytics

---

## 🚀 Deploy to Production

### Prerequisites
- Node.js v16+ installed
- MySQL server running (XAMPP or cloud)
- Domain name (optional)

### Steps
1. Update JWT_SECRET in .env
2. Switch to MySQL: `DB_TYPE=mysql`
3. Configure MySQL credentials
4. Build frontend: `npm run build`
5. Deploy backend to cloud (Heroku, AWS, Azure)
6. Deploy frontend to CDN (Vercel, Netlify)
7. Point domain to frontend
8. Enable HTTPS
9. Setup monitoring

---

## 📖 Documentation Files

- **README.md** - Complete setup guide (start here)
- **API_DOCUMENTATION.md** - All endpoints with examples
- **BACKEND_SETUP.md** - Backend configuration details
- **SYSTEM_DIAGNOSTIC_REPORT.md** - Full system audit
- **QUICK_ACCESS_CURRENT_SERVERS.md** - Current server info
- **FULL_SYSTEM_STATUS.md** - Overall system status
- **FINAL_VERIFICATION_CHECKLIST.md** - Verification results
- **QUICK_REFERENCE_GUIDE.md** - This file

---

## 🎯 What Can You Do Right Now?

1. ✅ Open http://localhost:3000 in browser
2. ✅ Register new account
3. ✅ Login with credentials
4. ✅ Upload resume file
5. ✅ Start AI interview
6. ✅ View admin dashboard
7. ✅ Check real-time updates
8. ✅ Browse all features

---

## 📞 Need Help?

### Check These Files First
1. README.md - Setup and basics
2. API_DOCUMENTATION.md - Endpoint details
3. SYSTEM_DIAGNOSTIC_REPORT.md - System status
4. FINAL_VERIFICATION_CHECKLIST.md - Verification

### Backend Debugging
```
Check output of: npm run dev
Look for errors in console
Check .env configuration
Verify port 5000 is free
```

### Frontend Debugging
```
Open browser DevTools (F12)
Check Console tab for errors
Check Network tab for API calls
Check Application > LocalStorage for token
```

---

## ✨ What's Included

✅ Full-stack interview platform  
✅ AI-powered interviews  
✅ Real-time data sync  
✅ MySQL/SQLite support  
✅ Admin dashboard  
✅ File management  
✅ Performance metrics  
✅ Hiring decisions  
✅ Job offers  
✅ Complete documentation  

---

## 🎉 You're All Set!

Everything is working perfectly. Start exploring by opening http://localhost:3000 now!

---

**Last Updated:** December 9, 2025  
**Status:** ✅ All Systems Operational
