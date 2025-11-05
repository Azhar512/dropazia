# Step-by-Step: Find Supabase Connection String

## 📍 You're Currently On: Tables Page
You're looking at "Database Tables" - this is NOT where the connection string is!

## ✅ Where to Find It

### Step 1: Go to Settings
1. Look at the **left sidebar**
2. Find **"Configuration"** section (below "Database Management")
3. Click **"Settings"** (under Configuration)

### Step 2: Find Connection String
1. Once in Settings, scroll down
2. Look for **"Connection string"** section
3. You'll see tabs: **"URI"**, "JDBC", "Golang", etc.
4. Click the **"URI"** tab
5. You'll see a connection string like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
   ```

## 🔄 Alternative: Use Connection Pooling

If you still can't find it, try the connection pooling URL format:

1. In the same Settings page
2. Look for **"Connection pooling"** section
3. Use the **"Session"** or **"Transaction"** mode connection string
4. It will look like:
   ```
   postgresql://postgres.jrajzvmcaaqqmezymyix:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

## 🎯 Quick Navigation Path

**Current location:** Database → Tables  
**Go to:** Configuration → Settings  
**Then scroll to:** Connection string section

## 💡 If Still Can't Find It

1. **Check if you're in the right project** - Make sure you're in the "dropaziapk" project
2. **Try the API Settings** - Sometimes connection info is under Settings → API
3. **Check your Supabase plan** - Some plans might have different UI layouts

## 🔧 Manual Construction (If Needed)

If you absolutely can't find it, we can build it manually:
- Project Reference: `jrajzvmcaaqqmezymyix`
- Password: `Shaikhprince5588@`
- Format: `postgresql://postgres:Shaikhprince5588%40@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres`

But it's better to get the exact one from Supabase!

