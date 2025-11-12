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
  # Student Management — Interview Assignment

  This repository contains the Student Management web application developed for the interview assignment. The project is intentionally focused on delivering the required functionality (API + stored procedures + frontend CRUD). The README below contains concise, professional instructions to run and verify the application locally.

  ## What is included
  - Backend: .NET 8 Minimal API with a clear three‑tier structure (API → Service → Repository). The API endpoints call stored procedures for all CRUD operations.
  - Database scripts: `/database` contains idempotent SQL scripts:
    - `create_database.sql` — creates the StudentDB database if it does not exist
    - `create_table.sql` — creates the `dbo.Student` table
    - `stored_procedures.sql` — CRUD stored procedures (CREATE/ALTER)
    - `alter_add_dateofbirth.sql` — schema adjustment script
  - Frontend: Vite + React + TypeScript app in `/frontend` with a Login page (demo) and a Student management page wired to the API.

  ## Why include seed data (optional)
  Seed data makes manual verification during review fast: a small set of sample students lets the reviewer open the UI and exercise list/edit/delete flows without creating data first. Seed scripts are optional; if you prefer I can add `database/seed.sql` that inserts 2–3 sample rows idempotently.

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
  curl -sS -X POST http://localhost:5000/api/students \
    -H 'Content-Type: application/json' \
    -d '{"firstName":"Alice","lastName":"Smith","email":"alice@example.com","dateOfBirth":"1999-05-14"}'
  ```

  List:

  ```bash
  curl -sS http://localhost:5000/api/students
  ```

  Update / Delete: use the corresponding PUT/DELETE endpoints as usual.

  ## Security note — configuration and secrets
  I noticed a concern about `appsettings.json` containing a password. Storing credentials in a committed file is not secure. Recommended practices:

  1. Rotate the exposed password immediately (if it was committed). For a local Azure SQL Edge container you can change the SA password via `sqlcmd` or recreate the container with a new `SA_PASSWORD`.

  2. Remove the committed secrets from the repository and stop committing credentials:

  ```bash
  git rm --cached backend/appsettings.json
  echo "backend/appsettings.json" >> .gitignore
  git add .gitignore
  git commit -m "Remove sensitive config from repo and ignore it"
  ```

  3. Use environment variables for connection strings locally (example above). For development, `dotnet user-secrets` is useful; for production use the platform's secret store (Azure App Service settings or Azure Key Vault).

  4. Update `backend/appsettings.json` in the repository to a template (no secrets) or add `backend/appsettings.json.example` with placeholders and do not commit real credentials.

  If you want, I can:
  - create `backend/appsettings.json.example` with a placeholder connection string, and
  - remove the real `backend/appsettings.json` from the repo (and add it to `.gitignore`) and provide the exact commands to rotate the SA password in your running container.

  ## Why seeds are useful
  Seed scripts (optional) speed up manual verification for reviewers: they insert a few sample rows so the UI shows real data immediately. Seeds should be idempotent (so they can be re-run safely).

  ## Next recommended steps (I can implement any of these)
  - Add an idempotent `database/seed.sql` that inserts 2–3 example students.
  - Replace `backend/appsettings.json` with `backend/appsettings.json.example` and remove secrets from Git history.
  - Add 2 backend tests (unit + integration) to validate input rules and CRUD happy path.

  If you want me to make the README changes above permanent (I updated it already) and add a seed file and `appsettings.json.example`, tell me which to do first — I can add the seed script and the example settings now and show the exact git commands to remove sensitive data from the repo and rotate the password.
```



---
