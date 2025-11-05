# Use Connection Pooler (Fixes IPv6 Issue)

## 🔍 The Problem
Your connection fails with `ENOTFOUND` because the direct database hostname resolves to IPv6, which Node.js can't connect to from your network.

## ✅ Solution: Use Connection Pooler

The Connection Pooler uses IPv4 and will work!

## 📍 How to Get Pooler Connection String

### Option 1: From Connection Pooling Section
1. In Database Settings → **Connection pooling configuration** section
2. Click the **"Docs"** link (next to "Connection pooling configuration")
3. The docs page should show connection string examples
4. Look for a connection string with `pooler.supabase.com` in it

### Option 2: Try Common Pooler Format
Based on your project, try this format:

```
postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Common regions:
- `us-east-1` (US East)
- `ap-southeast-1` (Southeast Asia)
- `eu-west-1` (Europe)

### Option 3: Check Supabase Dashboard
1. Go to **Settings** (top-level gear icon)
2. Click **Database**
3. Look for **"Connection string"** with tabs for "Session" or "Transaction" mode
4. These use the pooler

## 🎯 Try This Now

Update your `.env` with one of these (try each region):

**US East:**
```
DATABASE_URL=postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Southeast Asia:**
```
DATABASE_URL=postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Europe:**
```
DATABASE_URL=postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

Try them one by one until one works!

