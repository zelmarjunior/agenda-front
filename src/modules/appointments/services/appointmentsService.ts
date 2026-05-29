import { api } from '@/services/api';
import type { SuccessResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Appointment,
  AppointmentFilters,
  CancelAppointmentRequest,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
} from '@/types/appointments.types';

export const appointmentsService = {
  async list(
    businessId: string,
    filters: AppointmentFilters = {},
  ): Promise<PaginatedResponse<Appointment>> {
    const params = new URLSearchParams();
    if (filters.date) params.set('date', filters.date);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.professionalId) params.set('professionalId', filters.professionalId);
    if (filters.status) params.set('status', filters.status);
    params.set('page', String(filters.page ?? 1));
    params.set('limit', String(filters.limit ?? 20));
    const response = await api.get<SuccessResponse<PaginatedResponse<Appointment>>>(
      `/businesses/${businessId}/appointments?${params}`,
    );
    return response.data.data;
  },

  async get(businessId: string, appointmentId: string): Promise<Appointment> {
    const response = await api.get<SuccessResponse<Appointment>>(
      `/businesses/${businessId}/appointments/${appointmentId}`,
    );
    return response.data.data;
  },

  async create(businessId: string, data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await api.post<SuccessResponse<Appointment>>(
      `/businesses/${businessId}/appointments`,
      data,
    );
    return response.data.data;
  },

  async confirm(businessId: string, appointmentId: string): Promise<void> {
    await api.patch(`/businesses/${businessId}/appointments/${appointmentId}/confirm`);
  },

  async cancel(
    businessId: string,
    appointmentId: string,
    data: CancelAppointmentRequest,
  ): Promise<void> {
    await api.patch(`/businesses/${businessId}/appointments/${appointmentId}/cancel`, data);
  },

  async complete(businessId: string, appointmentId: string): Promise<void> {
    await api.patch(`/businesses/${businessId}/appointments/${appointmentId}/complete`);
  },

  async reschedule(
    businessId: string,
    appointmentId: string,
    data: RescheduleAppointmentRequest,
  ): Promise<void> {
    await api.patch(`/businesses/${businessId}/appointments/${appointmentId}/reschedule`, data);
  },
};
