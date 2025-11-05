# Super Admin Setup Guide

## Overview

This project now includes a **Super Admin** system with the following features:

- **Only ONE super admin** can exist in the database (enforced by database trigger)
- Super admin can **create, update, and delete regular admins**
- Super admin has **full access** to all admin features
- Super admin has a **separate dashboard** with statistics and admin management
- All operations are **real-time** with the database

## Database Setup

### Step 1: Run Database Migration

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Open the file: `backend/database/add-super-admin.sql`
3. Copy and paste the SQL into the SQL Editor
4. Click **Run** to execute

This will:
- Update the `users` table to support `super_admin` role
- Add a database trigger to ensure only ONE super admin exists
- Add indexes for better performance

### Step 2: Create Super Admin User

Run the following command in your terminal:

```bash
cd backend
npm run fix-super-admin
```

This will create a super admin user with:
- **Email**: `superadmin@dropazia.com`
- **Password**: `superadmin123`
- **Role**: `super_admin`

**Important**: Change the password after first login!

## Frontend Access

### Super Admin Dashboard

1. Navigate to: `/admin-login`
2. Login with super admin credentials:
   - Email: `superadmin@dropazia.com`
   - Password: `superadmin123`
3. You will be automatically redirected to `/super-admin`

### Super Admin Features

The Super Admin Dashboard includes:

1. **Statistics Overview**:
   - Total Users
   - Total Admins
   - Total Orders
   - Total Products
   - Orders by Status
   - Orders by Module

2. **Admin Management**:
   - View all admins (including super admin)
   - Create new admins
   - Edit admin details
   - Deactivate admins
   - Update admin status

3. **Real-time Updates**:
   - All data is fetched from the database in real-time
   - Changes are immediately reflected
   - Refresh button to reload data

## API Endpoints

All super admin endpoints require authentication and super admin role:

- `GET /api/super-admin/dashboard/stats` - Get dashboard statistics
- `GET /api/super-admin/admins` - Get all admins
- `POST /api/super-admin/admins` - Create new admin
- `PUT /api/super-admin/admins/:id` - Update admin
- `DELETE /api/super-admin/admins/:id` - Delete/deactivate admin

## Security Features

1. **Single Super Admin**: Database trigger prevents more than one super admin
2. **Role-based Access**: Middleware checks for `super_admin` role
3. **Protected Routes**: Frontend routes are protected with `requireSuperAdmin`
4. **Cannot Modify Super Admin**: Regular admins cannot modify super admin account

## Regular Admin vs Super Admin

### Regular Admin (`admin` role):
- Can manage products
- Can manage orders
- Can manage users (buyers/sellers)
- Cannot create other admins
- Cannot access super admin dashboard

### Super Admin (`super_admin` role):
- Can do everything regular admin can do
- Can create, update, and delete regular admins
- Has access to super admin dashboard
- Can see all system statistics
- Only one super admin exists

## Troubleshooting

### Super Admin Not Created

If the super admin creation fails:

1. Check database connection in `backend/.env`
2. Verify `DATABASE_URL` is correct
3. Run the migration SQL manually in Supabase
4. Try running `npm run fix-super-admin` again

### Cannot Access Super Admin Dashboard

1. Verify you're logged in as super admin
2. Check browser console for errors
3. Verify backend is running
4. Check that the route `/super-admin` is accessible

### Database Trigger Error

If you see "Only one super admin is allowed":

1. Check existing super admins in database
2. Update existing super admin instead of creating new one
3. Use `npm run fix-super-admin` to update existing super admin

## Next Steps

1. **Change Default Password**: Update super admin password after first login
2. **Create Regular Admins**: Use the super admin dashboard to create regular admins
3. **Set Up Permissions**: Configure what each admin can access (future feature)

---

**Note**: The super admin account is the most powerful account in the system. Keep credentials secure!

