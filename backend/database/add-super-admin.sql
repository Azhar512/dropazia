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

