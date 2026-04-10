export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  demoHostSlug: import.meta.env.VITE_DEMO_HOST_SLUG ?? 'demo-user',
  demoHostId: import.meta.env.VITE_DEMO_HOST_ID ?? 'demo-user',
} as const
