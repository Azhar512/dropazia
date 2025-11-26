# 🧪 Local Testing Setup Guide

Quick guide to run ShopDaraz Hub locally for testing PayFast integration.

## Step 1: Create Environment Files

### Frontend Environment (.env in root folder)

Create a file named `.env` in the **root** folder with:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000

# PayFast Sandbox Credentials (For Testing)
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=46f0cd694581a
VITE_PAYFAST_PASSPHRASE=jt7NOE43FZPn
VITE_PAYFAST_MODE=sandbox
```

### Backend Environment (backend/.env)

Create a file named `.env` in the **backend** folder with:

```env
# Backend Environment Variables
# YOU MUST ADD YOUR SUPABASE DATABASE_URL

DATABASE_URL=your-supabase-connection-pooler-url-here

# JWT Configuration
JWT_SECRET=local-development-secret-key-change-in-production-minimum-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS - Allowed Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://localhost:5173

# PayFast Sandbox Credentials (For Testing)
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=jt7NOE43FZPn
PAYFAST_MODE=sandbox
```

**IMPORTANT:** Replace `DATABASE_URL` with your actual Supabase connection pooler URL!

---

## Step 2: Install Dependencies

Run these commands in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
npm install
```

---

## Step 3: Start Servers

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

---

## Step 4: Access the Application

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## Step 5: Test PayFast

1. Register/Login to your application
2. Add products to cart
3. Go to checkout
4. **Select "PayFast"** as payment method
5. Fill in customer details
6. Click "Place Order"
7. You'll be redirected to PayFast sandbox
8. Use test card: `4000000000000002`, Expiry: `12/25`, CVV: `123`

---

## 🔑 What You Need

**The only thing you need to provide is:**
- ✅ Your **Supabase DATABASE_URL** (connection pooler URL)

Get it from: Supabase Dashboard → Project Settings → Database → Connection Pooling

---

## 💡 Notes

- Sandbox mode uses fake payments - no real money involved
- Test all features before deploying
- Once satisfied, get live PayFast credentials for production

