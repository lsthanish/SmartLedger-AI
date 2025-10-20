# 🖥️ Terminal Commands Reference

## Quick Start Commands

### Using PowerShell Script (Easiest - Windows)
```powershell
# From SmartLedger root directory
.\start.ps1
```
This automatically:
- Sets up Python virtual environment
- Installs backend dependencies
- Installs frontend dependencies
- Starts backend on port 8001
- Starts frontend on port 3000

---

## Manual Start Commands

### Backend Only

**Windows (PowerShell):**
```powershell
cd C:\path\to\SmartLedger\backend
python .\server_supabase.py
```

**Linux/Mac (Bash):**
```bash
cd /path/to/SmartLedger/backend
python server_supabase.py
```

**With Virtual Environment:**
```powershell
# Windows
cd backend
.\venv\Scripts\Activate.ps1
python server_supabase.py

# Linux/Mac
cd backend
source venv/bin/activate
python server_supabase.py
```

### Frontend Only

**All Platforms:**
```bash
cd frontend
npm start
```

---

## Complete Manual Setup

### Step-by-Step Setup (First Time)

**1. Install Backend Dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**2. Configure Backend Environment:**
```bash
# Create .env file in backend directory
# Copy contents from .env.example or set manually:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-key
# GEMINI_API_KEY=your-key
```

**3. Initialize Database:**
- Go to Supabase Dashboard: https://app.supabase.com/
- Navigate to SQL Editor
- Copy and run `backend/init_database.sql`

**4. Install Frontend Dependencies:**
```bash
cd frontend
npm install
```

**5. Configure Frontend Environment:**
```bash
# Create .env file in frontend directory
# Set:
# REACT_APP_BACKEND_URL=http://localhost:8001
# REACT_APP_SUPABASE_URL=https://your-project.supabase.co
# REACT_APP_SUPABASE_ANON_KEY=your-key
```

**6. Start Both Servers:**

Terminal 1 (Backend):
```bash
cd backend
python server_supabase.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

---

## Testing Commands

### Test Database Connection:
```bash
cd backend
python -c "from supabase import create_client; import os; from dotenv import load_dotenv; load_dotenv(); supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY']); print('Connection successful!'); print(supabase.table('users').select('*').limit(1).execute())"
```

### Test Backend Health:
```bash
curl http://localhost:8001/health
```

### Check Python Version:
```bash
python --version
# Should be 3.11 or higher
```

### Check Node Version:
```bash
node --version
# Should be 16 or higher
```

---

## Stopping Servers

### Stop Backend:
- Press `Ctrl + C` in the backend terminal

### Stop Frontend:
- Press `Ctrl + C` in the frontend terminal

### Kill Processes (if stuck):

**Windows (PowerShell):**
```powershell
# Find processes
Get-Process python* | Where-Object { $_.Path -like "*SmartLedger*" }
Get-Process node* | Where-Object { $_.Path -like "*SmartLedger*" }

# Kill specific process by ID
Stop-Process -Id <process-id> -Force
```

**Linux/Mac:**
```bash
# Find processes
ps aux | grep "server_supabase.py"
ps aux | grep "npm start"

# Kill by port
kill $(lsof -t -i:8001)  # Backend
kill $(lsof -t -i:3000)  # Frontend
```

---

## Common Development Commands

### Backend

**Restart Backend:**
```bash
# Stop with Ctrl+C, then:
cd backend
python server_supabase.py
```

**View API Documentation:**
- Open browser: http://localhost:8001/docs

**Run Python in Backend Context:**
```bash
cd backend
python
>>> from supabase import create_client
>>> # Test code here
```

### Frontend

**Restart Frontend:**
```bash
# Stop with Ctrl+C, then:
cd frontend
npm start
```

**Build for Production:**
```bash
cd frontend
npm run build
```

**Clear Cache and Reinstall:**
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Troubleshooting Commands

### Clear Browser Data:
- Open DevTools (F12)
- Application > Local Storage > Clear
- Application > Session Storage > Clear

### Check Logs:

**Backend Logs:**
- Look at terminal where backend is running
- Check for errors and request logs

**Frontend Logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Verify Environment Variables:

**Backend:**
```bash
cd backend
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('SUPABASE_URL:', os.environ.get('SUPABASE_URL')); print('PORT:', os.environ.get('PORT'))"
```

**Frontend:**
```bash
cd frontend
echo $REACT_APP_BACKEND_URL  # Linux/Mac
$env:REACT_APP_BACKEND_URL   # Windows PowerShell
```

---

## Development Workflow

### Typical Development Session:

1. **Start Servers:**
```bash
.\start.ps1  # Windows
# OR start manually in 2 terminals
```

2. **Make Changes:**
- Edit files in `frontend/src/` or `backend/`
- Frontend auto-reloads on save
- Backend needs restart after changes

3. **Test Changes:**
- Frontend: Browser auto-refreshes
- Backend: Restart server

4. **Stop Servers:**
- Press Ctrl+C in each terminal

### Quick Test Cycle:

```bash
# Terminal 1 - Backend (restart after changes)
cd backend
python server_supabase.py

# Terminal 2 - Frontend (auto-reloads)
cd frontend
npm start

# Terminal 3 - Testing
curl http://localhost:8001/health
curl http://localhost:8001/api/categories
```

---

## Production Commands

### Build Frontend:
```bash
cd frontend
npm run build
# Creates optimized build/ folder
```

### Run Production Backend:
```bash
cd backend
uvicorn server_supabase:app --host 0.0.0.0 --port 8001 --workers 4
```

### Environment Check:
```bash
# Verify all env vars are set
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); required = ['SUPABASE_URL', 'SUPABASE_KEY', 'GEMINI_API_KEY']; missing = [k for k in required if not os.environ.get(k)]; print('✅ All set!' if not missing else f'❌ Missing: {missing}')"
```

---

## Useful URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application |
| Backend API | http://localhost:8001 | FastAPI server |
| API Docs | http://localhost:8001/docs | Swagger UI |
| API Redoc | http://localhost:8001/redoc | ReDoc UI |
| Health Check | http://localhost:8001/health | Server status |
| Supabase Dashboard | https://app.supabase.com/ | Database management |

---

## Emergency Recovery

### If Everything Breaks:

1. **Stop all servers** (Ctrl+C everywhere)
2. **Kill all processes:**
```powershell
Get-Process python* | Stop-Process -Force
Get-Process node* | Stop-Process -Force
```
3. **Reinstall dependencies:**
```bash
cd backend
pip install -r requirements.txt

cd frontend
rm -rf node_modules
npm install
```
4. **Start fresh:**
```bash
.\start.ps1
```

---

**Need Help?** Check `README.md` or `TROUBLESHOOTING.md` for detailed guides!
