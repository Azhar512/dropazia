@echo off
echo ========================================
echo URGENT: Checking Database for Products
echo ========================================
echo.

cd backend

if not exist .env (
    echo ERROR: .env file not found in backend folder!
    echo Please make sure you have MONGODB_URI in backend/.env
    pause
    exit /b 1
)

echo Checking database for products...
echo.

node src/check-products-urgent.js

echo.
echo ========================================
pause

