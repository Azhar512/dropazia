# 🎯 Deployment Guide for dropazia.shop

## 🌐 Your Setup:
- **Domain:** dropazia.shop
- **Frontend:** Hostinger (dropazia.shop)
- **Backend:** Render (free tier)
- **Database:** MongoDB Atlas (already configured)

---

## 📋 STEP-BY-STEP DEPLOYMENT:

### STEP 1: Deploy Backend to Render ⏱️ (5 minutes)

#### A) Sign Up:
1. Go to: https://render.com
2. Click "Get Started"
3. Click "Continue with GitHub"
4. Allow Render access
5. Done!

#### B) Create Backend Service:
1. Click "New" → "Web Service"
2. Select repository: `dropazia`
3. Fill this:
   - **Name:** `shopdaraz-backend`
   - **Root Directory:** `backend`
   - **Region:** Choose any
   - **Branch:** `main`
4. Click "+ Add Environment Variable"
5. Add these 5 variables:

```
NODE_ENV = production
```

```
MONGODB_URI = mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0
```

```
PORT = 5000
```

```
JWT_SECRET = dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA
```

```
FRONTEND_URL = https://dropazia.shop
```
**(This is YOUR domain!)**

#### C) Deploy:
1. Click "Create Web Service"
2. Wait 3-5 minutes
3. Copy your backend URL (e.g., `https://shopdaraz-backend.onrender.com`)
4. **Save this URL!**

---

### STEP 2: Update Frontend Config ⏱️ (2 minutes)

After you get your backend URL from Render:

1. Open `.env.production` file
2. Update it with your backend URL:

```env
VITE_API_URL=https://shopdaraz-backend.onrender.com/api
```

Replace `shopdaraz-backend` with your actual Render backend name.

3. Save the file

---

### STEP 3: Build Frontend ⏱️ (1 minute)

Run this command in terminal:

```bash
npm run build
```

This creates a `dist/` folder with production files.

---

### STEP 4: Upload to Hostinger ⏱️ (5 minutes)

#### Option A: Using Hostinger File Manager (Easiest)

1. Login to Hostinger control panel: https://hpanel.hostinger.com
2. Go to **Files** → **File Manager**
3. Navigate to `public_html/` folder
4. **Upload ALL files from `dist/` folder** to `public_html/`
5. **Also upload `.htaccess` file** to the root

#### Option B: Using FileZilla

1. Download FileZilla: https://filezilla-project.org/
2. Connect to your Hostinger FTP:
   - Host: ftp.dropazia.shop or your IP
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Navigate to `public_html/`
4. Upload all files from `dist/`
5. Upload `.htaccess`

---

### STEP 5: Test Your Website! 🎉

Visit: **https://dropazia.shop**

Test:
- ✅ Login/Register
- ✅ Browse products
- ✅ Add to cart
- ✅ Checkout with EasyPaisa
- ✅ WhatsApp integration

---

## 📝 Quick Reference:

**Your URLs:**
- Frontend: https://dropazia.shop
- Backend: https://your-backend-name.onrender.com (you'll get this from Render)
- Database: MongoDB Atlas (already working!)

---

## ✅ Checklist:

### Backend:
- [ ] Signed up on Render
- [ ] Created web service: shopdaraz-backend
- [ ] Added all 5 environment variables
- [ ] FRONTEND_URL set to: https://dropazia.shop
- [ ] Deployed and got backend URL

### Frontend:
- [ ] Updated .env.production with Render backend URL
- [ ] Ran `npm run build`
- [ ] Uploaded dist/ folder to Hostinger
- [ ] Uploaded .htaccess file
- [ ] Tested website at https://dropazia.shop

---

## 🚀 Ready to Start?

**Let's begin with Render backend deployment!**

Open: https://render.com and let me know when you're signed up!

