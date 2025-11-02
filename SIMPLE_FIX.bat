@echo off
chcp 65001 >nul
cls
echo ==========================================
echo   SIMPLE FIX - Step by Step
echo ==========================================
echo.
echo.

REM Step 1: Delete mock users
echo Step 1: Deleting mock users from database...
cd backend
if exist "DELETE_MOCK_USERS_FORCE.js" (
    node DELETE_MOCK_USERS_FORCE.js
) else (
    echo.
    echo ERROR: Script not found!
    echo Please make sure you're in the project root folder.
    cd ..
    pause
    exit /b 1
)
cd ..
echo.
echo Step 1 complete!
echo.
pause
echo.

REM Step 2: Git operations
echo Step 2: Pushing code to GitHub...
echo.
git add -A
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git add failed
    pause
    exit /b 1
)

git commit -m "fix: Remove mock data, add triple-filter, real-time approval"
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Commit had issues (maybe no changes)
)

git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Try manually:
    echo   git push origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   ✅ ALL DONE!
echo ==========================================
echo.
echo Next:
echo 1. Wait 2-3 minutes
echo 2. Clear browser cache (Ctrl+Shift+Delete)
echo 3. Test admin dashboard
echo.
pause

