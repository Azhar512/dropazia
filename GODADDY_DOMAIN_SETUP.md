# 🎯 Complete Guide: Connect GoDaddy Domain to Hostinger + Update Backend

## 🌐 Your New Setup:
- **New Domain:** [Your GoDaddy Domain] (e.g., `yournewdomain.com`)
- **Frontend:** Hostinger
- **Backend:** Vercel (`https://dropazia.vercel.app`)
- **Database:** MongoDB Atlas (no changes needed!)

---

## 📋 STEP 1: Connect GoDaddy Domain to Hostinger

### **A) Get Hostinger Nameservers**

1. **Login to Hostinger**: https://hpanel.hostinger.com
2. **Go to**: Hosting → Manage (or Websites → Manage)
3. **Find**: "Nameservers" or "DNS Settings"
4. **Copy the nameservers** (usually look like):
   ```
   ns1.dns-parking.com
   ns2.dns-parking.com
   ```
   (Hostinger will give you exact ones)

### **B) Update GoDaddy DNS**

1. **Login to GoDaddy**: https://sso.godaddy.com
2. **Go to**: My Products → Domains
3. **Click**: Your domain name
4. **Click**: "DNS" or "Manage DNS"
5. **Find**: "Nameservers" section
6. **Click**: "Change" or "Edit"
7. **Select**: "Custom" (not "Default")
8. **Enter**: Hostinger nameservers you copied
9. **Save** changes

### **C) Wait for DNS Propagation**

- **Time**: 5 minutes to 48 hours (usually 30 minutes)
- **Check**: Use https://dnschecker.org to verify propagation

---

## 📋 STEP 2: Add Domain to Hostinger Hosting

### **Method 1: Using Hostinger Dashboard**

1. **Login to Hostinger**: https://hpanel.hostinger.com
2. **Go to**: Websites → Add Website
3. **Select**: "Use existing domain"
4. **Enter**: Your new GoDaddy domain
5. **Assign to**: Your hosting plan
6. **Document root**: `public_html`
7. **Click**: "Add" or "Create"

### **Method 2: If "Already used" Error**

1. **Go to**: Hosting → Manage
2. **Click**: "Hosting Plan" in sidebar
3. **Look for**: "Add Domain" or "Domain Management"
4. **Add**: Your new domain there

### **Method 3: Contact Hostinger Support**

If above doesn't work:
1. **Click**: "Ask Kodee" (chat support)
2. **Say**: "I need to connect my GoDaddy domain [yourdomain.com] to my hosting files"

---

## 📋 STEP 3: Update Backend Configuration

### **A) Update Vercel Environment Variables**

1. **Go to**: https://vercel.com/dashboard
2. **Select**: Your backend project (`dropazia`)
3. **Go to**: Settings → Environment Variables
4. **Find**: `FRONTEND_URL`
5. **Edit** or **Add new**:
   ```
   FRONTEND_URL=https://yournewdomain.com
   ```
   **OR** if you want both domains:
   ```
   FRONTEND_URL=https://dropazia.shop,https://yournewdomain.com
   ```
   (Check CORS setup first - see below)

### **B) Update Backend CORS (if needed)**

If you want **MULTIPLE domains** allowed, update `backend/src/server.js`:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : []
  : [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:8081',
    ];
```

Then in Vercel, set:
```
FRONTEND_URL=https://dropazia.shop,https://yournewdomain.com
```

---

## 📋 STEP 4: Update Frontend Configuration

### **A) Update .env.production**

1. **Open**: `.env.production` file in project root
2. **Update**: (This is just for future builds - your live site uses already built files)
   ```env
   VITE_API_URL=https://dropazia.vercel.app/api
   ```
   (Keep backend URL same - no change needed)

### **B) Rebuild Frontend (Optional)**

Only if you want to rebuild with new settings:

```bash
npm run build
```

Then upload new `dist/` files to Hostinger `public_html/`

---

## 📋 STEP 5: Enable SSL Certificate

1. **In Hostinger**: Go to SSL → Let's Encrypt
2. **Select**: Your new domain
3. **Click**: "Enable SSL"
4. **Wait**: 5-10 minutes

---

## 📋 STEP 6: Upload Frontend Files (if rebuilding)

1. **Go to**: Hostinger File Manager
2. **Navigate**: `public_html/` folder
3. **Upload**: All files from `dist/` folder
4. **Upload**: `.htaccess` file

---

## ✅ **DATABASE: NO CHANGES NEEDED!**

**Good news**: Your MongoDB Atlas database doesn't store domain URLs anywhere. 
- ✅ **No database changes required**
- ✅ **No migration needed**
- ✅ **Database works with any domain**

The domain is only used in:
- ✅ Backend CORS configuration (environment variable)
- ✅ Frontend build configuration (optional)
- ✅ Hostinger hosting settings

---

## 🎯 **Quick Summary:**

### **What to Update:**
1. ✅ **GoDaddy DNS**: Point nameservers to Hostinger
2. ✅ **Hostinger**: Add domain to hosting
3. ✅ **Vercel Backend**: Update `FRONTEND_URL` environment variable
4. ✅ **Optional**: Rebuild and upload frontend

### **What NOT to Update:**
1. ❌ **Database**: No changes needed
2. ❌ **Backend Code**: No code changes (unless adding multiple domains)
3. ❌ **Frontend Code**: No code changes needed

---

## 🔍 **Testing Checklist:**

After setup, test:
- [ ] `https://yournewdomain.com` loads correctly
- [ ] SSL certificate is active (green padlock)
- [ ] Login/Register works
- [ ] Products load from API
- [ ] Cart functionality works
- [ ] Admin dashboard accessible

---

## 🚨 **Troubleshooting:**

### **Domain not loading?**
- Wait 30 minutes for DNS propagation
- Check DNS with: https://dnschecker.org
- Verify nameservers are correct in GoDaddy

### **CORS errors?**
- Check `FRONTEND_URL` in Vercel environment variables
- Ensure domain starts with `https://`
- Wait 2-3 minutes after updating Vercel env vars

### **SSL not working?**
- Wait 10 minutes after enabling
- Clear browser cache
- Try incognito mode

---

## 📞 **Need Help?**

**For Domain Issues:**
- GoDaddy Support: https://www.godaddy.com/help
- Hostinger Support: Use "Ask Kodee" in hPanel

**For Backend Issues:**
- Vercel Docs: https://vercel.com/docs
- Check Vercel deployment logs

---

## 🎉 **Done!**

Your new GoDaddy domain is now connected to Hostinger, and your backend is configured to accept requests from it!

