# Quick Deployment Steps for Hostinger

## ⚡ Quick Start

Follow these steps to deploy your ShopDaraz Hub to Hostinger.

### 📋 Pre-Deployment Checklist

- [ ] Have MongoDB Atlas account ready
- [ ] Have Hostinger account with Business Plan
- [ ] Domain name connected
- [ ] Node.js support enabled on Hostinger

---

## 🗄️ Step 1: Setup MongoDB Atlas

### 1. Create Free MongoDB Atlas Account
- Visit: https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up with email/password
- Choose FREE tier
- Create cluster (choose any region)
- **Wait for cluster to be created (5-10 minutes)**

### 2. Configure Database
- Click "Security" → "Database Access"
- Click "Add New Database User"
- Choose "Password" authentication
- Username: `shopdaraz_admin`
- Password: Create a strong password (SAVE IT!)
- Click "Add User"

### 3. Configure Network
- Click "Security" → "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 4. Get Connection String
- Click "Database" → "Connect"
- Select "Connect your application"
- Copy the connection string
- It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`
- **SAVE THIS - You'll need it later!**

---

## 💻 Step 2: Prepare Your Code

### 2.1 Create Backend Environment File
Create `backend/.env` file with:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=generate_random_32_char_string_here

# Optional
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
```

**Important**: Replace:
- `your_mongodb_atlas_connection_string_here` - Your MongoDB Atlas connection string from Step 1.4
- `yourdomain.com` - Your actual domain name
- `generate_random_32_char_string_here` - Use https://randomkeygen.com/

### 2.2 Create Frontend Environment File
Create `.env` file in root directory:

```env
VITE_API_URL=https://yourdomain.com/api
```

Replace `yourdomain.com` with your actual domain.

### 2.3 Build Frontend
Run in project root:
```bash
npm run build
```

This creates a `dist` folder with production files.

---

## 🚀 Step 3: Upload to Hostinger

### 3.1 Access Hostinger File Manager
- Login to Hostinger control panel
- Click "File Manager" or "Filezilla"
- Navigate to your domain's public folder

### 3.2 Upload Frontend (to root)
1. Go to `dist` folder in your project
2. Upload **ALL files** from `dist` to:
   - `public_html/` OR `htdocs/`
3. Upload `.htaccess` file to root
4. These files will be accessible at: `https://yourdomain.com`

### 3.3 Upload Backend (to api folder)
1. Upload entire `backend` folder to:
   - `public_html/api/` OR `htdocs/api/`
2. Make sure `.env` file is included
3. Backend will be at: `https://yourdomain.com/api`

### 3.4 Upload Dependencies
**Option A: Upload node_modules**
- Upload the entire `backend/node_modules` folder
- File size: ~100MB (might take time)

**Option B: Install on server (recommended)**
- Access server via SSH
- Navigate to `api` folder
- Run: `npm install`

---

## ⚙️ Step 4: Configure Node.js on Hostinger

1. Go to Hostinger Control Panel
2. Find "Node.js" or "Node.js Selector"
3. Configure:
   - **Version**: 18.x or 20.x
   - **Application Root**: `api` or `public_html/api`
   - **Startup File**: `src/server.js`
   - **Application URL**: Enable
4. Click "Enable" or "Deploy"
5. Wait for deployment

---

## 🧪 Step 5: Test Your Deployment

### Test Backend
Open browser and visit:
```
https://yourdomain.com/api/health
```

Expected response:
```json
{"success":true,"message":"Server is running"}
```

### Test Frontend
Visit:
```
https://yourdomain.com
```

Should show your landing page.

---

## 🔧 Common Issues & Solutions

### Backend Not Starting
**Problem**: `https://yourdomain.com/api/health` shows error

**Solutions**:
1. Check Node.js version matches (18.x or 20.x)
2. Verify `.env` file is uploaded correctly
3. Check Hostinger error logs
4. Verify MongoDB connection string

### CORS Errors
**Problem**: Frontend can't connect to backend

**Solutions**:
1. Update `FRONTEND_URL` in `backend/.env` to your domain
2. Check CORS settings in `backend/src/server.js`
3. Clear browser cache

### Products Not Showing
**Problem**: Empty products page

**Solutions**:
1. Check MongoDB Atlas connection
2. Seed database with products
3. Check browser console for errors

---

## 📞 Need Help?

1. Check Hostinger Node.js logs for errors
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are correct
4. Ensure MongoDB Atlas network access is configured

---

## ✅ Post-Deployment Tasks

- [ ] Test user registration
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test admin panel
- [ ] Test WhatsApp button
- [ ] Test all features

---

**Good luck with your deployment! 🎉**

