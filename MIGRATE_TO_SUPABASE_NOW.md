# 🚀 Quick Migration Guide: MongoDB → Supabase

## Why Supabase?

✅ **100% Free Forever:**
- 500 MB database storage (plenty for your app)
- 2 GB bandwidth/month
- Unlimited API requests
- PostgreSQL (enterprise-grade SQL database)
- No connection issues like MongoDB

✅ **Better than MongoDB:**
- More stable connections
- Better performance
- SQL is easier to debug
- Automatic backups
- Built-in dashboard

---

## Step 1: Create Supabase Account (2 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"** (free)
3. Sign up with GitHub (fastest) or email
4. Click **"New Project"**
5. Fill in:
   - **Name**: `shopdaraz-hub` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

---

## Step 2: Get Database Connection String (1 minute)

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string**
3. Click **URI** tab
4. Copy the connection string
5. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
6. **Replace `[YOUR-PASSWORD]`** with the password you created in Step 1

---

## Step 3: Create Database Tables (2 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the entire content from `backend/database/supabase-schema.sql`
4. Click **"Run"** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

---

## Step 4: Update Backend Environment Variables (1 minute)

1. Open `backend/.env` file
2. Add these lines (replace with your actual values):

```env
# Supabase Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

**To find your keys:**
- Go to Supabase dashboard → **Settings** → **API**
- Copy **Project URL** (this is SUPABASE_URL)
- Copy **anon/public** key (this is SUPABASE_ANON_KEY)

---

## Step 5: Install PostgreSQL Dependencies (1 minute)

Open terminal in `backend` folder and run:

```bash
cd backend
npm install pg
npm uninstall mongoose
```

---

## Step 6: Update Backend Code

I'll create updated models and controllers for PostgreSQL. The migration script will handle this automatically.

---

## Step 7: Test Connection

Run your backend:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to Supabase PostgreSQL database
📋 Found X tables in database
```

---

## ✅ You're Done!

Your app is now using Supabase PostgreSQL instead of MongoDB!

**Benefits:**
- ✅ No more MongoDB connection errors
- ✅ Faster queries
- ✅ Free forever
- ✅ Better reliability

---

## Need Help?

If you encounter any issues, share the error message and I'll help you fix it!

