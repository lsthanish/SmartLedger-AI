# GitHub Repository Preparation Script
# Run this before pushing to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SmartLedger - GitHub Preparation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "[INFO] Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "[OK] Git initialized" -ForegroundColor Green
} else {
    Write-Host "[OK] Git already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "[CHECK] Verifying deployment files..." -ForegroundColor Yellow

# Check for deployment configuration files
$allGood = $true

Write-Host "  Checking frontend deployment configs..." -ForegroundColor White
if (Test-Path "frontend\vercel.json") { Write-Host "    [OK] vercel.json" -ForegroundColor Green } else { Write-Host "    [MISSING] vercel.json" -ForegroundColor Red; $allGood = $false }
if (Test-Path "frontend\netlify.toml") { Write-Host "    [OK] netlify.toml" -ForegroundColor Green } else { Write-Host "    [MISSING] netlify.toml" -ForegroundColor Red; $allGood = $false }

Write-Host "  Checking backend deployment configs..." -ForegroundColor White
if (Test-Path "backend\railway.toml") { Write-Host "    [OK] railway.toml" -ForegroundColor Green } else { Write-Host "    [MISSING] railway.toml" -ForegroundColor Red; $allGood = $false }
if (Test-Path "backend\Procfile") { Write-Host "    [OK] Procfile" -ForegroundColor Green } else { Write-Host "    [MISSING] Procfile" -ForegroundColor Red; $allGood = $false }
if (Test-Path "backend\runtime.txt") { Write-Host "    [OK] runtime.txt" -ForegroundColor Green } else { Write-Host "    [MISSING] runtime.txt" -ForegroundColor Red; $allGood = $false }

Write-Host "  Checking environment templates..." -ForegroundColor White
if (Test-Path "backend\.env.example") { Write-Host "    [OK] backend/.env.example" -ForegroundColor Green } else { Write-Host "    [MISSING] backend/.env.example" -ForegroundColor Red; $allGood = $false }
if (Test-Path "frontend\.env.example") { Write-Host "    [OK] frontend/.env.example" -ForegroundColor Green } else { Write-Host "    [MISSING] frontend/.env.example" -ForegroundColor Red; $allGood = $false }

Write-Host "  Checking documentation..." -ForegroundColor White
if (Test-Path "README.md") { Write-Host "    [OK] README.md" -ForegroundColor Green } else { Write-Host "    [MISSING] README.md" -ForegroundColor Red; $allGood = $false }
if (Test-Path "DEPLOYMENT.md") { Write-Host "    [OK] DEPLOYMENT.md" -ForegroundColor Green } else { Write-Host "    [MISSING] DEPLOYMENT.md" -ForegroundColor Red; $allGood = $false }
if (Test-Path "DEPLOYMENT_CHECKLIST.md") { Write-Host "    [OK] DEPLOYMENT_CHECKLIST.md" -ForegroundColor Green } else { Write-Host "    [MISSING] DEPLOYMENT_CHECKLIST.md" -ForegroundColor Red; $allGood = $false }

Write-Host "  Checking core files..." -ForegroundColor White
if (Test-Path "backend\server_supabase.py") { Write-Host "    [OK] backend/server_supabase.py" -ForegroundColor Green } else { Write-Host "    [MISSING] backend/server_supabase.py" -ForegroundColor Red; $allGood = $false }
if (Test-Path "backend\init_database.sql") { Write-Host "    [OK] backend/init_database.sql" -ForegroundColor Green } else { Write-Host "    [MISSING] backend/init_database.sql" -ForegroundColor Red; $allGood = $false }
if (Test-Path "frontend\src\App.js") { Write-Host "    [OK] frontend/src/App.js" -ForegroundColor Green } else { Write-Host "    [MISSING] frontend/src/App.js" -ForegroundColor Red; $allGood = $false }
if (Test-Path ".gitignore") { Write-Host "    [OK] .gitignore" -ForegroundColor Green } else { Write-Host "    [MISSING] .gitignore" -ForegroundColor Red; $allGood = $false }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "  STATUS: READY FOR DEPLOYMENT!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps to deploy:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. Stage files:  git add ." -ForegroundColor White
    Write-Host "  2. Commit:       git commit -m 'Ready for deployment'" -ForegroundColor White
    Write-Host "  3. Add remote:   git remote add origin https://github.com/joshuahanielgts/SmartLedger.git" -ForegroundColor White
    Write-Host "  4. Push:         git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Then follow DEPLOYMENT.md or DEPLOYMENT_CHECKLIST.md" -ForegroundColor Cyan
} else {
    Write-Host "  STATUS: MISSING FILES" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please create the missing files above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
