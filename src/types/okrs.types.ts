export type OkrPeriodType = 'MONTHLY' | 'QUARTERLY';

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  initialValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface Objective {
  id: string;
  businessId: string;
  title: string;
  description: string | null;
  periodType: OkrPeriodType;
  periodName: string;
  startDate: string;
  endDate: string;
  keyResults: KeyResult[];
  completionPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuarterAlert {
  shouldAlertPlanning: boolean;
  message: string | null;
  currentQuarter: string;
  nextQuarter: string;
}

export interface CreateKeyResultRequest {
  title: string;
  initialValue?: number;
  targetValue: number;
  currentValue?: number;
  unit: string;
}

export interface CreateObjectiveRequest {
  title: string;
  description?: string;
  periodType: OkrPeriodType;
  periodName: string;
  startDate: string;
  endDate: string;
  keyResults: CreateKeyResultRequest[];
}

export interface UpdateObjectiveRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateKeyResultRequest {
  title?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
}
