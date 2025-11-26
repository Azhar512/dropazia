# 🚀 Deploy in 3 Simple Steps

## Your URLs:
- **Backend**: https://dropazia.vercel.app
- **Frontend**: https://dropazia.online

---

## STEP 1: Add Environment Variables to Vercel (5 minutes)

### Go to:
https://vercel.com/azhar512s-projects/dropazia/settings/environment-variables

### Add these 9 variables (click "Add New" for each):

| Name | Value | Environment |
|------|-------|-------------|
| `NODE_ENV` | `production` | Production, Preview, Development |
| `DATABASE_URL` | `postgresql://postgres:Aneeq%401234567888@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres?sslmode=require` | Production, Preview, Development |
| `JWT_SECRET` | `8f3a9c7e2d1b6f5a4c8e9d2b7f6a5c4e8d9b7c6f5a4e8d2c7b6f5a9c8e7d2b1f` | Production, Preview, Development |
| `ALLOWED_ORIGINS` | `https://dropazia.online,https://www.dropazia.online` | Production, Preview, Development |
| `PAYFAST_MERCHANT_ID` | `241580` | Production, Preview, Development |
| `PAYFAST_MERCHANT_KEY` | `Pyjm982h_7s-74PQcUn2EgZv` | Production, Preview, Development |
| `PAYFAST_PASSPHRASE` | `Aneeqasif` | Production, Preview, Development |
| `PAYFAST_MODE` | `production` | Production, Preview, Development |
| `FRONTEND_URL` | `https://dropazia.online` | Production, Preview, Development |

### Then:
1. Go to "Deployments" tab
2. Click ⋮ (three dots) on latest deployment
3. Click "Redeploy"
4. Wait ~2 minutes for deployment

✅ **Backend is now ready!**

---

## STEP 2: Update Frontend .env and Build (3 minutes)

### Update `.env` file in project root:
```env
VITE_API_URL=https://dropazia.vercel.app
VITE_PAYFAST_MERCHANT_ID=241580
VITE_PAYFAST_MERCHANT_KEY=Pyjm982h_7s-74PQcUn2EgZv
VITE_PAYFAST_PASSPHRASE=Aneeqasif
VITE_PAYFAST_MODE=production
```

### Build:
```bash
npm run build
```

This creates a `dist/` folder with your production-ready frontend.

✅ **Frontend is now built!**

---

## STEP 3: Upload to Hostinger (5 minutes)

### Via Hostinger File Manager:
1. Login to Hostinger control panel
2. Go to "File Manager"
3. Navigate to `public_html` (or your domain folder)
4. **Delete old files** (if any)
5. Upload **all contents** of `dist/` folder
6. Make sure `.htaccess` is uploaded too

### Via FTP (alternative):
1. Use FTP client (FileZilla, etc.)
2. Connect to your Hostinger FTP
3. Navigate to `public_html`
4. Upload all contents of `dist/` folder
5. Upload `.htaccess`

✅ **Frontend is now live!**

---

## 🎉 TEST YOUR SITE:

Visit: https://dropazia.online

Test:
- [ ] Site loads correctly
- [ ] User can register/login
- [ ] Products are displayed
- [ ] Add to cart works
- [ ] Checkout works
- [ ] PayFast payment works
- [ ] Admin dashboard accessible
- [ ] Super admin features work

---

## ❓ ITN URL for PayFast:

**You don't need to set it!** 

Our code automatically sends:
```
https://dropazia.vercel.app/api/payfast/notify
```

With each payment request. ✅

---

## 🆘 If Something Goes Wrong:

### Backend Issues:
- Check Vercel deployment logs
- Verify all environment variables are set
- Check https://dropazia.vercel.app/api/health (should return server status)

### Frontend Issues:
- Check browser console for errors
- Verify `.env` has correct `VITE_API_URL`
- Make sure `.htaccess` is uploaded for SPA routing

### Database Issues:
- Test connection in Supabase dashboard
- Verify DATABASE_URL has correct password with `%40` instead of `@`

---

**Total Time: ~15 minutes to full deployment!** 🚀

