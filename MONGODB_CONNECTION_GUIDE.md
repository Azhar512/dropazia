# How to Get Your MongoDB Connection String

## Step 1: In MongoDB Atlas, Click "Drivers"

From the screenshot you sent (showing different connection methods), click on **"Drivers"** option.

## Step 2: Get Connection String

After clicking "Drivers":
1. Select **"Node.js"** as your driver
2. Select version **3.6 or later** (or latest)
3. Copy the connection string that looks like:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 3: Update Your Backend `.env` File

Create a file `backend/.env` with this content:

```env
# MongoDB Atlas - Replace with YOUR connection string from Step 2
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# JWT Secret - Generate at: https://randomkeygen.com/
JWT_SECRET=YourRandomSecureStringHereAtLeast32Characters
```

**Important**: 
- Replace `username:password` with your actual MongoDB credentials
- Replace `cluster0.xxxxx` with your actual cluster name
- Replace `yourdomain.com` with your actual domain
- Generate JWT_SECRET at https://randomkeygen.com/

## Step 4: Test Connection

Once your `.env` is configured, your backend will automatically connect to MongoDB Atlas when you start it.

## That's It!

Your app will now use MongoDB Atlas (cloud database) instead of local MongoDB!

