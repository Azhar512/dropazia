# ⚡ Quick Start Guide

Get ShopDaraz Hub running locally in 5 minutes!

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier is fine)
- Git

---

## 🚀 Setup Steps

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd shopdaraz-hub-main
```

### 2. Database Setup

1. Create Supabase project: https://supabase.com
2. Go to SQL Editor
3. Run `backend/database/supabase-schema.sql`
4. Get connection URL:
   - Project Settings > Database > Connection Pooling
   - Copy the **pooler** URL (contains `pooler.supabase.com`)

### 3. Backend Configuration

```bash
cd backend
npm install

# Create .env file
cp env.template .env

# Edit .env and add:
# DATABASE_URL=your_supabase_pooler_url
# JWT_SECRET=your_random_32_character_string
# ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create Admin User

```bash
npm run create-admin
```

This creates:
- **Email**: `admin@shopdaraz.com`
- **Password**: `admin123`

### 5. Frontend Configuration

```bash
cd ..  # back to root
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
```

### 6. Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🎉 Access Application

- **Frontend**: http://localhost:8080 (or port shown in terminal)
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🔐 Login

### Admin Login
1. On landing page, type: `admin` (triggers hidden admin link)
2. Click "Admin Login" button that appears
3. Use credentials:
   - Email: `admin@shopdaraz.com`
   - Password: `admin123`

### Super Admin Login
1. On landing page, type: `aneeq` (triggers super admin link)
2. Login with super admin credentials

### Regular User
1. Click "Get Started" or "Login"
2. Register new account
3. Login with your credentials

---

## 📝 Next Steps

After logging in:

1. **Admin**: Add products via Admin Dashboard
2. **Users**: Browse products by module (Daraz/Shopify)
3. **Test Cart**: Add items to cart
4. **Place Order**: Complete checkout flow
5. **Test Returns**: Request product return

---

## 🐛 Common Issues

### "Database connection failed"
- Check `DATABASE_URL` in `backend/.env`
- Use connection **pooler** URL (not direct)
- Verify Supabase project is active

### "CORS error"
- Check `ALLOWED_ORIGINS` in `backend/.env`
- Ensure it includes `http://localhost:8080` and `http://localhost:3000`

### "Cannot find module"
- Run `npm install` in both root and `backend/` directories

### Port already in use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will auto-assign different port

---

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm run dev         # Start with auto-reload
npm start           # Start production mode
npm run create-admin # Create admin user
npm run check-db    # Check database connection
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## 📚 More Information

- Full Deployment Guide: See `DEPLOYMENT_GUIDE.md`
- Environment Setup: See `ENV_SETUP_GUIDE.md`
- API Documentation: Check `backend/src/routes/` folder
- Project Structure: See main `README.md`

---

**Happy Coding! 🚀**

