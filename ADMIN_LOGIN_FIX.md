# 🔧 Admin Login Fix

## ✅ Status: Backend API is Working!

The backend login API is working correctly:
- ✅ Admin user exists in database
- ✅ Password hash is correct
- ✅ Login endpoint returns success (tested directly)

## 🔍 Frontend Issue

The frontend is calling the API but getting an error. Check:

### 1. Make Sure Backend Server is Running

```bash
cd backend
npm run dev
```

The server should be running on `http://localhost:5000`

### 2. Check Frontend .env File

Make sure you have a `.env` file in the **root directory** (not in `backend/`) with:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Restart Frontend Dev Server

After updating `.env`, restart the frontend:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Check Browser Console

Open browser DevTools (F12) and check:
- Network tab: See if the API call is being made
- Console tab: Look for any error messages
- Check if the request URL is correct: `http://localhost:5000/api/auth/login`

### 5. Test Login Credentials

- **Email**: `admin@shopdaraz.com`
- **Password**: `admin123`

## 🐛 Common Issues

1. **Backend not running**: Make sure `npm run dev` is running in backend folder
2. **Wrong API URL**: Check `VITE_API_URL` in root `.env`
3. **CORS error**: Backend should allow `http://localhost:8080` or your frontend port
4. **Cached response**: Clear browser cache and hard refresh (Ctrl+Shift+R)

## ✅ Quick Test

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the login request:
   - Status should be `200`
   - Response should show `"success": true`
   - If you see `401`, the credentials are wrong
   - If you see `CORS error`, backend CORS config needs fixing

---

**The backend is working - the issue is likely frontend configuration or the backend server not running!**

