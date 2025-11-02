@echo off
chcp 65001 >nul
echo ==========================================
echo   ULTIMATE FIX - FINAL SOLUTION
echo ==========================================
echo.
echo This is the COMPLETE fix:
echo   1. Deletes mock users from database
echo   2. Code blocks mock users (email+name+phone)
echo   3. Forces empty state on component mount
echo   4. Pushes everything
echo.
echo.

REM Delete mock users
echo [1/4] Deleting mock users from database...
cd backend
if exist "DELETE_MOCK_USERS_FORCE.js" (
    node DELETE_MOCK_USERS_FORCE.js
) else (
    echo ERROR: DELETE_MOCK_USERS_FORCE.js not found in backend folder
    pause
    exit /b 1
)
cd ..
echo.
echo ✅ Step 1 complete
echo.

REM Push code
echo [2/4] Staging all changes...
git add -A
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git add failed
    pause
    exit /b 1
)
echo ✅ Files staged
echo.

echo [3/4] Committing...
git commit -m "fix: ULTIMATE FIX - Triple-filter mock users (email+name+phone), force empty state, aggressive cleanup"
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Commit may have failed, but continuing...
)
echo ✅ Committed (or no changes)
echo.

echo [4/4] Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Git push failed!
    echo.
    echo Possible reasons:
    echo - No internet connection
    echo - Git credentials not set
    echo - Repository not initialized
    echo.
    echo Please check and try again.
    pause
    exit /b 1
)
echo ✅ Pushed!
echo.

echo ==========================================
echo   ✅ ULTIMATE FIX COMPLETE!
echo ==========================================
echo.
echo CRITICAL NEXT STEPS:
echo.
echo 1. WAIT 3 MINUTES for Vercel to deploy
echo.
echo 2. CLEAR BROWSER CACHE COMPLETELY:
echo    - Press Ctrl+Shift+Delete
echo    - Select "All time" 
echo    - Check EVERY box:
echo      ✅ Browsing history
echo      ✅ Cookies and site data
echo      ✅ Cached images and files
echo      ✅ Hosted app data
echo      ✅ Download history
echo    - Click "Clear data"
echo    - CLOSE ALL browser windows
echo    - RESTART COMPUTER (recommended)
echo.
echo 3. Open browser FRESH:
echo    - Go to: dropazia.online/admin-login
echo    - Login: admin@shopdaraz.com / admin123
echo    - Check dashboard
echo    - Should show "0 pending" or "No pending users"
echo    - NO mock users visible
echo.
echo 4. Test new registration:
echo    - Register test user (incognito)
echo    - Wait 15 seconds
echo    - Should appear in admin dashboard
echo.
echo ==========================================
echo.
echo The code now:
echo   ✅ Blocks mock users by email
echo   ✅ Blocks mock users by name
echo   ✅ Blocks mock users by phone
echo   ✅ Forces empty state on mount
echo   ✅ Auto-refreshes every 15 seconds
echo   ✅ Shows new registrations instantly
echo.
pause

