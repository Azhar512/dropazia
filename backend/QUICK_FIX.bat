@echo off
title Admin Login Fix - Running...
chcp 65001 >nul
cls
echo.
echo ==========================================
echo   FIXING ADMIN LOGIN ISSUE
echo ==========================================
echo.
echo This will:
echo   1. Connect to your MongoDB database
echo   2. Check if admin user exists
echo   3. Create/fix admin user if needed
echo   4. Verify login will work
echo.
echo Please wait...
echo.

cd /d %~dp0
node src/diagnose-and-fix.js

echo.
echo ==========================================
echo.
echo If you see "DIAGNOSTIC COMPLETE" above,
echo your admin login should now work!
echo.
echo Try logging in at:
echo https://dropazia.online/admin-login
echo.
echo Credentials:
echo   Email: admin@shopdaraz.com
echo   Password: admin123
echo.
echo ==========================================
pause

