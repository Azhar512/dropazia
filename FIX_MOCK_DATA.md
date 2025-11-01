# 🔧 Fix Mock Data Issue - Step by Step

## Problem
Mock users (Ali Haider, Sara Khan, Muhammad Ali) are showing in admin dashboard even though they shouldn't exist.

## Solution Steps

### Step 1: Clear Mock Users from Database
**Run this script to remove any mock users:**

```bash
# Windows
CLEAR_MOCK_DATA.bat

# Or manually
cd backend
node CLEAR_MOCK_USERS.js
```

This will:
- Find and delete users with emails: `abc12@gmail.com`, `sara@gmail.com`, `m.ali@gmail.com`
- Show current pending users in database
- Confirm cleanup

### Step 2: Hard Refresh Browser
**IMPORTANT:** The browser might be caching old data!

1. **Open Admin Dashboard**
2. **Press `Ctrl + Shift + R`** (Hard Refresh) OR
3. **Clear browser cache:**
   - Chrome: `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Clear last hour
4. **Close and reopen browser**

### Step 3: Check Browser Console
**Open DevTools (F12) → Console tab**

You should see logs like:
```
🔄 ==========================================
🔄 FETCHING USERS FROM DATABASE (REAL API CALL)
🔄 ==========================================
🔄 Time: 2025-01-24T...
🔄 API URL: https://dropazia.vercel.app/api/users?status=pending
📥 Pending users response: {...}
✅ API returned X pending users from DATABASE
```

**If you see:**
- ✅ `0 pending users` → **CORRECT** - Database is clean, no mock data
- ❌ Mock users still showing → Browser cache issue (do Step 2)
- ❌ API error → Backend issue (check Vercel deployment)

### Step 4: Verify Database State
**Check what's actually in database:**

```bash
cd backend
node src/check-database.js
```

This shows:
- Total users
- Pending users
- Approved users
- Sample user data

### Step 5: Test Registration
**Register a new test user:**

1. Open `dropazia.online` in **incognito window**
2. Register with new email (not used before)
3. Check admin dashboard (should appear in 30 seconds or click Refresh)

---

## Why Mock Data Might Still Show

### Reason 1: Browser Cache
**Solution:** Hard refresh (Ctrl+Shift+R) or clear cache

### Reason 2: Database Has Mock Users
**Solution:** Run `CLEAR_MOCK_DATA.bat`

### Reason 3: Old Frontend Code
**Solution:** Code is updated, just needs to be deployed

### Reason 4: API Returning Cached Data
**Solution:** New code clears cache before fetching

---

## Expected Behavior After Fix

1. **Admin Dashboard opens**
2. **Console shows:** "FETCHING USERS FROM DATABASE (REAL API CALL)"
3. **If no pending users:** Table shows "No pending users found"
4. **If pending users exist:** They appear with real data from database
5. **Auto-refreshes every 30 seconds** to show new registrations

---

## Still Seeing Mock Data?

**Check these:**

1. ✅ Did you run `CLEAR_MOCK_DATA.bat`?
2. ✅ Did you hard refresh browser (Ctrl+Shift+R)?
3. ✅ Did you check browser console for API logs?
4. ✅ Did you verify database with `check-database.js`?

**If all checked and still seeing mock data:**
- Take screenshot of browser console logs
- Check Network tab in DevTools → see what API returns
- Share the API response you see in Network tab

