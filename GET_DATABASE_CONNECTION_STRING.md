# How to Get Your Database Connection String

## ⚠️ What You're Showing vs What We Need

You're currently looking at the **"Project API"** section, which shows:
- Project URL (for REST API): `https://jrajzvmcaaqqmezymyix.supabase.co`
- API Key (anon public): For using Supabase client libraries

**But we need the DATABASE connection string instead!** This is different.

## 🔍 How to Find Your Database Connection String

### Step 1: Go to Settings
1. In your Supabase dashboard, look at the **left sidebar**
2. Scroll down and click **"Settings"** (gear icon)
3. Click **"Database"** (under Settings)

### Step 2: Find Connection String
1. Scroll down to **"Connection string"** section
2. You'll see tabs: **"URI"**, "JDBC", "Golang", etc.
3. Click the **"URI"** tab
4. You'll see a connection string like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
   ```
   
   **Note**: It will have `[YOUR-PASSWORD]` placeholder - you need to replace this with the actual password you set when creating the project.

### Step 3: Copy the Connection String
1. Click the **"Copy"** button or select and copy the entire string
2. Replace `[YOUR-PASSWORD]` with your actual database password
3. It should look like:
   ```
   postgresql://postgres:your-actual-password-here@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
   ```

### Step 4: Add to Your .env File
Open `backend/.env` and add:

```env
DATABASE_URL=postgresql://postgres:your-actual-password-here@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

## 📝 Quick Navigation Path

**Dashboard → Settings → Database → Connection string → URI tab**

## 🔑 Don't Forget!

- The connection string uses `db.` prefix (not just the project URL)
- It includes `:5432` (PostgreSQL port)
- Replace `[YOUR-PASSWORD]` with your actual password
- The format is: `postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres`

## 🎯 What We Need From You

The connection string format:
```
postgresql://postgres:[PASSWORD]@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

Once you have this, add it to `backend/.env` as `DATABASE_URL`.

