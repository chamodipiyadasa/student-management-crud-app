# Student Management App

This repository contains a Student Management crud Application

Principles implemented
- 3‑Tier architecture for the backend: API (Minimal API) → Service → Repository/Data Access.
- All database operations use stored procedures (no raw SQL executed from the API).
- MS SQL Server (StudentDB) as the database. SQL scripts are included in `/database`.
- Frontend is a React/TypeScript app (Vite) providing a demo Login and a Student Management UI. (The assignment originally asked for Next.js; this project uses a Vite React frontend wired to the backend.)

Contents
- `/backend` — .NET 8 Minimal API (three-tier). See `Models/`, `Services/`, `Repositories/`.
- `/frontend` — frontend app (Vite + React + TypeScript). Pages: Login, Students (CRUD UI).
- `/database` — SQL scripts (create database, create table, stored procedures, schema adjustments).

Database scripts (in `/database`)
- `create_database.sql`        — creates the `StudentDB` database (idempotent)
- `create_table.sql`           — creates `dbo.Student` table
- `stored_procedures.sql`      — all CRUD stored procedures (CREATE/ALTER)
- `alter_add_dateofbirth.sql`  — schema adjustment (optional)

API (backend) overview
All endpoints are under the `/api/students` route and call stored procedures in `StudentDB`.

Endpoints
- GET  /api/students
  - Description: Returns list of students
  - Example:
    curl -sS http://localhost:5000/api/students

- GET  /api/students/{id}
  - Description: Returns a single student by id
  - Example:
    curl -sS http://localhost:5000/api/students/1

- POST /api/students
  - Description: Creates a new student (body JSON)
  - Example:
    curl -sS -X POST http://localhost:5000/api/students \
      -H 'Content-Type: application/json' \
      -d '{"firstName":"Alice","lastName":"Smith","email":"alice@example.com","dateOfBirth":"1999-05-14"}'

- PUT  /api/students/{id}
  - Description: Updates an existing student (body JSON)
  - Example:
    curl -sS -X PUT http://localhost:5000/api/students/1 \
      -H 'Content-Type: application/json' \
      -d '{"firstName":"Alice","lastName":"Jones","email":"alice.jones@example.com","dateOfBirth":"1999-05-14"}'

- DELETE /api/students/{id}
  - Description: Deletes a student by id
  - Example:
    curl -sS -X DELETE http://localhost:5000/api/students/1

Notes about implementation
- The backend uses stored procedures for all CRUD operations. See `/database/stored_procedures.sql` for the exact procedures called by the API.
- The backend follows a Minimal API pattern but is organized into a Service layer and a Repository layer (see `/backend/Services` and `/backend/Repositories`).

Local setup (quick)
Prerequisites: .NET 8 SDK, Node.js (v18+), npm, Docker (recommended to run Azure SQL Edge locally), and sqlcmd if you want to run scripts from the host.

1) Start a local SQL Server (Azure SQL Edge example):

```bash
docker run -e "ACCEPT_EULA=1" -e "SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 --name azuresql -d mcr.microsoft.com/azure-sql-edge
```

2) Apply database scripts (example using docker exec):

```bash
docker cp database/. azuresql:/workspace
docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/create_database.sql
docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/create_table.sql
docker exec -it azuresql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -i /workspace/stored_procedures.sql
```

3) Configure backend connection string (example for macOS/Linux):

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

Open the frontend dev URL (Vite usually at http://localhost:5173), use the demo Login page and navigate to Students to exercise CRUD.

Deployment notes
- Database: Create `StudentDB` in Azure SQL and run the scripts in `/database` against the Azure SQL instance.
- Backend: Deploy the `/backend` app to Azure App Service and set the `ConnectionStrings__DefaultConnection` app setting.
- Frontend: Deploy to Vercel and configure the frontend to call the deployed backend API URL.

Files/paths of interest
- Backend model: `/backend/Models/Student.cs`
- Backend services: `/backend/Services/` (IStudentService.cs, StudentService.cs)
- Backend repositories: `/backend/Repositories/` (IStudentRepository.cs, StudentRepository.cs)
- Database scripts: `/database`
- Frontend code: `/frontend/src` (API helper: `/frontend/src/api`)

Live links
- Frontend (Vercel): https://student-management-crud-app.vercel.app/login
- Backend (Azure App Service): add your deployed backend URL here
- GitHub repo: add your public repository URL here

If you want, I can:
- add the full list of stored procedure names called by the API to this README
- or inject the deployed backend URL and GitHub link if you provide them

Contact / Notes
This README is focused on the assignment requirements: DB scripts, stored procedures only, API endpoints, and how to run/deploy. UI styling is intentionally minimal; functionality and integration are the priority.

