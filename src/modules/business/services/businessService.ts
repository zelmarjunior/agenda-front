import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type { Business, UpdateBusinessRequest } from '@/types/business.types';

export const businessService = {
  async get(businessId: string): Promise<Business> {
    const response = await api.get<SuccessResponse<Business>>(`/businesses/${businessId}`);
    return response.data.data;
  },

  async update(businessId: string, data: UpdateBusinessRequest): Promise<Business> {
    const response = await api.put<SuccessResponse<Business>>(`/businesses/${businessId}`, data);
    return response.data.data;
  },
};
