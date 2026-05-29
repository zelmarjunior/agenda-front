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
