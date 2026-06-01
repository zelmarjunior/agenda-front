import type { Client } from './clients.types';
import type { Professional } from './professionals.types';
import type { Service } from './services.types';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  client: Client;
  professional: Professional;
  service: Service;
  scheduledAt: string;
  durationMinutes: number;
  finalPrice: number | null;
  paymentMethod: string | null;
  status: AppointmentStatus;
  cancellationReason: string | null;
  noShowReason: string | null;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  clientId: string;
  professionalId: string;
  serviceId: string;
  scheduledAt: string;
  finalPrice?: number;
  paymentMethod?: string;
}

export interface UpdateAppointmentRequest {
  finalPrice?: number;
  paymentMethod?: string;
}

export interface CancelAppointmentRequest {
  reason: string;
}

export interface RescheduleAppointmentRequest {
  scheduledAt: string;
  reason: string;
}

export type RecurringFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM';

export interface CreateRecurringRuleRequest {
  clientId: string;
  professionalId: string;
  serviceId: string;
  startDate: string;
  startTime: string;
  frequency: RecurringFrequency;
  occurrences?: number;
  endDate?: string;
  paymentMethod?: string;
}

export interface RecurringRule {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  frequency: RecurringFrequency;
  startDate: string;
  occurrences: number | null;
  paymentMethod: string | null;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
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
