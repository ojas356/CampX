@echo off
REM ============================================================================
REM CampX — Stop Local PostgreSQL on Windows (Frees all background RAM)
REM ============================================================================
setlocal
set "SCRIPT_DIR=%~dp0"
set "DATA_DIR=%SCRIPT_DIR%pgdata"

if exist "%USERPROFILE%\scoop\apps\postgresql\current\bin\pg_ctl.exe" (
    set "PATH=%USERPROFILE%\scoop\apps\postgresql\current\bin;%PATH%"
) else if exist "C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" (
    set "PATH=C:\Program Files\PostgreSQL\16\bin;%PATH%"
) else if exist "C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe" (
    set "PATH=C:\Program Files\PostgreSQL\15\bin;%PATH%"
)

echo [CampX] Stopping local PostgreSQL server...
pg_ctl -D "%DATA_DIR%" stop -m fast
echo [CampX] PostgreSQL stopped cleanly. Zero background processes running.
endlocal
