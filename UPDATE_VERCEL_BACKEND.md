# 🚀 Update Vercel Backend for dropazia.online

## ✅ Your Setup:
- **Existing Domain:** dropazia.shop
- **New Domain:** dropazia.online
- **Backend:** Vercel (`https://dropazia.vercel.app`)
- **Status:** DNS propagating (nameservers updated)

---

## 📋 STEP-BY-STEP: Update Vercel Backend

### **Step 1: Go to Vercel Dashboard**

1. **Visit**: https://vercel.com/dashboard
2. **Login** to your account
3. **Find** your backend project: `dropazia` (or whatever you named it)

### **Step 2: Open Environment Variables**

1. **Click** on your project (`dropazia`)
2. **Go to**: **Settings** tab (top navigation)
3. **Click**: **Environment Variables** (left sidebar)

### **Step 3: Update FRONTEND_URL**

1. **Find**: `FRONTEND_URL` in the list
2. **Click**: **Edit** (or pencil icon)

3. **Change the value to** (both domains, comma-separated):
   ```
   https://dropazia.shop,https://dropazia.online
   ```

4. **IMPORTANT**: 
   - Include `https://` for both
   - Separate with comma (no space after comma)
   - Make sure both domains are correct

5. **Click**: **Save**

### **Step 4: Verify All Environment Variables**

Make sure you have these environment variables set:

```
✅ NODE_ENV = production
✅ MONGODB_URI = mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0
✅ JWT_SECRET = dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA
✅ PORT = 5000
✅ FRONTEND_URL = https://dropazia.shop,https://dropazia.online
```

### **Step 5: Wait for Redeploy**

- **Vercel will automatically redeploy** when you save environment variables
- **Wait**: 1-3 minutes
- **Check**: Deployment logs to ensure it deployed successfully

---

## 🎯 **Exact Value to Set:**

**In Vercel Environment Variables, set:**

**Variable Name:** `FRONTEND_URL`

**Variable Value:** 
```
https://dropazia.shop,https://dropazia.online
```

**That's it!** Just paste this exact value.

---

## ✅ **Verification:**

After updating:

1. **Check**: Vercel deployment logs
2. **Verify**: No errors in deployment
3. **Test**: Once DNS propagates (24-48 hours), test both domains

---

## 🔍 **Troubleshooting:**

### **Can't find FRONTEND_URL?**
- Click **"Add New"** button
- **Name**: `FRONTEND_URL`
- **Value**: `https://dropazia.shop,https://dropazia.online`
- **Environments**: Select "Production"
- **Save**

### **Deployment failed?**
- Check deployment logs in Vercel
- Verify all environment variables are correct
- Make sure no extra spaces in FRONTEND_URL value

### **CORS errors after DNS propagates?**
- Double-check FRONTEND_URL has both domains
- Make sure both start with `https://`
- Wait 2-3 minutes after updating (backend needs to restart)

---

## 📝 **Current Status:**

✅ **Backend Code**: Updated (supports multiple domains)
✅ **DNS**: In progress (propagating)
⏳ **Vercel Config**: Need to update FRONTEND_URL ← **YOU ARE HERE**
⏳ **Hostinger**: Need to add domain after DNS completes

---

## 🎉 **What Happens Next:**

1. ✅ **You update Vercel** (this step)
2. ⏳ **DNS propagates** (24-48 hours)
3. ⏳ **Add domain to Hostinger** (after DNS completes)
4. ✅ **Enable SSL** (after domain added)
5. ✅ **Your new domain works!**

---

**Update Vercel now, and everything will be ready when DNS completes!**

