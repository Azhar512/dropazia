# 🔧 Step-by-Step Fix for .env File

## The Problem

Your `.env` file still has the **OLD connection string** that doesn't work. The error shows it's trying to connect to:
```
db.jrajzvmcaaqqmezymyix.supabase.co:5432  ❌ WRONG
```

But it needs:
```
aws-1-ap-southeast-1.pooler.supabase.com:6543  ✅ CORRECT
```

## ✅ Step-by-Step Fix

### Step 1: Open `backend/.env` file

Make sure you're editing the file at:
```
C:\Users\speed\Desktop\shopdaraz-hub-main\backend\.env
```

### Step 2: Find the DATABASE_URL line

Look for a line that starts with:
```
DATABASE_URL=
```

### Step 3: DELETE the entire line

Select the whole line and delete it completely.

### Step 4: Type this EXACTLY (all on one line):

```
DATABASE_URL=postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important:**
- Copy the ENTIRE line above
- Paste it into your .env file
- Make sure it's on ONE line (no line breaks)
- No spaces before or after the `=`
- Save the file (Ctrl+S)

### Step 5: Verify it's correct

After saving, your `.env` file should have a line that looks like:
```
DATABASE_URL=postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Check:**
- ✅ Starts with `DATABASE_URL=`
- ✅ Has `pooler.supabase.com` (NOT `db.xxx.supabase.co`)
- ✅ Has `:6543` (NOT `:5432`)
- ✅ Entire string on one line

### Step 6: Close and reopen VS Code terminal

1. Click the trash icon on the terminal tab to close it
2. Open new terminal: Press `` Ctrl+` ``
3. Run:
   ```bash
   cd backend
   npm run check-db
   ```

### Step 7: Expected Output

You should see:
```
✅ Connecting to: aws-1-ap-southeast-1.pooler.supabase.com:6543
✅ Connected to Supabase PostgreSQL database
```

**NOT:**
```
❌ Connecting to: db.jrajzvmcaaqqmezymyix.supabase.co:5432
```

## 🚨 Still Not Working?

If you still see the old connection string:

1. **Check for multiple .env files**: Make sure you're editing `backend/.env`, not root `.env`
2. **Check for hidden characters**: Delete the line and type it fresh
3. **Check file encoding**: Make sure it's saved as UTF-8
4. **Restart VS Code completely**: Close and reopen VS Code

## 📝 Quick Copy-Paste

Here's the exact line to paste (select all and copy):

```
DATABASE_URL=postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

**The key is: Use `pooler.supabase.com` and port `6543`, NOT `db.xxx.supabase.co` and port `5432`!**

