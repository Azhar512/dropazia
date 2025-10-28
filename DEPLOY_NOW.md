# 🚀 Deploy Your ShopDaraz Hub NOW!

## ✅ What's Ready

1. ✅ **Frontend**: Built and ready in `dist/` folder
2. ✅ **Backend**: Ready for deployment
3. ✅ **MongoDB Atlas**: Your cluster is set up
4. ✅ **Code**: All features complete

---

## 📋 Step-by-Step Deployment

### **Step 1: Get Your MongoDB Connection String** 

You already have MongoDB Atlas set up! Now get the connection string:

1. In your MongoDB Atlas dashboard (the screenshot you sent)
2. Click **"Connect"** button on Cluster0
3. Select **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
5. **Replace `<password>` with your actual database password**

---

### **Step 2: Create Environment Files**

#### Create `backend/.env` file with:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# JWT Security (generate random 32+ character string)
JWT_SECRET=GenerateRandomStringHereWithAtLeast32Characters

# Optional Email
# SMTP_HOST=smtp.hostinger.com
# SMTP_PORT=587
```

**Important**: Replace:
- `yourdomain.com` → Your actual domain
- `username:password` → Your MongoDB credentials
- `GenerateRandomStringHere...` → Use https://randomkeygen.com/

#### Create `.env` file in root directory (for frontend):

```env
VITE_API_URL=https://yourdomain.com/api
```

**Replace `yourdomain.com` with your actual domain**

---

### **Step 3: Upload to Hostinger**

#### A. Upload Frontend
1. Login to Hostinger control panel
2. Open **File Manager**
3. Go to `public_html/` or `htdocs/`
4. Upload **ALL files** from `dist/` folder:
   - `index.html`
   - `assets/` folder
   - `favicon.ico`, `favicon.png`, `favicon.svg`
   - `jazzcash-logo.svg`, `placeholder.svg`
   - `robots.txt`
5. Upload `.htaccess` file from project root to web root

#### B. Upload Backend
1. Create folder `api` in web root
2. Upload **entire backend folder** to `public_html/api/`
3. Make sure `.env` file is included

#### C. Upload Dependencies
Upload the `backend/node_modules` folder to `api/node_modules`
**OR** install on server via SSH:
```bash
cd api
npm install
```

---

### **Step 4: Configure Node.js on Hostinger**

1. Go to Hostinger Control Panel
2. Find **"Node.js"** section
3. Set:
   - **Version**: 18.x or 20.x
   - **App Root**: `api` or `public_html/api`
   - **Startup File**: `src/server.js`
4. Click **"Enable"** or **"Deploy"**

---

### **Step 5: Test**

Visit these URLs:

1. **Frontend**: `https://yourdomain.com` ✅
2. **Backend**: `https://yourdomain.com/api/health` ✅
   - Should return: `{"success":true,"message":"Server is running"}`

---

## 🎯 Quick Command Reference

### For Local Testing:
```bash
# Frontend (already running on port 8081)
npm run dev

# Backend (should already be running)
cd backend
npm run dev
```

### For Building:
```bash
# Build frontend
npm run build

# Build backend (already ready)
cd backend
npm install
```

---

## 📦 What to Upload

### **Frontend Files** (to `public_html/`):
```
dist/
├── index.html
├── assets/
│   ├── index-C5w-p3Rq.css
│   └── index-DUw2AY1V.js
├── favicon.ico
├── favicon.png
├── favicon.svg
├── jazzcash-logo.svg
├── placeholder.svg
└── robots.txt
```

### **Backend Files** (to `public_html/api/`):
```
backend/
├── src/
├── node_modules/
├── package.json
├── package-lock.json
└── .env (with your configuration)
```

### **Other Files**:
- `.htaccess` (upload to web root)
- `.htaccess` configuration for SPA routing

---

## 🔧 Troubleshooting

### Backend not starting?
- Check Node.js version (18.x or 20.x)
- Check `.env` file has correct MongoDB URI
- Check Hostinger logs for errors

### Frontend can't connect to backend?
- Update CORS in `backend/src/server.js`
- Check `VITE_API_URL` in frontend `.env`
- Verify backend health endpoint

### Products not showing?
- Seed database with products via admin panel
- Check MongoDB Atlas connection
- Verify products have correct `module` field

---

## ✅ Post-Deployment Checklist

After deployment, test these features:

- [ ] Home page loads
- [ ] User registration works
- [ ] User login works
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Admin panel accessible
- [ ] WhatsApp button works
- [ ] Returns feature works
- [ ] All sidebar links work

---

## 🎉 You're Almost Done!

**Next Steps:**
1. ✅ Your frontend is built (done!)
2. 📝 Create `.env` files (see Step 2)
3. 📤 Upload files to Hostinger (see Step 3)
4. ⚙️ Configure Node.js (see Step 4)
5. 🧪 Test your deployment (see Step 5)

**Need Help?** Read `QUICK_DEPLOY_STEPS.md` for detailed instructions!

Good luck! 🚀

