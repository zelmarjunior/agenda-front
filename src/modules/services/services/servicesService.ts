import { api } from '@/services/api';
import type { SuccessResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { CreateServiceRequest, Service } from '@/types/services.types';
import type { LinkProductsToServiceRequest } from '@/types/services.types';

export const servicesService = {
  async list(
    businessId: string,
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<Service>> {
    const qs = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 20),
    });
    const response = await api.get<SuccessResponse<PaginatedResponse<Service>>>(
      `/businesses/${businessId}/services?${qs}`,
    );
    return response.data.data;
  },

  async get(businessId: string, serviceId: string): Promise<Service> {
    const response = await api.get<SuccessResponse<Service>>(
      `/businesses/${businessId}/services/${serviceId}`,
    );
    return response.data.data;
  },

  async create(businessId: string, data: CreateServiceRequest): Promise<Service> {
    const response = await api.post<SuccessResponse<Service>>(
      `/businesses/${businessId}/services`,
      data,
    );
    return response.data.data;
  },

  async update(businessId: string, serviceId: string, data: CreateServiceRequest): Promise<void> {
    await api.put(`/businesses/${businessId}/services/${serviceId}`, data);
  },

  async delete(businessId: string, serviceId: string): Promise<void> {
    await api.delete(`/businesses/${businessId}/services/${serviceId}`);
  },

  async linkProducts(
    businessId: string,
    serviceId: string,
    data: LinkProductsToServiceRequest,
  ): Promise<void> {
    await api.put(`/businesses/${businessId}/services/${serviceId}/products`, data);
  },
};
