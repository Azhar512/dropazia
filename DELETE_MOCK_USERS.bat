@echo off
chcp 65001 >nul
echo ==========================================
echo   FORCE DELETE MOCK USERS
echo ==========================================
echo.
echo This will DELETE these exact users:
echo   - Ali Haider (abc12@gmail.com)
echo   - Sara Khan (sara@gmail.com)
echo   - Muhammad Ali (m.ali@gmail.com)
echo.
echo.

cd backend
node DELETE_MOCK_USERS_FORCE.js

echo.
echo ==========================================
echo.
echo ✅ Done!
echo.
echo Next steps:
echo   1. Clear browser cache (Ctrl+Shift+Delete)
echo   2. Hard refresh (Ctrl+Shift+R)
echo   3. Check admin dashboard
echo.
pause

