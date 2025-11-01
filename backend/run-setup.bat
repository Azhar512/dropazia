@echo off
chcp 65001 >nul
echo ==========================================
echo   DIAGNOSTIC AND FIX TOOL
echo ==========================================
echo.
echo This will:
echo   - Check database connection
echo   - Fix admin user if needed
echo   - Verify login credentials
echo.
echo.

node src/diagnose-and-fix.js

echo.
echo ==========================================
pause

