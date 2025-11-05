@echo off
echo ========================================
echo Force Reload Environment Variables
echo ========================================
echo.
echo This will:
echo 1. Clear any cached DATABASE_URL
echo 2. Test the connection with fresh .env
echo.
pause

REM Clear any system env vars (if any)
set DATABASE_URL=

REM Now test with the .env file
echo.
echo Testing connection with .env file...
echo.
cd /d "%~dp0"
node src/check-database.js

pause

