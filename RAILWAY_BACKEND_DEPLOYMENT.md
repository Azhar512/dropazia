# 🚀 Railway Backend Deployment Guide

## Prerequisites

- ✅ MongoDB Atlas connection string (from previous guide)
- ✅ GitHub repository with your code
- ✅ Railway account (free tier available)

## Step 1: Create Railway Account

1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub (recommended)
3. **Verify your email**

## Step 2: Create New Project

1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. **Find and select** `Azhar512/dropazia` repository
4. Click **"Deploy Now"**

## Step 3: Configure Backend

Railway will start importing your project. Now we need to configure it:

### 3.1: Set Root Directory

1. In your project settings, find **"Root Directory"**
2. Set it to: `backend`
3. Click **"Update"**

### 3.2: Set Build Command

Railway should auto-detect, but verify:
- **Start Command**: `npm start`
- **Build Command**: (empty or `npm install`)

## Step 4: Add Environment Variables

1. Go to **"Variables"** tab in Railway
2. Click **"+ New Variable"**
3. Add these variables **one by one**:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://shopdaraz_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shopdaraz?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
FRONTEND_URL=https://your-hostinger-domain.com
```

### Variable Details:

1. **MONGODB_URI**: Your MongoDB Atlas connection string (replace YOUR_PASSWORD)
2. **JWT_SECRET**: Generate a random secret: 
   ```bash
   # Or use: https://randomkeygen.com/
   ```
3. **FRONTEND_URL**: Your Hostinger domain (we'll set this later)

## Step 5: Deploy

1. Click **"Deploy"** or changes auto-deploy
2. **Wait for deployment** to complete (~2-3 minutes)
3. You'll get a URL like: `https://dropazia-production.railway.app`

## Step 6: Get Your Backend URL

1. In Railway dashboard, find your **"Domains"** section
2. Copy the URL (e.g., `https://dropazia-production.railway.app`)
3. **Save this URL** - you'll need it for Hostinger frontend

## Step 7: Update CORS in Backend

Make sure your backend `server.js` allows your Hostinger domain:

```javascript
app.use(cors({
  origin: [
    'https://your-hostinger-domain.com',
    'https://www.your-hostinger-domain.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

## Step 8: Seed Database

Your backend needs initial data. Railway will run this automatically when it starts, or you can trigger it:

1. Go to Railway dashboard
2. Click on **"Deployments"**
3. Run: `cd backend && node src/seed.js`

## ✅ What You Have Now

- ✅ Backend deployed on Railway
- ✅ Connected to MongoDB Atlas
- ✅ Backend URL (for frontend configuration)
- ✅ Database seeded with sample data

## 🚨 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Check MongoDB connection string is valid
- Check logs in Railway dashboard

### Database connection failed
- Verify MongoDB Atlas network access allows all IPs
- Check connection string has correct password
- Ensure database name is included in connection string

### CORS errors in browser
- Add your Hostinger domain to CORS origins in backend
- Check frontend is using correct backend URL

## 🚀 Next Steps

1. **Save your Railway backend URL**
2. **Configure Hostinger frontend** (next step)
3. **Connect frontend to backend**
4. **Test everything works**

---

**Your backend is deployed!** 🎉
