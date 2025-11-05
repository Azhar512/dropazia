# 🔐 Environment Variables Setup Guide

This document explains all required environment variables for ShopDaraz Hub.

## 📋 Required Environment Variables

### Backend (.env file in `backend/` directory)

```env
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database
# OR
SUPABASE_DATABASE_URL=postgresql://user:password@host:port/database

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Server Configuration
NODE_ENV=production
PORT=5000

# CORS Configuration (for production)
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env file in root directory)

```env
# API Base URL
VITE_API_URL=https://your-backend-api.com
# For local development:
# VITE_API_URL=http://localhost:5000
```

## 🔑 How to Get These Values

### 1. Supabase Database URL

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Find **Connection string** section
4. Copy the **Connection pooling** URL (recommended) or **Session mode** URL
5. Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

**Example:**
```
postgresql://postgres.abcdefghijklmnop:yourpassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 2. JWT Secret

Generate a secure random string (minimum 32 characters):

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
- Use a secure random string generator
- Minimum 32 characters recommended
- Keep it secret and never commit to git

### 3. Frontend URL

- **Development**: `http://localhost:3000` (or your dev port)
- **Production**: Your actual domain(s), comma-separated if multiple
  - Example: `https://dropazia.online,https://www.dropazia.online`

## 📁 File Locations

### Backend Environment
Create/update: `backend/.env`

```env
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-generated-jwt-secret
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

### Frontend Environment
Create/update: `.env` (in project root)

```env
VITE_API_URL=https://your-backend-api.com
```

## ✅ Verification

### Check Backend Connection
```bash
cd backend
npm run check-db
```

### Check Admin User
```bash
cd backend
npm run create-admin
```

## 🔒 Security Best Practices

1. **Never commit `.env` files to git**
   - Add `.env` to `.gitignore`
   - Use `.env.example` as template

2. **Use strong JWT secrets**
   - Minimum 32 characters
   - Use cryptographically secure random strings
   - Different secrets for dev/production

3. **Protect database credentials**
   - Use connection pooling when available
   - Rotate passwords regularly
   - Use Supabase connection pooler for production

4. **Environment separation**
   - Different values for development and production
   - Never use production credentials in development

## 🚨 Common Issues

### Issue: "Database URL not configured"
**Solution**: Make sure `DATABASE_URL` or `SUPABASE_DATABASE_URL` is set in `backend/.env`

### Issue: "JWT_SECRET not configured"
**Solution**: Generate a JWT secret and add it to `backend/.env`

### Issue: "CORS errors"
**Solution**: Add your frontend URL to `FRONTEND_URL` in `backend/.env`

### Issue: "Connection refused"
**Solution**: 
- Check your Supabase database is running
- Verify connection string is correct
- Check network/firewall settings

## 📝 Example .env Files

### backend/.env.example
```env
# Database
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
NODE_ENV=production
PORT=5000

# CORS
FRONTEND_URL=https://yourdomain.com
```

### .env.example (root)
```env
# API URL
VITE_API_URL=https://your-backend-api.com
```

---

**Last Updated**: 2024
**Database**: Supabase PostgreSQL

