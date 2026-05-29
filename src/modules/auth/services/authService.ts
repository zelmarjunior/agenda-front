import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type { AuthToken, LoginRequest, RegisterBusinessRequest } from '@/types/auth.types';
import type { Business } from '@/types/business.types';

export const authService = {
  async register(data: RegisterBusinessRequest): Promise<AuthToken> {
    const response = await api.post<SuccessResponse<AuthToken>>('/auth/register', data);
    return response.data.data;
  },

  async login(data: LoginRequest): Promise<AuthToken> {
    const response = await api.post<SuccessResponse<AuthToken>>('/auth/login', data);
    return response.data.data;
  },

  async getBusiness(businessId: string): Promise<Business> {
    const response = await api.get<SuccessResponse<Business>>(`/businesses/${businessId}`);
    return response.data.data;
  },
};
