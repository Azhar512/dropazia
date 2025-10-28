@echo off
echo ========================================
echo   DEPLOYING TO HOSTINGER
echo ========================================
echo.

echo Step 1: Checking if .env file exists...
if exist .env.production (
    echo Found .env.production file
) else (
    echo Creating .env.production file...
    echo VITE_API_URL=https://your-backend-url.onrender.com/api > .env.production
    echo.
    echo IMPORTANT: You need to update .env.production with your Render backend URL!
    echo Edit .env.production and replace 'your-backend-url' with your actual URL.
    echo.
    pause
)

echo.
echo Step 2: Building frontend for production...
call npm run build

if exist dist (
    echo.
    echo ========================================
    echo   BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Your production files are in the 'dist/' folder
    echo.
    echo NEXT STEPS:
    echo 1. Upload ALL files from 'dist/' to Hostinger
    echo 2. Upload '.htaccess' file to Hostinger
    echo 3. Make sure to update .env.production with your Render backend URL
    echo.
    echo Press any key to open the dist folder...
    pause
    explorer dist
) else (
    echo.
    echo ========================================
    echo   BUILD FAILED!
    echo ========================================
    echo Check the errors above
)

