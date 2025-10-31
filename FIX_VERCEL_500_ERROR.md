# 🔧 Fix Vercel Backend 500 Error

## ✅ **GOOD NEWS:**
- ✅ Frontend is working correctly
- ✅ API calls are reaching Vercel backend
- ✅ No more double `/api` path issue
- ❌ **Backend returning 500 Internal Server Error**

---

## 🚨 **The Problem:**

Your Vercel backend is crashing when processing requests. This is usually due to:
1. Missing environment variables
2. MongoDB connection failing
3. Code errors

---

## 🔧 **SOLUTION: Fix Vercel Environment Variables**

### **Step 1: Go to Vercel Dashboard**

1. **Visit**: https://vercel.com/dashboard
2. **Login** to your account
3. **Select**: Your `dropazia` project

### **Step 2: Check Environment Variables**

1. **Go to**: **Settings** → **Environment Variables**
2. **Verify** you have ALL these variables:

#### **REQUIRED Variables:**

```
✅ NODE_ENV = production

✅ MONGODB_URI = mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0

✅ JWT_SECRET = dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA

✅ PORT = 5000

✅ FRONTEND_URL = https://dropazia.shop,https://dropazia.online
```

### **Step 3: Check Vercel Deployment Logs**

1. **Go to**: **Deployments** tab in Vercel
2. **Click**: Latest deployment
3. **Check**: "Build Logs" and "Function Logs"
4. **Look for**: Error messages

### **Step 4: Common Issues & Fixes**

#### **Issue 1: Missing MONGODB_URI**
- **Error**: "MongoDB connection error"
- **Fix**: Add `MONGODB_URI` environment variable
- **Value**: Your MongoDB Atlas connection string

#### **Issue 2: Missing JWT_SECRET**
- **Error**: "JWT_SECRET not configured"
- **Fix**: Add `JWT_SECRET` environment variable
- **Value**: Use the same one from your config: `dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA`

#### **Issue 3: MongoDB IP Whitelist**
- **Error**: "MongoDB connection timeout"
- **Fix**: Go to MongoDB Atlas → Network Access → Allow all IPs (0.0.0.0/0)

#### **Issue 4: Invalid vercel.json**
- **Error**: "Route not found" or build errors
- **Fix**: Ensure `vercel.json` in root OR `backend/vercel.json` is correct

---

## 🎯 **Quick Action Checklist:**

### **In Vercel Dashboard:**

1. **Settings** → **Environment Variables**
   - [ ] `NODE_ENV` = `production`
   - [ ] `MONGODB_URI` = Your MongoDB connection string
   - [ ] `JWT_SECRET` = Strong random string (32+ chars)
   - [ ] `PORT` = `5000`
   - [ ] `FRONTEND_URL` = `https://dropazia.shop,https://dropazia.online`

2. **Deployments** → Latest deployment
   - [ ] Check logs for errors
   - [ ] Look for MongoDB connection errors
   - [ ] Look for missing variable errors

3. **Redeploy** (if you changed env vars)
   - [ ] Vercel will auto-redeploy after saving env vars
   - [ ] Wait 2-3 minutes

---

## 🔍 **Test Backend Health:**

After fixing environment variables, test:

1. **Health Check**: Visit `https://dropazia.vercel.app/health`
   - Should return: `{"success":true,"message":"Server is running"}`

2. **If health check fails**: Backend is not starting
   - Check deployment logs
   - Verify all environment variables are set

---

## 📋 **Exact Values to Use:**

Copy these EXACTLY into Vercel environment variables:

```
NODE_ENV
production

MONGODB_URI
mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/?appName=Cluster0

JWT_SECRET
dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gamV5dCBrZXkgZm9yIHByb2R1Y3Rpb24gZGVwbG95bWVudA

PORT
5000

FRONTEND_URL
https://dropazia.shop,https://dropazia.online
```

---

## 🚀 **After Fixing:**

1. **Save** environment variables in Vercel
2. **Wait** 2-3 minutes for redeploy
3. **Test**: Visit `https://dropazia.vercel.app/health`
4. **Test**: Try login again on `dropazia.online`

---

## ❓ **Still Getting 500?**

If still getting errors:

1. **Check Vercel logs**: Go to Deployments → Latest → Logs
2. **Copy the error message**
3. **Share it** so we can fix the specific issue

---

**Your backend just needs proper environment variables configured in Vercel!**

