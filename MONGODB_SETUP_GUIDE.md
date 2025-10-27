# 🗄️ MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. **Go to** [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Sign up** for free account
3. **Verify your email**

## Step 2: Create Cluster

1. Click **"Build a Database"**
2. Choose **"M0 - FREE"** cluster (Free tier)
3. **Cloud Provider**: Choose closest to you (AWS recommended)
4. **Region**: Select closest region (e.g., `N. Virginia (us-east-1)`)
5. Click **"Create"**
6. **Wait 1-2 minutes** for cluster to be created

## Step 3: Create Database User

1. In the **"Database Access"** section:
   - Click **"Add New Database User"**
   - **Authentication Method**: Password
   - **Username**: `shopdaraz_admin` (or your choice)
   - **Password**: Create a strong password (save it!)
   - Select **"Read and write to any database"**
   - Click **"Add User"**

## Step 4: Configure Network Access

1. Go to **"Network Access"** section
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for now)
   - This allows Railway and Hostinger to connect
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go back to **"Database"** section
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 5.0 or later
6. **Copy the connection string** (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Connection String

Replace `<password>` with your actual password:

**Example:**
```
mongodb+srv://shopdaraz_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shopdaraz?retryWrites=true&w=majority
```

**Save this connection string!** You'll need it for Railway deployment.

## Step 7: Create Database

The database name in the connection string is what will be created automatically. Make sure to include the database name:

```
mongodb+srv://...@cluster0.xxxxx.mongodb.net/shopdaraz?retryWrites=true&w=majority
                                                      ^^^^^^^^^
                                                   Database name
```

## ✅ What You Have Now

- ✅ MongoDB Atlas account
- ✅ Free cluster running
- ✅ Database user credentials
- ✅ Network access configured
- ✅ Connection string ready

## 🚀 Next Steps

1. **Save your MongoDB connection string**
2. **Go to Railway deployment** (next step)
3. **Use the connection string** in Railway environment variables

---

**Your MongoDB Atlas is ready!** 🎉
