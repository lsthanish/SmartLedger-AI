# SmartLedger Setup Guide

## Complete Setup Instructions for SmartLedger v2.0

This guide will walk you through setting up SmartLedger with Supabase and Gemini AI.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Database Setup](#supabase-database-setup)
3. [Gemini AI API Key](#gemini-ai-api-key)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.11 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **A Supabase Account** - [Sign up free](https://supabase.com/)
- **A Google Account** for Gemini AI - [Sign in](https://ai.google.dev/)

---

## Supabase Database Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign up/login
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: SmartLedger
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
4. Click **"Create New Project"** and wait for it to initialize (1-2 minutes)

### Step 2: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `backend/supabase_schema.sql` from your project
4. Copy the entire contents and paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### Step 3: Get Your Supabase Credentials

1. Go to **Settings** > **API** (in your Supabase dashboard)
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (the long JWT token)
3. Save these values - you'll need them for configuration

### Step 4: Verify Your Database

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - `users`
   - `transactions`
   - `budgets`
   - `ai_insights`

---

## Gemini AI API Key

### Step 1: Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select **"Create API key in new project"** (or use an existing project)
5. Copy the API key (it starts with `AIza...`)
6. Save this key securely

### Step 2: Test Your API Key (Optional)

You can test your API key at [Google AI Studio](https://aistudio.google.com/)

---

## Backend Configuration

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

1. Create a `.env` file in the `backend` directory
2. Copy the contents from `.env.example`
3. Fill in your credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY

# Gemini AI Configuration
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# JWT Configuration (Generate a random secure key)
JWT_SECRET_KEY=your-very-long-and-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://your-domain.com

# Server Configuration
HOST=0.0.0.0
PORT=8001
```

**Important:** Generate a strong JWT secret key. You can use:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 5: Test the Backend

```bash
python server_supabase.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

Visit `http://localhost:8001/health` to verify it's working.

---

## Frontend Configuration

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

### Step 3: Configure Environment Variables

1. Create a `.env` file in the `frontend` directory
2. Copy the contents from `.env.example`
3. Fill in your configuration:

```env
# Backend API
REACT_APP_BACKEND_URL=http://localhost:8001

# Supabase Configuration (same as backend)
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Site Configuration
REACT_APP_SITE_URL=https://smartledger.app
REACT_APP_SITE_NAME=SmartLedger
```

### Step 4: Test the Frontend

**Using npm:**
```bash
npm start
```

**Using yarn:**
```bash
yarn start
```

The app should open at `http://localhost:3000`

---

## Running the Application

### Full Startup Process

1. **Start Backend** (in one terminal):
   ```bash
   cd backend
   # Activate virtual environment
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   python server_supabase.py
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**:
   - Open your browser to `http://localhost:3000`
   - Create an account
   - Start tracking your finances!

---

## Testing the Features

### 1. Test User Registration
- Go to the Auth page
- Register with your email and password
- You should be logged in automatically

### 2. Test Transactions
- Navigate to Transactions
- Add a few sample transactions (income and expenses)
- Try editing and deleting

### 3. Test Budgets
- Go to Budgets
- Create a budget for a category
- Set a limit and see the progress bar

### 4. Test AI Insights (The Cool Part! 🤖)
- Navigate to "AI Insights"
- Select an insight type
- Click "Generate Insight"
- Wait a few seconds for Gemini AI to analyze your data
- Read your personalized financial recommendation!

### 5. Test Dashboard
- Check that all your data appears correctly
- View the charts and statistics

---

## Troubleshooting

### Backend Issues

**Problem:** `Module not found` errors
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt
```

**Problem:** Supabase connection errors
```bash
# Solution: Verify your SUPABASE_URL and SUPABASE_KEY in .env
# Check if the URL includes https://
# Ensure the key is the 'anon public' key, not the service_role key
```

**Problem:** Gemini AI errors
```bash
# Solution: Verify your API key is correct
# Check if you have any API quotas exceeded
# Visit https://makersuite.google.com/app/apikey to verify
```

### Frontend Issues

**Problem:** `Cannot connect to backend`
```bash
# Solution: Ensure backend is running on port 8001
# Check REACT_APP_BACKEND_URL in frontend/.env
```

**Problem:** npm install fails
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Problem:** "Table doesn't exist" errors
```bash
# Solution: Re-run the schema SQL
# Go to Supabase SQL Editor and run backend/supabase_schema.sql again
```

**Problem:** "Row Level Security" errors
```bash
# Solution: Check if RLS policies are properly set up
# The schema should have created them automatically
# You can disable RLS temporarily in Supabase for testing:
# ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

---

## Next Steps

1. **Customize the App**: Edit colors, add more features
2. **Deploy**: See deployment guide in README.md
3. **Add More AI Features**: Expand the Gemini AI integration
4. **Invite Friends**: Share your awesome finance tracker!

---

## Need Help?

- Check the main README.md for more information
- Open an issue on GitHub
- Email: support@smartledger.app

---

**Happy Tracking! 💰📊🤖**
