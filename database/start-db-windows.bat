@echo off
REM ============================================================================
REM CampX — Start Local PostgreSQL on Windows (No Docker)
REM ============================================================================
setlocal
set "SCRIPT_DIR=%~dp0"
set "DATA_DIR=%SCRIPT_DIR%pgdata"
set "LOG_FILE=%SCRIPT_DIR%postgres.log"

if exist "%USERPROFILE%\scoop\apps\postgresql\current\bin\pg_ctl.exe" (
    set "PATH=%USERPROFILE%\scoop\apps\postgresql\current\bin;%PATH%"
) else if exist "C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" (
    set "PATH=C:\Program Files\PostgreSQL\16\bin;%PATH%"
) else if exist "C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe" (
    set "PATH=C:\Program Files\PostgreSQL\15\bin;%PATH%"
)

if not exist "%DATA_DIR%\PG_VERSION" (
    echo [CampX] Local database cluster not initialized yet. Running setup-windows.ps1...
    powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%setup-windows.ps1"
    exit /b %ERRORLEVEL%
)

echo [CampX] Starting PostgreSQL server on localhost:5432 ...
pg_ctl -D "%DATA_DIR%" -l "%LOG_FILE%" -o "-p 5432" start
echo [CampX] PostgreSQL is running! Logs: %LOG_FILE%
endlocal
