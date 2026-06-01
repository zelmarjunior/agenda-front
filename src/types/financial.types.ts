export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  recurrence: 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  startDate: string;
  category: string;
  active: boolean;
  createdAt: string;
}

export interface VariableCost {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  notes: string | null;
  createdAt: string;
}

export interface CashEntry {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  paymentMethod: string | null;
  description: string;
  date: string;
  appointmentId: string | null;
}

export interface CashflowResponse {
  period: { from: string; to: string };
  income: number;
  expense: number;
  net: number;
  byPaymentMethod: Record<string, number>;
  entries: CashEntry[];
}

export interface FinancialSummary {
  period: { from: string; to: string };
  revenue: { gross: number };
  costs: { fixed: number; variable: number; total: number };
  profit: { net: number; margin: number };
}

export interface CreateFixedCostRequest {
  name: string;
  amount: number;
  recurrence?: 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  startDate: string;
  category?: string;
}

export interface CreateVariableCostRequest {
  name: string;
  amount: number;
  date: string;
  category?: string;
  notes?: string;
}
