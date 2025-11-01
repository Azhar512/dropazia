# 🚨 URGENT FIX - Do This Right Now!

## The Problem
Admin login not working - getting 401 Unauthorized error.

## The Solution (3 Easy Steps)

### Step 1: Run the Fix Script

**Option A: Double-click (EASIEST)**
1. Go to `backend` folder
2. **Double-click `QUICK_FIX.bat`**
3. Wait for it to finish

**Option B: Command Line**
```bash
cd backend
node src/diagnose-and-fix.js
```

**Option C: Emergency Fix (if Option A/B fails)**
```bash
cd backend
node src/emergency-admin-fix.js
```

### Step 2: Wait for Completion

You should see:
```
✅ DIAGNOSTIC COMPLETE - ALL ISSUES FIXED!
📋 Admin Login Credentials:
   Email: admin@shopdaraz.com
   Password: admin123
```

### Step 3: Login

1. Go to: `https://dropazia.online/admin-login`
2. Email: `admin@shopdaraz.com`
3. Password: `admin123`
4. Click "Access Admin Dashboard"

## What Gets Fixed

✅ **Database Connection** - Verified working
✅ **Admin User** - Created if missing
✅ **Password Hash** - Fixed if corrupted
✅ **User Status** - Set to approved & active
✅ **Login Credentials** - Verified working

## If Still Not Working After Running Script

1. **Check Vercel Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Verify `MONGODB_URI` ends with `/shopdaraz?retryWrites=true&w=majority`
   - NOT `/test` or `/?appName=Cluster0`

2. **Wait 2-3 minutes** after running script for database changes to sync

3. **Clear browser cache** and try again

4. **Check Vercel logs** for any backend errors

---

**DO THIS NOW:** Double-click `backend/QUICK_FIX.bat` and wait for it to finish!

