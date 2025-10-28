@echo off
echo ======================================
echo ShopDaraz Hub - Production Build
echo ======================================
echo.

echo [1/5] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Building frontend for production...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)

echo.
echo [3/5] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [4/5] Creating deployment package...
if exist "deploy" rmdir /s /q "deploy"
mkdir deploy
mkdir deploy\frontend
mkdir deploy\backend

echo Copying frontend files...
xcopy /E /I /Y "dist\*" "deploy\frontend\"
copy /Y ".htaccess" "deploy\frontend\"

echo Copying backend files...
xcopy /E /I /Y "backend\src" "deploy\backend\src"
xcopy /E /I /Y "backend\node_modules" "deploy\backend\node_modules"
copy /Y "backend\package.json" "deploy\backend\"
copy /Y "backend\package-lock.json" "deploy\backend\"
if exist "backend\.env" copy /Y "backend\.env" "deploy\backend\"

echo [5/5] Creating upload instructions...
(
echo UPLOAD INSTRUCTIONS FOR HOSTINGER
echo ====================================
echo.
echo 1. FRONTEND (Upload to domain root):
echo    - Upload ALL files from: deploy\frontend\
echo    - Upload to: public_html\ OR htdocs\
echo    - This includes .htaccess file
echo.
echo 2. BACKEND (Upload to api folder):
echo    - Upload entire 'deploy\backend' folder
echo    - Rename to 'api' on server
echo    - Path should be: public_html\api\
echo.
echo 3. ENVIRONMENT VARIABLES:
echo    - Edit deploy\backend\.env file
echo    - Add your MongoDB Atlas connection string
echo    - Add your domain URL
echo    - Upload the .env file to: api\.env
echo.
echo 4. NODE.JS SETUP ON HOSTINGER:
echo    - Go to Hostinger Control Panel
echo    - Find "Node.js" section
echo    - Set version to: 18.x
echo    - Set app root to: api
echo    - Set startup file to: src/server.js
echo    - Enable Node.js
echo.
echo 5. TESTING:
echo    - Visit: https://yourdomain.com
echo    - Visit: https://yourdomain.com/api/health
echo.
echo DONE! Your production build is ready in the 'deploy' folder.
echo.
) > "deploy\UPLOAD_INSTRUCTIONS.txt"

echo.
echo ======================================
echo BUILD COMPLETE!
echo ======================================
echo.
echo Your production files are in the 'deploy' folder
echo Read 'deploy\UPLOAD_INSTRUCTIONS.txt' for next steps
echo.
pause

