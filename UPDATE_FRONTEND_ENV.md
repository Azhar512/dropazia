# 📝 Update Frontend .env File

**File**: `.env` (in project root)

Replace the content with:

```env
# Backend API URL - Your Vercel Backend
VITE_API_URL=https://dropazia.vercel.app

# PayFast PRODUCTION Credentials
VITE_PAYFAST_MERCHANT_ID=241580
VITE_PAYFAST_MERCHANT_KEY=Pyjm982h_7s-74PQcUn2EgZv
VITE_PAYFAST_PASSPHRASE=Aneeqasif
VITE_PAYFAST_MODE=production
```

---

## After updating:

1. **Save the file**
2. **Build the frontend**: `npm run build`
3. **Upload `dist/` folder to Hostinger**

---

## PayFast ITN URL:

After Vercel redeploys, set this in PayFast dashboard:

**ITN URL**: `https://dropazia.vercel.app/api/payfast/notify`

---

**Delete this file after reading!**

