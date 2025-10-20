"""
Database Initialization Script for SmartLedger
Run this script to automatically set up all database tables in Supabase
"""

from supabase import create_client
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_KEY']

print("🚀 SmartLedger Database Initialization")
print("=" * 50)
print(f"Supabase URL: {supabase_url}")
print("=" * 50)

# Read the SQL initialization script
sql_file = ROOT_DIR / 'init_database.sql'
if not sql_file.exists():
    print("❌ Error: init_database.sql not found!")
    print(f"   Expected location: {sql_file}")
    exit(1)

with open(sql_file, 'r', encoding='utf-8') as f:
    sql_script = f.read()

print("\n📋 SQL Script loaded successfully!")
print(f"   Script size: {len(sql_script)} characters")

print("\n" + "=" * 50)
print("⚠️  IMPORTANT INSTRUCTIONS:")
print("=" * 50)
print("""
The Supabase Python client doesn't support executing raw SQL scripts.
You need to run the SQL script manually in the Supabase Dashboard.

STEPS TO COMPLETE SETUP:
1. Go to: https://app.supabase.com/
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy the contents of: backend/init_database.sql
6. Paste into the SQL editor
7. Click "Run" or press Ctrl+Enter

QUICK LINK:
https://app.supabase.com/project/{}/sql

The SQL script will create:
✅ users table (linked to Supabase Auth)
✅ transactions table (for expense tracking)
✅ budgets table (for budget management)
✅ All necessary indexes and security policies
✅ Auto-trigger to create user profiles on signup

After running the SQL script, your database will be ready!
Then restart the backend server and try signing in again.
""".format(supabase_url.split('//')[1].split('.')[0]))

print("\n" + "=" * 50)
print("📄 SQL Script Preview (First 1000 characters):")
print("=" * 50)
print(sql_script[:1000])
print("\n... (continued in init_database.sql)")
print("\n" + "=" * 50)

input("\n Press Enter to open the Supabase SQL Editor URL in your notes...")

print(f"\n📋 Copy this URL to your browser:")
print(f"   https://app.supabase.com/project/{supabase_url.split('//')[1].split('.')[0]}/sql")
print(f"\n📄 Then copy and run: backend/init_database.sql")
print("\n✅ After that, restart the backend server!")
