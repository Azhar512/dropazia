# 🚨 URGENT: Setup Super Admin - Step by Step

## The Problem

The database constraint doesn't allow `super_admin` role yet. You need to run the SQL migration first.

## Step 1: Run Database Migration in Supabase

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**
3. **Click**: SQL Editor (left sidebar)
4. **Click**: New Query
5. **Copy and paste** the entire SQL from `backend/database/add-super-admin.sql`:

```sql
-- Add Super Admin Support to Database
-- Run this SQL in Supabase SQL Editor

-- Update users table to support 'super_admin' role
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('buyer', 'seller', 'admin', 'super_admin'));

-- Add constraint to ensure only ONE super admin exists
CREATE OR REPLACE FUNCTION check_single_super_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'super_admin' THEN
    IF (SELECT COUNT(*) FROM users WHERE role = 'super_admin' AND id != NEW.id) > 0 THEN
      RAISE EXCEPTION 'Only one super admin is allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS enforce_single_super_admin ON users;

-- Create trigger to enforce single super admin
CREATE TRIGGER enforce_single_super_admin
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION check_single_super_admin();

-- Add index for super admin queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

6. **Click**: Run (or press Ctrl+Enter)
7. **Wait for**: ✅ Success message

## Step 2: Create Super Admin User

After the migration is successful, run:

```bash
cd backend
npm run fix-super-admin
```

This will create:
- **Email**: `superadmin@dropazia.com`
- **Password**: `superadmin123`

## Step 3: Test Login

1. Go to your app
2. Type **"aneeq"** on the landing page
3. Click the **Super Admin Dashboard** card
4. Login with:
   - Email: `superadmin@dropazia.com`
   - Password: `superadmin123`

## ✅ What the Migration Does

1. ✅ Updates `users` table to allow `super_admin` role
2. ✅ Adds database trigger to ensure only ONE super admin exists
3. ✅ Creates index for better performance

## 🚨 Important Notes

- **Only ONE super admin** can exist (enforced by database)
- **Cannot delete** super admin once created
- **Change password** after first login for security

---

**After running the SQL migration, run `npm run fix-super-admin` again!**

