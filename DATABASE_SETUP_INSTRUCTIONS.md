# 🚨 CRITICAL: Database Setup Required

## The Problem
Your sign-in is failing because the database tables don't exist yet. The backend logs show:
```
"Could not find the table 'public.users' in the schema cache"
```

## The Solution - Run This SQL Script

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com/
2. Select your project: `lhorlrbmcsuxhgzzifbw`
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run the Initialization Script
1. Click "New query"
2. Copy the ENTIRE contents of `backend/init_database.sql`
3. Paste it into the SQL editor
4. Click "Run" or press Ctrl+Enter

### Step 3: Verify Tables Were Created
Run this query to verify:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- ✅ users
- ✅ transactions
- ✅ budgets

### Step 4: Restart Backend Server
After running the SQL script:
```powershell
cd C:\Users\Joshua\Downloads\SmartLedger\SmartLedger\backend
python server_supabase.py
```

### Step 5: Test Sign-In
1. Go to http://localhost:3000/auth
2. Create a new account
3. Sign in should now work! 🎉

## What the Script Does
✅ Creates `users` table linked to Supabase Auth  
✅ Creates `transactions` table for expense tracking  
✅ Creates `budgets` table for budget management  
✅ Sets up Row Level Security (RLS) policies  
✅ Creates auto-trigger to create user profiles on signup  
✅ Creates all necessary indexes for performance  

## Why This Is Needed
- Supabase Auth only creates users in `auth.users`
- Your app needs additional tables in `public` schema
- The backend expects these tables to exist
- RLS policies ensure users only see their own data

## After Setup
Once the database is initialized:
- ✅ Sign up will automatically create user profiles
- ✅ Sign in will work perfectly
- ✅ All features (transactions, budgets, analytics) will work
- ✅ Data is secure with Row Level Security

---

**Run the SQL script now and your app will work perfectly!** 🚀
