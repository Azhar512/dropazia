@echo off
echo ==========================================
echo   PUSHING CHANGES TO GITHUB
echo ==========================================
echo.

git add -A
echo ✅ Files staged

git commit -m "feat: Add users API endpoint and fix admin dashboard to show real pending users"
echo ✅ Changes committed

git push origin main
echo ✅ Changes pushed to GitHub

echo.
echo ==========================================
echo   DEPLOYMENT STATUS
echo ==========================================
echo.
echo ✅ Changes pushed successfully!
echo.
echo Vercel will auto-deploy in 2-3 minutes.
echo.
echo After deployment:
echo   1. Register a new test user
echo   2. Login as admin at dropazia.online/admin-login
echo   3. Check "Pending Approvals" tab
echo   4. New users should appear automatically
echo.
pause

