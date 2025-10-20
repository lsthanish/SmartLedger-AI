# SmartLedger Startup Script (PowerShell)
# This script sets up and runs the complete SmartLedger application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SmartLedger v2.0 - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Please run this script from the SmartLedger root directory" -ForegroundColor Red
    exit 1
}

# Step 1: Setup Backend
Write-Host "[1/4] Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "  Creating virtual environment..." -ForegroundColor Gray
    python -m venv venv
}

# Activate virtual environment
Write-Host "  Activating virtual environment..." -ForegroundColor Gray
& .\venv\Scripts\Activate.ps1

# Install/Update dependencies
Write-Host "  Installing Python dependencies..." -ForegroundColor Gray
pip install -q -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "  Error: Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ Backend setup complete!" -ForegroundColor Green
Set-Location ..

# Step 2: Setup Frontend
Write-Host ""
Write-Host "[2/4] Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing Node dependencies..." -ForegroundColor Gray
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Error: Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  Node modules already installed" -ForegroundColor Gray
}

Write-Host "  ✓ Frontend setup complete!" -ForegroundColor Green
Set-Location ..

# Step 3: Start Backend Server
Write-Host ""
Write-Host "[3/4] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "  Backend will run on: http://localhost:8001" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\Activate.ps1; python server_supabase.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Step 4: Start Frontend Server
Write-Host ""
Write-Host "[4/4] Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "  Frontend will open at: http://localhost:3000" -ForegroundColor Cyan

Set-Location frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

Set-Location ..

# Done
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SmartLedger is starting up!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy tracking! :)" -ForegroundColor Magenta
