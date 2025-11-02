@echo off
chcp 65001 >nul
echo ==========================================
echo   CHECKING DATABASE FOR REAL USERS
echo ==========================================
echo.
echo This will show what users are ACTUALLY
echo stored in the MongoDB database.
echo.
echo.

cd backend
node CHECK_ACTUAL_USERS.js

echo.
echo ==========================================
echo.
pause

