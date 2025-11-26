# 🔐 Vercel Environment Variables

**Project**: dropazia (https://dropazia.vercel.app)

Add these in **Settings → Environment Variables**:

---

## Copy-Paste These Values:

```
NODE_ENV
production

DATABASE_URL
postgresql://postgres:Aneeq%401234567888@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres?sslmode=require

JWT_SECRET
8f3a9c7e2d1b6f5a4c8e9d2b7f6a5c4e8d9b7c6f5a4e8d2c7b6f5a9c8e7d2b1f

ALLOWED_ORIGINS
https://your-domain.com,https://www.your-domain.com

PAYFAST_MERCHANT_ID
241580

PAYFAST_MERCHANT_KEY
Pyjm982h_7s-74PQcUn2EgZv

PAYFAST_PASSPHRASE
Aneeqasif

PAYFAST_MODE
production

FRONTEND_URL
https://your-domain.com
```

---

## ⚠️ IMPORTANT: Replace These:

- `your-domain.com` → Your actual Hostinger domain (e.g., `shopdaraz.com`)
- Update both `ALLOWED_ORIGINS` and `FRONTEND_URL`

---

## 📝 How to Add in Vercel:

1. Go to: https://vercel.com/azhar512s-projects/dropazia/settings/environment-variables
2. For each variable:
   - Click "Add New"
   - Name: (e.g., NODE_ENV)
   - Value: (e.g., production)
   - Environment: Select "Production" (and "Preview" + "Development" if you want)
   - Click "Save"
3. Repeat for all 10 variables
4. After adding all, go to "Deployments" tab
5. Click the three dots (...) on latest deployment
6. Click "Redeploy"

---

**Delete this file after setting up!**

