# 🚀 PRODUCTION ENVIRONMENT VARIABLES

## ⚠️ IMPORTANT: DO NOT COMMIT THIS FILE TO GITHUB!

---

## 📦 **Backend Environment Variables** (`backend/.env`)

Update your `backend/.env` file with these values:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - Your Supabase Connection (KEEP YOUR EXISTING ONE)
DATABASE_URL=postgresql://postgres:Aneeq%401234567888@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres?sslmode=require

# JWT Secret (KEEP YOUR EXISTING ONE - or generate new if you don't have)
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# CORS - Frontend URL
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# PayFast PRODUCTION Credentials
PAYFAST_MERCHANT_ID=241580
PAYFAST_MERCHANT_KEY=Pyjm982h_7s-74PQcUn2EgZv
PAYFAST_PASSPHRASE=Aneeqasif
PAYFAST_MODE=production

# Frontend URL (for ITN callbacks)
FRONTEND_URL=https://your-domain.com
```

---

## 🎨 **Frontend Environment Variables** (`.env` in root)

Update your `.env` file in the root directory:

```env
# Backend API URL (Your Vercel backend)
VITE_API_URL=https://your-backend-name.vercel.app

# PayFast PRODUCTION Credentials
VITE_PAYFAST_MERCHANT_ID=241580
VITE_PAYFAST_MERCHANT_KEY=Pyjm982h_7s-74PQcUn2EgZv
VITE_PAYFAST_PASSPHRASE=Aneeqasif
VITE_PAYFAST_MODE=production
```

---

## 🔐 **For Vercel Dashboard** (Environment Variables)

When deploying backend to Vercel, add these in **Settings → Environment Variables**:

| Variable Name | Value |
|--------------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://postgres:Aneeq%401234567888@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres?sslmode=require` |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` |
| `ALLOWED_ORIGINS` | `https://your-domain.com,https://www.your-domain.com` |
| `PAYFAST_MERCHANT_ID` | `241580` |
| `PAYFAST_MERCHANT_KEY` | `Pyjm982h_7s-74PQcUn2EgZv` |
| `PAYFAST_PASSPHRASE` | `Aneeqasif` |
| `PAYFAST_MODE` | `production` |
| `FRONTEND_URL` | `https://your-domain.com` |

---

## ✅ **Quick Checklist:**

### **Before Deploying:**
- [ ] Update `backend/.env` with production PayFast credentials
- [ ] Update `.env` (frontend) with production PayFast credentials
- [ ] Update `VITE_API_URL` with your Vercel backend URL
- [ ] Update `ALLOWED_ORIGINS` with your Hostinger domain
- [ ] Generate strong `JWT_SECRET` (if you don't have one)

### **PayFast Dashboard Settings:**
- [ ] Login to https://www.payfast.co.za
- [ ] Go to **Settings → Integration**
- [ ] Set **ITN URL**: `https://your-backend.vercel.app/api/payfast/notify`
- [ ] Verify passphrase is saved: `Aneeqasif`

### **Deploy Backend (Vercel):**
- [ ] Push code to GitHub
- [ ] Link GitHub repo to Vercel
- [ ] Add all environment variables in Vercel dashboard
- [ ] Deploy and get backend URL

### **Deploy Frontend (Hostinger):**
- [ ] Update `.env` with Vercel backend URL
- [ ] Run `npm run build`
- [ ] Upload `dist/` folder to Hostinger
- [ ] Upload `.htaccess` to Hostinger

---

## 🆘 **Need Help?**

Refer to `DEPLOYMENT_READY.md` for detailed step-by-step deployment instructions!

---

## ⚠️ **SECURITY WARNING:**

**DELETE THIS FILE AFTER READING!** It contains sensitive credentials.

Never commit this file to GitHub or share it publicly!
```

