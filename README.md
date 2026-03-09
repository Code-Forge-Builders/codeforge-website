## CodeForge Website

CodeForge Website is the internal marketing and analytics site for **CodeForge**. It is a full‑stack application built with a **Next.js 15** frontend and a **Go (Gin) + PostgreSQL** backend, including an authenticated admin area with dashboards, visit metrics, and background email workers. The codebase is tailored specifically to CodeForge’s own website and is **not intended to be a generic, reusable prospecting platform**.

### Tech stack

- **Frontend**
  - **Framework**: Next.js 15 (App Router, Turbopack)
  - **Language**: TypeScript + React 19
  - **Styling**: Tailwind CSS 4
  - **i18n**: `next-intl`
  - **Charts**: `recharts`
- **Backend**
  - **Language**: Go 1.25
  - **Web framework**: Gin
  - **Database**: PostgreSQL via GORM
  - **Auth**: JWT (`github.com/golang-jwt/jwt/v5`)
  - **Config**: Environment variables (`github.com/caarlos0/env/v11`)
  - **Background jobs**: Email workers and job queue in Go

### Project structure

- **`frontend/`**: Next.js application for the public site and admin UI.
  - `src/app/(admin)/auth/login` – admin authentication flow.
  - `src/app/(admin)/admin/dashboard` – analytics dashboard (visits, visitors, leads, conversion, charts).
  - `src/lib/httpClient.ts` – HTTP client configured to talk to the API.
- **`backend/`**: Go API and workers.
  - `main.go` – application entrypoint (server, DB connection, workers, graceful shutdown).
  - `internal/` – configuration, database, migrations, jobs, router, and HTTP handlers.
  - `.env.example` – example configuration for database and SMTP.

## Getting started

### Prerequisites

- **Node.js** 20+ (for the frontend)
- **npm**, **pnpm**, or **yarn** (examples use `npm`)
- **Go** 1.25+ (for the backend)
- **PostgreSQL** 14+ (or compatible)

### 1. Configure the backend environment

From the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` and set:

- **Database**
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE`
- **SMTP (email)**
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_TLS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`
- **Server**
  - `PORT` – defaults to `8080` if not provided.

The Go application will automatically:

- Load configuration
- Connect to the database (with retries)
- Run migrations (`internal/db/migrations`)
- Start email workers
- Start the HTTP server and handle graceful shutdown

### 2. Configure the frontend environment (optional)

The frontend talks to the backend using `src/lib/httpClient.ts`.

- **Default API base URL**: `http://localhost:8080/api`
- To override, create a `.env.local` in `frontend/` and set:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Running the project

### Start the backend (API)

From the project root:

```bash
cd backend
go run .
```

This will start the API server on the port configured in `.env` (default `:8080`).

### Start the frontend (Next.js app)

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Next.js dev server will run on `http://localhost:3000`.

You can now:

- Access the public site at `http://localhost:3000`
- Access the admin area (e.g. `/auth/login`, `/admin/dashboard`) once your initial setup and credentials are configured

## Scripts

### Frontend (`frontend/package.json`)

- **`npm run dev`**: Start the Next.js development server (Turbopack).
- **`npm run build`**: Build the production bundle.
- **`npm start`**: Start the production server.
- **`npm test`**: Run Jest tests.
- **`npm run test:cov`**: Run tests with coverage.
- **`npm run lint`**: Run ESLint.

### Backend

From `backend/`:

- **`go run .`**: Run the API and workers in development.
- **`go build ./...`**: Build the binaries.

## Admin dashboard overview

- **Authentication**
  - Admin login at `/(admin)/auth/login` with email/password.
  - Initial setup checks to ensure first-time configuration.
- **Dashboard**
  - High-level KPIs: total visits, unique visitors, leads, conversion rate.
  - Time‑series chart of visits using `recharts`, with filters by period (`24h`, `7d`, `30d`, `90d`, custom range).
  - Data is fetched from the backend analytics endpoint via `apiHttpClient`.

## Environment variables summary

- **Backend**
  - See `backend/.env.example` for the full list and defaults.
- **Frontend**
  - `NEXT_PUBLIC_API_BASE_URL` (optional): URL of the backend API (defaults to `http://localhost:8080/api`).

## Testing

### Frontend tests

From `frontend/`:

```bash
npm test
```

or with coverage:

```bash
npm run test:cov
```

### Backend tests

From `backend/`:

```bash
go test ./...
```

## Deployment notes

- **Backend**
  - Build the Go binary and deploy alongside a managed PostgreSQL instance.
  - Ensure `.env` (or your platform’s environment variables) contains all required settings.
- **Frontend**
  - Run `npm run build` in `frontend/` and deploy the output using your Next.js‑compatible platform.
  - Set `NEXT_PUBLIC_API_BASE_URL` to the public URL of the deployed API.

