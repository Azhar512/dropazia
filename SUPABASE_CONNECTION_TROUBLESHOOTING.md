# Supabase Connection Troubleshooting

## ❌ Current Error
```
getaddrinfo ENOTFOUND db.jrajzvmcaaqqmezymyix.supabase.co
```

## 🔍 Possible Causes

### 1. Project is Paused
- Go to Supabase Dashboard → Project Settings
- Check if project status shows "Paused"
- If paused, click "Resume" or "Restart project"

### 2. Project Still Provisioning
- New projects can take 5-10 minutes to fully provision
- Even if tables are created, the database hostname might not be ready

### 3. Network/Firewall Issue
- Your network might be blocking the connection
- Try a different network or disable VPN if using one

## ✅ Solutions to Try

### Solution 1: Check Project Status
1. Go to Supabase Dashboard
2. Check if project shows as "Active" (not "Paused")
3. If paused, click "Resume project"

### Solution 2: Wait and Retry
- Wait 5-10 minutes if this is a new project
- Then restart the backend server

### Solution 3: Try Connection Pooling URL
In Supabase Dashboard → Database → Settings → Connection pooling
- Use the "Session" or "Transaction" mode connection string
- It might have a different hostname format

### Solution 4: Restart Supabase Project
1. Go to Project Settings
2. Click "Restart project"
3. Wait 2-3 minutes
4. Try connecting again

## 🔧 Quick Check

Is your Supabase project showing as "Active" or "Paused"?

