import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type {
  AnamnesisTemplate,
  AnamnesisRecord,
  CreateTemplateRequest,
  SubmitAnswersRequest,
} from '@/types/anamnesis.types';

export const anamnesisService = {
  async listTemplates(businessId: string): Promise<AnamnesisTemplate[]> {
    const r = await api.get<SuccessResponse<AnamnesisTemplate[]>>(
      `/businesses/${businessId}/anamnesis/templates`,
    );
    return r.data.data;
  },

  async createTemplate(businessId: string, data: CreateTemplateRequest): Promise<AnamnesisTemplate> {
    const r = await api.post<SuccessResponse<AnamnesisTemplate>>(
      `/businesses/${businessId}/anamnesis/templates`,
      data,
    );
    return r.data.data;
  },

  async listClientRecords(businessId: string, clientId: string): Promise<AnamnesisRecord[]> {
    const r = await api.get<SuccessResponse<AnamnesisRecord[]>>(
      `/businesses/${businessId}/clients/${clientId}/anamnesis`,
    );
    return r.data.data;
  },

  async applyTemplate(businessId: string, clientId: string, templateId: string): Promise<AnamnesisRecord> {
    const r = await api.post<SuccessResponse<AnamnesisRecord>>(
      `/businesses/${businessId}/clients/${clientId}/anamnesis`,
      { templateId },
    );
    return r.data.data;
  },

  async submitAnswers(
    businessId: string,
    clientId: string,
    recordId: string,
    data: SubmitAnswersRequest,
  ): Promise<AnamnesisRecord> {
    const r = await api.put<SuccessResponse<AnamnesisRecord>>(
      `/businesses/${businessId}/clients/${clientId}/anamnesis/${recordId}/answers`,
      data,
    );
    return r.data.data;
  },
};
