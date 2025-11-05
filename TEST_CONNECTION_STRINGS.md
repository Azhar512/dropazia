# Test Different Connection String Formats

Since your tables are created, the database works! The issue is the connection string format.

## Try These Connection String Formats

### Format 1: Direct Connection (Current - Not Working)
```
postgresql://postgres:Shaikhprince5588%40@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

### Format 2: Try Without "db." Prefix
```
postgresql://postgres:Shaikhprince5588%40@jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

### Format 3: Use Project URL Format
```
postgresql://postgres:Shaikhprince5588%40@jrajzvmcaaqqmezymyix.supabase.co/postgres
```

### Format 4: Connection Pooler (Most Likely)
```
postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

## How to Get the Correct Format

Since you can't find it in Settings, try this:

1. **Go to Supabase Dashboard**
2. Click on your **project name** (top left)
3. Look for **"Connection Info"** or **"Database"** 
4. Or try: **Settings** → **API** → Look for database connection info there

## Quick Test

Update your `.env` file with Format 2 first, then test:

```env
DATABASE_URL=postgresql://postgres:Shaikhprince5588%40@jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

If that doesn't work, try Format 4 (pooler).

