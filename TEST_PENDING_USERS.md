# 🧪 Test Pending Users - Step by Step

## Quick Test Steps

### Step 1: Register a New Test User
1. Open `dropazia.online` in **incognito/private window**
2. Go to registration page
3. Fill form with:
   - Name: Test User
   - Email: **test123@example.com** (use a unique email)
   - Phone: 03214444444
   - Password: **testpass123** (8+ chars with number)
   - Account Type: Buyer
   - Module: Daraz
4. Click "Create Account"
5. Should see success message with admin approval notice

### Step 2: Check Admin Dashboard
1. **Open normal window** (not incognito)
2. Login as admin: `admin@shopdaraz.com` / `admin123`
3. Go to Admin Dashboard
4. **Open browser console (F12)**
5. Look for these logs:
   ```
   🔄 Fetching pending users from API...
   📥 Pending users response: {...}
   ✅ Found X pending users
   ```
6. Go to **"Pending Approvals" tab**
7. Should see the new test user

### Step 3: If Users Don't Appear

**Check Browser Console:**
- Look for errors (red messages)
- Check if API call succeeded
- Look for response structure

**Check Network Tab:**
1. Open DevTools → Network tab
2. Filter by "users"
3. Look for request to `/api/users?status=pending`
4. Check:
   - Status code (should be 200)
   - Response body (should have `success: true, data: [...]`)
   - If 401/403 → Auth issue
   - If 404 → Route not found (backend not deployed)

**Test Backend Directly:**
```bash
cd backend
npm run test-users
```
This shows all users in database with their status.

### Step 4: Common Issues & Fixes

**Issue: 401/403 Error**
- **Fix:** Make sure you're logged in as admin
- **Fix:** Token might be expired - logout and login again

**Issue: 404 Error**
- **Fix:** Backend not deployed - push changes to GitHub
- **Fix:** Wait 2-3 minutes for Vercel deployment

**Issue: Empty Array Response**
- **Fix:** No pending users exist - register a new test user
- **Fix:** Users might have different status - check with `npm run test-users`

**Issue: API Returns Success But No Users**
- **Fix:** Check database - users might be approved already
- **Fix:** Users might have wrong status - check in MongoDB Atlas

---

**After testing, the console logs will show exactly what's happening!**

