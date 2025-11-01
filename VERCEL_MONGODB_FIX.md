# 🚨 CRITICAL: Fix MongoDB Database Name in Vercel

## ❌ Current Problem

The error shows: `test.products` - this means MongoDB is connecting to the **"test"** database instead of your production database.

## ✅ Solution: Update MONGODB_URI in Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com
2. Select your project: **dropazia**
3. Go to **Settings** → **Environment Variables**

### Step 2: Update MONGODB_URI

**Current (WRONG):**
```
mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0
```

**Should be (CORRECT):**
```
mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority
```

**Changes:**
- Added `/shopdaraz` before the `?` (database name)
- Changed `?appName=Cluster0` to `?retryWrites=true&w=majority`

### Step 3: Redeploy
1. After updating the environment variable
2. Go to **Deployments** tab
3. Click **"..."** on the latest deployment
4. Click **"Redeploy"**

Or just wait - Vercel will auto-redeploy when it detects the env variable change.

## ✅ Code Fixes Applied

1. ✅ Added `app.set('trust proxy', true)` - Fixes rate limit warning
2. ✅ Removed deprecated MongoDB options (`useUnifiedTopology`, `useNewUrlParser`)
3. ✅ Using MongoDB aggregation with `allowDiskUse(true)` - Fixes 32MB sort error
4. ✅ Auto-create indexes on connection - Ensures indexes exist

## 🔍 Verify After Fix

1. Wait 2-3 minutes for Vercel to redeploy
2. Check Vercel logs - should see:
   - `📊 Database: shopdaraz` (NOT "test")
   - `✅ Product indexes verified/created`
3. Refresh `dropazia.online/admin` - products should load

---
**This is the MAIN fix - the database name issue is causing everything to fail!**

