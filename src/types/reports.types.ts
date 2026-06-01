import type { Professional } from './professionals.types';
import type { Product } from './inventory.types';
import type { Service } from './services.types';

interface ReportPeriod {
  from: string;
  to: string;
}

export interface FinancialReport {
  period: ReportPeriod;
  totalRevenue: number;
  byProfessional: Array<{
    professional: Professional;
    revenue: number;
    commission: number;
    appointmentsCompleted: number;
  }>;
}

export interface AppointmentsReport {
  period: ReportPeriod;
  byProfessional: Array<{
    professional: Professional;
    totalScheduled: number;
    totalCompleted: number;
    totalCancelled: number;
    occupancyRate: number;
  }>;
  topServices: Array<{
    service: Service;
    count: number;
  }>;
}

export interface InventoryReport {
  period: ReportPeriod;
  lowStockProducts: Product[];
  consumptionByProduct: Array<{
    product: Product;
    totalConsumed: number;
  }>;
}

export interface ReportParams {
  from: string;
  to: string;
  professionalId?: string;
}

export interface PendingPaymentItem {
  appointmentId: string;
  scheduledAt: string;
  finalPrice: number | null;
  status: string;
  clientName: string;
  clientPhone: string | null;
  serviceName: string;
}

export interface HeatmapCell {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export interface HeatmapReport {
  period: { from: string; to: string };
  matrix: HeatmapCell[];
  maxCount: number;
}

export interface ServiceStatItem {
  serviceId: string;
  name: string;
  price: number;
  costPrice: number | null;
  durationMinutes: number;
  margin: number | null;
  totalScheduled: number;
  totalCompleted: number;
  totalCancelled: number;
  totalNoShows: number;
  totalRevenue: number;
  cancellationRate: number;
}

export interface ServiceStatsReport {
  period: { from: string; to: string };
  summary: {
    totalServices: number;
    totalRevenue: number;
    totalCompleted: number;
    avgPrice: number;
    avgMargin: number | null;
  };
  services: ServiceStatItem[];
}

export interface ClientStatsReport {
  period: { from: string; to: string };
  summary: {
    totalActiveClients: number;
    totalCompleted: number;
    totalNoShows: number;
    noShowRate: number;
  };
  mostFrequent: Array<{
    clientId: string;
    name: string;
    phone: string | null;
    totalCompleted: number;
    totalSpent: number;
  }>;
  mostNoShows: Array<{
    clientId: string;
    name: string;
    phone: string | null;
    noShowCount: number;
  }>;
  noShowReasons: Array<{
    reason: string;
    count: number;
  }>;
}
