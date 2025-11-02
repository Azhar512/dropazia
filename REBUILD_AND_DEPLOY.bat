@echo off
chcp 65001 >nul
echo ==========================================
echo   REBUILD FRONTEND FOR HOSTINGER
echo ==========================================
echo.
echo This will:
echo   1. Install dependencies
echo   2. Build frontend (creates dist folder)
echo   3. Prepare files for Hostinger upload
echo.
echo Press any key to continue...
pause >nul
echo.

echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

echo [2/3] Building frontend for production...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo ✅ Frontend built successfully
echo.

echo [3/3] Checking dist folder...
if not exist "dist" (
    echo ERROR: dist folder not found!
    pause
    exit /b 1
)
echo ✅ dist folder created
echo.

echo ==========================================
echo   ✅ BUILD COMPLETE!
echo ==========================================
echo.
echo 📋 NEXT STEPS TO DEPLOY:
echo.
echo 1. Open Hostinger File Manager
echo 2. Navigate to: public_html\
echo 3. DELETE all old files (or backup first)
echo 4. Upload ALL files from: dist\
echo 5. Make sure .htaccess file is in root
echo.
echo 📂 Files to upload from dist folder:
echo    - index.html
echo    - assets\ (folder)
echo    - All .js files
echo    - All .css files
echo    - Everything else in dist\
echo.
echo ⚠️  IMPORTANT: Upload .htaccess file from root folder too!
echo.
echo ==========================================
pause

