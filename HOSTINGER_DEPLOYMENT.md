# 🚀 Hostinger Frontend Deployment Guide

## ✅ What's Ready

Your project is configured and ready to deploy! Follow these steps:

## 📋 **Step-by-Step Deployment**

### **Step 1: Build Your Frontend (Do This First)**

Open your terminal in the project folder and run:

```bash
# Build the production-ready files
npm run build
```

This will create a `dist` folder with all your static files ready to upload.

### **Step 2: Open Hostinger File Manager**

1. **Login to Hostinger** dashboard
2. Click on your domain (e.g., `darazxpert.com` or create a new one)
3. Go to **"Files"** or **"File Manager"**
4. Navigate to **`public_html`** folder (this is your root directory)

### **Step 3: Upload Your Built Files**

1. **Open your local `dist` folder** (created after running `npm run build`)
2. **Select ALL files and folders** inside the `dist` folder:
   - index.html
   - All .js files
   - All .css files
   - assets folder
   - Everything else
3. **Upload to Hostinger's `public_html`** folder
4. Make sure `index.html` is in the root of `public_html`

### **Step 4: Configure .htaccess (Important for React Router)**

Since your app uses React Router, you need this configuration file.

**Create a file named `.htaccess`** in your `public_html` folder with this content:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Or I can create this file for you** - just let me know!

### **Step 5: Access Your Live Site**

Your website will be live at:
- `https://yourdomain.com`
- Or `https://yourdomain.hostingersite.com` (if you haven't connected custom domain)

## 🎯 **Important Notes**

### **Backend URL Configuration**

Your frontend needs to know where the backend API is. You have two options:

**Option A: Deploy backend first, then update frontend**
1. Deploy backend to Railway/Render
2. Get backend URL: `https://your-backend.railway.app`
3. Update environment variable in next build

**Option B: Use localhost backend for testing**
The frontend will try to connect to `http://localhost:5000` by default

### **After Backend is Deployed**

You'll need to create a `.env` file in your project root with:

```
VITE_API_URL=https://your-backend-url.com
```

Then rebuild and re-upload:
```bash
npm run build
```

## 🚨 **Common Issues & Solutions**

### **Issue: Page not found on refresh**
**Solution:** Add `.htaccess` file (see Step 4 above)

### **Issue: 404 errors on pages**
**Solution:** Make sure `index.html` is in `public_html` root, not in a subfolder

### **Issue: Backend connection errors**
**Solution:** 
1. Deploy backend first to Railway/Render
2. Update `.env` with backend URL
3. Rebuild and re-upload

### **Issue: Styles not loading**
**Solution:** Make sure you uploaded ALL files from `dist` folder, including assets folder

## ✅ **Checklist Before Uploading**

- [ ] Run `npm run build` successfully
- [ ] Check that `dist` folder exists
- [ ] Verify `index.html` is in the `dist` folder
- [ ] Have backend URL ready (or use localhost for testing)
- [ ] Ready to upload to Hostinger

## 🎉 **After Deployment**

Your site will be live! You can:
- ✅ Access it from anywhere
- ✅ Share the URL with others
- ✅ Test all features
- ✅ Connect custom domain (in Hostinger settings)

## 📞 **Need Help?**

If you encounter any issues:
1. Check browser console (F12) for errors
2. Verify all files uploaded correctly
3. Make sure `.htaccess` is in place
4. Ensure backend is running and accessible

---

**Ready to build and upload?** Let me know when you're done with Step 1 (running `npm run build`) and I'll guide you through the rest!
