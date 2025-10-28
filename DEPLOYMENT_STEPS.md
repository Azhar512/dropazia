# 🚀 Step-by-Step Deployment Guide

## 📋 Complete Deployment Steps

### PART 1: Backend Deployment to Render (FREE)

#### Step 1: Sign up for Render
1. Go to: https://render.com
2. Click "Get Started" or "Sign Up"
3. Sign up with your GitHub account
4. Verify email if needed

#### Step 2: Deploy Backend
1. Click **"New"** → **"Web Service"**
2. Select **"Connect a repository"**
3. Choose your repository: `dropazia`
4. Render will auto-detect settings:
   - **Name:** shopdaraz-backend
   - **Region:** Choose closest to you
   - **Branch:** main
   - **Root Directory:** `backend`
5. Click **"Advanced"** → **"Add Environment Variable"**
6. Add these variables one by one:

```
NODE_ENV = production
MONGODB_URI = mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0
PORT = 5000
JWT_SECRET = dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA
FRONTEND_URL = https://yourdomain.com
```

7. Click **"Create Web Service"**
8. Wait for deployment (takes 3-5 minutes)

#### Step 3: Get Your Backend URL
After deployment completes, Render will show:
```
https://shopdaraz-backend.onrender.com
```

**Copy this URL** - you'll need it for frontend!

---

### PART 2: Frontend Deployment to Hostinger

#### Step 1: Create Production .env File
1. Open your project in VS Code
2. Create file named `.env.production` in root directory
3. Add this content:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

4. Replace `your-backend-url` with your actual Render URL
   - Example: `https://shopdaraz-backend.onrender.com/api`

#### Step 2: Build Frontend
1. Open terminal in project root
2. Run:
```bash
npm run build
```
3. This creates a `dist/` folder with production files

#### Step 3: Upload to Hostinger

**Option A: Using FileZilla**

1. Download FileZilla: https://filezilla-project.org/download.php
2. Get your Hostinger FTP details from Hostinger control panel
3. Open FileZilla
4. Connect using:
   - Host: `ftp.yourdomain.com` or your IP
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
5. Navigate to `public_html/` folder
6. Upload ALL files from `dist/` folder to `public_html/`
7. Upload `.htaccess` file to root

**Option B: Using Hostinger File Manager**

1. Login to Hostinger control panel
2. Go to **hPanel** → **Files** → **File Manager**
3. Navigate to `public_html/` folder
4. Upload all files from `dist/` folder
5. Upload `.htaccess` file

#### Step 4: Test Your Website
1. Visit your domain: https://yourdomain.com
2. Test login, products, checkout
3. Check if backend APIs are working

---

## ✅ Quick Checklist:

### Backend (Render):
- [ ] Sign up for Render account
- [ ] Deploy backend from GitHub
- [ ] Add environment variables
- [ ] Get backend URL from Render
- [ ] Test backend health: https://your-backend-url.onrender.com/health

### Frontend (Hostinger):
- [ ] Create `.env.production` file
- [ ] Update with Render backend URL
- [ ] Run `npm run build`
- [ ] Upload `dist/` folder to Hostinger
- [ ] Upload `.htaccess` file
- [ ] Test website

---

## 🔧 Important Files Created:

1. ✅ `backend/render.yaml` - Render deployment config
2. ✅ `.htaccess` - Already exists (for frontend routing)
3. ✅ `DEPLOY_NOW.bat` - Quick build script
4. ✅ `RENDER_HOSTINGER_DEPLOYMENT.md` - Detailed guide

---

## 📞 Troubleshooting:

### Backend Issues:
- If MongoDB connection fails: Add `0.0.0.0/0` to MongoDB Atlas IP whitelist
- If environment variables missing: Check Render dashboard
- If deployment fails: Check Render logs

### Frontend Issues:
- If blank page: Check browser console for errors
- If API calls fail: Verify `.env.production` has correct URL
- If routing doesn't work: Verify `.htaccess` is uploaded

---

## 🎉 That's It!

Follow these steps and your app will be live with:
- ✅ EasyPaisa payment (03274996979)
- ✅ WhatsApp integration
- ✅ Real-time features
- ✅ All modules working

**Ready to deploy? Start with Render backend first, then frontend!**

