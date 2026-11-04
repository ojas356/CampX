# ==============================================================================
# CampX — Lightweight Windows PostgreSQL Setup (No Docker, No pgAdmin)
# ==============================================================================
# Run this script in PowerShell from the `database/` folder:
#   powershell -ExecutionPolicy Bypass -File .\setup-windows.ps1
# ==============================================================================

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DataDir   = Join-Path $ScriptDir "pgdata"
$LogFile   = Join-Path $ScriptDir "postgres.log"
$InitSql   = Join-Path $ScriptDir "init.sql"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CampX PostgreSQL Setup for Windows (No Docker)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Check if PostgreSQL CLI tools (initdb, pg_ctl, psql) are on PATH or in Scoop
function Find-PgBin {
    $pgCtl = Get-Command pg_ctl -ErrorAction SilentlyContinue
    if ($pgCtl) {
        return Split-Path -Parent $pgCtl.Source
    }
    $scoopPg = Join-Path $env:USERPROFILE "scoop\apps\postgresql\current\bin"
    if (Test-Path (Join-Path $scoopPg "pg_ctl.exe")) {
        return $scoopPg
    }
    $progFiles = @(
        "C:\Program Files\PostgreSQL\16\bin",
        "C:\Program Files\PostgreSQL\15\bin",
        "C:\Program Files\PostgreSQL\17\bin"
    )
    foreach ($dir in $progFiles) {
        if (Test-Path (Join-Path $dir "pg_ctl.exe")) {
            return $dir
        }
    }
    return $null
}

$PgBin = Find-PgBin

if (-not $PgBin) {
    Write-Host "`nPostgreSQL CLI tools not found on your system." -ForegroundColor Yellow
    Write-Host "Installing lightweight CLI-only PostgreSQL via Scoop (no pgAdmin, no background bloat)..." -ForegroundColor Yellow

    if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Scoop package manager for current user..." -ForegroundColor Cyan
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
    }

    scoop install postgresql
    $PgBin = Find-PgBin
}

if (-not $PgBin) {
    Write-Error "Could not locate PostgreSQL binaries (pg_ctl.exe / psql.exe). Please install via 'scoop install postgresql' or 'winget install PostgreSQL.PostgreSQL.16'."
    exit 1
}

$env:PATH = "$PgBin;$env:PATH"
Write-Host "Using PostgreSQL binaries at: $PgBin" -ForegroundColor Green

# 2. Initialize local data directory (./database/pgdata) if not already initialized
if (-not (Test-Path (Join-Path $DataDir "PG_VERSION"))) {
    Write-Host "`n[1/4] Initializing lightweight local database cluster in .\pgdata ..." -ForegroundColor Cyan
    & "$PgBin\initdb.exe" -D $DataDir -U postgres -A trust --encoding=UTF8 --locale=C
} else {
    Write-Host "`n[1/4] Local database cluster .\pgdata already exists." -ForegroundColor Green
}

# 3. Start the PostgreSQL server on port 5432
Write-Host "`n[2/4] Starting PostgreSQL server on localhost:5432 ..." -ForegroundColor Cyan
$status = & "$PgBin\pg_ctl.exe" -D $DataDir status 2>&1
if ($LASTEXITCODE -ne 0) {
    & "$PgBin\pg_ctl.exe" -D $DataDir -l $LogFile -o "-p 5432" start
    Start-Sleep -Seconds 2
} else {
    Write-Host "PostgreSQL server is already running." -ForegroundColor Green
}

# 4. Create campx_user and campx_db if they do not exist
Write-Host "`n[3/4] Configuring 'campx_user' and 'campx_db' ..." -ForegroundColor Cyan
$roleExists = & "$PgBin\psql.exe" -h localhost -p 5432 -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='campx_user'"
if ($roleExists -ne "1") {
    & "$PgBin\psql.exe" -h localhost -p 5432 -U postgres -c "CREATE USER campx_user WITH PASSWORD 'campx_pass';"
}

$dbExists = & "$PgBin\psql.exe" -h localhost -p 5432 -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='campx_db'"
if ($dbExists -ne "1") {
    & "$PgBin\psql.exe" -h localhost -p 5432 -U postgres -c "CREATE DATABASE campx_db OWNER campx_user;"
    & "$PgBin\psql.exe" -h localhost -p 5432 -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE campx_db TO campx_user;"
}

# 5. Load schema and initial APSIT seed data from init.sql
Write-Host "`n[4/4] Loading CampX schema & APSIT sample data from init.sql ..." -ForegroundColor Cyan
$env:PGPASSWORD = "campx_pass"
& "$PgBin\psql.exe" -h localhost -p 5432 -U campx_user -d campx_db -f $InitSql

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  SUCCESS! CampX PostgreSQL is running on port 5432" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Database URL : jdbc:postgresql://localhost:5432/campx_db"
Write-Host "  Username     : campx_user"
Write-Host "  Password     : campx_pass"
Write-Host ""
Write-Host "  Quick Commands (from database\ folder):" -ForegroundColor Yellow
Write-Host "    .\start-db-windows.bat    -> Start PostgreSQL"
Write-Host "    .\inspect-db-windows.bat  -> View tables & run SQL queries"
Write-Host "    .\stop-db-windows.bat     -> Stop PostgreSQL (0 background RAM)"
