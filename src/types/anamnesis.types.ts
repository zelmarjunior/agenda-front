export type FieldType = 'TEXT' | 'SINGLE' | 'MULTIPLE' | 'BOOLEAN' | 'DATE' | 'SIGNATURE';

export interface AnamnesisField {
  id: string;
  label: string;
  type: FieldType;
  options: string[] | null;
  isAlert: boolean;
  required: boolean;
  sortOrder: number;
}

export interface AnamnesisTemplate {
  id: string;
  name: string;
  description: string | null;
  requiredBeforeFirst: boolean;
  expiresInDays: number | null;
  active: boolean;
  version: number;
  fields: AnamnesisField[];
  createdAt: string;
}

export interface AnamnesisAnswer {
  id: string;
  fieldId: string;
  value: string;
  isAlertTriggered: boolean;
}

export interface AnamnesisRecord {
  id: string;
  templateId: string;
  clientId: string;
  status: 'PENDING' | 'COMPLETED';
  filledBy: 'CLIENT' | 'PROFESSIONAL';
  filledAt: string | null;
  accessToken: string | null;
  answers: AnamnesisAnswer[];
  createdAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  requiredBeforeFirst?: boolean;
  expiresInDays?: number;
  fields: Array<{
    label: string;
    type: FieldType;
    options?: string[];
    isAlert?: boolean;
    required?: boolean;
    sortOrder?: number;
  }>;
}

export interface SubmitAnswersRequest {
  answers: Array<{ fieldId: string; value: string }>;
}
