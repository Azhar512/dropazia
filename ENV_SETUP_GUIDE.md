# Environment Setup Guide

## Backend Environment Variables

Create `backend/.env` file with the following variables:

```env
# Database Configuration (Supabase PostgreSQL)
# Get this from: Supabase Dashboard > Project Settings > Database > Connection Pooling
# IMPORTANT: Use the CONNECTION POOLING URL (not direct connection)
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS - Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://dropazia.online,https://www.dropazia.online
```

## Frontend Environment Variables

Create `.env` file in root directory:

```env
# Backend API URL
VITE_API_URL=https://dropazia.vercel.app
```

## Vercel Deployment Setup

1. Go to: Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add these variables:
   - `DATABASE_URL` = (Supabase connection pooler URL)
   - `JWT_SECRET` = (Strong random string, min 32 chars)
   - `ALLOWED_ORIGINS` = https://dropazia.online,https://www.dropazia.online
   - `NODE_ENV` = production

## Hostinger Deployment Setup

1. Set `VITE_API_URL` in `.env` file to your Vercel backend URL
2. Run: `npm run build`
3. Upload contents of `dist/` folder to Hostinger
4. Ensure `.htaccess` file is in the root of your Hostinger public_html folder

## Security Checklist

- ✓ Use Supabase connection **pooler** URL (contains "pooler.supabase.com")
- ✓ JWT_SECRET is at least 32 characters and random
- ✓ ALLOWED_ORIGINS includes all your frontend domains
- ✓ Never commit `.env` files to git
- ✓ Use strong passwords for database

