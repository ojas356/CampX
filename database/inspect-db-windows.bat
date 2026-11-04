@echo off
REM ============================================================================
REM CampX — Inspect Database on Windows via CLI (No pgAdmin Required)
REM ============================================================================
setlocal
set "SCRIPT_DIR=%~dp0"
set "PGPASSWORD=campx_pass"

if exist "%USERPROFILE%\scoop\apps\postgresql\current\bin\psql.exe" (
    set "PATH=%USERPROFILE%\scoop\apps\postgresql\current\bin;%PATH%"
) else if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" (
    set "PATH=C:\Program Files\PostgreSQL\16\bin;%PATH%"
) else if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    set "PATH=C:\Program Files\PostgreSQL\15\bin;%PATH%"
)

echo ========================================================================
echo   CampX Database Summary (inspect_queries.sql)
echo ========================================================================
psql -h localhost -p 5432 -U campx_user -d campx_db -f "%SCRIPT_DIR%inspect_queries.sql"

echo.
echo ========================================================================
echo   Opening interactive psql shell (type \q and press Enter to exit)
echo ========================================================================
psql -h localhost -p 5432 -U campx_user -d campx_db
endlocal
