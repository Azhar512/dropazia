# 🔧 Fix Password Encoding in Connection String

## Issue

Your connection string has a password with `%40` which is URL-encoded `@`. If your password actually contains an `@` symbol, it needs to be properly encoded.

## Solution

### Option 1: If Your Password Contains @ Symbol

If your Supabase password actually has an `@` symbol, you need to URL-encode it:

**Special Characters to Encode:**
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `=` → `%3D`

**Example:**
If your password is `MyPass@123`, it should be:
```
postgresql://postgres.xxx:MyPass%40123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Option 2: If Your Password Doesn't Contain @ Symbol

If your password doesn't actually have an `@`, remove the `%40` encoding:

**Before:**
```
postgresql://postgres.xxx:Shaikhprince5588%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**After (if password is `Shaikhprince5588@`):**
```
postgresql://postgres.xxx:Shaikhprince5588%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**After (if password is `Shaikhprince5588` without @):**
```
postgresql://postgres.xxx:Shaikhprince5588@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## Quick Fix

1. **Check your actual password in Supabase**:
   - Go to Supabase Dashboard
   - Settings → Database
   - Check what your database password actually is

2. **Update backend/.env**:
   - If password has `@`, keep `%40`
   - If password doesn't have `@`, remove `%40` and use the actual password

3. **Test**:
   ```bash
   cd backend
   npm run check-db
   ```

## Alternative: Use Connection String Directly from Supabase

The easiest way is to copy the connection string directly from Supabase dashboard:

1. Go to **Settings → Database → Connection string**
2. Select **Connection pooling**
3. Copy the entire string
4. Paste it into `backend/.env` as `DATABASE_URL=...`

This ensures proper encoding automatically.

