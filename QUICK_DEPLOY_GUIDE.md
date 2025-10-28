# 🚀 Quick Deployment Guide - Step by Step

## 📋 BACKEND DEPLOYMENT (Render)

### What You Need:
- GitHub account (you have this!)
- Gmail or GitHub email

### Time: 5-10 minutes

### Steps:

#### 1. Sign Up for Render (2 minutes)
- Visit: https://render.com
- Click "Get Started"
- Click "Continue with GitHub"
- Allow Render to access your GitHub
- Done!

#### 2. Create Backend Service (3 minutes)
- Click "New" → "Web Service"
- Select: `dropazia` repository
- Fill this:
  - Name: `shopdaraz-backend`
  - Root Directory: `backend`
  - Region: Choose any
  - Branch: `main`
- Click "+ Add Environment Variable"
- Add these 5 variables:

**Variable 1:**
```
NODE_ENV = production
```

**Variable 2:**
```
MONGODB_URI = mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0
```

**Variable 3:**
```
PORT = 5000
```

**Variable 4:**
```
JWT_SECRET = dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA
```

**Variable 5:**
```
FRONTEND_URL = https://yourdomain.com
```
(Replace with your actual domain)

#### 3. Deploy (2 minutes)
- Click "Create Web Service"
- Wait for deployment
- Copy your backend URL when ready

---

## 📋 FRONTEND DEPLOYMENT (Hostinger)

### What You Need:
- Hostinger account (you have this!)
- FileZilla or Hostinger File Manager

### Time: 5 minutes

### Steps:

#### 1. Get Backend URL from Render
After backend deployment, you'll get a URL like:
```
https://shopdaraz-backend.onrender.com
```

#### 2. Create .env.production File
Create a file in your project root with this content:

```env
VITE_API_URL=https://shopdaraz-backend.onrender.com/api
```

Replace the URL with your actual Render backend URL.

#### 3. Build Frontend
Run this command in terminal:

```bash
npm run build
```

This creates a `dist/` folder.

#### 4. Upload to Hostinger

**Using FileZilla:**
1. Download FileZilla from: https://filezilla-project.org/download.php
2. Open FileZilla
3. Connect with your Hostinger FTP credentials
4. Navigate to `public_html/` folder
5. Upload ALL files from `dist/` folder
6. Upload `.htaccess` file

**Using Hostinger File Manager:**
1. Login to Hostinger
2. Go to File Manager
3. Navigate to `public_html/`
4. Upload all files from `dist/`
5. Upload `.htaccess`

#### 5. Test Your Website
Visit your domain and test the features!

---

## ✅ Checklist:

### Backend (Render):
- [ ] Signed up on Render
- [ ] Connected GitHub repository
- [ ] Created web service with name: shopdaraz-backend
- [ ] Added all 5 environment variables
- [ ] Deployed and got backend URL
- [ ] Tested backend health endpoint

### Frontend (Hostinger):
- [ ] Got backend URL from Render
- [ ] Created .env.production with backend URL
- [ ] Ran `npm run build`
- [ ] Uploaded dist/ folder to Hostinger
- [ ] Uploaded .htaccess file
- [ ] Tested website

---

## 🎉 You're Done!

Your app is now live with:
- ✅ EasyPaisa payment (03274996979)
- ✅ WhatsApp integration
- ✅ Real-time features
- ✅ All modules working

---

## 🔗 Your URLs:

- **Frontend:** https://yourdomain.com
- **Backend:** https://shopdaraz-backend.onrender.com
- **Database:** MongoDB Atlas (already configured)

