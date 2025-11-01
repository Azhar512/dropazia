# 🔍 Check Database Contents

## Quick Check Script

This script shows you exactly what's in your MongoDB Atlas database without modifying anything.

### Run the Check:

**Step 1:** Make sure you have `.env` file in `backend` folder with:

```env
MONGODB_URI=mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority
```

**Step 2:** Run the check:

```bash
cd backend
node src/check-database.js
```

**Or use npm:**
```bash
cd backend
npm run check-db
```

### What It Shows:

✅ Total number of users
✅ Total number of products
✅ Whether admin user exists
✅ Sample products if any

### Based on Results:

**If database is EMPTY (0 products, 0 users):**
- ✅ Safe to use seed script
- ✅ Run: `npm run seed` (after setting `FORCE_SEED=true` in `.env`)
- ✅ This creates admin + sample products

**If database has products:**
- ⚠️ Seed script will DELETE everything
- ✅ Use `create-admin.js` script instead (non-destructive)
- ✅ Run: `npm run create-admin`

---

**After checking, let me know what you found and I'll guide you on the next step!**

