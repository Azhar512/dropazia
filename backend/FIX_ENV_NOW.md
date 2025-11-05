# 🚨 URGENT: Fix Your .env File NOW

## The Problem

Your `.env` file still has the **OLD/WRONG** connection string:
```
db.jrajzvmcaaqqmezymyix.supabase.co:5432
```

This is causing DNS errors because it's not IPv4 compatible.

## ✅ The Fix

### Step 1: Open `backend/.env` file

### Step 2: Find the line that starts with `DATABASE_URL=`

### Step 3: REPLACE the entire line with this:

```env
DATABASE_URL=postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 4: Make Sure:

- ✅ Line starts with `DATABASE_URL=`
- ✅ No spaces around the `=`
- ✅ Entire string on ONE line (no line breaks)
- ✅ Starts with `postgresql://` (not `postgresal://`)
- ✅ Has `pooler.supabase.com` (not `db.xxx.supabase.co`)
- ✅ Port is `6543` (not `5432`)
- ✅ Password `@` is encoded as `%40`

### Step 5: Save the file (Ctrl+S)

### Step 6: Close and reopen your terminal/VS Code

**Important**: Environment variables are loaded when the terminal starts. You MUST restart the terminal after changing `.env`!

### Step 7: Test again

```bash
cd backend
npm run check-db
```

## 🔍 How to Verify It's Fixed

After updating, the output should show:
```
Connecting to: aws-1-ap-southeast-1.pooler.supabase.com:6543
✅ Connected to Supabase PostgreSQL database
```

**NOT:**
```
❌ Connecting to: db.jrajzvmcaaqqmezymyix.supabase.co:5432
```

## 💡 Still Not Working?

1. **Check for multiple .env files**: Make sure you're editing `backend/.env`, not `.env` in root
2. **Check for typos**: Copy the connection string exactly as shown
3. **Restart terminal**: Close VS Code terminal completely and open a new one
4. **Check file encoding**: Make sure `.env` is saved as UTF-8

---

**The connection string MUST be on one line with no breaks!**

