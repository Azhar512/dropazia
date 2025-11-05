# 🔧 Fix Your Supabase Connection String

## ⚠️ Current Issue

Your `DATABASE_URL` appears to be using an incorrect format:
```
postgresql://***:***@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

The hostname `db.jrajzvmcaaqqmezymyix.supabase.co` is causing DNS resolution errors.

## ✅ Correct Supabase Connection String Format

Supabase uses **two different connection formats**:

### Option 1: Connection Pooling (Recommended for Production)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Example:**
```
postgresql://postgres.abcdefghijklmnop:mypassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Option 2: Direct Connection (Session Mode)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

## 🔍 How to Get the Correct Connection String

### Step 1: Go to Supabase Dashboard
1. Visit: https://app.supabase.com
2. Select your project

### Step 2: Get Connection String
1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **Connection pooling** tab
4. Copy the connection string

**OR**

1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **Session mode** tab
4. Copy the connection string

### Step 3: Update backend/.env

Replace your current `DATABASE_URL` with the one from Supabase dashboard.

**Important:**
- Use **Connection pooling** (port 6543) for better performance
- Make sure the format starts with `postgresql://`
- The hostname should be `aws-0-[REGION].pooler.supabase.com` (not `db.xxx.supabase.co`)

## 📝 Example Correct Format

```env
# Connection Pooling (Recommended)
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:YourPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# OR Session Mode
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:YourPassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## 🔍 What to Look For

Your connection string should have:
- ✅ `postgresql://` at the start
- ✅ `postgres.[PROJECT-REF]` as username (not just `postgres`)
- ✅ `aws-0-[REGION].pooler.supabase.com` as hostname
- ✅ Port `6543` (pooling) or `5432` (session)
- ✅ `/postgres` at the end

## ❌ What NOT to Use

- ❌ `db.xxx.supabase.co` hostname (this is incorrect format)
- ❌ Missing project reference in username
- ❌ Wrong port number

## 🧪 Test After Fixing

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

## 💡 Still Having Issues?

1. **Double-check in Supabase Dashboard**: Copy the connection string directly from Settings → Database
2. **Try Connection Pooling**: Use port 6543 instead of 5432
3. **Check Password**: Make sure password doesn't have unencoded special characters
4. **Verify Project Status**: Make sure your Supabase project is active

---

**The key issue**: Your current connection string uses `db.xxx.supabase.co` but Supabase uses `aws-0-[REGION].pooler.supabase.com` format.

