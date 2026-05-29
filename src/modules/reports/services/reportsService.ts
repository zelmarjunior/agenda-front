import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type {
  AppointmentsReport,
  FinancialReport,
  InventoryReport,
  ReportParams,
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
};
