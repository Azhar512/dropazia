# How to Create Environment Files

## Step 1: Get Your MongoDB Password

You need to know your MongoDB Atlas password. If you forgot it:
1. Go to MongoDB Atlas
2. Click "Database Access"
3. Click your user ("dropazia")
4. Click "Edit" or reset password

## Step 2: Create backend/.env File

1. Open Notepad or any text editor
2. Copy this content:

```env
MONGODB_URI=mongodb+srv://dropazia:YOUR_PASSWORD@cluster0.9hv504i.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
JWT_SECRET=GenerateRandomSecureKeyHereWithAtLeast32Characters
FRONTEND_URL=http://localhost:8081
```

3. Replace `YOUR_PASSWORD` with your actual MongoDB password
4. Replace `GenerateRandomSecureKeyHereWithAtLeast32Characters` with a random string
   - You can generate one at: https://randomkeygen.com/
5. Save as `backend/.env` (exact filename, no `.txt` extension)
6. Make sure it's in the `backend` folder

## Step 3: Create Frontend .env File

Create `.env` file in the **root directory** (same folder as `package.json`):

```env
VITE_API_URL=http://localhost:5000/api
```

For production, change to:
```env
VITE_API_URL=https://yourdomain.com/api
```

## Step 4: Test Locally

After creating the files, restart your backend:
```
cd backend
npm run dev
```

Your app will now use MongoDB Atlas!

---

## For Hostinger Deployment

When deploying to production:

1. Keep the same MongoDB connection (already configured for cloud)
2. Update `FRONTEND_URL` in `backend/.env` to your actual domain
3. Update `VITE_API_URL` in root `.env` to your domain's API endpoint

