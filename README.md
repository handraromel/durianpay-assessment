# DurianPay Payment Dashboard

A fullstack payment dashboard application built with **Go** (backend) and **React + TypeScript** (frontend). Features authentication, payment listing with filtering/sorting and Redis caching.

## Tech Stack

| Layer    | Technology                                                                       |
| -------- | -------------------------------------------------------------------------------- |
| Backend  | Go 1.25+, Chi router, SQLite, Redis, JWT, oapi-codegen                           |
| Frontend | React 19, Vite 7, TypeScript, TanStack Query/Table, Tailwind, HeadlessUI Zustand |
| Infra    | Docker, Docker Compose, Redis 7                                                  |
| DB       | Sqlite                                                                           |

## Prerequisites

- **Go** >= 1.25 — [install](https://go.dev/dl/)
- **Node.js** >= 24 — [install](https://nodejs.org/)
- **Docker** & **Docker Compose** — [install](https://docs.docker.com/get-docker/)
- **Redis** (only for local non-Docker development) — [install](https://redis.io/download)

## Quick Start (Docker)

The fastest way to run the entire stack:

```bash
# 1. Clone the repository
git clone <repo-url> && cd durianpay-assessment

# 2. Copy environment file and set JWT_SECRET
cp .env.example .env
# Edit .env and set a strong JWT_SECRET value

# 3. Start all services
docker compose up --build
```

Once running:

| Service            | URL                 |
| ------------------ | ------------------- |
| Frontend           | localhost:5173      |
| Backend API        | localhost:8080      |
| API Docs (Swagger) | localhost:8080/docs |
| Redis              | localhost:6379      |

## Running Individually (Without Docker)

After cloning the repository, install dependencies for each service before running:

```bash
git clone <repo-url>
cd durianpay-assessment
```

### Backend

```bash
cd backend
cp .env.example .env        # configure environment variables (JWT_SECRET, REDIS_ADDR, etc.)
make dep                     # install & tidy Go dependencies (go mod tidy + go mod vendor)
make run                     # start server on :8080
```

See [backend/README.md](backend/README.md) for full backend documentation.

### Frontend

```bash
cd frontend
cp .env.example .env        # configure API base URL (VITE_API_BASE_URL)
npm install                  # install Node dependencies
npm run dev                  # start dev server on http://localhost:5173
```

See [frontend/README.md](frontend/README.md) for full frontend documentation.

## Environment Setup

Environment files must be created from their `.env.example` templates before running:

| Location        | Template                | Purpose                               |
| --------------- | ----------------------- | ------------------------------------- |
| `.env`          | `.env.example`          | Docker Compose variables (JWT_SECRET) |
| `backend/.env`  | `backend/.env.example`  | Backend server configuration          |
| `frontend/.env` | `frontend/.env.example` | Frontend API base URL                 |

> **Security Note:** `JWT_SECRET` in `docker-compose.yml` is read from the environment variable `${JWT_SECRET}`. It is **not** hardcoded. Always set a strong secret in your `.env` file before running in production.

## Seed Data

The backend auto-seeds the SQLite database on first startup:

### Users

| Email                | Password       | Role      |
| -------------------- | -------------- | --------- |
| `cs@test.com`        | `password`     | cs        |
| `operation@test.com` | `password`     | operation |
| `superuser@test.com` | `Password@123` | superuser |

### Payments

40 sample payment records are seeded across various merchants (Tokopedia, Shopee, Grab, Bank BCA, Netflix ID, etc.) with mixed statuses (`completed`, `processing`, `failed`) and amounts ranging from Rp12,000 to Rp3,200,000.

> **Note:** Seeds only run when the database is empty. Delete `backend/dashboard.db` to re-seed.

## API Documentation

API documentation is available in **OpenAPI/Swagger** format:

- **Swagger UI:** http://localhost:8080/docs
- **Raw OpenAPI YAML:** http://localhost:8080/docs/openapi.yaml
- **Source spec:** [openapi.yaml](openapi.yaml)

### API Endpoints

| Method | Endpoint                     | Auth   | Description                 |
| ------ | ---------------------------- | ------ | --------------------------- |
| POST   | `/dashboard/v1/auth/login`   | Public | Login with email + password |
| POST   | `/dashboard/v1/auth/refresh` | Public | Refresh JWT access token    |
| GET    | `/dashboard/v1/payments`     | Bearer | List payments (filterable)  |

**Query parameters for `/dashboard/v1/payments`:**

- `status` — Filter by status (`completed`, `processing`, `failed`)
- `id` — Filter by payment ID
- `sort` — Sort field with `-` prefix for descending (e.g., `-created_at`, `amount`)

## Testing

### Frontend Tests

```bash
cd frontend
npm test              # run tests in watch mode
npm run test:run      # run tests once
npm run test:coverage # run tests with coverage report
```

## Project Structure

```
├── docker-compose.yml       # Docker orchestration
├── openapi.yaml             # OpenAPI 3.0 specification
├── .env.example             # Docker Compose env template
├── backend/
│   ├── main.go              # Entry point, DB init, seeding
│   ├── .env.example         # Backend env template
│   ├── Makefile             # Build & dev commands
│   └── internal/
│       ├── api/             # API handler aggregation
│       ├── config/          # Environment configuration
│       ├── docs/            # Swagger UI handler
│       ├── entity/          # Domain models
│       ├── middleware/       # JWT auth middleware
│       ├── module/          # Feature modules (auth, payment)
│       ├── openapigen/      # Generated OpenAPI code
│       ├── service/         # HTTP server, Redis client
│       └── transport/       # JSON response helpers
└── frontend/
    ├── .env.example         # Frontend env template
    ├── vite.config.ts       # Vite + Vitest configuration
    └── src/
        ├── components/      # Reusable UI components
        ├── constants/       # App constants & API endpoints
        ├── hooks/           # React hooks (queries, mutations)
        ├── pages/           # Page components
        ├── services/        # API service layer
        ├── stores/          # Zustand state management
        ├── types/           # TypeScript type definitions
        └── utils/           # Utility functions
```
