# Build Your Connection String Manually

Since the connection string section is hard to find, let's build it manually. It's very simple!

## ✅ What We Already Know

From your Supabase URL, we have:
- **Project Reference**: `jrajzvmcaaqqmezymyix`
- **Database Host**: `db.jrajzvmcaaqqmezymyix.supabase.co`
- **Port**: `5432`
- **Database Name**: `postgres`
- **Username**: `postgres`

## ❓ What You Need

Only **ONE thing**: Your database password
- This is the password you set when you created the Supabase project
- If you forgot it, you can click "Reset database password" on that page

## 🔧 The Connection String Format

```
postgresql://postgres:[YOUR-PASSWORD]@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with your actual password.

## 📝 Example

If your password was `MyPassword123!`, it would be:

```
postgresql://postgres:MyPassword123!@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

## 🎯 Quick Steps

1. Get your database password (or reset it if needed)
2. Replace `[YOUR-PASSWORD]` in the format above
3. Copy the complete connection string
4. Add it to `backend/.env` as:

```env
DATABASE_URL=postgresql://postgres:your-actual-password@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

## 💡 Can't Remember Password?

1. On the Database Settings page, click **"Reset database password"**
2. Set a new password (SAVE IT!)
3. Use that new password in the connection string

