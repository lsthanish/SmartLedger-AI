# 🚀 SmartLedger Deployment Guide

Complete guide for deploying SmartLedger to production using Vercel/Netlify (Frontend) and Railway/Render (Backend).

## 📋 Pre-Deployment Checklist

### 1. Backend Preparation
- [ ] Backend works locally (test at http://localhost:8001/docs)
- [ ] All environment variables documented in `backend/.env.example`
- [ ] Database schema created in Supabase (run `backend/init_database.sql`)
- [ ] Gemini API key is valid and has quota
- [ ] Dependencies listed in `backend/requirements.txt`

### 2. Frontend Preparation
- [ ] Frontend builds successfully (`npm run build` in frontend/)
- [ ] All environment variables documented in `frontend/.env.example`
- [ ] API URLs updated for production
- [ ] CORS origins configured in backend

### 3. Repository Preparation
- [ ] `.gitignore` file excludes `.env`, `node_modules/`, `__pycache__/`
- [ ] Sensitive data removed from code
- [ ] `README.md` updated with deployment instructions
- [ ] Configuration files created (`vercel.json`, `netlify.toml`, `railway.toml`)

## 🎯 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git repository (if not already done)
cd SmartLedger
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SmartLedger ready for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/joshuahanielgts/SmartLedger.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy Backend (Railway)

#### Option A: Using Railway Dashboard

1. **Sign up/Login to Railway**
   - Go to https://railway.app/
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your SmartLedger repository
   - Railway will auto-detect Python

3. **Configure Backend Service**
   - Root Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server_supabase:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   Go to Variables tab and add:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   JWT_SECRET_KEY=your-secret-key-32-chars-minimum
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   CORS_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app
   HOST=0.0.0.0
   PORT=$PORT
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your backend URL (e.g., `https://smartledger-backend.up.railway.app`)

#### Option B: Using Render

1. **Sign up/Login to Render**
   - Go to https://render.com/
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select SmartLedger repo

3. **Configure Service**
   - Name: `smartledger-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server_supabase:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   Add the same variables as Railway (see above)

5. **Deploy**
   - Click "Create Web Service"
   - Copy your backend URL

### Step 3: Deploy Frontend (Vercel)

#### Option A: Using Vercel Dashboard

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com/
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your SmartLedger repository
   - Select repository from list

3. **Configure Project**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Set Environment Variables**
   Go to Settings → Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_SITE_URL=https://your-frontend.vercel.app
   REACT_APP_SITE_NAME=SmartLedger
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

#### Option B: Using Netlify

1. **Sign up/Login to Netlify**
   - Go to https://netlify.com/
   - Sign in with GitHub

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select SmartLedger repository

3. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Node version: 18

4. **Set Environment Variables**
   Go to Site settings → Build & deploy → Environment:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_SITE_URL=https://your-site.netlify.app
   REACT_APP_SITE_NAME=SmartLedger
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Visit your live site!

### Step 4: Update CORS Settings

After deployment, update your backend CORS settings:

1. **Update Backend Environment Variables**
   In Railway/Render, update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app
   ```

2. **Redeploy Backend**
   - Railway: Automatically redeploys
   - Render: Click "Manual Deploy" → "Deploy latest commit"

### Step 5: Verify Deployment

1. **Test Backend**
   - Visit `https://your-backend.railway.app/health`
   - Should return: `{"status": "healthy"}`
   - Visit `https://your-backend.railway.app/docs`
   - Should show FastAPI documentation

2. **Test Frontend**
   - Visit your frontend URL
   - Create a test account
   - Add a transaction
   - Check if data persists
   - Test all AI features

3. **Test Integration**
   - Sign up for a new account
   - Verify profile is created in Supabase
   - Add transactions and budgets
   - Check Supabase dashboard to confirm data

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

#### Vercel
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `REACT_APP_SITE_URL` environment variable

#### Netlify
1. Go to Domain settings → Add custom domain
2. Follow DNS configuration instructions
3. Enable HTTPS (automatic)
4. Update `REACT_APP_SITE_URL` environment variable

#### Railway
1. Go to Settings → Domains
2. Click "Generate Domain" or add custom domain
3. Update `CORS_ORIGINS` in environment variables

### SSL/HTTPS
- Vercel: Automatic
- Netlify: Automatic
- Railway: Automatic
- Render: Automatic

All platforms provide free SSL certificates via Let's Encrypt.

### Environment Variables Management

#### Update Variables:
1. **Vercel**: Settings → Environment Variables → Edit
2. **Netlify**: Site settings → Build & deploy → Environment → Edit
3. **Railway**: Service → Variables → Edit
4. **Render**: Dashboard → Environment → Edit

After updating, redeploy:
- Vercel: Automatic on git push
- Netlify: Automatic on git push
- Railway: Automatic on variable change
- Render: Manual deploy or automatic on git push

## 🐛 Troubleshooting

### Frontend Shows "Network Error"
- **Cause**: Backend URL incorrect or CORS not configured
- **Fix**: 
  1. Verify `REACT_APP_BACKEND_URL` in frontend environment variables
  2. Check `CORS_ORIGINS` in backend includes your frontend URL
  3. Redeploy backend after CORS update

### Backend Returns 500 Errors
- **Cause**: Environment variables missing or incorrect
- **Fix**:
  1. Check all environment variables are set in Railway/Render
  2. Verify Supabase URL and key are correct
  3. Check Gemini API key is valid
  4. View logs in Railway/Render dashboard

### Build Fails on Vercel/Netlify
- **Cause**: Missing dependencies or environment variables
- **Fix**:
  1. Check `package.json` has all dependencies
  2. Verify Node version is 16+ (set in build settings)
  3. Ensure environment variables are set before build
  4. Check build logs for specific errors

### Database Connection Errors
- **Cause**: Supabase credentials incorrect or RLS policies blocking access
- **Fix**:
  1. Verify Supabase URL and anon key
  2. Check RLS policies in Supabase dashboard
  3. Ensure `init_database.sql` was run
  4. Test connection from Railway/Render logs

### AI Features Not Working
- **Cause**: Gemini API key invalid or quota exceeded
- **Fix**:
  1. Verify Gemini API key in backend environment variables
  2. Check API quota at https://makersuite.google.com/
  3. View backend logs for Gemini-specific errors

## 📊 Monitoring & Logs

### View Logs

**Railway:**
- Go to your project → Service → Logs
- Real-time streaming logs

**Render:**
- Go to Dashboard → Logs
- Filter by service

**Vercel:**
- Go to Deployments → Deployment → Logs
- Function logs available

**Netlify:**
- Go to Deploys → Deploy log
- Function logs in Functions tab

### Health Checks

**Backend Health:**
```bash
curl https://your-backend.railway.app/health
```

**Frontend Health:**
```bash
curl https://your-frontend.vercel.app
```

### Performance Monitoring

- **Vercel**: Built-in analytics in dashboard
- **Netlify**: Analytics addon available
- **Railway**: Metrics in dashboard (CPU, memory, network)
- **Supabase**: Database metrics in dashboard

## 💰 Cost Estimates

### Free Tier Limits

**Railway:**
- $5 free credits/month
- ~500 hours runtime
- Perfect for small projects

**Render:**
- Free tier available
- 750 hours/month
- Service sleeps after 15 min inactivity

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Generous free tier

**Netlify:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Generous free tier

**Supabase:**
- 500 MB database
- 2 GB bandwidth/month
- 50,000 monthly active users

**Google Gemini:**
- 60 requests/minute (free tier)
- 1,500 requests/day
- Perfect for testing

### Recommended Paid Plans (Optional)

If you exceed free tiers:
- **Railway**: $5/month (remove free tier limits)
- **Vercel Pro**: $20/month (more bandwidth)
- **Netlify Pro**: $19/month (more build minutes)
- **Supabase Pro**: $25/month (8 GB database)

## 🔄 Continuous Deployment

### Automatic Deployments

All platforms support automatic deployment on git push:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Build**
   - Vercel/Netlify detect changes
   - Railway/Render rebuild backend
   - New version goes live automatically

3. **Rollback if Needed**
   - All platforms support instant rollback
   - Go to Deployments → Previous version → Rollback

### Branch Deployments

**Vercel/Netlify** automatically create preview deployments for:
- Pull requests
- Feature branches
- Great for testing before merging

## 🎉 Success!

Your SmartLedger app is now live! Share your URL:
- Frontend: `https://your-site.vercel.app`
- Backend API: `https://your-backend.railway.app`

Next steps:
1. Share with friends and family
2. Monitor usage and logs
3. Gather feedback
4. Iterate and improve

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify all environment variables
3. Test locally first
4. Review troubleshooting section above
5. Check platform-specific documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com/)
   - [Railway Docs](https://docs.railway.app/)
   - [Render Docs](https://render.com/docs)
   - [Supabase Docs](https://supabase.com/docs)

---

**Made with ❤️ for better financial wellness**
