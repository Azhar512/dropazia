# Complete Deployment Guide for ShopDaraz Hub

This guide will help you deploy your ShopDaraz Hub application to your Hostinger business plan hosting with Node.js and MongoDB.

## Prerequisites

- Hostinger Business Plan (with Node.js support)
- MongoDB Atlas account (free tier recommended)
- Domain name connected to your Hostinger account
- Git installed on your local machine

## Step 1: Setup MongoDB Atlas (Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (FREE tier)
4. Wait for cluster to be created (5-10 minutes)

### 1.2 Configure Database Access
1. Click "Security" → "Database Access"
2. Click "Add New Database User"
3. Set username and password (save these!)
4. Set privileges to "Atlas Admin"
4. Click "Add User"

### 1.3 Configure Network Access
1. Click "Security" → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Get Connection String
1. Click "Database" → "Connect"
2. Select "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
4. Replace `<password>` with your actual password
5. Save this connection string!

## Step 2: Prepare Your Code for Deployment

### 2.1 Update Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string_here
DB_NAME=shopdaraz

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# JWT Secret
JWT_SECRET=your_very_secure_random_string_here_use_at_least_32_characters

# Backend URL (for frontend to connect)
API_URL=https://yourdomain.com/api

# Optional: Email service (add later if needed)
# SMTP_HOST=smtp.hostinger.com
# SMTP_PORT=587
# SMTP_USER=your_email@yourdomain.com
# SMTP_PASS=your_email_password
```

### 2.2 Update Frontend Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://yourdomain.com/api
```

## Step 3: Build Frontend for Production

### 3.1 Install Dependencies (if not done)
```bash
npm install
```

### 3.2 Build Frontend
```bash
npm run build
```

This will create a `dist` folder with your production-ready frontend.

## Step 4: Deploy to Hostinger

### 4.1 Connect via FTP/File Manager
1. Login to Hostinger control panel
2. Go to File Manager
3. Navigate to your domain's public folder (usually `public_html` or `htdocs`)

### 4.2 Upload Frontend Files
1. Upload the entire `dist` folder contents to your domain's root
2. Upload the `public` folder
3. Upload the `.htaccess` file from your project root

### 4.3 Upload Backend
1. Create a folder named `api` in your domain's root
2. Upload the entire `backend` folder to `api/`
3. Make sure to include:
   - All `src/` files
   - `package.json`
   - `node_modules` (or run `npm install` on server)
   - `.env` file with your configuration

### 4.4 Configure Node.js on Hostinger
1. In Hostinger control panel, find "Node.js" section
2. Set Node.js version (18.x or higher)
3. Set application root to `api`
4. Set startup file to `src/server.js`
5. Enable Node.js and restart

## Step 5: Test Your Deployment

### 5.1 Test Backend
Visit: `https://yourdomain.com/api/health`
Should return: `{"success":true,"message":"Server is running"}`

### 5.2 Test Frontend
Visit: `https://yourdomain.com`
Should show your landing page

## Step 6: Final Configuration

### 6.1 Update CORS Settings
In `backend/src/server.js`, ensure CORS allows your domain:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000', 'http://localhost:8080', ...];
```

### 6.2 Enable HTTPS
Hostinger usually provides SSL certificates automatically. Make sure it's enabled in your control panel.

## Troubleshooting

### Backend not starting?
1. Check Node.js version matches locally
2. Check `package.json` scripts
3. Check error logs in Hostinger panel
4. Verify MongoDB connection string

### Frontend can't connect to backend?
1. Check CORS settings
2. Verify API_URL in frontend `.env`
3. Check browser console for errors

### Products not showing?
1. Seed your database using the admin panel
2. Check MongoDB connection
3. Verify products have correct `module` field

## Post-Deployment Checklist

- [ ] MongoDB Atlas configured and accessible
- [ ] Environment variables set correctly
- [ ] Backend starting and accessible
- [ ] Frontend loading correctly
- [ ] Admin panel accessible
- [ ] User registration/login working
- [ ] Products displaying
- [ ] Cart functionality working
- [ ] SSL certificate active
- [ ] WhatsApp button working
- [ ] Returns feature working

## Notes

1. **Database**: Use MongoDB Atlas for cloud database (free tier supports 512MB)
2. **File Storage**: For production images, consider using cloud storage like Cloudinary
3. **Email**: Configure SMTP for email notifications
4. **Monitoring**: Set up error monitoring (e.g., Sentry)
5. **Backups**: Configure regular database backups in MongoDB Atlas

## Support

If you encounter issues:
1. Check Hostinger Node.js logs
2. Check browser console for frontend errors
3. Check MongoDB Atlas connection status
4. Verify all environment variables are set

Good luck with your deployment! 🚀

