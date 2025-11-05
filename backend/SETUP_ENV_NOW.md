# Setup Your .env File Now

## ✅ Connection String Ready!

Your Supabase connection string is ready. The `@` in your password has been URL-encoded as `%40`.

## 📝 Create backend/.env File

1. **Navigate to** `backend` folder
2. **Create a new file** named `.env` (no extension, just `.env`)
3. **Copy and paste this entire content**:

```env
# ==========================================
# ShopDaraz Hub - Environment Configuration
# ==========================================
# Database Configuration (Supabase PostgreSQL)
# ==========================================
DATABASE_URL=postgresql://postgres:Shaikhprince5588%40@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres

# ==========================================
# JWT Configuration (REQUIRED!)
# ==========================================
JWT_SECRET=your-super-secret-jwt-key-for-shopdaraz-2024
JWT_EXPIRES_IN=7d

# ==========================================
# Server Configuration
# ==========================================
PORT=5000
NODE_ENV=development

# ==========================================
# Frontend URL (for CORS)
# ==========================================
FRONTEND_URL=http://localhost:8080
```

## ⚠️ Important Notes

1. **Password encoding**: Your password `Shaikhprince5588@` has been encoded as `Shaikhprince5588%40` (the `@` becomes `%40`)

2. **File location**: Must be in `backend/.env` (not in root folder)

3. **No spaces**: Make sure there are no spaces around the `=` sign

## 🚀 Next Steps After Creating .env

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Run the database schema** in Supabase:
   - Go to Supabase dashboard
   - Click "SQL Editor" (left sidebar)
   - Click "New query"
   - Open `backend/database/supabase-schema.sql`
   - Copy entire content and paste into SQL Editor
   - Click "Run"

3. **Test the connection**:
   ```bash
   cd backend
   npm start
   ```

You should see:
```
✅ Connected to Supabase PostgreSQL database
📊 Database time: [timestamp]
📋 Found [number] tables in database
```

## ✅ That's It!

Once you create the `.env` file with the content above, your connection is ready!

