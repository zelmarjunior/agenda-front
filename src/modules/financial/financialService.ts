import { api } from '@/services/api';
import type { SuccessResponse } from '@/types/api.types';
import type {
  FixedCost, VariableCost, CashflowResponse, FinancialSummary,
  CreateFixedCostRequest, CreateVariableCostRequest,
} from '@/types/financial.types';

function base(businessId: string) { return `/businesses/${businessId}/financial`; }

export const financialService = {
  // Fixed costs
  async listFixedCosts(businessId: string): Promise<FixedCost[]> {
    const r = await api.get<SuccessResponse<FixedCost[]>>(`${base(businessId)}/fixed-costs`);
    return r.data.data;
  },
  async createFixedCost(businessId: string, data: CreateFixedCostRequest): Promise<FixedCost> {
    const r = await api.post<SuccessResponse<FixedCost>>(`${base(businessId)}/fixed-costs`, data);
    return r.data.data;
  },
  async updateFixedCost(businessId: string, id: string, data: Partial<CreateFixedCostRequest>): Promise<FixedCost> {
    const r = await api.put<SuccessResponse<FixedCost>>(`${base(businessId)}/fixed-costs/${id}`, data);
    return r.data.data;
  },
  async deleteFixedCost(businessId: string, id: string): Promise<void> {
    await api.delete(`${base(businessId)}/fixed-costs/${id}`);
  },

  // Variable costs
  async listVariableCosts(businessId: string, from?: string, to?: string): Promise<VariableCost[]> {
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    const r = await api.get<SuccessResponse<VariableCost[]>>(`${base(businessId)}/variable-costs?${qs}`);
    return r.data.data;
  },
  async createVariableCost(businessId: string, data: CreateVariableCostRequest): Promise<VariableCost> {
    const r = await api.post<SuccessResponse<VariableCost>>(`${base(businessId)}/variable-costs`, data);
    return r.data.data;
  },
  async deleteVariableCost(businessId: string, id: string): Promise<void> {
    await api.delete(`${base(businessId)}/variable-costs/${id}`);
  },

  // Reports
  async getCashflow(businessId: string, from: string, to: string): Promise<CashflowResponse> {
    const r = await api.get<SuccessResponse<CashflowResponse>>(
      `${base(businessId)}/cashflow?from=${from}&to=${to}`,
    );
    return r.data.data;
  },
  async getSummary(businessId: string, from: string, to: string): Promise<FinancialSummary> {
    const r = await api.get<SuccessResponse<FinancialSummary>>(
      `${base(businessId)}/summary?from=${from}&to=${to}`,
    );
    return r.data.data;
  },

  // AI Insights streaming via fetch (supports Authorization header)
  async streamInsights(
    businessId: string,
    months = 3,
    onToken: (token: string) => void,
    onDone: () => void,
    onError: (err: string) => void,
  ): Promise<void> {
    const token = localStorage.getItem('token') ?? '';
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
    const url = `${apiBase}/api/v1/businesses/${businessId}/financial/insights?months=${months}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
      });
      if (!response.body) { onError('No response body'); return; }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.token) onToken(parsed.token);
              if (parsed.done) onDone();
              if (parsed.error) onError(parsed.error);
            } catch { /* skip malformed */ }
          }
        }
      }
      onDone();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro de conexão');
    }
  },
};
