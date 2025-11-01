@echo off
chcp 65001 >nul
echo ==========================================
echo   CLEARING MOCK USERS FROM DATABASE
echo ==========================================
echo.
echo This will remove any mock/test users:
echo   - abc12@gmail.com (Ali Haider)
echo   - sara@gmail.com (Sara Khan)
echo   - m.ali@gmail.com (Muhammad Ali)
echo.
echo.

cd backend
node CLEAR_MOCK_USERS.js

echo.
echo ==========================================
echo.
echo ✅ Cleanup complete!
echo.
echo Next steps:
echo   1. Hard refresh browser (Ctrl+Shift+R)
echo   2. Clear browser cache
echo   3. Login to admin dashboard again
echo   4. Check Pending Approvals tab
echo.
pause

