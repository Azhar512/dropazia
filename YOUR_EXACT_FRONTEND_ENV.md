# 🎨 YOUR EXACT Frontend .env File

**File**: `.env` (in project root - where package.json is)

Replace the entire content with:

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

## 🚀 After Updating .env:

### 1. Save the file

### 2. Build the frontend:
```bash
npm run build
```

### 3. Upload to Hostinger:
- Login to Hostinger File Manager or FTP
- Go to `public_html` (or your domain folder)
- Upload **all contents** of the `dist/` folder
- Make sure `.htaccess` is also uploaded (for SPA routing)

---

**Your site will then be live at: https://dropazia.online** 🎉

---

**Delete this file after reading!**

