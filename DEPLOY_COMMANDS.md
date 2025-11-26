# 🚀 Quick Deployment Commands

## Backend to Vercel (CLI Method)

```bash
# Navigate to backend
cd backend

# Deploy to Vercel
vercel

# Follow prompts:
# - Login if needed
# - Set up and deploy: YES
# - Project name: shopdaraz-hub-backend
# - Override settings: NO

# After first deployment, deploy to production:
vercel --prod
```

## Backend to Vercel (GitHub Method) - RECOMMENDED

```bash
# From project root
git add .
git commit -m "Add PayFast and production setup"
git push origin main

# Then:
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repo
# 3. Set Root Directory to "backend"
# 4. Deploy
# 5. Add environment variables in Vercel dashboard
# 6. Redeploy
```

## Frontend to Hostinger

```bash
# Update .env with your Vercel backend URL
# Example: VITE_API_URL=https://your-backend.vercel.app

# Build the frontend
npm run build

# Upload dist/ folder to Hostinger:
# 1. Login to Hostinger File Manager
# 2. Go to public_html (or your domain folder)
# 3. Upload entire contents of dist/ folder
# 4. Upload .htaccess file (for SPA routing)
```

## PayFast ITN URL Configuration

After deploying backend, update PayFast dashboard:

1. Go to https://www.payfast.co.za
2. Settings → Integration
3. Set ITN URL: `https://your-backend.vercel.app/api/payfast/notify`
4. Save

---

## Environment Variables Checklist

### Vercel (Backend)
- [ ] NODE_ENV
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] ALLOWED_ORIGINS
- [ ] PAYFAST_MERCHANT_ID
- [ ] PAYFAST_MERCHANT_KEY
- [ ] PAYFAST_PASSPHRASE
- [ ] PAYFAST_MODE
- [ ] FRONTEND_URL

### Frontend (.env before build)
- [ ] VITE_API_URL (Your Vercel backend URL)
- [ ] VITE_PAYFAST_MERCHANT_ID
- [ ] VITE_PAYFAST_MERCHANT_KEY
- [ ] VITE_PAYFAST_PASSPHRASE
- [ ] VITE_PAYFAST_MODE

---

## Testing Checklist

After deployment:
- [ ] Test product listing
- [ ] Test user registration/login
- [ ] Test adding to cart
- [ ] Test checkout flow
- [ ] **Test PayFast payment**
- [ ] Test admin dashboard
- [ ] Test super admin features
- [ ] Test sidebar real-time updates
- [ ] Test product image/PDF downloads

