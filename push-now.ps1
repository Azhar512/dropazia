Write-Host "=========================================="
Write-Host "  PUSHING CHANGES TO GITHUB"
Write-Host "=========================================="
Write-Host ""

git add -A
Write-Host "✅ Files staged" -ForegroundColor Green

git commit -m "feat: Add users API endpoint, fix admin dashboard pending users, improve registration with better error handling"
Write-Host "✅ Changes committed" -ForegroundColor Green

git push origin main
Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================="
Write-Host "  DEPLOYMENT STATUS"
Write-Host "=========================================="
Write-Host ""
Write-Host "✅ Changes pushed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Vercel will auto-deploy in 2-3 minutes." -ForegroundColor Yellow
Write-Host ""
Write-Host "After deployment:" -ForegroundColor Cyan
Write-Host "  1. Register a new test user"
Write-Host "  2. Login as admin at dropazia.online/admin-login"
Write-Host "  3. Check 'Pending Approvals' tab"
Write-Host "  4. New users should appear automatically"
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

