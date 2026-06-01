import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type {
  AppointmentsReport,
  FinancialReport,
  InventoryReport,
  ReportParams,
  PendingPaymentItem,
  HeatmapReport,
  ClientStatsReport,
  ServiceStatsReport,
} from '@/types/reports.types';

function buildQs(params: ReportParams): string {
  const qs = new URLSearchParams({ from: params.from, to: params.to });
  if (params.professionalId) qs.set('professionalId', params.professionalId);
  return qs.toString();
}

export const reportsService = {
  async financial(businessId: string, params: ReportParams): Promise<FinancialReport> {
    const response = await api.get<SuccessResponse<FinancialReport>>(
      `/businesses/${businessId}/reports/financial?${buildQs(params)}`,
    );
    return response.data.data;
  },

  async appointments(businessId: string, params: ReportParams): Promise<AppointmentsReport> {
    const response = await api.get<SuccessResponse<AppointmentsReport>>(
      `/businesses/${businessId}/reports/appointments?${buildQs(params)}`,
    );
    return response.data.data;
  },

  async inventory(businessId: string, params: ReportParams): Promise<InventoryReport> {
    const response = await api.get<SuccessResponse<InventoryReport>>(
      `/businesses/${businessId}/reports/inventory?${buildQs(params)}`,
    );
    return response.data.data;
  },

  async pendingPayments(businessId: string): Promise<PendingPaymentItem[]> {
    const response = await api.get<SuccessResponse<PendingPaymentItem[]>>(
      `/businesses/${businessId}/reports/pending-payments`,
    );
    return response.data.data;
  },

  async heatmap(businessId: string, params: ReportParams): Promise<HeatmapReport> {
    const response = await api.get<SuccessResponse<HeatmapReport>>(
      `/businesses/${businessId}/reports/heatmap?${buildQs(params)}`,
    );
    return response.data.data;
  },

  async serviceStats(businessId: string, params: ReportParams): Promise<ServiceStatsReport> {
    const response = await api.get<SuccessResponse<ServiceStatsReport>>(
      `/businesses/${businessId}/reports/service-stats?${buildQs(params)}`,
    );
    return response.data.data;
  },

  async clientStats(businessId: string, params: ReportParams): Promise<ClientStatsReport> {
    const response = await api.get<SuccessResponse<ClientStatsReport>>(
      `/businesses/${businessId}/reports/client-stats?${buildQs(params)}`,
    );
    return response.data.data;
  },
};
