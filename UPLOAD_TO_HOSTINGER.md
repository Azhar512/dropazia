# 📤 Upload Frontend to Hostinger

## Your Built Files Location:
```
C:\Users\speed\Desktop\shopdaraz-hub-main\dist\
```

---

## Method 1: Hostinger File Manager (RECOMMENDED)

### Step 1: Login
1. Go to: https://hpanel.hostinger.com
2. Login with your credentials

### Step 2: Open File Manager
1. Find your domain: **dropazia.online**
2. Click "File Manager" or "Manage"

### Step 3: Navigate to Public Folder
Usually one of these:
- `public_html` (if main domain)
- `domains/dropazia.online/public_html`
- `dropazia.online/public_html`

### Step 4: Clean Old Files
1. Select all files in the folder (if any)
2. Click "Delete"

### Step 5: Upload New Files
1. Click "Upload" button
2. Navigate to: `C:\Users\speed\Desktop\shopdaraz-hub-main\dist\`
3. **IMPORTANT**: Upload ALL contents INSIDE the dist folder:
   - index.html
   - assets/ (entire folder)
   - Any other files

### Step 6: Upload .htaccess
1. Go back to: `C:\Users\speed\Desktop\shopdaraz-hub-main\`
2. Find `.htaccess` file
3. Upload it to the same folder as index.html

---

## Method 2: FTP Client (FileZilla)

### FTP Credentials (Get from Hostinger):
- Host: ftp.dropazia.online (or as provided by Hostinger)
- Username: (from Hostinger FTP accounts)
- Password: (from Hostinger FTP accounts)
- Port: 21

### Steps:
1. Open FileZilla (or any FTP client)
2. Connect using credentials above
3. Navigate to `public_html` folder on server
4. Delete old files
5. Upload entire contents of `dist/` folder
6. Upload `.htaccess` file

---

## ✅ After Upload:

1. **Test Your Site**: 
   - Visit: https://dropazia.online
   - Should load your app

2. **Test Features**:
   - [ ] Homepage loads
   - [ ] Products display
   - [ ] User can register/login
   - [ ] Add to cart works
   - [ ] Checkout works
   - [ ] PayFast payment works

3. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for any errors
   - Verify API calls go to: https://dropazia.vercel.app

---

## 🆘 Common Issues:

### "404 on Refresh"
- **Solution**: Make sure `.htaccess` is uploaded
- The `.htaccess` file enables SPA routing

### "API Connection Failed"
- **Solution**: Check Vercel environment variables are set
- Verify backend is running: https://dropazia.vercel.app

### "White Screen"
- **Solution**: Check browser console for errors
- Verify all files uploaded correctly
- Check file permissions (should be 644 for files, 755 for folders)

---

## 📍 Files You Need to Upload:

From `dist/` folder:
- ✅ index.html
- ✅ assets/ (entire folder with all CSS/JS)
- ✅ Any other files in dist/

From project root:
- ✅ .htaccess (for SPA routing)

---

**After upload, visit: https://dropazia.online** 🚀

