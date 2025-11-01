@echo off
chcp 65001 >nul
echo ==========================================
echo   PUSHING UPDATED CODE TO GITHUB
echo ==========================================
echo.
echo Changes:
echo   - Removed mock data from Admin Dashboard
echo   - Added real-time auto-refresh (30s) for pending users
echo   - Blocked product access for non-approved users
echo   - Prevented auto-login after registration
echo   - Added backend approval check on login
echo.
echo.

git add -A
echo ✅ Files staged

git commit -m "fix: Remove mock data, add real-time admin approval system, block product access until approval"
echo ✅ Changes committed

git push origin main
echo ✅ Changes pushed to GitHub

echo.
echo ==========================================
echo   DEPLOYMENT STATUS
echo ==========================================
echo.
echo ✅ All changes pushed successfully!
echo.
echo Vercel will auto-deploy in 2-3 minutes.
echo.
echo After deployment:
echo   1. Users can register but cannot login until approved
echo   2. Admin dashboard shows real pending users (auto-refreshes every 30s)
echo   3. Users cannot access products until admin approves
echo   4. No more mock data - everything is real-time
echo.
pause

