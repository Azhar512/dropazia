# 📤 EXACT Files to Upload to Hostinger

## 🎯 Upload Location:
**Hostinger File Manager → public_html**

---

## 📦 Files to Upload:

### **Step 1: Navigate to dist folder**
Open: `C:\Users\speed\Desktop\shopdaraz-hub-main\dist\`

You will see:
- `index.html`
- `assets` folder

**SELECT ALL OF THESE** and upload to Hostinger

---

### **Step 2: Navigate to project root**
Open: `C:\Users\speed\Desktop\shopdaraz-hub-main\`

Find and upload:
- `.htaccess` file

---

## ✅ What You Should See After Upload:

In your Hostinger `public_html` folder, you should have:

```
public_html/
├── index.html          ← From dist/
├── assets/             ← From dist/
│   ├── index-mzAwtF7A.css
│   └── index-DZoDuqL3.js
└── .htaccess           ← From project root
```

---

## 📝 Step-by-Step Upload Instructions:

### 1. Login to Hostinger
- Go to: https://hpanel.hostinger.com
- Login with your credentials

### 2. Open File Manager
- Find your website: **dropazia.online**
- Click "File Manager" button

### 3. Navigate to public_html
- You should see a folder called `public_html`
- Click to open it

### 4. Delete Old Files (if any)
- If there are any old files, select them all
- Click "Delete" button

### 5. Upload from dist/ folder
- Click "Upload" button in File Manager
- Navigate to: `C:\Users\speed\Desktop\shopdaraz-hub-main\dist\`
- Select **ALL FILES AND FOLDERS** inside dist:
  - Select `index.html`
  - Select `assets` folder
- Click "Upload" or "Open"
- Wait for upload to complete

### 6. Upload .htaccess file
- Click "Upload" button again
- Navigate to: `C:\Users\speed\Desktop\shopdaraz-hub-main\`
- Find and select `.htaccess` file
- Click "Upload" or "Open"
- Wait for upload to complete

### 7. Verify Upload
After upload, your `public_html` should contain:
- ✅ index.html
- ✅ assets/ (folder)
- ✅ .htaccess

---

## ⚠️ IMPORTANT NOTES:

### About .htaccess file:
- This file starts with a dot (.)
- It might be hidden in Windows Explorer
- In File Manager, you might need to show "Hidden Files"
- To show hidden files in Windows Explorer:
  - Open the folder
  - Click "View" menu
  - Check "Hidden items"

### If you can't see .htaccess:
You can create it manually in Hostinger:
1. In File Manager, click "New File"
2. Name it: `.htaccess`
3. Edit it and paste this content:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/assets/
RewriteRule ^ index.html [QSA,L]

# Fix MIME types for JavaScript and CSS
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType application/json .json
    AddType image/svg+xml .svg
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## 🎉 After Upload:

Visit: **https://dropazia.online**

Your site should load!

---

## 🆘 Common Issues:

### "Can't find .htaccess file"
- Enable "Show hidden files" in Windows Explorer
- Or create it manually in Hostinger File Manager

### "Upload fails"
- Try uploading one file at a time
- Make sure you're in the correct folder (public_html)
- Check your internet connection

### "Site shows 404 error"
- Make sure index.html is in public_html root
- Verify .htaccess is uploaded

---

**Total files to upload: 3 items (index.html + assets folder + .htaccess)** ✅

