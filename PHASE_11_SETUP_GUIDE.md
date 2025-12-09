# 🚀 Quick Setup Guide - Phase 11

## Step-by-Step Installation

### Step 1: Install Backend Dependencies
```bash
cd c:\Users\Sweta Sri\Desktop\new\interview-portal-backend
npm install
```

This will install the new `multer` package for file uploads.

### Step 2: Install Frontend Dependencies
```bash
cd c:\Users\Sweta Sri\Desktop\new\interview-portal-frontend
npm install
```

### Step 3: Start Backend Server
```bash
cd c:\Users\Sweta Sri\Desktop\new\interview-portal-backend
npm start
```

**Expected Output:**
```
Connected to SQLite database
Users table ready
Questions table ready
...
Resumes table ready
Server running on http://localhost:5000
```

### Step 4: Start Frontend Server (in new terminal)
```bash
cd c:\Users\Sweta Sri\Desktop\new\interview-portal-frontend
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in XXX ms

➜  Local:   http://localhost:3001/
```

### Step 5: Open Browser
Navigate to: `http://localhost:3001/`

---

## ✨ What You'll See

### New Dark Theme:
- ✅ Dark navy backgrounds (#050810, #0a0e27)
- ✅ Vibrant purple-blue gradients
- ✅ Bright white text (#f8fafc)
- ✅ Smooth animations

### New Features:
- ✅ Resume Upload page with drag-drop
- ✅ Real-time upload progress
- ✅ Enhanced Candidate Dashboard
- ✅ Search materials feature
- ✅ Dark theme everywhere

---

## 🧪 Testing the Features

### Test 1: Upload Resume
1. Login as a candidate
2. Click "Upload Resume" on dashboard
3. Drag a PDF file into the upload area
4. Watch the real-time progress bar
5. See the resume in "Your Resumes" list

### Test 2: Dark Theme
1. Check all pages have dark backgrounds
2. Verify text is readable (white on dark)
3. Check button gradients are vibrant
4. Verify animations are smooth

### Test 3: Search Materials
1. Go to "Study Materials"
2. Type in search box
3. See instant results filter
4. Verify performance

### Test 4: Responsive Design
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Test Mobile (375px) view
4. Test Tablet (768px) view
5. Test Desktop (1024px+) view

---

## 🎨 Color Changes Overview

### Before (Light Theme):
```
Backgrounds: #f5e6f0 (Pastel pink), #e6f2ff (Pastel blue)
Text: #333333 (Dark gray)
Buttons: Soft pastel gradients
Overall: Light and washed out
```

### After (Dark Theme):
```
Backgrounds: #050810 (Deep navy), #1a1f35 (Dark surface)
Text: #f8fafc (Bright white)
Buttons: Vibrant gradients (#6366f1 → #8b5cf6)
Overall: Modern and professional
```

---

## 📁 New Files Structure

```
Frontend:
  src/
    ├── pages/
    │   ├── ResumeUpload.jsx        ✨ NEW
    │   ├── CandidateDashboard.jsx  📝 UPDATED
    │   └── CandidateMaterials.jsx  📝 UPDATED
    └── styles/
        ├── resume-upload.css       ✨ NEW
        ├── materials.css           ✨ NEW
        ├── candidate-dashboard.css ✨ NEW
        ├── dashboard-enhanced.css  ✨ NEW
        ├── global.css              📝 UPDATED
        └── pages.css               📝 UPDATED

Backend:
  routes/
    └── resume.js                   ✨ NEW
  models/
    └── database.js                 📝 UPDATED
  server.js                          📝 UPDATED
  package.json                       📝 UPDATED
  uploads/
    └── resumes/                    ✨ NEW (auto-created)
```

---

## 🔍 Verification Checklist

### ✅ Backend Ready:
- [ ] NPM install completed without errors
- [ ] Server starts on port 5000
- [ ] Resumes table created in database
- [ ] No console errors

### ✅ Frontend Ready:
- [ ] NPM install completed without errors
- [ ] Frontend runs on port 3001
- [ ] Can navigate to pages
- [ ] Dark theme visible
- [ ] No console errors

### ✅ Features Working:
- [ ] Resume upload page accessible
- [ ] Drag-drop works
- [ ] Progress bar animates
- [ ] Resume saves to database
- [ ] List refreshes automatically
- [ ] Dark theme applied everywhere

### ✅ Responsive:
- [ ] Mobile view (375px) works
- [ ] Tablet view (768px) works
- [ ] Desktop view (1024px+) works
- [ ] No overlapping elements
- [ ] All text readable

---

## 🛠️ Common Issues & Fixes

### Issue: "Cannot find module 'multer'"
```bash
Solution: npm install multer
Location: interview-portal-backend
```

### Issue: Port 5000 already in use
```bash
Solution 1: taskkill /IM node.exe /F
Solution 2: Change port in .env file
```

### Issue: Port 3001 not working
```bash
Solution: Frontend auto-switches to another port
Check console for: "➜  Local:   http://localhost:XXXX/"
```

### Issue: Styles not showing
```bash
Solution 1: Hard refresh (Ctrl+Shift+R)
Solution 2: Clear browser cache
Solution 3: Check global.css import in App.jsx
```

### Issue: Resume upload fails
```bash
Checklist:
- [ ] Backend server running
- [ ] File size < 5MB
- [ ] File type is PDF/DOC/DOCX
- [ ] User is authenticated
- [ ] Check browser console for errors
```

---

## 📊 Performance Tips

### For Better Upload Speed:
- Use local network connection
- Check file size (smaller = faster)
- Verify backend is on same machine
- Monitor browser network tab

### For Better UI Performance:
- Hard refresh to clear cache
- Close unused browser tabs
- Disable browser extensions
- Update graphics drivers

---

## 📚 Documentation Files

All documentation in project root:
1. **PHASE_11_ENHANCED_COLORS_REALTIME.md** - Complete feature guide
2. **QUICKSTART_PROFESSIONAL.md** - User quick start
3. **PHASE_10_PROFESSIONAL_DESIGN.md** - Design system
4. **DESIGN_SYSTEM_SPECIFICATIONS.md** - Color & CSS details

---

## 🎯 What to Test Next

1. **Resume Features:**
   - Upload different file types
   - Test drag-drop
   - Download resume
   - Delete resume
   - Test file size limit

2. **Dark Theme:**
   - Check all pages
   - Verify text contrast
   - Test button interactions
   - Check animations

3. **Real-Time Updates:**
   - Upload and see instant refresh
   - Search materials
   - Check performance metrics

4. **Responsive Design:**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)
   - Touch interactions

---

## 🚀 Next Phase

After testing Phase 11, you can:
1. Add video interviews with dark theme
2. Implement real-time notifications
3. Add AI facial recognition
4. Create advanced analytics
5. Deploy to production

---

## 💬 Support Commands

### Start both servers (PowerShell):
```powershell
# Terminal 1 - Backend
cd "c:\Users\Sweta Sri\Desktop\new\interview-portal-backend"; npm start

# Terminal 2 - Frontend
cd "c:\Users\Sweta Sri\Desktop\new\interview-portal-frontend"; npm run dev
```

### Stop servers:
```powershell
# Kill all Node processes
taskkill /IM node.exe /F

# Or stop individual terminals with Ctrl+C
```

### Check server status:
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check if port 3001 is in use
netstat -ano | findstr :3001
```

---

## 📞 Need Help?

1. Check error messages in console
2. Review troubleshooting section above
3. Check documentation files
4. Verify all files were created
5. Restart servers
6. Clear browser cache

---

*Setup Guide Complete!*
*Ready to test Phase 11 features* ✨
