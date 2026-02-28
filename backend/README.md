# Backend — Go API Server

Payment Dashboard API built with Go, using Chi router, SQLite, Redis caching, and JWT authentication. Follows clean architecture with entity / repository / usecase / handler separation.

## Prerequisites

- **Go** >= 1.25
- **Redis** running on `localhost:6379` (or configure via `.env`)
- **SQLite** (bundled via `go-sqlite3`)

## Setup

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env to set JWT_SECRET and other values

# 2. Install dependencies
make dep

# 3. (Optional) Generate OpenAPI server code
make openapi-gen

# 4. (Optional) Generate a random JWT secret
make gen-secret
```

## Run

```bash
make run    # starts server on :8080 (configurable via HTTP_ADDR in .env)
```

## Build

```bash
make build  # outputs binary to ./bin/mygolangapp
./bin/mygolangapp
```

## API Documentation

Swagger UI is available at **http://localhost:8080/docs** when the server is running.

Raw OpenAPI spec: **http://localhost:8080/docs/openapi.yaml**

## API Endpoints

| Method | Endpoint                     | Auth   | Description                 |
| ------ | ---------------------------- | ------ | --------------------------- |
| POST   | `/dashboard/v1/auth/login`   | Public | Login with email + password |
| POST   | `/dashboard/v1/auth/refresh` | Public | Refresh JWT access token    |
| GET    | `/dashboard/v1/payments`     | Bearer | List payments with filters  |
| GET    | `/docs`                      | Public | Swagger UI                  |
| GET    | `/docs/openapi.yaml`         | Public | Raw OpenAPI specification   |

### Payment Query Parameters

- `status` — `completed`, `processing`, `failed`
- `id` — exact payment ID
- `sort` — field name, prefix `-` for descending (e.g., `-created_at`, `amount`, `-merchant`)

## Seed Data

Auto-seeded on first startup (when DB is empty):

- **3 users:** `cs@test.com` / `password`, `operation@test.com` / `password`, `superuser@test.com` / `Password@123`
- **40 payments** across various merchants and statuses

Delete `dashboard.db` to re-seed.

## Makefile Targets

| Target             | Description                         |
| ------------------ | ----------------------------------- |
| `make dep`         | Install & tidy Go dependencies      |
| `make run`         | Run the server locally              |
| `make build`       | Build binary to `./bin/mygolangapp` |
| `make openapi-gen` | Generate OpenAPI types & server     |
| `make gen-secret`  | Generate random JWT secret          |

## Environment Variables

| Variable               | Default                 | Description              |
| ---------------------- | ----------------------- | ------------------------ |
| `HTTP_ADDR`            | `:8080`                 | Server listen address    |
| `JWT_SECRET`           | `dev-secret-replace-me` | JWT signing secret       |
| `JWT_EXPIRED`          | `24h`                   | JWT access token TTL     |
| `REDIS_ADDR`           | `localhost:6379`        | Redis connection address |
| `OPENAPIYAML_LOCATION` | `../openapi.yaml`       | Path to OpenAPI spec     |
