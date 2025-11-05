# 🚀 Database Migration: MongoDB → Supabase (PostgreSQL)

## Why Supabase?

✅ **100% Free Tier:**
- 500 MB database storage
- 2 GB bandwidth/month
- Unlimited API requests
- Built-in authentication (can use if needed)
- PostgreSQL database (enterprise-grade)

✅ **Benefits:**
- No connection issues
- Better performance
- SQL queries (easier to debug)
- Free forever tier
- Automatic backups

## Migration Steps

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project
4. Wait 2-3 minutes for setup

### Step 2: Get Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Step 3: Install Dependencies

```bash
cd backend
npm install pg @supabase/supabase-js
npm uninstall mongoose
```

### Step 4: Update Environment Variables

Add to `backend/.env`:
```
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Step 5: Create Database Tables

Run the SQL schema provided in the migration script.

## What Will Change

✅ **Backend:**
- Replace Mongoose with `pg` (PostgreSQL client)
- Update all models to SQL queries
- Update all controllers
- Connection will be more stable

✅ **Data Migration:**
- Export existing MongoDB data (if any)
- Import to Supabase (optional script provided)

✅ **No Frontend Changes Needed:**
- API endpoints stay the same
- Same functionality
- Better performance

---

**Ready to migrate?** Let me know and I'll create all the necessary files!

