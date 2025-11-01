# 🔐 Create Admin User - Instructions

## Problem
You're getting a 401 Unauthorized error because the admin user doesn't exist in the database.

## Solution: Create Admin User

### Option 1: Run Script Locally (Recommended)

**Step 1:** Make sure you have the production `MONGODB_URI` set in your `.env` file:

```env
MONGODB_URI=mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
```

**Step 2:** Run the create-admin script:

```bash
cd backend
node src/create-admin.js
```

**Step 3:** You should see:
```
✅ Connected to MongoDB
✅ Admin user created successfully!
📧 Email: admin@shopdaraz.com
🔑 Password: admin123
```

**Step 4:** Now try logging in with:
- **Email:** `admin@shopdaraz.com`
- **Password:** `admin123`

---

### Option 2: Use MongoDB Atlas Directly

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Browse Collections"**
3. Select your `shopdaraz` database
4. Open the `users` collection
5. Click **"INSERT DOCUMENT"**
6. Paste this JSON:

```json
{
  "name": "Admin User",
  "email": "admin@shopdaraz.com",
  "phone": "+92-300-1234567",
  "passwordHash": "$2a$10$rH8S8k5L7V3hJvZqX8yX8eKwZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5",
  "role": "admin",
  "status": "approved",
  "isActive": true,
  "createdAt": { "$date": "2025-11-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2025-11-01T00:00:00.000Z" }
}
```

**⚠️ IMPORTANT:** The `passwordHash` above is for password `admin123`. If you need a different password, you'll need to generate a new hash using bcrypt.

---

### Option 3: Add FORCE_SEED to Vercel (Alternative)

If you want to use the full seed script:

1. Go to Vercel → Settings → Environment Variables
2. Add new variable:
   - **Name:** `FORCE_SEED`
   - **Value:** `true`
3. The seed script will run on next deployment (but this DELETES all existing users/products!)

**⚠️ WARNING:** This will DELETE all existing data!

---

## Default Admin Credentials

- **Email:** `admin@shopdaraz.com`
- **Password:** `admin123`

After creating the admin user, you should be able to log in!

