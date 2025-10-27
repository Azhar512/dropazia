# ✅ Complete Deployment Checklist

## Phase 1: Database Setup (MongoDB Atlas)

- [ ] Create MongoDB Atlas account at https://mongodb.com/atlas
- [ ] Create new cluster (free tier M0)
- [ ] Create database user with password (save password!)
- [ ] Configure network access (allow all IPs for now)
- [ ] Get connection string from Atlas
- [ ] Replace `<password>` in connection string with actual password
- [ ] **Save connection string** (you'll need it for Railway)

**Connection string format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopdaraz?retryWrites=true&w=majority
```

---

## Phase 2: Backend Deployment (Railway)

- [ ] Go to https://railway.app
- [ ] Sign up with GitHub
- [ ] Create new project
- [ ] Deploy from GitHub repo (Azhar512/dropazia)
- [ ] Set root directory to: `backend`
- [ ] Add environment variables:
  - [ ] `MONGODB_URI` = your MongoDB connection string
  - [ ] `JWT_SECRET` = random secret key
  - [ ] `NODE_ENV` = production
  - [ ] `PORT` = 5000
  - [ ] `FRONTEND_URL` = your Hostinger domain (set later)
- [ ] Wait for deployment to complete
- [ ] **Save your Railway URL** (e.g., https://dropazia-production.railway.app)

**Generate JWT Secret:**
You can use: https://randomkeygen.com/ or any random string generator

---

## Phase 3: Frontend Configuration

- [ ] Create `.env.production` file in project root
- [ ] Add: `VITE_API_URL=https://your-railway-backend.railway.app`
- [ ] Replace with your actual Railway URL
- [ ] Run: `npm run build`
- [ ] Check `dist` folder has all files

---

## Phase 4: Hostinger Upload

- [ ] Login to Hostinger dashboard
- [ ] Go to File Manager for your domain
- [ ] Navigate to `public_html` folder
- [ ] Upload ALL contents from `dist` folder to `public_html` root:
  - [ ] `index.html` (goes to root)
  - [ ] `assets/` folder (complete folder)
  - [ ] All `.ico`, `.png`, `.svg` files
  - [ ] `robots.txt`
- [ ] Upload `.htaccess` file to `public_html` root
- [ ] Verify files are in `public_html` root directory (not subfolders)

---

## Phase 5: Final Configuration

- [ ] Visit your Hostinger domain (check if it loads)
- [ ] Update Railway environment variable `FRONTEND_URL` with your domain
- [ ] Wait for Railway to redeploy
- [ ] Check SSL is active on your Hostinger domain

---

## Phase 6: Testing

- [ ] Visit your live site: `https://your-domain.com`
- [ ] Open browser console (F12) - check for errors
- [ ] Test login:
  - Email: `admin@shopdaraz.com`
  - Password: `admin123`
- [ ] Test features:
  - [ ] Browse products
  - [ ] Add to cart
  - [ ] Checkout process
- [ ] Test admin dashboard access

---

## 🚨 Troubleshooting Checklist

If something doesn't work:

**Frontend not loading:**
- [ ] Check `.htaccess` file is uploaded
- [ ] Verify files are in `public_html` root
- [ ] Check browser console for errors

**Backend connection fails:**
- [ ] Verify Railway backend URL in frontend
- [ ] Check backend is running in Railway dashboard
- [ ] Check Railway logs for errors
- [ ] Verify CORS settings allow your domain

**Database errors:**
- [ ] Verify MongoDB connection string in Railway
- [ ] Check MongoDB Atlas network access (allow all IPs)
- [ ] Verify database user has correct permissions
- [ ] Check database is seeded (in Railway logs)

**Login not working:**
- [ ] Check backend is running
- [ ] Check MongoDB connection
- [ ] Check JWT_SECRET is set in Railway
- [ ] Check browser console for API errors

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Site loads at your Hostinger domain
- ✅ Login works with admin credentials
- ✅ Products load from database
- ✅ Cart functionality works
- ✅ No console errors
- ✅ Backend API connected
- ✅ Database connected

---

## 📊 Architecture

```
Browser → Hostinger (Frontend) → Railway (Backend) → MongoDB Atlas (Database)
```

All components working in real-time! 🚀
