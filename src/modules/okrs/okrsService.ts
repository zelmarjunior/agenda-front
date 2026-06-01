import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type {
  Objective,
  KeyResult,
  QuarterAlert,
  CreateObjectiveRequest,
  UpdateObjectiveRequest,
  UpdateKeyResultRequest,
} from '@/types/okrs.types';

function base(businessId: string) {
  return `/businesses/${businessId}/okrs`;
}

export const okrsService = {
  async getQuarterAlert(businessId: string): Promise<QuarterAlert> {
    const r = await api.get<SuccessResponse<QuarterAlert>>(`${base(businessId)}/quarter-alert`);
    return r.data.data;
  },

  async list(businessId: string, periodName?: string): Promise<Objective[]> {
    const qs = periodName ? `?periodName=${encodeURIComponent(periodName)}` : '';
    const r = await api.get<SuccessResponse<Objective[]>>(`${base(businessId)}${qs}`);
    return r.data.data;
  },

  async create(businessId: string, data: CreateObjectiveRequest): Promise<Objective> {
    const r = await api.post<SuccessResponse<Objective>>(base(businessId), data);
    return r.data.data;
  },

  async update(businessId: string, objectiveId: string, data: UpdateObjectiveRequest): Promise<Objective> {
    const r = await api.put<SuccessResponse<Objective>>(`${base(businessId)}/${objectiveId}`, data);
    return r.data.data;
  },

  async delete(businessId: string, objectiveId: string): Promise<void> {
    await api.delete(`${base(businessId)}/${objectiveId}`);
  },

  async updateKeyResult(businessId: string, objectiveId: string, keyResultId: string, data: UpdateKeyResultRequest): Promise<KeyResult> {
    const r = await api.patch<SuccessResponse<KeyResult>>(
      `${base(businessId)}/${objectiveId}/key-results/${keyResultId}`,
      data,
    );
    return r.data.data;
  },

  async syncRevenue(businessId: string, objectiveId: string, keyResultId: string): Promise<{ currentValue: number }> {
    const r = await api.post<SuccessResponse<{ currentValue: number }>>(
      `${base(businessId)}/${objectiveId}/key-results/${keyResultId}/sync-revenue`,
    );
    return r.data.data;
  },

  async syncNewClients(businessId: string, objectiveId: string, keyResultId: string): Promise<{ currentValue: number }> {
    const r = await api.post<SuccessResponse<{ currentValue: number }>>(
      `${base(businessId)}/${objectiveId}/key-results/${keyResultId}/sync-new-clients`,
    );
    return r.data.data;
  },

  async syncRetention(businessId: string, objectiveId: string, keyResultId: string): Promise<{ currentValue: number }> {
    const r = await api.post<SuccessResponse<{ currentValue: number }>>(
      `${base(businessId)}/${objectiveId}/key-results/${keyResultId}/sync-retention`,
    );
    return r.data.data;
  },
};
