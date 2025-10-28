# 🚀 Local Development Setup Guide

## ✅ **Application Status**

Your ShopDaraz Hub is now running locally! Here's everything you need to know:

---

## 🌐 **Access Your Application**

### **Frontend (React App)**
- **URL**: http://localhost:8080
- **Status**: Running in development mode
- **Hot Reload**: Enabled (changes update automatically)

### **Backend API (Node.js/Express)**
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api

### **Database**
- **Type**: MongoDB
- **Connection**: http://localhost:27017
- **Status**: Running (Windows Service)

---

## 📋 **Testing Your Application**

### **1. Open Frontend**
1. **Open browser**: http://localhost:8080
2. **You should see**: Landing page with Daraz and Shopify modules

### **2. Test Features**

#### **Login/Create Account**
- Click on "Daraz Module" or "Shopify Module"
- Use **Register** to create new account
- Or use these **demo credentials**:
  ```
  Email: admin@shopdaraz.com
  Password: admin123
  ```

#### **Browse Products**
- Navigate to Daraz or Shopify products
- Browse product catalog
- View product details

#### **Shopping Cart**
- Add products to cart
- Cart persists in database
- Update quantities
- Remove items

#### **Checkout**
- Click checkout
- Fill shipping information
- Process payment (JazzCash demo)

#### **Admin Dashboard**
- Type "admin" on landing page to reveal admin access
- Login as admin
- Approve/reject users
- Manage products

---

## 🔧 **Manual Start/Stop Commands**

### **If You Need to Restart**

#### **Backend Server**
```bash
# Navigate to backend folder
cd backend

# Start backend
npm run dev

# Or stop with Ctrl+C
```

#### **Frontend Server**
```bash
# In project root
npm run dev

# Or stop with Ctrl+C
```

#### **MongoDB Service**
```powershell
# Check status
Get-Service -Name MongoDB

# Start MongoDB
Start-Service -Name MongoDB

# Stop MongoDB
Stop-Service -Name MongoDB
```

---

## 🗄️ **Database Information**

### **Collections**
Your MongoDB has these collections:
- `users` - User accounts
- `products` - Product catalog
- `cartitems` - Shopping cart items
- `orders` - Order history

### **Access Database**
You can use MongoDB Compass to view the database:
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. View collections and data

### **Sample Data**
The database is seeded with:
- Admin user: `admin@shopdaraz.com` / `admin123`
- Demo products for Daraz and Shopify modules

---

## 🐛 **Troubleshooting**

### **Issue: Port Already in Use**

**Backend (Port 5000):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 8080):**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID> /F
```

### **Issue: Backend Won't Start**

**Check:**
1. MongoDB is running: `Get-Service -Name MongoDB`
2. Backend `.env` file exists in `backend/` folder
3. Dependencies installed: `cd backend && npm install`

### **Issue: Frontend Won't Start**

**Check:**
1. Dependencies installed: `npm install`
2. Port 8080 is available

### **Issue: Can't Connect to Database**

**Check:**
1. MongoDB service is running
2. Connection string in `backend/.env` is correct
3. Default should be: `mongodb://localhost:27017/shopdaraz`

---

## 📊 **Environment Variables**

### **Backend (.env in backend folder)**
```env
MONGODB_URI=mongodb://localhost:27017/shopdaraz
JWT_SECRET=your-local-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8080
```

### **Frontend (.env in root)**
```env
VITE_API_URL=http://localhost:5000
```

---

## 🎯 **Development Features**

- ✅ **Hot Reload**: Changes reflect immediately
- ✅ **Source Maps**: Debug in browser DevTools
- ✅ **MongoDB Integration**: Real database (no mock data)
- ✅ **JWT Authentication**: Real authentication
- ✅ **Development Mode**: Detailed error messages

---

## 🚀 **Ready to Code!**

Your application is running and ready for development!

**Happy Coding!** 🎉

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check terminal for backend errors
3. Verify MongoDB is running
4. Check environment variables are set correctly
