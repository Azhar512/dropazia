@echo off
echo.
echo ========================================
echo   PUSHING VERCEL.JSON FIX
echo ========================================
echo.

cd /d "%~dp0"

git add vercel.json
git commit -m "Fix vercel.json - remove deprecated builds configuration"
git push origin main

echo.
echo ========================================
echo   PUSHED! Vercel will auto-deploy
echo ========================================
echo.
echo Wait 2 minutes for Vercel to redeploy automatically.
echo Then test: https://dropazia.online
echo.
pause

