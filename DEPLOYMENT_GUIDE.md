# 🚀 Complete Deployment Guide

## Overview
This guide covers deploying ShopDaraz Hub with:
- **Backend**: Vercel (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Hostinger (Static Hosting)

---

## ✅ Pre-Deployment Checklist

### 1. Database Setup (Supabase)

1. Create a Supabase project at https://supabase.com
2. Run the database schema:
   - Go to SQL Editor in Supabase Dashboard
   - Execute `backend/database/supabase-schema.sql`
   - Execute `backend/database/add-wallet-migration.sql` (for wallet feature)
   - Execute `backend/database/add-super-admin.sql` (optional)

3. **Get Connection Pooler URL** (Critical!):
   - Go to: Project Settings > Database > Connection Pooling
   - Mode: **Transaction** (recommended for serverless)
   - Copy the connection string with `pooler.supabase.com`
   - Format: `postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

---

## 📦 Backend Deployment (Vercel)

### Step 1: Prepare Backend

1. Ensure `backend/src/server.js` is properly configured
2. Verify `vercel.json` exists in root directory

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI
```bash
cd /path/to/project
npm install -g vercel
vercel login
vercel
```

#### Option B: GitHub Integration
1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Vercel will auto-deploy on git push

### Step 3: Configure Environment Variables in Vercel

Go to: Vercel Dashboard > Your Project > Settings > Environment Variables

Add these variables:

```env
DATABASE_URL = postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres

JWT_SECRET = [Generate a 32+ character random string]

ALLOWED_ORIGINS = https://dropazia.online,https://www.dropazia.online

NODE_ENV = production
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Create Admin User

After deployment, create admin user:

1. Go to Vercel Functions log
2. Or use Supabase SQL Editor:

```sql
INSERT INTO users (name, email, password_hash, role, status, is_active)
VALUES (
  'Admin User',
  'admin@dropazia.com',
  '$2a$10$YourBcryptHashHere',  -- Generate using bcrypt
  'admin',
  'approved',
  true
);
```

Generate password hash:
```bash
cd backend
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword123', 10));"
```

### Step 5: Verify Backend

Test your backend:
```bash
curl https://your-backend.vercel.app/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

---

## 🌐 Frontend Deployment (Hostinger)

### Step 1: Configure Environment

Create `.env` file in project root:

```env
VITE_API_URL=https://your-backend.vercel.app
```

Replace `your-backend.vercel.app` with your actual Vercel backend URL.

### Step 2: Build Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with the production build.

### Step 3: Upload to Hostinger

1. **Login to Hostinger**:
   - Go to hPanel > File Manager
   - Navigate to `public_html/` (or your domain folder)

2. **Delete existing files** (if any):
   - Select all files in `public_html/`
   - Delete

3. **Upload build files**:
   - Upload ALL contents of `dist/` folder
   - Include the `.htaccess` file (important!)
   - Upload `public/.htaccess` to root if not included

4. **Verify .htaccess exists**:
   - The `.htaccess` file enables SPA routing
   - Should be in the root of public_html
   - If missing, create it with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Step 4: Configure Domain (if needed)

If using custom domain:
1. Update DNS settings in domain registrar
2. Point A record to Hostinger server IP
3. Wait for DNS propagation (up to 48 hours)

### Step 5: Update CORS in Backend

After frontend is live, update `ALLOWED_ORIGINS` in Vercel:

```env
ALLOWED_ORIGINS = https://yourdomain.com,https://www.yourdomain.com
```

---

## 🧪 Testing Deployment

### Test Backend
```bash
# Health check
curl https://your-backend.vercel.app/health

# Test product endpoint
curl https://your-backend.vercel.app/api/products
```

### Test Frontend
1. Visit your Hostinger domain
2. Check browser console for errors
3. Try logging in
4. Try adding products to cart
5. Test navigation (refresh on any route should work)

### Common Issues

**Issue**: Frontend shows "Network error"
- **Fix**: Check `VITE_API_URL` in build
- **Verify**: Inspect `dist/assets/*.js` files, search for API URL

**Issue**: CORS errors in browser console
- **Fix**: Add frontend domain to `ALLOWED_ORIGINS` in Vercel
- **Redeploy** Vercel after changing env vars

**Issue**: 404 errors on page refresh
- **Fix**: Ensure `.htaccess` file exists in Hostinger public_html
- **Check**: Apache mod_rewrite is enabled

**Issue**: "Database connection failed"
- **Fix**: Use connection pooler URL, not direct connection
- **Verify**: URL contains `pooler.supabase.com`

---

## 🔐 Security Checklist

After deployment:

- [ ] Change default admin password
- [ ] JWT_SECRET is 32+ characters and random
- [ ] DATABASE_URL uses connection pooler
- [ ] ALLOWED_ORIGINS includes only your domains
- [ ] .env files are not committed to git
- [ ] Supabase RLS (Row Level Security) enabled (optional)
- [ ] API rate limiting is active
- [ ] HTTPS is enforced (both Vercel and Hostinger)

---

## 📊 Monitoring

### Vercel
- Monitor function executions: Vercel Dashboard > Analytics
- Check logs: Vercel Dashboard > Logs
- Set up alerts for errors

### Supabase
- Monitor database: Supabase Dashboard > Database > Stats
- Check connection pool: Ensure < 60 connections (free tier)
- Review query performance

### Hostinger
- Check bandwidth usage: hPanel > Statistics
- Monitor uptime
- Review access logs

---

## 🔄 Updating the Application

### Backend Updates
```bash
git push origin main  # If using GitHub integration
# Or
vercel --prod  # If using CLI
```

### Frontend Updates
```bash
# 1. Update code
# 2. Build
npm run build

# 3. Upload dist/ folder to Hostinger
# Use FileZilla or Hostinger File Manager
```

---

## 🆘 Support

If you encounter issues:

1. Check Vercel function logs
2. Check browser console (F12)
3. Verify environment variables
4. Test API endpoints directly
5. Check Supabase connection count

---

## 📝 Environment Variables Reference

### Backend (Vercel)
| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://...pooler.supabase.com:6543/postgres` | ✅ Yes |
| `JWT_SECRET` | `abc123...xyz789` (32+ chars) | ✅ Yes |
| `ALLOWED_ORIGINS` | `https://dropazia.online,https://www.dropazia.online` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |

### Frontend (Build Time)
| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://your-backend.vercel.app` | ✅ Yes |

---

## ✅ Deployment Complete!

Your application should now be live at:
- **Frontend**: https://dropazia.online
- **Backend API**: https://your-backend.vercel.app
- **Database**: Managed by Supabase

**First Steps After Deployment:**
1. Login with admin credentials
2. Create test product
3. Test cart functionality
4. Invite team members
5. Monitor for errors

**Enjoy your deployed application! 🎉**

