# 🎯 Quick Access Guide - Live Servers

**Both servers are currently RUNNING and accessible!**

---

## 📱 Access Points

### Frontend Application
```
URL: http://localhost:3000
Status: ✅ RUNNING
Framework: React + Vite
Port: 3000
```

**What to do:**
1. Open http://localhost:3000 in your browser
2. You should see the login/register page
3. Create a new account or login with existing credentials

### Backend API Server
```
URL: http://localhost:5000
Status: ✅ RUNNING
Framework: Express.js + Socket.IO
Port: 5000
Database: SQLite (interview_portal.db)
```

**API Endpoints Available:**
- Authentication: `/api/auth/register`, `/api/auth/login`
- Resume: `/api/resume/upload`, `/api/resume/list`, `/api/resume/download/:id`
- AI Interview: `/api/ai-interview/start`, `/api/ai-interview/submit-answer`
- Submissions: `/api/submissions`
- Questions: `/api/questions`
- Jobs: `/api/jobs`
- Materials: `/api/materials`

---

## 🗄️ Database

### SQLite (Currently Active)
```
Location: e:\CS\Project\Interview Portel IIT Bombay\interview-portal-backend\interview_portal.db
Size: ~100KB
Tables: 16 (auto-created)
Status: ✅ Connected
```

### MySQL/XAMPP (Available but not active)
To switch to MySQL:

1. **Start XAMPP MySQL:**
   - Open XAMPP Control Panel
   - Click **Start** next to MySQL

2. **Create Database:**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Run: `CREATE DATABASE interview_portal;`

3. **Update Backend Config:**
   - Edit: `interview-portal-backend/.env`
   ```env
   DB_TYPE=mysql
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=
   MYSQL_DATABASE=interview_portal
   ```

4. **Restart Backend:**
   ```powershell
   cd "interview-portal-backend"
   npm run dev
   ```

---

## 🧪 Test the System

### Test 1: Frontend Loading ✅
```
Action: Open http://localhost:3000
Expected: Login/Register page loads
```

### Test 2: Backend Health ✅
```
Action: Open http://localhost:5000/api/health
Expected: JSON response: {"message":"Backend is running"}
```

### Test 3: Create Account ✅
```
Action: Click Register on frontend
Fill: 
  - Email: test@interview.com
  - Password: test123
  - Name: Test User
  - Role: candidate
Expected: Account created, can login
```

### Test 4: Upload Resume ✅
```
Action: Login → Upload Resume
Expected: File uploads, shows in resume list
```

### Test 5: Real-Time Updates ✅
```
Action: Upload file from one browser
Expected: Admin dashboard (other browser) updates in real-time
```

---

## 📊 Current System Status

| Component | Status | Location |
|-----------|--------|----------|
| Backend Server | ✅ Running | http://localhost:5000 |
| Frontend Server | ✅ Running | http://localhost:3000 |
| SQLite Database | ✅ Connected | ./interview_portal.db |
| Socket.IO | ✅ Listening | Port 5000 |
| API Routes (12) | ✅ Loaded | /routes/* |
| React App | ✅ Compiled | Vite ready |
| Authentication | ✅ Ready | JWT configured |
| File Upload | ✅ Ready | Multer configured |
| Admin Dashboard | ✅ Ready | Real-time enabled |

---

## 🔑 Default Test Accounts

After running `node create-admin.js` in backend directory:

```
Email: admin@interview.com
Password: admin123
Role: admin
```

---

## 📝 File Locations

### Key Backend Files
```
Backend Root: e:\CS\Project\Interview Portel IIT Bombay\interview-portal-backend\

server.js                          Main server file
models/database.js                 Database layer
routes/                            All API routes
services/                          Business logic
middleware/auth.js                 JWT validation
.env                               Configuration
interview_portal.db                SQLite database
```

### Key Frontend Files
```
Frontend Root: e:\CS\Project\Interview Portel IIT Bombay\interview-portal-frontend\

src/App.jsx                        Main router
src/pages/                         All page components (48 files)
src/api/                           API wrapper modules (7 files)
src/hooks/useRealtime.js           Real-time hook
src/styles/                        All CSS files (8 files)
vite.config.js                     Vite configuration
index.html                         HTML entry point
```

---

## 🛠️ Useful Commands

### Backend Commands
```powershell
# Start development server
cd "interview-portal-backend"
npm run dev

# Install dependencies
npm install

# Create admin user
node create-admin.js
```

### Frontend Commands
```powershell
# Start development server
cd "interview-portal-frontend"
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Stop Servers
```powershell
# Kill backend (Ctrl+C in terminal)
# Kill frontend (Ctrl+C in terminal)
```

---

## ⚠️ Troubleshooting

### Frontend won't load
```
Issue: Blank page at http://localhost:3000
Solution:
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh (Ctrl+Shift+R)
3. Restart frontend: npm run dev
```

### Backend not responding
```
Issue: Cannot reach http://localhost:5000
Solution:
1. Check if backend is running
2. Check if PORT=5000 in .env
3. Kill any process on port 5000
4. Restart: npm run dev
```

### API calls failing
```
Issue: "Cannot POST /api/..." errors
Solution:
1. Check backend is running first
2. Check frontend is on http://localhost:3000
3. Check vite.config.js has proxy configured
4. Check network tab in browser DevTools
```

### Real-time not working
```
Issue: Socket.IO events not firing
Solution:
1. Check browser DevTools > Network > WS
2. Verify socket.io-client is installed
3. Restart both servers
4. Clear browser console errors
```

---

## 📚 Documentation

Complete documentation available:
- **README.md** - Full setup guide
- **API_DOCUMENTATION.md** - All endpoints with examples
- **BACKEND_SETUP.md** - Backend configuration
- **SYSTEM_DIAGNOSTIC_REPORT.md** - Complete system audit

---

## 🎬 Next Steps

1. ✅ Open **http://localhost:3000** in your browser
2. ✅ Register a new account or login
3. ✅ Upload a resume (test file upload)
4. ✅ Start an AI interview
5. ✅ Check Admin Dashboard for real-time updates
6. ✅ Switch to MySQL when ready for production

---

**🚀 Everything is running! Start exploring the application now.**

**Any issues? Check the SYSTEM_DIAGNOSTIC_REPORT.md or console logs.**
