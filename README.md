# Meeting Booking Workspace

### Hexlet tests and linter status:
[![Actions Status](https://github.com/xdsor/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/xdsor/ai-for-developers-project-386/actions)

## Local development with Prism

The repository now supports a local contract-first flow:

- `typespec/` is the source of truth for the API contract
- `TypeSpec` emits `typespec/tsp-output/schema/openapi.yaml`
- `Prism` serves a mock API from that OpenAPI file
- `web/` calls the mock API during development

### Install dependencies

```bash
npm install
cd typespec && npm install
cd ../web && npm install
```

### Start the full stack

```bash
npm run dev
```

This starts three processes:

- TypeSpec compiler in watch mode
- Prism mock server on `http://localhost:4010`
- Vite dev server for `web/`

### Useful commands

```bash
npm run spec:build
npm run mock
npm run web:dev
npm run web:build
```

### Frontend environment

Copy `web/.env.example` to `web/.env` if you need to override defaults.

- `VITE_API_BASE_URL=/api`
- `VITE_API_PROXY_TARGET=http://localhost:4010`

By default, Vite proxies `/api/*` requests to Prism, so the browser does not need to call the mock server directly.
