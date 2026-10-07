# Engineering Management Platform

A Vue 3 and Vite frontend for property engineering operations. The current interface includes a dashboard, work order views, and login flow, with mock data available for local development.

## Stack

- Vue 3 and Vue Router
- Vite
- Pinia
- Element Plus
- ECharts
- Axios
- SCSS

## Requirements

- Node.js 18 or later
- npm

## Getting started

```bash
npm install
cp .env.example .env.development
npm run dev
```

The development server listens on port `3000`. API requests use `/api` and are proxied to `http://localhost:8080` by the Vite development server. Set `VITE_APP_MOCK=true` to use the included mock responses.

## Build

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Configuration

Copy `.env.example` to `.env.development` for local development. Keep environment-specific values in local env files; they are ignored by Git. Do not commit credentials or private service URLs.

## Project layout

```text
src/
├── api/         # API clients
├── assets/      # Global styles and assets
├── components/  # Reusable interface components
├── router/      # Route definitions
├── stores/      # Pinia stores
├── utils/       # Shared utilities and mock responses
└── views/       # Route-level pages
```

## Project status

This repository contains the frontend application. A compatible backend is required for live API data; mock mode is intended for local preview.

## License

MIT. See [LICENSE](LICENSE).