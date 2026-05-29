import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { env } from '@/utils/env';
import { storage } from '@/utils/storage';
import type { ErrorResponse } from '@/types/api.types';

const BASE_URL = `${env.apiBaseUrl}/api/v1`;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (env.logApiRequests) {
    console.warn(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      storage.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined;
    return data?.message ?? error.message ?? 'Erro inesperado';
  }
  if (error instanceof Error) return error.message;
  return 'Erro inesperado';
}
