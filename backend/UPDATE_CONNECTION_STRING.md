# 🔧 URGENT: Update Your Connection String

## ⚠️ Current Problem

Your connection string is using the **OLD/WRONG format**:
```
db.jrajzvmcaaqqmezymyix.supabase.co:5432
```

This format **doesn't work** anymore. Supabase requires:
```
aws-0-[REGION].pooler.supabase.com:6543
```

## ✅ Step-by-Step Fix

### Step 1: Get Correct Connection String from Supabase

1. **Go to**: https://app.supabase.com
2. **Select your project**
3. **Click**: Settings (gear icon) → **Database**
4. **Scroll down** to **Connection string** section
5. **Click** the **"Connection pooling"** tab
6. **Copy** the entire connection string

### Step 2: Update backend/.env

1. Open `backend/.env` file
2. Find the line with `DATABASE_URL=`
3. **Replace** the entire value with the connection string you copied from Supabase

**It should look like this:**
```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Important:**
- ✅ Must have `aws-0-[REGION].pooler.supabase.com`
- ✅ Must use port `6543` (connection pooling)
- ✅ Must start with `postgresql://`

### Step 3: Test Connection

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

## 🚨 What NOT to Use

❌ **WRONG**: `db.jrajzvmcaaqqmezymyix.supabase.co`  
❌ **WRONG**: Port `5432` (use `6543` for pooling)  
❌ **WRONG**: Missing `pooler` in hostname  

✅ **CORRECT**: `aws-0-ap-southeast-1.pooler.supabase.com`  
✅ **CORRECT**: Port `6543`  
✅ **CORRECT**: Full connection string from Supabase dashboard  

## 💡 Quick Reference

**Your connection string MUST have:**
- Hostname: `aws-0-ap-southeast-1.pooler.supabase.com` (or your region)
- Port: `6543` (connection pooling)
- Username: `postgres.[PROJECT-REF]` (includes project reference)
- Database: `/postgres` at the end

**Get it directly from Supabase dashboard** - don't try to construct it manually!

---

**After updating, run `npm run check-db` again to verify.**

