# 🔧 Fix Hostinger Routing (404 Errors)

## Problem:
- Homepage works: ✅ https://dropazia.online
- Other pages show 404: ❌ https://dropazia.online/login

## Cause:
The `.htaccess` file is missing or not working in your Hostinger `public_html` folder.

---

## ✅ SOLUTION: Upload .htaccess File

### Method 1: Create in Hostinger File Manager (EASIEST)

1. **Login to Hostinger**: https://hpanel.hostinger.com

2. **Open File Manager**:
   - Go to your domain: dropazia.online
   - Click "File Manager"

3. **Navigate to public_html**:
   - Make sure you're in the folder where `index.html` is

4. **Create New File**:
   - Click "New File" button
   - Name it: `.htaccess` (with the dot!)
   - Click "Create"

5. **Edit the file**:
   - Right-click on `.htaccess`
   - Click "Edit"
   - Copy the content from `HTACCESS_FOR_HOSTINGER.txt`
   - Paste it
   - Click "Save"

---

### Method 2: Upload .htaccess from Your Computer

1. **Find the file on your computer**:
   - Location: `C:\Users\speed\Desktop\shopdaraz-hub-main\.htaccess`

2. **Show hidden files in Windows Explorer**:
   - Open the folder
   - Click "View" menu (top)
   - Check "Hidden items" checkbox
   - Now you should see `.htaccess` file

3. **Upload to Hostinger**:
   - Go to Hostinger File Manager
   - Navigate to `public_html`
   - Click "Upload"
   - Select `.htaccess` file
   - Upload it

---

### Method 3: Copy .htaccess to dist folder and re-upload

```bash
# Run this command in your project folder:
copy .htaccess dist\.htaccess

# Then upload entire dist folder again to Hostinger
```

---

## ✅ After Fixing:

Visit these URLs - they should all work:
- https://dropazia.online → Homepage ✅
- https://dropazia.online/login → Login page ✅
- https://dropazia.online/products → Products page ✅
- https://dropazia.online/register → Register page ✅

---

## 🔍 How to Verify .htaccess is Uploaded:

### In Hostinger File Manager:

Your `public_html` folder should contain:
```
public_html/
├── .htaccess       ← THIS MUST BE HERE
├── index.html
├── assets/
├── favicon.ico
└── ... other files
```

### Check Hidden Files Setting:

If you don't see `.htaccess`:
1. Look for a "Show hidden files" checkbox in File Manager
2. Or a "Settings" icon in File Manager
3. Enable "Show dot files" or "Show hidden files"

---

## 🆘 Still Not Working?

If `.htaccess` is uploaded but routes still show 404:

### Option A: Check Apache Configuration
Some Hostinger plans don't allow `.htaccess` overrides.
Contact Hostinger support and ask them to enable `.htaccess` for your domain.

### Option B: Use PHP fallback
Create a file called `index.php` with:
```php
<?php
header('Location: /index.html');
?>
```

---

## 📞 Need Help?

Ask Hostinger Support:
"I've uploaded a React SPA and need .htaccess to work for client-side routing. Can you enable AllowOverride for my domain?"

---

**After fixing .htaccess, ALL pages on your site will work!** 🎉

