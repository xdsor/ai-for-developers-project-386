# Repository Guidelines

## Project Structure & Module Organization

This repository is split into three packages:

- `typespec/` defines the API contract in `main.tsp`, `models.tsp`, and `operations.tsp`. TypeSpec emits `typespec/tsp-output/schema/openapi.yaml`, which is then synced into `backend/src/main/resources/openapi/openapi.yaml`.
- `backend/` contains the Spring Boot application. Generated OpenAPI Java classes are written to `backend/build/generated/openapi/src/main/java`, while handwritten application code stays in `backend/src/main/java`.
- `web/` contains the React + Vite frontend. App code lives in `web/src/` and is organized by layer: `pages/`, `widgets/`, `components/`, `hooks/`, `ui/`, `lib/`, `api/`, and `config/`.

Keep contract changes in `typespec/` first, then sync the backend OpenAPI copy, regenerate backend classes, and update `web/src/api/types.ts`, `web/src/api/client.ts`, and any affected UI.

## Frontend Code Style

The `web/src/` directory follows a lightweight feature-slice approach. Each layer has a strict responsibility:

- `api/` — HTTP calls and TypeScript types only. No UI, no state.
- `config/` — static app configuration constants.
- `lib/` — pure utility functions and shared hooks (`dateUtils.ts`, `shareUtils.ts`, `notifications.ts`). No React components.
- `ui/` — stateless, pure presentational primitives (icons, base elements). No data fetching, no business logic.
- `components/` — focused UI components that may hold minimal local form/interaction state and call API directly (e.g. `BookingForm`). No data fetching hooks.
- `widgets/` — composite components that orchestrate `components/` and `ui/` with local state. No data fetching hooks. Organized by domain: `widgets/guest/`, `widgets/host/`.
- `hooks/` — data-fetching hooks only. Return loading/error/data. Organized by domain: `hooks/guest/`, `hooks/host/`.
- `pages/` — thin route-level components. Only use `useParams`, call a data-fetching hook, handle loading/error guards, and render one widget. No layout code, no business logic.

**Rules:**
- Pages must not contain layout markup or business logic — delegate to widgets.
- Widgets must not fetch data — receive everything via props.
- Hooks must not render UI.
- Utilities in `lib/` must be pure functions with no side-effects on React state.
- Prefer extracting a new widget or utility over growing a page or existing component.

## Backend Code Style

For handwritten backend code in `backend/src/main/java`:

- Prefer a functional style with small pure functions and explicit inputs/outputs.
- Use `vavr` for control flow and expected error handling: prefer `Either`, `Option`, and `Try` over exceptions for ordinary business flows.
- Model branch-heavy business outcomes with sealed classes where that makes the flow clearer.
- Keep exceptions for framework boundaries and truly unexpected failures, not for normal `not found` / `validation` / `conflict` cases.
- Avoid scattering object construction with `new` through business logic. Prefer static factories, constructor-like functions, and mapper classes/functions.
- Keep generated OpenAPI DTOs as transport models. Build and map them in dedicated mappers/factories instead of directly inside orchestration logic when possible.

## Build, Test, and Development Commands

Install dependencies at the root, then in each JavaScript package:

```bash
npm install
cd typespec && npm install
cd ../web && npm install
```

Key commands:

- `make spec` rebuilds the TypeSpec contract and syncs `backend/src/main/resources/openapi/openapi.yaml`.
- `make web-dev` starts the web-only mock flow: TypeSpec watch, Prism on `127.0.0.1:4010`, and the Vite dev server.
- `make backend` syncs the OpenAPI file, generates Java classes, and runs Spring Boot.
- `make dev` starts the full application: Spring Boot backend plus the frontend proxied to `http://localhost:8080`.
- `npm run spec:build` compiles the TypeSpec contract once.
- `npm run spec:sync:backend` compiles the TypeSpec contract and copies the resulting OpenAPI file into backend resources.
- `npm run spec:watch` recompiles the contract on changes.
- `npm run mock` serves the generated OpenAPI schema through Prism.
- `npm run web:dev` runs only the frontend.
- `npm run web:dev:backend` runs the frontend with the API proxy pointed at the Spring Boot backend.
- `./backend/gradlew -p backend test` runs backend tests, including code generation and API integration tests.
- `npm run test:e2e` runs Playwright E2E tests against the real backend flow.
- `npm run test:e2e:ui` opens the Playwright UI runner.
- `npm run web:build` creates the production frontend build.
- `npm --prefix web run lint` runs ESLint for the frontend.

## E2E Testing

- End-to-end tests live in the root `e2e/` directory and use Playwright.
- Playwright tests must run only against the real backend flow. Do not add Prism-based E2E coverage.
- Prefer resilient selectors based on roles and labels. Add `aria-label` to interactive icon-only controls when needed for testability and accessibility.
- Add `data-testid` only for genuinely unstable or hard-to-address UI states such as booking success confirmations or dynamic slot containers.
