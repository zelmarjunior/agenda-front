function requireEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: requireEnv(process.env.NEXT_PUBLIC_API_BASE_URL, 'NEXT_PUBLIC_API_BASE_URL'),
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Agenda',
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? '30000'),
  tokenStorage: (process.env.NEXT_PUBLIC_TOKEN_STORAGE ?? 'localStorage') as
    | 'localStorage'
    | 'sessionStorage',
  isDevelopment: (process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'development') === 'development',
  debugMode: (process.env.NEXT_PUBLIC_DEBUG_MODE ?? 'false') === 'true',
  logApiRequests: (process.env.NEXT_PUBLIC_LOG_API_REQUESTS ?? 'false') === 'true',
} as const;
