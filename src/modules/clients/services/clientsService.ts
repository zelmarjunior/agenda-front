import { api } from '@/services/api';
import type { SuccessResponse, PaginatedResponse } from '@/types/api.types';
import type { Client, CreateClientRequest, ClientSummary } from '@/types/clients.types';
import type { Appointment } from '@/types/appointments.types';

interface ClientListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const clientsService = {
  async list(
    businessId: string,
    params: ClientListParams = {},
  ): Promise<PaginatedResponse<Client>> {
    const qs = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 20),
    });
    if (params.search) qs.set('search', params.search);
    const response = await api.get<SuccessResponse<PaginatedResponse<Client>>>(
      `/businesses/${businessId}/clients?${qs}`,
    );
    return response.data.data;
  },

  async get(businessId: string, clientId: string): Promise<Client> {
    const response = await api.get<SuccessResponse<Client>>(
      `/businesses/${businessId}/clients/${clientId}`,
    );
    return response.data.data;
  },

  async create(businessId: string, data: CreateClientRequest): Promise<Client> {
    const response = await api.post<SuccessResponse<Client>>(
      `/businesses/${businessId}/clients`,
      data,
    );
    return response.data.data;
  },

  async update(businessId: string, clientId: string, data: CreateClientRequest): Promise<void> {
    await api.put(`/businesses/${businessId}/clients/${clientId}`, data);
  },

  async delete(businessId: string, clientId: string): Promise<void> {
    await api.delete(`/businesses/${businessId}/clients/${clientId}`);
  },

  async getSummary(businessId: string, clientId: string): Promise<ClientSummary> {
    const response = await api.get<SuccessResponse<ClientSummary>>(
      `/businesses/${businessId}/clients/${clientId}/summary`,
    );
    return response.data.data;
  },

  async appointments(
    businessId: string,
    clientId: string,
    page = 1,
  ): Promise<PaginatedResponse<Appointment>> {
    const qs = new URLSearchParams({ page: String(page), limit: '20' });
    const response = await api.get<SuccessResponse<PaginatedResponse<Appointment>>>(
      `/businesses/${businessId}/clients/${clientId}/appointments?${qs}`,
    );
    return response.data.data;
  },
};
