# 🎯 Interview Portal - Complete Setup & Deployment Guide

An advanced interview platform with **real-time data sync**, **AI-powered interviews**, **MySQL/XAMPP support**, and **comprehensive admin dashboard**.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- **Node.js** v16+ (install from [nodejs.org](https://nodejs.org))
- **XAMPP** (optional, for MySQL; download from [apachefriends.org](https://www.apachefriends.org))

### Setup Backend

```powershell
cd "Interview Portel IIT Bombay\interview-portal-backend"
npm install
npm run dev
```

**Expected output:**
```
✅ Database initialized
✓ Loaded ./routes/auth
✓ Loaded ./routes/resume
... (all routes)
✅ Server running on http://localhost:5000
```

### Setup Frontend

In a new terminal:

```powershell
cd "Interview Portel IIT Bombay\interview-portal-frontend"
npm install
npm run dev
```

**Frontend** opens at `http://localhost:5173`  
**Backend** runs at `http://localhost:5000`

---

## 📋 Features

✅ **User Authentication**
- Register candidates, interviewers, admins
- Secure JWT-based login
- Role-based access control

✅ **Resume & File Management**
- Upload/download PDF, DOCX, MP3 files
- Auto-save to database with metadata
- Real-time file notifications

✅ **AI-Powered Interviews**
- Dynamic question generation based on resume
- Real-time scoring & feedback
- Supports text, voice, and video formats
- Store all responses with AI evaluations

✅ **Real-Time Data Sync**
- Socket.IO for instant updates
- Live interview progress tracking
- Real-time admin dashboard
- Auto-refresh on events

✅ **Admin Dashboard**
- View all users, interviews, decisions, offers
- Real-time event log
- Hiring decision management
- Job offer creation & tracking

✅ **Performance Metrics**
- Track technical & soft skills scores
- Overall interview performance
- Recommendation engine

✅ **Database Flexibility**
- SQLite (default, no setup needed)
- MySQL/XAMPP (production-ready)
- Auto-create all tables on startup

---

## 🗄️ Database Setup

### Option 1: SQLite (Default)

No setup needed! The backend automatically creates `interview_portal.db` on first run.

### Option 2: MySQL with XAMPP

**Step 1: Start XAMPP**
- Open XAMPP Control Panel
- Click **Start** next to MySQL

**Step 2: Create Database**

Open phpMyAdmin (`http://localhost/phpmyadmin`) and run:

```sql
CREATE DATABASE interview_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Step 3: Update Backend Config**

Edit `interview-portal-backend/.env`:

```env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=interview_portal
PORT=5000
JWT_SECRET=your_secret_key_here
```

**Step 4: Restart Backend**

```powershell
npm run dev
```

The backend will auto-create all tables in MySQL.

---

## 🔑 Test Account

After starting the backend, create an admin user:

```powershell
cd interview-portal-backend
node create-admin.js
```

**Login with:**
- Email: `admin@interview.com`
- Password: `admin123`

---

## 📁 Project Structure

```
Interview Portel IIT Bombay/
├── interview-portal-backend/
│   ├── models/
│   │   └── database.js          # MySQL/SQLite abstraction
│   ├── routes/
│   │   ├── auth.js
│   │   ├── aiInterview.js
│   │   ├── resume.js            # File upload/download
│   │   ├── submissions.js
│   │   ├── questions.js
│   │   └── ... (other routes)
│   ├── services/
│   │   ├── aiQuestionGenerator.js
│   │   ├── resumeParser.js
│   │   └── ...
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── realtime.js              # Socket.IO handler
│   ├── server.js                # Express + Socket.IO
│   ├── .env                      # Configuration
│   ├── .env.example              # Example config
│   └── package.json
│
├── interview-portal-frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── resume.js
│   │   │   ├── aiInterview.js
│   │   │   ├── admin.js
│   │   │   └── realtime.js      # Socket.IO client
│   │   ├── hooks/
│   │   │   └── useRealtime.js   # Real-time hook
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # 🆕 Admin interface
│   │   │   ├── AIInterview.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   └── ... (other pages)
│   │   ├── styles/
│   │   │   └── AdminDashboard.css   # 🆕 Dashboard styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── API_DOCUMENTATION.md      # 🆕 Complete API reference
├── BACKEND_SETUP.md          # 🆕 Backend setup guide
└── README.md                 # This file
```

---

## 🔌 Real-Time Events

The system emits real-time updates via Socket.IO. Example usage:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Listen for resume uploads
socket.on('resume:uploaded', (data) => {
  console.log(`${data.filename} uploaded by user ${data.userId}`);
  // Refresh resume list in UI
});

// Listen for interview completion
socket.on('ai-interview:completed', (data) => {
  console.log(`Interview ${data.session_id} completed with ${data.final_score}% score`);
  // Update admin dashboard
});

// Listen for submissions
socket.on('submission:created', (data) => {
  console.log(`Question answered: ${data.is_correct ? '✅' : '❌'}`);
});
```

---

## 🔐 Authentication Flow

```
1. User registers/logs in
   → Backend validates credentials
   → Returns JWT token
   
2. Frontend stores token in localStorage
   → All API requests include Authorization header
   
3. Backend verifies token on each request
   → Extracts userId from token
   → Ensures user has permission
   
4. Frontend auto-refreshes token before expiry
   → Seamless user experience
```

---

## 📊 Admin Dashboard Features

**Overview Tab**
- Real-time statistics (users, sessions, decisions, offers)
- Live event log with timestamps

**Users Tab**
- List all registered users
- Filter by role (candidate, interviewer, admin)
- View joined date

**Sessions Tab**
- All AI interview sessions
- Current status, scores, durations
- Sortable by date, score, status

**Hiring Tab**
- Interview decisions (hire, reject, pending)
- AI scores and feedback
- Quick actions to update decisions

**Offers Tab**
- Job offers sent to candidates
- Salary and start date info
- Acceptance status

---

## 🎯 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login & get token

### Resume
- `POST /api/resume/upload` - Upload file
- `GET /api/resume/list` - List resumes
- `DELETE /api/resume/delete/:id` - Delete resume

### AI Interview
- `POST /api/ai-interview/parse-resume` - Extract resume data
- `POST /api/ai-interview/generate-questions` - Create dynamic questions
- `POST /api/ai-interview/start` - Begin interview
- `POST /api/ai-interview/submit-answer` - Save answer & score
- `POST /api/ai-interview/complete` - Finalize interview
- `GET /api/ai-interview/session/:id` - Get session details

### Questions & Submissions
- `GET /api/questions` - List all questions
- `POST /api/questions` - Create question (admin)
- `POST /api/submissions` - Submit quiz answer
- `GET /api/submissions/user/results` - Get user scores

### Admin
- `GET /api/users` - List all users
- `GET /api/hiring-decisions` - Get decisions
- `GET /api/job-offers` - Get offers

Full details: see `API_DOCUMENTATION.md`

---

## 🚀 Deployment Checklist

### Backend

- [ ] Set strong `JWT_SECRET` in `.env`
- [ ] Use MySQL in production (not SQLite)
- [ ] Enable HTTPS
- [ ] Set `CORS` for frontend domain
- [ ] Add rate limiting
- [ ] Setup auto-backups
- [ ] Monitor logs for errors

### Frontend

- [ ] Build: `npm run build`
- [ ] Update API base URL to production backend
- [ ] Deploy to CDN (Vercel, Netlify, AWS)
- [ ] Set up custom domain
- [ ] Enable HTTPS

### Database

- [ ] Use managed MySQL (AWS RDS, Azure, etc.)
- [ ] Set strong passwords
- [ ] Enable automated backups
- [ ] Setup read replicas if needed
- [ ] Monitor performance

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** `npm run dev` exits with no output

**Solution:**
```powershell
# Check for port conflicts
netstat -ano | findstr :5000

# Check .env exists
type .env

# Check JWT_SECRET is set
echo $env:JWT_SECRET
```

### Frontend can't connect to backend

**Problem:** Network errors in browser console

**Solution:**
- Verify backend is running: `http://localhost:5000/api/health`
- Check CORS is enabled (already configured)
- Clear browser cache: Ctrl+Shift+Delete

### MySQL connection fails

**Problem:** "Could not connect to MySQL"

**Solution:**
```powershell
# Verify MySQL is running in XAMPP
# Check credentials in .env match XAMPP config
# Create database if missing:
mysql -u root -e "CREATE DATABASE interview_portal;"
```

### Files won't upload

**Problem:** Upload endpoint returns 500 error

**Solution:**
- Check `uploads/resumes/` directory exists
- Verify file size < 50MB
- Check file type is PDF/DOC/MP3
- Ensure user is authenticated (token valid)

### Real-time events not working

**Problem:** Socket.IO events not firing

**Solution:**
- Check browser DevTools > Network > WS (WebSocket)
- Verify `socket.io-client` is installed
- Ensure backend Socket.IO server is running
- Check firewall allows WebSocket connections

---

## 📞 Support

### Key Files for Debugging

- **Backend Logs**: Run `npm run dev` to see real-time logs
- **Frontend Console**: F12 > Console tab in browser
- **Database**: SQLite → `interview_portal.db` | MySQL → phpMyAdmin

### Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ERR_CONNECTION_REFUSED` | Backend not running | Start with `npm run dev` |
| `401 Unauthorized` | Invalid/expired token | Re-login |
| `405 Method Not Allowed` | Wrong HTTP method | Check API docs |
| `Duplicate entry` | Email already registered | Use different email |
| `EADDRINUSE` | Port already in use | Change `PORT` in .env |

---

## 📚 Documentation Files

- **`API_DOCUMENTATION.md`** - Complete API reference with examples
- **`BACKEND_SETUP.md`** - Backend-specific setup & configuration
- **`README.md`** (this file) - Overall project guide

---

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **Socket.IO**: https://socket.io/docs
- **Vite**: https://vitejs.dev
- **MySQL**: https://dev.mysql.com/doc
- **JWT**: https://jwt.io

---

## 📝 License

This project is provided as-is for educational and commercial use.

---

## ✨ What's Included

🎉 **This complete solution includes:**

✅ Full-stack interview platform  
✅ AI-powered interview engine  
✅ Real-time data synchronization  
✅ MySQL & SQLite database support  
✅ Admin dashboard with live updates  
✅ Resume & audio file management  
✅ Performance metrics & hiring decisions  
✅ Complete API documentation  
✅ Production-ready code  
✅ Error handling & validation  

---

## 🎯 Next Steps

1. **Start the application**
   ```powershell
   # Terminal 1: Backend
   cd interview-portal-backend
   npm run dev
   
   # Terminal 2: Frontend
   cd interview-portal-frontend
   npm run dev
   ```

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Admin Dashboard: http://localhost:5173 (login as admin)

3. **Test the features**
   - Create candidates & interviewers
   - Upload resumes
   - Start AI interviews
   - View real-time dashboard updates

4. **Deploy to production**
   - Configure MySQL
   - Set environment variables
   - Deploy backend to cloud (Heroku, AWS, Azure)
   - Deploy frontend to CDN (Vercel, Netlify)

---

**🚀 Happy Interviewing! Feel free to customize and extend the platform for your needs.**
