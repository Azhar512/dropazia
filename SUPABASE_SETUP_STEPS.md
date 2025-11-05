# Supabase Setup Steps - What You Need to Do

## 🔑 What You Need (You Do This Yourself)

### Step 1: Create Supabase Account & Project

1. **Go to**: [https://supabase.com](https://supabase.com)
2. **Sign up** for a free account (or log in)
3. **Click "New Project"**
4. **Fill in**:
   - **Project Name**: e.g., "shopdaraz-hub"
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., "Southeast Asia (Singapore)")
   - Click **"Create new project"**

### Step 2: Get Your Connection String

Once your project is created:

1. Go to **Settings** → **Database** (left sidebar)
2. Scroll down to **"Connection string"** section
3. Click on **"URI"** tab (not "JDBC" or "Golang")
4. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### Step 3: Add to Your .env File

Add this to `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Replace**:
- `[YOUR-PASSWORD]` with the password you set in Step 1
- The rest of the URL should match what Supabase gave you

### Step 4: Run the Database Schema

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open the file: `backend/database/supabase-schema.sql`
4. **Copy the entire contents** and paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: ✅ "Success. No rows returned"

### Step 5: Install Dependencies

Open terminal in `backend` folder:

```bash
cd backend
npm install
```

This will install the `pg` package for PostgreSQL.

### Step 6: Test the Connection

Start your backend server:

```bash
npm start
```

You should see:
```
✅ Connected to Supabase PostgreSQL database
📊 Database time: [timestamp]
📋 Found [number] tables in database
```

## 🚫 What You DON'T Need to Share with Me

- ❌ Your database password
- ❌ Your full connection string
- ❌ Your Supabase project URL

## ✅ What You MIGHT Share (If Troubleshooting)

If you run into errors, you can share:

- ✅ Error messages (screenshot or copy text)
- ✅ What step you're on
- ✅ Console output (without sensitive info)
- ✅ Partial connection string (like `postgresql://postgres:***@db.xxxxx.supabase.co`)

## 📋 Quick Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied connection string
- [ ] Added `DATABASE_URL` to `backend/.env`
- [ ] Ran `supabase-schema.sql` in SQL Editor
- [ ] Installed dependencies (`npm install` in backend folder)
- [ ] Tested connection (`npm start`)

## 🎯 Example .env File

Your `backend/.env` should have:

```env
# Database
DATABASE_URL=postgresql://postgres:your-password-here@db.abcdefgh.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend (if needed)
FRONTEND_URL=http://localhost:8080
```

## ⚠️ Important Security Notes

1. **Never commit `.env` file** to Git (it should be in `.gitignore`)
2. **Never share your password** publicly
3. **Use different passwords** for development and production
4. **Keep your `.env` file secure** on your local machine

## 🆘 Common Issues

### "Database URL not configured"
- Make sure `DATABASE_URL` is in `backend/.env`
- Check there are no extra spaces or quotes

### "Connection timeout"
- Check your internet connection
- Verify the connection string is correct
- Check Supabase project is active (not paused)

### "Table doesn't exist"
- Make sure you ran `supabase-schema.sql` in SQL Editor
- Check for any errors when running the SQL

### "Authentication failed"
- Double-check your password in the connection string
- Make sure you're using the "URI" format, not "JDBC"

## 🎉 That's It!

Once you complete these steps, your application will be fully connected to Supabase!

