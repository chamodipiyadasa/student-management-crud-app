# Student Management App

This repository contains a full‑stack Student Management demo . Below are clear, step‑by‑step instructions run the app locally and verify functionality quickly.

## Quick summary — what this repo contains
- Backend: .NET 8 Minimal API (three-tier: API → Service → Repository). CRUD endpoints call stored procedures.
- Database: SQL scripts provided in `/database`:
  - `create_database.sql` — creates `StudentDB` (idempotent)
  - `create_table.sql` — creates `dbo.Student` table (idempotent)
  - `stored_procedures.sql` — all CRUD stored procedures (CREATE/ALTER)
  - `alter_add_dateofbirth.sql` — schema fix (if needed)
- Frontend: Vite + React + TypeScript app (in `/frontend`) with Login page and Students management page (CRUD).


---

## What's implemented (completed)
- .NET Minimal API with endpoints:
  - GET /api/students
  - GET /api/students/{id}
  - POST /api/students
dotnet run --urls "http://localhost:5000"
```

curl -sS http://localhost:5000/api/students | jq .
```
  # Student Management APP

  This repository contains the Student Management web application developed for aassignment. The project is intentionally focused on delivering the required functionality (API + stored procedures + frontend CRUD). The README below contains concise, professional instructions to run and verify the application locally.

  ## What is included
  - Backend: .NET 8 Minimal API with a clear three‑tier structure (API → Service → Repository). The API endpoints call stored procedures for all CRUD operations.
  - Database scripts: `/database` contains idempotent SQL scripts:
    - `create_database.sql` — creates the StudentDB database if it does not exist
    - `create_table.sql` — creates the `dbo.Student` table
    - `stored_procedures.sql` — CRUD stored procedures (CREATE/ALTER)
    - `alter_add_dateofbirth.sql` — schema adjustment script
  - Frontend: Vite + React + TypeScript app in `/frontend` with a Login page (demo) and a Student management page wired to the API.



  ## Prerequisites
  - Docker (recommended for running Azure SQL Edge locally)
  - .NET 8 SDK
  - Node.js (v18+) and npm
  - Optional: `sqlcmd` (for running scripts from host) and `jq` for JSON inspection

  ## Quick local run (recommended)

  1) Start the database (Azure SQL Edge in Docker). Use a secure SA password and keep note of it for the next steps.

  ```bash
  # run Azure SQL Edge (example)
  docker run -e "ACCEPT_EULA=1" -e "SA_PASSWORD=YourStrong!Passw0rd" \
    -p 1433:1433 --name azuresql -d mcr.microsoft.com/azure-sql-edge

  # wait until the container is ready (check logs)
  docker logs -f azuresql
  ```

  2) Apply SQL scripts to create the database, table, and stored procedures. Example using `docker exec`:

  ```bash
  docker cp database/. azuresql:/workspace
  docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/create_database.sql
  docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/create_table.sql
  docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/stored_procedures.sql
  ```

  3) Configure the backend to use a connection string from an environment variable (do not commit secrets):

  macOS / Linux:

  ```bash
  export ConnectionStrings__DefaultConnection="Server=127.0.0.1,1433;Database=StudentDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
  ```

  4) Run the backend:

  ```bash
  cd backend
  dotnet build
  dotnet run --urls "http://localhost:5000"
  ```

  5) Run the frontend:

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

  Open the Vite URL (e.g. http://localhost:5173). Sign in on the Login page (demo) and navigate to the Students page to exercise CRUD.

  ## Quick smoke tests (API)

  Create:

  ```bash
  # Student Management App

  Live demo (frontend): https://student-management-crud-app-s21r.vercel.app/

  This repository is a compact full‑stack Student Management demo. Below are concise, actionable instructions to run and verify the app locally, plus deployment notes for Vercel (frontend) and Azure (backend).

  ## What this repo contains
  - Backend: .NET 8 Minimal API (three‑tier: API → Service → Repository). Endpoints call stored procedures for CRUD.
  - Database: idempotent SQL scripts in `/database` (create database, create table, stored procedures, schema adjustments).
  - Frontend: Vite + React + TypeScript app in `/frontend` with a demo Login and Students management UI.

  ## Quick local run
  Prereqs: Docker, .NET 8 SDK, Node.js (v18+) and npm.

  1) Start Azure SQL Edge (Docker)

  ```bash
  # example: pick a secure SA password
  docker run -e "ACCEPT_EULA=1" -e "SA_PASSWORD=YourStrong!Passw0rd" \
    -p 1433:1433 --name azuresql -d mcr.microsoft.com/azure-sql-edge
  docker logs -f azuresql
  ```

  2) Apply DB scripts (example using docker exec)

  ```bash
  docker cp database/. azuresql:/workspace
  docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/create_database.sql
  docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/create_table.sql
  docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/stored_procedures.sql
  ```

  3) Configure backend connection (do not commit secrets)

  ```bash
  export ConnectionStrings__DefaultConnection="Server=127.0.0.1,1433;Database=StudentDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
  ```

  4) Run backend

  ```bash
  cd backend
  dotnet build
  dotnet run --urls "http://localhost:5000"
  ```

  5) Run frontend (dev)

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

  Open the Vite URL (e.g. http://localhost:5173). Login is a demo; go to Students to exercise CRUD.

  ## Quick API smoke tests

  Create
  ```bash
  curl -sS -X POST http://localhost:5000/api/students \
    -H 'Content-Type: application/json' \
    -d '{"firstName":"Alice","lastName":"Smith","email":"alice@example.com","dateOfBirth":"1999-05-14"}'
  ```

  List
  ```bash
  curl -sS http://localhost:5000/api/students
  ```

  ## Deployment notes

 
