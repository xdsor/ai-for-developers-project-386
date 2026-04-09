# Repository Guidelines

## Project Structure & Module Organization

This repository is split into two packages:

- `typespec/` defines the API contract in `main.tsp`, `models.tsp`, and `operations.tsp`. Generated OpenAPI output is written to `typespec/tsp-output/schema/openapi.yaml`.
- `web/` contains the React + Vite frontend. App code lives in `web/src/` and is organized by feature: `pages/`, `components/`, `hooks/`, `api/`, and `config/`.

Keep contract changes in `typespec/` first, then sync `web/src/api/types.ts`, `web/src/api/client.ts`, and any affected UI.

## Build, Test, and Development Commands

Install dependencies at the root, then in each package:

```bash
npm install
cd typespec && npm install
cd ../web && npm install
```

Key commands:

- `npm run dev` starts the full local stack: TypeSpec watch, Prism mock server on `127.0.0.1:4010`, and the Vite dev server.
- `npm run spec:build` compiles the TypeSpec contract once.
- `npm run spec:watch` recompiles the contract on changes.
- `npm run mock` serves the generated OpenAPI schema through Prism.
- `npm run web:dev` runs only the frontend.
- `npm run web:build` creates the production frontend build.
- `npm --prefix web run lint` runs ESLint for the frontend.

