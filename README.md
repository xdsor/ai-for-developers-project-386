# Meeting Booking Workspace

### Hexlet tests and linter status:
[![Actions Status](https://github.com/xdsor/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/xdsor/ai-for-developers-project-386/actions)

## Contract-first workflow

The repository uses a contract-first flow across TypeSpec, Spring Boot, and the frontend:

- `typespec/` is the source of truth for the API contract
- `TypeSpec` emits `typespec/tsp-output/schema/openapi.yaml`
- `make spec` syncs that schema into `backend/src/main/resources/openapi/openapi.yaml`
- `backend/` generates Java API interfaces and DTOs into `backend/build/generated/openapi/src/main/java`
- `web/` can run either against Prism or against the real Spring Boot backend

### Install dependencies

```bash
npm install
cd typespec && npm install
cd ../web && npm install
```

### Development modes

Web-only mock flow:

```bash
make web-dev
```

This starts three processes:

- TypeSpec compiler in watch mode
- Prism mock server on `http://localhost:4010`
- Vite dev server for `web/`

Full application flow:

```bash
make dev
```

This starts:

- Spring Boot backend on `http://localhost:8080`
- Vite dev server for `web/`, proxied to the backend

### Useful commands

```bash
make spec
make backend
make dev
./backend/gradlew -p backend test
npm run spec:build
npm run spec:sync:backend
npm run mock
npm run web:dev
npm run web:dev:backend
npm run web:build
```

### Docker deployment

The repository includes a production `Dockerfile` and `docker-compose.yml`.

Direct image run:

```bash
docker build -t meeting-booking-app .
docker run --rm -e PORT=8080 -p 8080:8080 meeting-booking-app
```

In the container, Spring Boot serves both the API and the built React app. The app reads the listening port from `PORT`.

Production compose with Caddy and Let's Encrypt:

```bash
cp .env.example .env
docker compose up -d --build
```

Required DNS/network conditions:

- `APP_DOMAIN` must point to the host running Docker
- ports `80` and `443` must be reachable from the internet
- Caddy obtains and renews Let's Encrypt certificates automatically

In docker profile:

- frontend is served from `/`
- API is served from `/api/*`
- refreshing React Router routes returns the SPA instead of backend `404`

### Frontend environment

Copy `web/.env.example` to `web/.env` if you need to override defaults.

- `VITE_API_BASE_URL=/api`
- `VITE_API_PROXY_TARGET=http://localhost:4010`

By default, Vite proxies `/api/*` requests to Prism, so the browser does not need to call the mock server directly.
When running `make dev`, the frontend is started with `VITE_API_PROXY_TARGET=http://localhost:8080` so `/api/*` goes to the Spring Boot backend.
