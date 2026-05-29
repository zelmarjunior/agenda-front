import type { Client } from './clients.types';
import type { Professional } from './professionals.types';
import type { Service } from './services.types';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  client: Client;
  professional: Professional;
  service: Service;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  cancellationReason: string | null;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  clientId: string;
  professionalId: string;
  serviceId: string;
  scheduledAt: string;
}

export interface CancelAppointmentRequest {
  reason: string;
}

export interface RescheduleAppointmentRequest {
  scheduledAt: string;
  reason: string;
}

export interface AppointmentFilters {
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  professionalId?: string;
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
}
