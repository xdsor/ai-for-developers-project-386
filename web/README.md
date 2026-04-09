# Web UI

Минимальный React UI для `Meeting Booking Service`.

## Конфигурация

- `VITE_API_BASE_URL` - базовый URL API, по умолчанию `/api`.
- `VITE_DEMO_USER_SLUG` - публичный slug demo-пользователя, по умолчанию `demo-user`.
- `VITE_DEMO_USER_ID` - `userId` для admin API, по умолчанию `demo-user`.

## Правило синхронизации с TypeSpec

Источник истины для API находится в `typespec/*.tsp`.

При изменении контракта:

1. Сначала меняем TypeSpec.
2. Затем синхронизируем `src/api/types.ts` и клиентский код в `src/api/client.ts`.
3. Только после этого обновляем UI-компоненты и страницы.
