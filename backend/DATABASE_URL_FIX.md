# 🔧 Database Connection String Fix

## Error You're Seeing

```
❌ Supabase connection error: getaddrinfo ENOTFOUND db.jrajzvmcaaqqmezymyix.supabase.co
```

This error means the connection string is malformed or incorrect.

## ✅ How to Fix

### Step 1: Get Your Supabase Connection String

1. Go to your Supabase project: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string**
5. Select **Connection pooling** (recommended) or **Session mode**
6. Copy the connection string

### Step 2: Format Your Connection String

The connection string should look like this:

**Connection Pooling (Recommended):**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Session Mode:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### Step 3: Update backend/.env

Create or edit `backend/.env` file:

```env
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Important:**
- Replace `YOUR_PROJECT_REF` with your actual project reference
- Replace `YOUR_PASSWORD` with your actual database password
- Use the **Connection pooling** URL (port 6543) for better performance
- Keep the entire string on one line (no line breaks)

### Step 4: Verify Format

Your connection string should:
- ✅ Start with `postgresql://` or `postgres://`
- ✅ Include username: `postgres.[PROJECT-REF]`
- ✅ Include password (after `:`)
- ✅ Include host: `@aws-0-[REGION].pooler.supabase.com`
- ✅ Include port: `:6543` (pooling) or `:5432` (session)
- ✅ Include database: `/postgres`

### Step 5: Test Connection

```bash
cd backend
npm run check-db
```

You should see:
```
✅ Connected to Supabase PostgreSQL database
📊 Database time: [timestamp]
📋 Found X tables in database
```

## 🚨 Common Issues

### Issue 1: Missing .env File
**Solution**: Create `backend/.env` file with `DATABASE_URL=...`

### Issue 2: Wrong Format
**Error**: `Invalid DATABASE_URL format`
**Solution**: Make sure it starts with `postgresql://`

### Issue 3: Password Has Special Characters
**Solution**: URL-encode special characters in password:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

### Issue 4: Wrong Hostname
**Error**: `getaddrinfo ENOTFOUND`
**Solution**: 
- Use the connection pooling URL (port 6543)
- Make sure you're using the correct region
- Check if the hostname is correct in Supabase dashboard

## 📝 Example .env File

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:YourPassword123!@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Server
NODE_ENV=production
PORT=5000

# CORS
FRONTEND_URL=http://localhost:3000
```

## 🔍 Verify Your Connection String

1. Check if it starts with `postgresql://`
2. Check if hostname is correct (should contain `pooler.supabase.com`)
3. Check if port is correct (6543 for pooling, 5432 for session)
4. Check if password is correct (no extra spaces or quotes)

## 💡 Still Not Working?

1. **Check Supabase Dashboard**: Make sure your project is active
2. **Check Network**: Make sure you can reach Supabase servers
3. **Try Session Mode**: Use port 5432 instead of 6543
4. **Check Firewall**: Make sure port 6543/5432 is not blocked

---

**Last Updated**: 2024

