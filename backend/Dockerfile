# ===========================================
# Base Stage - Common build dependencies
# ===========================================
FROM golang:tip-bookworm AS base

WORKDIR /app

# Install build dependencies (Debian-based image uses apt-get)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libc6-dev libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy go mod files and download deps
COPY go.mod go.sum ./
RUN go mod download

# ===========================================
# Development Stage
# ===========================================
FROM base AS development

# Source files are mounted via docker-compose volumes
# so we don't COPY them here

ENV CGO_ENABLED=1

EXPOSE 8080

CMD ["go", "run", "."]

# ===========================================
# Builder Stage - Compile production binary
# ===========================================
FROM base AS builder

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o mygolangapp .

# ===========================================
# Production Stage - Minimal runtime image
# ===========================================
FROM debian:bookworm-slim AS production

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /app/mygolangapp .

EXPOSE 8080

CMD ["./mygolangapp"]
