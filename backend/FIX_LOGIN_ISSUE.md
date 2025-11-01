# 🔧 Fix Admin Login Issue - Complete Guide

## Problem
Getting "401 Unauthorized" / "Invalid email or password" when trying to login as admin.

## Solution: Run Diagnostic & Fix Tool

I've created a comprehensive diagnostic tool that will:
1. ✅ Test database connection
2. ✅ Check if admin user exists
3. ✅ Verify/fix password hash
4. ✅ Ensure user is active and approved
5. ✅ Create admin if missing

### Quick Fix:

```bash
cd backend
npm run diagnose
```

**Or directly:**
```bash
cd backend
node src/diagnose-and-fix.js
```

**Or double-click:** `backend/run-setup.bat` (updated to use diagnose script)

## What the Script Does

### Step 1: Database Connection
- Tests MongoDB connection
- Verifies correct database name (not "test")
- Confirms connection is working

### Step 2: User Check
- Checks if admin user exists
- Shows current admin user details
- Tests if password "admin123" works

### Step 3: Auto-Fix
- If admin missing → Creates admin user
- If password wrong → Resets password to "admin123"
- Ensures user is `active` and `approved`

### Step 4: Verification
- Final verification that everything works
- Confirms password is correct

## After Running the Script

You should see:
```
✅ DIAGNOSTIC COMPLETE - ALL ISSUES FIXED!
📋 Admin Login Credentials:
   Email: admin@shopdaraz.com
   Password: admin123
🎉 You can now login to the admin dashboard!
```

Then try logging in again at: `https://dropazia.online/admin-login`

## Possible Causes

1. **Admin user doesn't exist** → Script creates it
2. **Password hash corrupted** → Script resets it
3. **User not active** → Script activates it
4. **Wrong database** → Script detects and warns

## If Still Not Working

1. Check Vercel logs for errors
2. Verify MONGODB_URI in Vercel has database name: `/shopdaraz?`
3. Make sure backend is deployed to Vercel
4. Wait 2-3 minutes after running script for changes to propagate

---

**Run `npm run diagnose` and everything should be fixed!** 🎉

