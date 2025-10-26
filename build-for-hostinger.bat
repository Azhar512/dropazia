@echo off
echo ====================================
echo Building for Hostinger Deployment
echo ====================================
echo.

echo Step 1: Cleaning previous build...
if exist dist rmdir /s /q dist

echo.
echo Step 2: Installing dependencies...
call npm install

echo.
echo Step 3: Building production files...
call npm run build

echo.
echo ====================================
echo Build Complete!
echo ====================================
echo.
echo Your files are ready in the 'dist' folder
echo.
echo Next steps:
echo 1. Open Hostinger File Manager
echo 2. Go to public_html folder
echo 3. Upload ALL contents from 'dist' folder
echo 4. Upload the '.htaccess' file to public_html
echo.
echo ====================================
echo.
pause
