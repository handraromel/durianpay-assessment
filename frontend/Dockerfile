# ===========================================
# Base Stage - Common setup
# ===========================================
FROM node:current-alpine3.23 AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# ===========================================
# Development Stage
# ===========================================
FROM base AS development

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy all source files (config + src + public)
COPY . .

EXPOSE 5173

# Use Vite dev server with host flag for Docker networking
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]