# 🔧 XAMPP MySQL Setup Guide - Step by Step

**Fix MySQL Connection Error**

---

## ⚠️ Common XAMPP MySQL Errors & Solutions

### Error: "Cannot GET /phpmyadmin/"

**This means:** MySQL is not running or not properly configured in XAMPP.

### ✅ Solution - Step by Step

---

## Step 1: Start XAMPP MySQL Correctly

### Option A: Using XAMPP Control Panel

1. **Open XAMPP Control Panel** (from Start menu or Control Panel)
2. **Find MySQL row**
3. **Click "Start" button** next to MySQL
4. **Wait** until it shows "Running" (may take 5-10 seconds)
5. **Check port** shows 3306

```
MySQL - Running on port 3306
```

### Option B: If MySQL Won't Start

**Try these fixes:**

1. **Check if port 3306 is already in use:**
   ```powershell
   netstat -ano | findstr :3306
   ```

2. **If something is using port 3306:**
   - Kill the process
   - Restart MySQL in XAMPP

3. **If MySQL still won't start:**
   - Stop all Apache services
   - Restart XAMPP Control Panel as Administrator
   - Try starting MySQL again

---

## Step 2: Verify MySQL is Running

**Open browser and go to:**
```
http://localhost/phpmyadmin
```

**You should see phpMyAdmin login page**

---

## Step 3: Create Database (if not exists)

### Option A: Using phpMyAdmin (Easiest)

1. **Open** http://localhost/phpmyadmin
2. **Login** (usually no password needed for root)
3. **Click "New"** on the left
4. **Database name:** `interview_portal`
5. **Collation:** `utf8mb4_unicode_ci`
6. **Click "Create"**

### Option B: Using Command Line

```powershell
# Open Command Prompt or PowerShell

# Navigate to MySQL bin directory
cd "C:\xampp\mysql\bin"

# Connect to MySQL
mysql -u root

# Create database
CREATE DATABASE interview_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```

---

## Step 4: Update Backend Configuration

**Edit:** `interview-portal-backend/.env`

```env
PORT=5000
JWT_SECRET=your_secret_key_here
DB_TYPE=mysql
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=interview_portal
```

**Important:**
- `MYSQL_HOST=127.0.0.1` (not localhost)
- `MYSQL_USER=root` (default XAMPP user)
- `MYSQL_PASSWORD=` (usually empty for local XAMPP)
- `MYSQL_DATABASE=interview_portal`

---

## Step 5: Restart Backend Server

```powershell
# Stop current backend (Ctrl+C in terminal)

# Navigate to backend
cd "interview-portal-backend"

# Start again
npm run dev
```

**You should see:**
```
Database initialized
✓ All routes loaded
✅ Server running on http://localhost:5000
Connected to MySQL database
```

---

## 🧪 Test MySQL Connection

### Test 1: Register User
```
1. Open http://localhost:3000
2. Click Register
3. Fill form and submit
4. Check MySQL - user should be saved
```

### Test 2: Check Data in phpMyAdmin
```
1. Open http://localhost/phpmyadmin
2. Click interview_portal > users table
3. You should see your registered user
```

---

## ❌ Common Issues & Fixes

### Issue: "Cannot connect to MySQL server"

**Cause:** MySQL service not running or wrong credentials

**Fix:**
1. Check XAMPP Control Panel - MySQL should show "Running"
2. Verify port 3306 is listening: `netstat -ano | findstr :3306`
3. Check .env has correct credentials

### Issue: "Access denied for user 'root'@'localhost'"

**Cause:** Wrong password in .env

**Fix:**
```
XAMPP default is:
- User: root
- Password: (empty - leave blank)
```

### Issue: "Unknown database 'interview_portal'"

**Cause:** Database not created

**Fix:**
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create database manually (follow Step 3)
3. Restart backend

### Issue: "Can't connect to MySQL on '127.0.0.1'"

**Cause:** MySQL service not running

**Fix:**
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait for "Running" status
4. Retry

---

## ✅ Verification Checklist

- [ ] XAMPP Control Panel open
- [ ] MySQL showing "Running" status
- [ ] phpMyAdmin accessible at http://localhost/phpmyadmin
- [ ] Database "interview_portal" created
- [ ] Backend .env updated with MySQL credentials
- [ ] Backend restarted with `npm run dev`
- [ ] Backend shows "Connected to MySQL database"
- [ ] Can register user in frontend
- [ ] User appears in phpMyAdmin

---

## 🎯 Final Status

When everything is correct, you should see:

```
✅ Frontend: http://localhost:3000 - Running
✅ Backend: http://localhost:5000 - Running (MySQL connected)
✅ MySQL: http://localhost/phpmyadmin - Accessible
✅ Database: interview_portal created with tables
✅ Data: Persistent in MySQL
```

---

## 📝 Quick Reference

```powershell
# Check MySQL running
netstat -ano | findstr :3306

# Start MySQL from command line
net start MySQL80

# Stop MySQL from command line
net stop MySQL80

# Restart backend
cd interview-portal-backend
npm run dev

# Access phpMyAdmin
http://localhost/phpmyadmin
```

---

**If still not working, try:**
1. Restart XAMPP entirely (stop all services, wait 10 seconds, start again)
2. Restart your computer
3. Reinstall XAMPP
4. Check antivirus/firewall not blocking MySQL
