# Fix Connection Error: ENOTFOUND

## ❌ Error You're Seeing
```
ENOTFOUND db.jrajzvmcaaqqmezymyix.supabase.co
```

This means the hostname cannot be resolved (DNS issue).

## ✅ Solutions

### Solution 1: Verify Connection String Format

The connection string format should be:
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Check in Supabase:**
1. Go to **Settings** → **Database**
2. Scroll down to **"Connection string"** section
3. Make sure you're using the **"URI"** tab (not JDBC or others)
4. Copy the exact connection string

### Solution 2: Try Alternative Connection Format

Sometimes Supabase uses a different host format. Try these alternatives:

**Option A - Direct connection:**
```
postgresql://postgres:PASSWORD@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

**Option B - Pooler connection (if available):**
```
postgresql://postgres.jrajzvmcaaqqmezymyix:PASSWORD@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Solution 3: Check Project Status

1. Make sure your Supabase project is **active** (not paused)
2. Check if the project is fully provisioned
3. Wait a few minutes if the project was just created

### Solution 4: Verify Password Encoding

Your password contains `@` which needs to be URL-encoded as `%40`.

Current format: `Shaikhprince5588%40` ✅ (This is correct)

### Solution 5: Test Connection Manually

Try connecting using a PostgreSQL client like `psql` or pgAdmin to verify the connection string works.

## 🔧 Quick Fix Steps

1. **Double-check your connection string** in Supabase Settings → Database → Connection string (URI tab)
2. **Verify the password** is correct (the one you set when creating the project)
3. **Make sure `@` is encoded as `%40`** in the connection string
4. **Update your `.env` file** with the exact connection string from Supabase

## 📝 Current Connection String (Verify It)

Your current connection string should be:
```
DATABASE_URL=postgresql://postgres:Shaikhprince5588%40@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

If this doesn't work, get the EXACT connection string from Supabase dashboard and replace it.

