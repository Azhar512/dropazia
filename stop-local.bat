@echo off
echo ========================================
echo   Stopping Local Development
echo ========================================
echo.

echo Stopping Frontend Server...
taskkill /F /FI "WindowTitle eq Frontend Server*" >nul 2>&1
taskkill /F /FI "WindowTitle eq Backend Server*" >nul 2>&1

echo.
echo Stopping Node processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   All Servers Stopped!
echo ========================================
echo.

pause
