@echo off
echo.
echo ========================================
echo   FIXING .env FILE
echo ========================================
echo.

cd /d "%~dp0"

echo # Backend API URL - Your Vercel Backend > .env
echo VITE_API_URL=https://dropazia.vercel.app >> .env
echo. >> .env
echo # PayFast PRODUCTION Credentials >> .env
echo VITE_PAYFAST_MERCHANT_ID=241580 >> .env
echo VITE_PAYFAST_MERCHANT_KEY=Pyjm982h_7s-74PQcUn2EgZv >> .env
echo VITE_PAYFAST_PASSPHRASE=Aneeqasif >> .env
echo VITE_PAYFAST_MODE=production >> .env

echo.
echo ========================================
echo   SUCCESS! .env file updated!
echo ========================================
echo.
echo The file now contains:
echo.
type .env
echo.
echo ========================================
echo   Now rebuilding frontend...
echo ========================================
echo.

npm run build

echo.
echo ========================================
echo   BUILD COMPLETE!
echo ========================================
echo.
echo Now upload the dist/ folder to Hostinger!
echo.
pause

