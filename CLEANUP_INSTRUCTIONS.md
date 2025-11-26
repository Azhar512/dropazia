# 🧹 Project Cleanup Instructions

This file documents what needs to be cleaned up in the project root directory.

## ✅ Files to Archive/Delete

The root directory contains 100+ markdown and batch files from the development and troubleshooting process. These should be moved to the `docs/archived/` folder or deleted.

### Files to KEEP (Important!)
- `README.md` - Main project documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `QUICK_START.md` - Quick start guide
- `ENV_SETUP_GUIDE.md` - Environment setup
- `package.json` - NPM configuration
- `package-lock.json` - NPM lock file
- `vercel.json` - Vercel deployment config
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind CSS config
- `tsconfig.*.json` - TypeScript configurations
- `eslint.config.js` - ESLint configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn/ui configuration
- `index.html` - HTML entry point

### Files to DELETE (Batch Scripts)
These are Windows batch scripts used for troubleshooting:
- `*.bat` files (all batch scripts)
- Delete all files ending in `.bat`

### Files to ARCHIVE (Move to `docs/archived/`)
All other `.md` files should be moved to `docs/archived/`:

**Deployment & Setup Docs:**
- `DEPLOYMENT_*.md`
- `SETUP_*.md`
- `LOCAL_*.md`
- `HOSTINGER_*.md`
- `RAILWAY_*.md`
- `RENDER_*.md`
- `VERCEL_*.md`

**Database & Connection Docs:**
- `DATABASE_*.md`
- `MONGODB_*.md`
- `SUPABASE_*.md`
- `CONNECTION_*.md`
- `MIGRATE_*.md`
- `MIGRATION_*.md`

**Fix & Troubleshooting Docs:**
- `FIX_*.md`
- `ADMIN_LOGIN_FIX.md`
- `CART_FIX.md`
- `CHECKOUT_FIXES.md`
- `EMERGENCY_*.md`
- `URGENT_*.md`
- `FORCE_*.md`
- `NUCLEAR_*.md`
- `CRITICAL_*.md`

**Feature & Implementation Docs:**
- `FEATURES_IMPLEMENTED.md`
- `DARAZ_*.md`
- `JAZZCASH_*.md`
- `EASYPAISA_*.md`
- `MARKAZ_VS_SHOPDARAZ_COMPARISON.md`

**Testing & Debugging Docs:**
- `TEST_*.md`
- `CHECK_*.md`
- `DEBUG_*.md`
- `API_DEBUG_STEPS.md`

**Production & Recovery Docs:**
- `PRODUCTION_*.md`
- `PRODUCT_DATA_RECOVERY_GUIDE.md`
- `PRODUCTS_RECOVERY_SUCCESS.md`
- `DATA_PERSISTENCE_GUARANTEE.md`

**Git & GitHub Docs:**
- `GITHUB_PUSH_FIX.md`
- `PUSH_*.md`

**Domain & Hosting Docs:**
- `GODADDY_DOMAIN_SETUP.md`
- `YOUR_DOMAIN_GUIDE.md`
- `FIND_CONNECTION_STRING_*.md`

**Miscellaneous:**
- `CREATE_ENV_FILES.md`
- `USE_CONNECTION_POOLER.md`
- `SHOULD_YOU_SWITCH_DATABASE_ANALYSIS.md`
- `CORRECT_PATH_TO_CONNECTION_STRING.md`
- `UPDATE_VERCEL_BACKEND.md`

### Test Files to DELETE
- `test.html`
- `TEST_API_DIRECTLY.html`
- Any other `test*.html` files

## 🤖 Automated Cleanup (Optional)

### For Linux/Mac:
```bash
# Create archive directory
mkdir -p docs/archived

# Move all non-essential MD files
find . -maxdepth 1 -name "*.md" \
  ! -name "README.md" \
  ! -name "DEPLOYMENT_GUIDE.md" \
  ! -name "QUICK_START.md" \
  ! -name "ENV_SETUP_GUIDE.md" \
  ! -name "CLEANUP_INSTRUCTIONS.md" \
  -exec mv {} docs/archived/ \;

# Delete all batch files
rm -f *.bat

# Delete test HTML files
rm -f test*.html TEST*.html
```

### For Windows PowerShell:
```powershell
# Create archive directory
New-Item -ItemType Directory -Force -Path docs\archived

# Move non-essential MD files
Get-ChildItem -Path . -Filter *.md -File | 
  Where-Object {
    $_.Name -notin @('README.md', 'DEPLOYMENT_GUIDE.md', 'QUICK_START.md', 'ENV_SETUP_GUIDE.md', 'CLEANUP_INSTRUCTIONS.md')
  } | 
  Move-Item -Destination docs\archived\

# Delete batch files
Remove-Item -Path *.bat

# Delete test HTML files
Remove-Item -Path test*.html, TEST*.html
```

### Manual Cleanup
If you prefer manual cleanup:
1. Create folder: `docs/archived/`
2. Move all `.md` files (except the ones listed to KEEP) to `docs/archived/`
3. Delete all `.bat` files
4. Delete `test.html` and `TEST_API_DIRECTLY.html`

## After Cleanup

Your root directory should contain only:
```
shopdaraz-hub-main/
├── backend/
├── database/
├── dist/
├── docs/
├── node_modules/
├── public/
├── src/
├── README.md                    ✓
├── DEPLOYMENT_GUIDE.md          ✓
├── QUICK_START.md               ✓
├── ENV_SETUP_GUIDE.md           ✓
├── CLEANUP_INSTRUCTIONS.md      ✓
├── package.json                 ✓
├── package-lock.json            ✓
├── vercel.json                  ✓
├── vite.config.ts               ✓
├── tailwind.config.ts           ✓
├── tsconfig.*.json              ✓
├── eslint.config.js             ✓
├── postcss.config.js            ✓
├── components.json              ✓
└── index.html                   ✓
```

## ⚠️ Important Notes

- **DO NOT** delete `README.md` or any configuration files
- **DO NOT** delete the `backend/`, `src/`, `public/`, or `database/` directories
- **Backup** before running automated scripts
- **Commit changes** to git after cleanup
- **Test** the application after cleanup to ensure nothing broke

---

**After cleanup, your project will be much cleaner and easier to navigate!**

