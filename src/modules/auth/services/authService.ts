import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type { AuthToken, LoginRequest, RegisterBusinessRequest, RegisterResult } from '@/types/auth.types';
import type { Business } from '@/types/business.types';

export const authService = {
  async register(data: RegisterBusinessRequest): Promise<RegisterResult> {
    const response = await api.post<SuccessResponse<RegisterResult>>('/auth/register', data);
    return response.data.data;
  },

  async verifyEmail(email: string, code: string): Promise<AuthToken> {
    const response = await api.post<SuccessResponse<AuthToken>>('/auth/verify-email', { email, code });
    return response.data.data;
  },

  async resendVerification(email: string): Promise<void> {
    await api.post('/auth/resend-verification', { email });
  },

  async login(data: LoginRequest): Promise<AuthToken> {
    const response = await api.post<SuccessResponse<AuthToken>>('/auth/login', data);
    return response.data.data;
  },

  async lookupBusinesses(email: string): Promise<{ id: string; name: string }[]> {
    const response = await api.post<SuccessResponse<{ id: string; name: string }[]>>(
      '/auth/lookup-businesses',
      { email },
    );
    return response.data.data;
  },

  async getBusiness(businessId: string): Promise<Business> {
    const response = await api.get<SuccessResponse<Business>>(`/businesses/${businessId}`);
    return response.data.data;
  },
};
