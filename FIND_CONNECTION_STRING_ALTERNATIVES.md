# Alternative Ways to Find Database Connection String

## Method 1: Check Connection Pooling Section

1. On the same Database Settings page
2. Look at the **"Connection pooling configuration"** section
3. There might be a link or tab for "Connection string" there
4. Or click the **"Docs"** link - it might show connection info

## Method 2: Go to Project Settings (Different Location)

1. In the left sidebar, click **"Settings"** (gear icon at the very top - NOT "Database" > "Settings")
2. This is the PROJECT-level settings
3. Look for **"Database"** in that settings page
4. The connection string should be there

## Method 3: Build It Manually

If you have your database password, we can construct it manually. The format is:

```
postgresql://postgres:[YOUR-PASSWORD]@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

You need:
- Your database password (the one you set when creating the project)
- Your project reference: `jrajzvmcaaqqmezymyix` (from your URL)

Replace `[YOUR-PASSWORD]` with your actual password.

## Method 4: Check SQL Editor

1. Go to **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Sometimes connection info is shown there

## Method 5: Use Connection Pooling String

Sometimes Supabase shows connection pooling strings. Look for:
- **"Connection string"** with "Session" or "Transaction" mode
- These work the same way

## What to Look For

The connection string should look like:
```
postgresql://postgres:PASSWORD@db.jrajzvmcaaqqmezymyix.supabase.co:5432/postgres
```

Or with connection pooling:
```
postgresql://postgres.jrajzvmcaaqqmezymyix:PASSWORD@aws-0-xxx.pooler.supabase.com:6543/postgres
```

Both will work! The first one (direct connection) is simpler.

