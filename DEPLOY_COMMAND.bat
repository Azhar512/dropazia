@echo off
echo ========================================
echo   DEPLOYING SHOPDARAZ HUB
echo ========================================
echo.

echo Step 1: Building Frontend...
call npm run build
echo.

echo Step 2: Frontend build complete!
echo The dist/ folder is ready to upload to Hostinger.
echo.
echo Next Steps:
echo 1. Upload dist/ folder contents to Hostinger via FTP
echo 2. Deploy backend to Railway with the environment variables
echo 3. Update frontend .env with Railway backend URL
echo.
echo Check DEPLOYMENT_READY.md for detailed instructions!
echo.
pause

