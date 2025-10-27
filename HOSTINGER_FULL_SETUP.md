# 🌐 Complete Hostinger Deployment Guide

## Overview

This guide will help you deploy your ShopDaraz Hub frontend to Hostinger and connect it with your Railway backend and MongoDB Atlas database.

## 📋 Prerequisites

- ✅ Hostinger Business Web Hosting account
- ✅ Backend deployed on Railway
- ✅ MongoDB Atlas database configured
- ✅ Built frontend files (`dist` folder)

## 🎯 Step 1: Configure Backend URL

First, we need to configure your frontend to connect to your Railway backend.

### 1.1: Create Production Build

Run this command in your project directory:

```bash
npm run build
```

### 1.2: Update API Configuration

The frontend is already configured to use environment variables. Your built files will use:
- Development: `http://localhost:5000`
- Production: Will use the backend URL you'll configure

**Note:** Since we're building for production, we need to update the API URL before building.

### 1.3: Create `.env.production` file

Create a file named `.env.production` in your project root with:

```env
VITE_API_URL=https://your-railway-backend.railway.app
```

Replace `your-railway-backend.railway.app` with your actual Railway URL.

### 1.4: Rebuild

```bash
npm run build
```

Now your `dist` folder has the correct backend URL.

## 🎯 Step 2: Upload to Hostinger

### 2.1: Access Hostinger File Manager

1. **Login to Hostinger** dashboard
2. Click on your domain (e.g., `darazxpert.com`)
3. Go to **"Files"** or **"File Manager"**
4. Navigate to **`public_html`** folder

### 2.2: Delete Default Files (Optional)

If you see default WordPress files (like `index.php`, `wp-config.php`), you can delete them or back them up.

### 2.3: Upload Build Files

Upload **ALL contents** from your `dist` folder:

**Files to upload:**
- ✅ `index.html` (main file - goes to root of public_html)
- ✅ `assets/` folder (complete folder with all JS and CSS files)
- ✅ All `.ico`, `.png`, `.svg` files
- ✅ `robots.txt`
- ✅ `.htaccess` file (important for React Router!)

**How to upload:**
1. Select all files from `dist` folder
2. Drag and drop into Hostinger File Manager
3. Or use Upload button in File Manager
4. **Make sure files go directly to `public_html`, not in subfolders**

### 2.4: Upload .htaccess

Upload the `.htaccess` file to `public_html` root directory. This file is crucial for React Router to work properly.

**Important:** Make sure `.htaccess` is visible in File Manager (some hosts hide dot-files).

## 🎯 Step 3: Configure Domain

### 3.1: SSL Certificate (Auto)

Hostinger provides free SSL certificates. Your site should have HTTPS enabled automatically.

### 3.2: Test Your Domain

Visit your domain:
- `https://your-domain.com`
- `https://www.your-domain.com`

## 🎯 Step 4: Configure Backend CORS

### 4.1: Update Railway Backend

Go back to Railway dashboard and update environment variable:

```
FRONTEND_URL=https://your-domain.com
```

Railway will automatically redeploy with new CORS settings.

## 🎯 Step 5: Connect Database

Your database is already configured in Railway backend, but make sure it's seeded:

### 5.1: Check Database Seeding

1. Go to Railway dashboard
2. Go to "Deployments" → "Logs"
3. You should see: "✅ Database seeded successfully"

### 5.2: Test Database Connection

Your backend should connect automatically. Check Railway logs to confirm.

## 🎯 Step 6: Test Everything

### 6.1: Test Frontend

1. Visit your Hostinger domain
2. Check if page loads correctly
3. Open browser console (F12) to check for errors

### 6.2: Test Backend Connection

1. Try logging in with:
   - Email: `admin@shopdaraz.com`
   - Password: `admin123`

2. If login works, backend is connected! ✅

### 6.3: Test Features

- ✅ Browse products (Daraz/Shopify)
- ✅ Add to cart
- ✅ Checkout process
- ✅ Admin dashboard

## 🚨 Troubleshooting

### Issue: 404 Errors on Page Refresh

**Solution:** Make sure `.htaccess` file is uploaded to `public_html` root directory.

### Issue: API Connection Errors

**Solution:** 
1. Check `VITE_API_URL` in build is correct
2. Check backend CORS allows your domain
3. Check Railway backend is running

### Issue: Styles Not Loading

**Solution:** Make sure `assets` folder was uploaded completely with all files.

### Issue: Login Not Working

**Solution:**
1. Check backend is running on Railway
2. Check MongoDB connection
3. Check environment variables in Railway

### Issue: Database Errors

**Solution:**
1. Verify MongoDB Atlas connection string
2. Check MongoDB Atlas network access allows all IPs
3. Verify database user has correct permissions

## ✅ Complete Setup Checklist

- [ ] MongoDB Atlas configured with connection string
- [ ] Backend deployed to Railway
- [ ] Railway environment variables set
- [ ] Frontend built with correct API URL
- [ ] All files uploaded to Hostinger `public_html`
- [ ] `.htaccess` file uploaded
- [ ] SSL certificate active
- [ ] Backend CORS configured for Hostinger domain
- [ ] Test login works
- [ ] Test all features work

## 🎉 Success!

Your ShopDaraz Hub is now live on Hostinger with full backend and database integration!

## 📊 Architecture Summary

```
User Browser
    ↓
Hostinger (Frontend - Static Files)
    ↓ HTTP Request
Railway (Backend API - Node.js)
    ↓ Database Query
MongoDB Atlas (Database)
```

All components are connected and working in real-time! 🚀

## 🔄 Future Updates

To update your site:
1. Make changes to your code
2. Push to GitHub
3. Rebuild frontend: `npm run build`
4. Upload new `dist` folder to Hostinger
5. Backend auto-updates from GitHub/Railway

---

**Your ShopDaraz Hub is live and fully functional!** 🎉
