@echo off
echo.
echo ========================================
echo   COPYING .htaccess TO dist FOLDER
echo ========================================
echo.

cd /d "%~dp0"

copy /Y .htaccess dist\.htaccess

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo .htaccess is now in dist folder
echo.
echo Now you can re-upload the entire dist folder to Hostinger
echo and .htaccess will be included automatically!
echo.
pause

