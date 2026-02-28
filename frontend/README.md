# Frontend — React Payment Dashboard

Payment Dashboard UI built with React 19, TypeScript, Vite, TanStack Query/Table, Tailwind CSS, and Zustand.

## Prerequisites

- **Node.js** >= 24
- Backend API running on `http://localhost:8080` (or configure via `.env`)

## Setup

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env if your backend runs on a different URL

# 2. Install dependencies
npm install
```

## Development

```bash
npm run dev    # starts dev server on http://localhost:5173
```

## Build

```bash
npm run build    # type-check + production build to ./dist
npm run preview  # preview the production build locally
```

## Testing

Tests are written with **Vitest** and **React Testing Library**.

```bash
npm test              # run tests in watch mode
npm run test:run      # run tests once
npm run test:coverage # run with coverage report
```

## Environment Variables

| Variable            | Default                 | Description          |
| ------------------- | ----------------------- | -------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |

## Project Structure

```
src/
├── components/       # Reusable UI components (DataTable, Dropdown, Modal, etc.)
├── constants/        # App constants, API endpoints, dropdown options
├── hooks/            # React hooks — queries, mutations, page logic
├── layouts/          # App layout (Header, Sidebar, Footer)
├── pages/            # Route-level page components
├── providers/        # React Query, Notification providers
├── routers/          # App routing configuration
├── services/         # API service layer (auth, payment)
├── stores/           # Zustand state stores
├── test/             # Test setup files
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (httpClient, currency, token)
└── validations/      # Form validation schemas (Yup)
```

## Scripts

| Script                  | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start development server            |
| `npm run build`         | Type-check and build for production |
| `npm run preview`       | Preview production build            |
| `npm run lint`          | Run ESLint                          |
| `npm test`              | Run tests in watch mode             |
| `npm run test:run`      | Run tests once                      |
| `npm run test:coverage` | Run tests with coverage             |
