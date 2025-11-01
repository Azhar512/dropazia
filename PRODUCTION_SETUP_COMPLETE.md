# 🚀 Complete Production Setup Guide

## ✅ Perfect Setup - Everything Will Work!

Since your database is empty, I've created a comprehensive setup script that will:
- ✅ Create admin user
- ✅ Create demo user  
- ✅ Create 6 sample products (Daraz + Shopify)
- ✅ Make everything ready to use

## 🎯 Quick Start

### Step 1: Create `.env` file in `backend` folder

Create `backend/.env` file with:

```env
MONGODB_URI=mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_from_vercel_here
NODE_ENV=production
```

**Note:** Get `JWT_SECRET` from Vercel → Settings → Environment Variables

### Step 2: Run the Setup Script

```bash
cd backend
npm run setup
```

**Or directly:**
```bash
cd backend
node src/setup-production.js
```

### Step 3: What You'll See

```
🚀 Starting Production Setup...
✅ Connected to MongoDB
📊 Database: shopdaraz

📊 Current Database State:
   Users: 0
   Products: 0

👤 Creating admin user...
✅ Admin user created successfully!
📧 Email: admin@shopdaraz.com
🔑 Password: admin123

👤 Creating demo user...
✅ Demo user created successfully!

📦 Creating sample products...
✅ Created 6 sample products

✅ ==========================================
✅ PRODUCTION SETUP COMPLETE!
✅ ==========================================

📋 Login Credentials:
   Admin: admin@shopdaraz.com / admin123
   Demo:  demo@shopdaraz.com / admin123

📊 Final Database State:
   Users: 2
   Products: 6

🎉 Everything is ready! You can now log in to the admin dashboard.
```

### Step 4: Test Login

1. Go to: `https://dropazia.online/admin-login`
2. Login with:
   - **Email:** `admin@shopdaraz.com`
   - **Password:** `admin123`

3. You should see the admin dashboard with:
   - ✅ Total Products: 6
   - ✅ Approved Users: 2
   - ✅ All products visible in Products section

## 📦 What Gets Created

### Users:
1. **Admin User**
   - Email: `admin@shopdaraz.com`
   - Password: `admin123`
   - Role: `admin`
   - Status: `approved`

2. **Demo User**
   - Email: `demo@shopdaraz.com`
   - Password: `admin123`
   - Role: `buyer`
   - Status: `approved`

### Products (6 total):
1. **Summer Dress Collection** - Daraz (PKR 2,500)
2. **Men's Watch** - Daraz (PKR 5,000)
3. **Premium Home Decor Set** - Shopify (PKR 3,500)
4. **Kids Running Shoes** - Shopify (PKR 1,200)
5. **Wireless Bluetooth Headphones** - Daraz (PKR 4,500)
6. **Laptop Backpack** - Daraz (PKR 2,800)

## ✅ Safety Features

- **Non-destructive:** Only creates if doesn't exist
- **Idempotent:** Can run multiple times safely
- **No data loss:** Won't delete existing users/products

## 🔍 Verify Everything Works

After running setup:

1. ✅ Login works
2. ✅ Products visible in admin dashboard
3. ✅ Products visible on `/daraz-products` page
4. ✅ Products visible on `/shopify-products` page
5. ✅ Can add/edit/delete products
6. ✅ Can approve users

---

**Ready? Run `npm run setup` and everything will be perfect! 🎉**

