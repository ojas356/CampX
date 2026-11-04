# CampX — PostgreSQL Setup & Inspection on Windows (Without Docker or pgAdmin)

This directory contains everything needed to run **PostgreSQL natively on Windows without Docker** and **without installing heavy GUI tools like pgAdmin or StackBuilder**.

---

## Files in `database/`

| File | Purpose |
|---|---|
| `setup-windows.ps1` | Automated PowerShell script that installs CLI-only PostgreSQL (if missing), initializes a local `pgdata/` folder, starts the server on port `5432`, creates `campx_user` & `campx_db`, and loads `init.sql`. |
| `start-db-windows.bat` | Starts the local PostgreSQL server on `localhost:5432`. |
| `stop-db-windows.bat` | Stops the local PostgreSQL server cleanly so it uses **0 MB RAM** in the background when you aren't coding. |
| `inspect-db-windows.bat` | Runs `inspect_queries.sql` to print all students, products, and chats in Command Prompt/PowerShell, then opens an interactive `psql` prompt. |
| `init.sql` | Creates the `students`, `products`, `conversations`, and `messages` tables and seeds realistic APSIT student accounts and marketplace listings. |
| `inspect_queries.sql` | Ready-to-run SQL queries verifying student-to-product ownership and chat threads. |

---

## Method 1: Automated 1-Command Windows Setup (Recommended)

Open **PowerShell** inside the `database` folder and run:

```powershell
cd database
powershell -ExecutionPolicy Bypass -File .\setup-windows.ps1
```

### What `setup-windows.ps1` does automatically:
1. Checks if PostgreSQL CLI tools (`initdb.exe`, `pg_ctl.exe`, `psql.exe`) are already installed on your Windows machine.
2. If not found, installs **portable CLI-only PostgreSQL** via [Scoop](https://scoop.sh/) (`scoop install postgresql`) into your user folder—**skipping pgAdmin 4, StackBuilder, and permanent Windows background services** (saving ~800 MB of disk space).
3. Creates a self-contained database folder at `database\pgdata`.
4. Starts PostgreSQL on `localhost:5432`.
5. Creates database user `campx_user` (password: `campx_pass`) and database `campx_db`.
6. Executes `init.sql` to create tables and seed APSIT sample data.

### Daily Start, Inspect & Stop on Windows (Command Prompt or PowerShell)

Once set up, you can double-click these `.bat` files or run them from terminal:

- **Start Database:**
  ```powershell
  .\start-db-windows.bat
  ```
- **Inspect Tables & Run SQL Queries (No pgAdmin needed):**
  ```powershell
  .\inspect-db-windows.bat
  ```
- **Stop Database (Frees 100% of background RAM):**
  ```powershell
  .\stop-db-windows.bat
  ```

---

## Method 2: Manual Step-by-Step Windows Setup (Using PowerShell)

If you prefer to run every command yourself in **Windows PowerShell**:

### Step 1: Install Lightweight PostgreSQL CLI on Windows
Run the following in PowerShell to install portable PostgreSQL via Scoop (no admin popup, no pgAdmin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
scoop install postgresql
```
*(Alternatively, if you already installed PostgreSQL using the Windows installer in `C:\Program Files\PostgreSQL\16\bin`, add that `bin` folder to your Windows `PATH`).*

### Step 2: Initialize & Start a Local Database Cluster
Inside the `database/` folder:
```powershell
# 1. Initialize a local data folder inside database\pgdata
initdb -D .\pgdata -U postgres -A trust --encoding=UTF8 --locale=C

# 2. Start PostgreSQL on port 5432
pg_ctl -D .\pgdata -l .\postgres.log -o "-p 5432" start
```

### Step 3: Create `campx_user`, `campx_db`, and Load `init.sql`
```powershell
# 1. Create the CampX database user and database
psql -h localhost -p 5432 -U postgres -c "CREATE USER campx_user WITH PASSWORD 'campx_pass';"
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE campx_db OWNER campx_user;"
psql -h localhost -p 5432 -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE campx_db TO campx_user;"

# 2. Load the schema and APSIT sample listings
$env:PGPASSWORD="campx_pass"
psql -h localhost -p 5432 -U campx_user -d campx_db -f .\init.sql
```

---

## How to Inspect the Database in Windows Terminal (No pgAdmin)

Open PowerShell or Command Prompt in the `database/` folder and run:

```powershell
.\inspect-db-windows.bat
```
Or connect directly with `psql`:
```powershell
$env:PGPASSWORD="campx_pass"
psql -h localhost -p 5432 -U campx_user -d campx_db
```

Inside the `campx_db=>` prompt, use these commands:
- `\dt` — List all tables (`students`, `products`, `conversations`, `messages`)
- `SELECT id, name, college_email, phone_number FROM students;` — View registered APSIT students
- `SELECT id, product_name, price, condition, status, student_id FROM products;` — View marketplace listings
- `\q` — Exit `psql`
