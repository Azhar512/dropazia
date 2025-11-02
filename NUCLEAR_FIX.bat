@echo off
chcp 65001 >nul
echo ==========================================
echo   NUCLEAR FIX - Complete Cache Clear
echo ==========================================
echo.
echo This will:
echo   1. Check database for mock users
echo   2. Clear mock users if found
echo   3. Clear all browser cache
echo   4. Force rebuild frontend
echo.
echo.

REM Step 1: Check database
echo [Step 1/4] Checking database...
cd backend
node CHECK_ACTUAL_USERS.js
cd ..
echo.

REM Step 2: Clear mock users
echo [Step 2/4] Clearing mock users from database...
cd backend
node CLEAR_MOCK_USERS.js
cd ..
echo.

REM Step 3: Clear build cache
echo [Step 3/4] Clearing build cache...
if exist "dist" rmdir /s /q dist
if exist "node_modules\.vite" rmdir /s /q node_modules\.vite
if exist ".vite" rmdir /s /q .vite
echo ✅ Build cache cleared
echo.

REM Step 4: Instructions
echo [Step 4/4] Next steps:
echo.
echo ✅ Database checked and cleaned
echo ✅ Build cache cleared
echo.
echo 🔥 NOW DO THIS:
echo.
echo 1. Open browser
echo 2. Press Ctrl+Shift+Delete
echo 3. Select "All time"
echo 4. Check ALL boxes:
echo    - Cookies and site data
echo    - Cached images and files
echo    - Hosted app data
echo 5. Click "Clear data"
echo 6. Close ALL browser windows
echo 7. Restart browser
echo 8. Go to dropazia.online/admin-login
echo 9. Login as admin
echo 10. Check dashboard
echo.
echo If still seeing mock data:
echo - Screenshot browser console (F12)
echo - Screenshot Network tab → /api/users request
echo - Check what API actually returns
echo.
pause

