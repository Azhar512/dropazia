# 🔍 API Debugging Steps

## Issue: Products Not Showing (0 Products)

Even though 29 products exist in database, they're not displaying.

## 🔍 Step 1: Check Browser Console

1. Open admin dashboard: `dropazia.online/admin`
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Look for messages:
   - `🔄 Loading products from API...`
   - `🌐 API Request: ...`
   - `✅ Products loaded: ...`
   - `📊 Response structure: ...`

**What to check:**
- Is API request being made?
- What URL is being called?
- What response is received?
- Any error messages?

## 🔍 Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page (F5)
3. Look for request to `/api/products`
4. Click on it
5. Check:
   - **Request URL** - What's the full URL?
   - **Response** - What data is returned?
   - **Status** - Is it 200 OK?

## 🔍 Step 3: Check API Base URL

The issue might be the API URL is pointing to localhost instead of Vercel.

**Check this:**
- Open browser console
- Type: `import.meta.env.VITE_API_URL`
- Should show your Vercel backend URL
- If it's `undefined` or `http://localhost:5000`, that's the problem!

## ✅ Fix Applied:

I've updated the code to:
1. **Better error handling** - Logs full response structure
2. **Handle different response formats** - Works with various API response structures
3. **Better logging** - Shows exactly what data is received

## 🚀 Next Steps:

1. **Upload new `dist` folder** to Hostinger
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Open browser console** (F12)
4. **Click "Refresh Products"** button
5. **Check console logs** - Should show:
   - `📊 Response structure: ...`
   - `📦 Mapped products: 29 products`

If you still see "0 products", check the console logs and share what you see!

---

## 🔧 Quick Test:

You can also test the API directly by:
1. Opening browser console (F12)
2. Running this:
```javascript
fetch('https://shopdaraz-hub-backend.vercel.app/api/products')
  .then(r => r.json())
  .then(data => console.log('API Response:', data))
```

This will show if the API is returning products.

