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
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      storage.clearAll();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined;

    // Backend message takes priority — assume it's already in Portuguese
    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message;
    }

    // Network / connectivity errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Sem conexão com o servidor. Verifique sua internet.';
    }
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      return 'A requisição demorou demais. Tente novamente.';
    }

    // HTTP status fallbacks
    const status = error.response?.status;
    if (status === 400) return 'Dados inválidos. Verifique os campos e tente novamente.';
    if (status === 401) return 'Sessão expirada. Faça login novamente.';
    if (status === 403) return 'Sem permissão para realizar esta ação.';
    if (status === 404) return 'Recurso não encontrado.';
    if (status === 409) return 'Conflito: este registro já existe ou foi alterado.';
    if (status === 422) return 'Dados inválidos. Verifique os campos e tente novamente.';
    if (status && status >= 500) return 'Erro no servidor. Tente novamente em instantes.';

    return 'Erro inesperado. Tente novamente.';
  }
  if (error instanceof Error) return error.message;
  return 'Erro inesperado. Tente novamente.';
}
