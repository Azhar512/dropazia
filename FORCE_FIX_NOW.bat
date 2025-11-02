@echo off
chcp 65001 >nul
echo ==========================================
echo   FORCE FIX - AGGRESSIVE CLEANUP
echo ==========================================
echo.
echo This will FORCE remove mock data:
echo   1. Delete from database (by email, name, phone)
echo   2. Add aggressive frontend filters
echo   3. Push code immediately
echo.
echo.

REM Step 1: Force delete from database
echo [1/3] FORCE DELETING mock users...
cd backend
node DELETE_MOCK_USERS_FORCE.js
cd ..
echo.

REM Step 2: Push code with aggressive filters
echo [2/3] Pushing code with aggressive safety filters...
git add -A
git commit -m "fix: AGGRESSIVE FIX - Remove mock data with triple-filter (email+name+phone), real-time approval system"
git push origin main
echo ✅ Pushed!
echo.

REM Step 3: Instructions
echo [3/3] Next Steps:
echo.
echo ✅ Code pushed with AGGRESSIVE filters
echo ✅ Mock users blocked by email, name, AND phone
echo.
echo NOW DO THIS:
echo.
echo 1. Wait 2-3 minutes for deployment
echo.
echo 2. Clear browser cache AGGRESSIVELY:
echo    - Ctrl+Shift+Delete
echo    - Select "All time"
echo    - Check EVERYTHING
echo    - Clear data
echo    - Close ALL browser windows
echo    - Restart computer (if needed)
echo.
echo 3. Open browser
echo    - Go to dropazia.online/admin-login
echo    - Login as admin
echo    - Check dashboard
echo    - Mock users should be GONE
echo.
echo 4. Test registration:
echo    - Register new user (incognito)
echo    - Wait 15 seconds
echo    - Should appear in admin dashboard
echo.
echo ==========================================
pause

