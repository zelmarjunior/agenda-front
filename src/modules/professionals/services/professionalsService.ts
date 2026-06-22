import { api } from '@/services/api';
import type { SuccessResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type {
  AvailableSlot,
  CreateProfessionalRequest,
  LinkServicesRequest,
  Professional,
  ServiceCommission,
  SetServiceCommissionRequest,
  SetWorkingHoursRequest,
  UpdateProfessionalRequest,
  WorkingHour,
} from '@/types/professionals.types';

export const professionalsService = {
  async list(
    businessId: string,
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<Professional>> {
    const qs = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 20),
    });
    const response = await api.get<SuccessResponse<PaginatedResponse<Professional>>>(
      `/businesses/${businessId}/professionals?${qs}`,
    );
    return response.data.data;
  },

  async get(businessId: string, professionalId: string): Promise<Professional> {
    const response = await api.get<SuccessResponse<Professional>>(
      `/businesses/${businessId}/professionals/${professionalId}`,
    );
    return response.data.data;
  },

  async create(businessId: string, data: CreateProfessionalRequest): Promise<Professional> {
    const response = await api.post<SuccessResponse<Professional>>(
      `/businesses/${businessId}/professionals`,
      data,
    );
    return response.data.data;
  },

  async update(
    businessId: string,
    professionalId: string,
    data: UpdateProfessionalRequest,
  ): Promise<void> {
    await api.put(`/businesses/${businessId}/professionals/${professionalId}`, data);
  },

  async getWorkingHours(businessId: string, professionalId: string): Promise<WorkingHour[]> {
    const response = await api.get<SuccessResponse<WorkingHour[]>>(
      `/businesses/${businessId}/professionals/${professionalId}/working-hours`,
    );
    return response.data.data;
  },

  async setWorkingHours(
    businessId: string,
    professionalId: string,
    data: SetWorkingHoursRequest,
  ): Promise<WorkingHour[]> {
    const response = await api.put<SuccessResponse<WorkingHour[]>>(
      `/businesses/${businessId}/professionals/${professionalId}/working-hours`,
      data,
    );
    return response.data.data;
  },

  async linkServices(
    businessId: string,
    professionalId: string,
    data: LinkServicesRequest,
  ): Promise<void> {
    await api.put(`/businesses/${businessId}/professionals/${professionalId}/services`, data);
  },

  async delete(businessId: string, professionalId: string): Promise<void> {
    await api.delete(`/businesses/${businessId}/professionals/${professionalId}`);
  },

  async getCommissions(businessId: string, professionalId: string): Promise<ServiceCommission[]> {
    const response = await api.get<SuccessResponse<ServiceCommission[]>>(
      `/businesses/${businessId}/professionals/${professionalId}/commissions`,
    );
    return response.data.data;
  },

  async setCommission(
    businessId: string,
    professionalId: string,
    serviceId: string,
    data: SetServiceCommissionRequest,
  ): Promise<void> {
    await api.patch(
      `/businesses/${businessId}/professionals/${professionalId}/commissions/${serviceId}`,
      data,
    );
  },

  async availableSlots(
    businessId: string,
    professionalId: string,
    date: string,
    serviceId: string,
  ): Promise<AvailableSlot[]> {
    const qs = new URLSearchParams({ date, serviceId });
    const response = await api.get<SuccessResponse<AvailableSlot[]>>(
      `/businesses/${businessId}/professionals/${professionalId}/available-slots?${qs}`,
    );
    return response.data.data;
  },
};
