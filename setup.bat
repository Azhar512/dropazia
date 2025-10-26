@echo off
echo Setting up ShopDaraz Hub with MongoDB...

echo.
echo Step 1: Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Creating .env file...
copy env.txt .env
if %errorlevel% neq 0 (
    echo Error creating .env file
    pause
    exit /b 1
)

echo.
echo Step 3: Installing frontend dependencies...
cd ..
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Step 4: Seeding database...
cd backend
node src/seed.js
if %errorlevel% neq 0 (
    echo Error seeding database
    pause
    exit /b 1
)

cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Start the backend server: cd backend && npm run dev
echo 3. Start the frontend server: npm run dev
echo.
echo Login credentials:
echo Admin: admin@shopdaraz.com / admin123
echo Demo: demo@shopdaraz.com / admin123
echo.
pause