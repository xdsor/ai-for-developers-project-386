export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  demoUserSlug: import.meta.env.VITE_DEMO_USER_SLUG ?? 'demo-user',
  demoUserId: import.meta.env.VITE_DEMO_USER_ID ?? 'demo-user',
} as const
