# 🚀 Quick Deployment Checklist

Use this checklist before pushing to GitHub and deploying.

## ✅ Pre-Push Checklist

### 1. Code Quality
- [ ] All features working locally
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Backend starts without errors: `cd backend && python server_supabase.py`
- [ ] No console errors in browser
- [ ] All API endpoints responding

### 2. Environment Variables
- [ ] `backend/.env.example` updated with all required variables
- [ ] `frontend/.env.example` updated with all required variables
- [ ] **Actual `.env` files NOT committed** (check .gitignore)
- [ ] All sensitive data removed from code

### 3. Configuration Files
- [ ] `.gitignore` includes `.env`, `node_modules/`, `__pycache__/`, `build/`
- [ ] `vercel.json` exists in `frontend/`
- [ ] `netlify.toml` exists in `frontend/`
- [ ] `railway.toml` exists in `backend/`
- [ ] `Procfile` exists in `backend/`
- [ ] `runtime.txt` exists in `backend/`

### 4. Database
- [ ] Supabase project created
- [ ] `init_database.sql` executed in Supabase SQL Editor
- [ ] All tables visible in Supabase Table Editor
- [ ] RLS policies enabled and working

### 5. Dependencies
- [ ] `backend/requirements.txt` includes all Python packages
- [ ] `frontend/package.json` includes all npm packages
- [ ] No missing imports in code

## 🚀 Deployment Steps

### Step 1: Commit to Git
```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

### Step 2: Deploy Backend (Railway)
1. Go to https://railway.app/
2. New Project → Deploy from GitHub
3. Select SmartLedger repository
4. Configure:
   - Root Directory: `backend`
   - Start Command: `uvicorn server_supabase:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (copy from `.env.example`)
6. Deploy
7. **Copy backend URL** (e.g., `https://smartledger-production.up.railway.app`)

### Step 3: Deploy Frontend (Vercel)
1. Go to https://vercel.com/
2. New Project → Import Git Repository
3. Select SmartLedger
4. Configure:
   - Root Directory: `frontend`
   - Framework: Create React App
5. Add environment variables:
   - `REACT_APP_BACKEND_URL`: Your Railway backend URL
   - `REACT_APP_SUPABASE_URL`: Your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `REACT_APP_SITE_URL`: Your Vercel URL (add after first deploy)
   - `REACT_APP_SITE_NAME`: SmartLedger
6. Deploy

### Step 4: Update CORS
1. Go back to Railway
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-vercel-url.vercel.app
   ```
3. Save (auto-redeploys)

### Step 5: Test
1. Visit your frontend URL
2. Create account
3. Add transaction
4. Test AI features
5. Verify data in Supabase

## 🔍 Verification Commands

### Test Backend Locally
```bash
cd backend
python server_supabase.py
# Visit: http://localhost:8001/health
# Visit: http://localhost:8001/docs
```

### Test Frontend Locally
```bash
cd frontend
npm run build
npm start
# Visit: http://localhost:3000
```

### Test Backend Production
```bash
curl https://your-backend-url.railway.app/health
```

### Test Database Connection
```bash
cd backend
python -c "from supabase import create_client; import os; from dotenv import load_dotenv; load_dotenv(); print('Testing...'); supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY']); print('Connected!')"
```

## ⚠️ Common Issues

### Issue: Build Fails on Vercel
**Solution:** 
- Check Node version (should be 16+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Issue: Backend 500 Error
**Solution:**
- Check all environment variables are set in Railway
- View Railway logs for error details
- Verify Supabase credentials

### Issue: CORS Error
**Solution:**
- Update `CORS_ORIGINS` in Railway to include your Vercel URL
- Wait for Railway to redeploy (~1 minute)

### Issue: Database Error
**Solution:**
- Verify `init_database.sql` was executed
- Check Supabase dashboard for table visibility
- Test connection with verification command above

## 📦 Files Needed for Deployment

### Backend Files
- ✅ `server_supabase.py` - Main FastAPI application
- ✅ `requirements.txt` - Python dependencies
- ✅ `.env.example` - Environment variables template
- ✅ `Procfile` - Process configuration
- ✅ `runtime.txt` - Python version
- ✅ `railway.toml` - Railway configuration
- ✅ `init_database.sql` - Database schema

### Frontend Files
- ✅ `package.json` - Node dependencies
- ✅ `.env.example` - Environment variables template
- ✅ `vercel.json` - Vercel configuration
- ✅ `netlify.toml` - Netlify configuration
- ✅ All React source files in `src/`

### Root Files
- ✅ `.gitignore` - Git ignore rules
- ✅ `README.md` - Project documentation
- ✅ `DEPLOYMENT.md` - Deployment guide

## 🎯 Post-Deployment

### Monitor Your App
- Railway: Check logs for errors
- Vercel: Check analytics
- Supabase: Monitor database usage

### Update Environment
To update environment variables:
1. Go to platform dashboard
2. Settings → Environment Variables
3. Edit and save (auto-redeploys)

### Rollback if Needed
All platforms support instant rollback:
- Vercel: Deployments → Previous → Rollback
- Railway: Deployments → Previous → Redeploy

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ User can sign up and sign in
- ✅ Transactions can be added
- ✅ Budgets can be created
- ✅ AI features respond
- ✅ Data persists in Supabase
- ✅ No CORS errors in console

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed guide
2. Review platform docs (Vercel, Railway, Supabase)
3. Check logs for specific errors
4. Verify all environment variables

---

**Ready to deploy? Follow the steps above!** 🚀
