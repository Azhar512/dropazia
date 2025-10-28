@echo off
echo ========================================
echo   ShopDaraz Hub - Local Development
echo ========================================
echo.

echo Checking MongoDB Service...
sc query MongoDB | findstr "RUNNING" >nul
if %errorlevel% neq 0 (
    echo ERROR: MongoDB service is not running!
    echo Starting MongoDB service...
    net start MongoDB
    timeout /t 3 /nobreak >nul
)

sc query MongoDB | findstr "RUNNING" >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to start MongoDB service!
    pause
    exit /b 1
)

echo MongoDB service is running!
echo.

echo ========================================
echo Starting Backend Server...
echo ========================================
echo.
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
echo.
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:5000
echo.
echo Press any key to close this window...
pause >nul
