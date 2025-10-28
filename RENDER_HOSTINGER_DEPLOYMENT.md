# 🚀 Complete Deployment Guide: Render + Hostinger

## 📋 Overview:

- **Backend:** Deploy to Render (Free Tier)
- **Frontend:** Deploy to Hostinger (Your Business Plan)
- **Database:** MongoDB Atlas (Already Configured)

---

## 📁 PART 1: BACKEND DEPLOYMENT TO RENDER

### Step 1: Create render.yaml file

Create a file named `render.yaml` in your `backend/` folder:

```yaml
services:
  - type: web
    name: shopdaraz-backend
    runtime: node
    plan: free
    buildCommand: npm install
    startCommand: node src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0
      - key: PORT
        value: 5000
      - key: JWT_SECRET
        value: dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA
      - key: FRONTEND_URL
        value: https://yourdomain.com
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up/login (it's free!)
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub account
5. Select repository: `dropazia`
6. Select root directory: `backend/`
7. Click **"Deploy"**
8. Render will auto-detect Node.js and deploy!

### Step 3: Get Your Backend URL

After deployment, Render will give you a URL like:
```
https://shopdaraz-backend.onrender.com
```

**Save this URL** - you'll need it for frontend configuration!

---

## 📁 PART 2: FRONTEND DEPLOYMENT TO HOSTINGER

### Step 1: Build the Frontend

Run this command to build for production:

```bash
npm run build
```

This creates a `dist/` folder with production-ready files.

### Step 2: Configure Frontend for Production

Before building, create `.env` file in root directory:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render backend URL.

### Step 3: Upload to Hostinger

**Option A: Using FileZilla (Recommended)**

1. Download FileZilla: https://filezilla-project.org/
2. Connect to your Hostinger FTP:
   - Host: `ftp.yourdomain.com` or IP
   - Username: Your Hostinger FTP username
   - Password: Your Hostinger FTP password
   - Port: 21
3. Navigate to `public_html/` folder
4. Upload ALL files from `dist/` folder to `public_html/`
5. Also upload `.htaccess` file (create if missing)

**Option B: Using Hostinger File Manager**

1. Login to Hostinger control panel
2. Go to File Manager
3. Navigate to `public_html/` folder
4. Upload all files from `dist/` folder
5. Upload `.htaccess` file

### Step 4: Create/Update .htaccess File

Create `.htaccess` file in root directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Step 5: Rebuild with Production API URL

1. Update `.env` with your Render backend URL:
```env
VITE_API_URL=https://shopdaraz-backend.onrender.com/api
```

2. Rebuild:
```bash
npm run build
```

3. Upload `dist/` folder contents to Hostinger again

---

## ✅ Quick Deployment Checklist:

### Backend (Render):
- [ ] Create account on render.com
- [ ] Connect GitHub repository
- [ ] Select `backend/` as root directory
- [ ] Add environment variables in Render dashboard
- [ ] Deploy and get backend URL

### Frontend (Hostinger):
- [ ] Create `.env` file with Render backend URL
- [ ] Run `npm run build`
- [ ] Upload `dist/` folder to Hostinger `public_html/`
- [ ] Upload `.htaccess` file
- [ ] Test website

---

## 🔧 Troubleshooting:

### If backend doesn't connect:
1. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)
2. Verify environment variables in Render dashboard
3. Check Render logs for errors

### If frontend shows blank page:
1. Verify `.htaccess` file is uploaded
2. Check browser console for errors
3. Verify `VITE_API_URL` in `.env` is correct

---

## 📞 After Deployment:

**Your URLs will be:**
- Frontend: https://yourdomain.com
- Backend: https://shopdaraz-backend.onrender.com
- Database: MongoDB Atlas (already configured)

---

## 🎉 That's It!

Your app will be live with:
- EasyPaisa payment system
- WhatsApp integration (03274996979)
- Real-time orders, analytics, profits
- Wishlist and returns features

