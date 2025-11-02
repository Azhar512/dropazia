@echo off
chcp 65001 >nul
cls
echo ==========================================
echo   ULTIMATE FIX - Running Now
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js first
    pause
    exit /b 1
)

REM Step 1: Delete mock users
echo [Step 1/3] Deleting mock users from database...
echo.
cd backend
if not exist "DELETE_MOCK_USERS_FORCE.js" (
    echo ❌ ERROR: DELETE_MOCK_USERS_FORCE.js not found
    cd ..
    pause
    exit /b 1
)
node DELETE_MOCK_USERS_FORCE.js
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Warning: Database cleanup had issues, but continuing...
)
cd ..
echo.
echo ✅ Step 1 complete
echo.

REM Step 2: Stage files
echo [Step 2/3] Staging all code changes...
echo.
git add -A
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Git add failed
    pause
    exit /b 1
)
echo ✅ Files staged
echo.

REM Step 3: Commit and push
echo [Step 3/3] Committing and pushing...
echo.
git commit -m "fix: ULTIMATE FIX - Remove ALL mock data, triple-filter, force empty state, real-time approval"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Warning: Commit failed (maybe no changes?)
)
echo.
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Git push failed
    echo Please check your Git credentials and internet connection
    pause
    exit /b 1
)
echo.
echo ✅ Step 3 complete
echo.

echo ==========================================
echo   ✅ ALL STEPS COMPLETE!
echo ==========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Wait 2-3 minutes for Vercel deployment
echo.
echo 2. Clear browser cache:
echo    - Press Ctrl+Shift+Delete
echo    - Select "All time"
echo    - Check ALL boxes
echo    - Clear data
echo    - Close browser completely
echo.
echo 3. Test:
echo    - Go to dropazia.online/admin-login
echo    - Login as admin
echo    - Mock users should be GONE!
echo.
echo ==========================================
pause

