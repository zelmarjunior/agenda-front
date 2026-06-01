export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  commissionRate: number | null;
  phone: string | null;
  photoUrl: string | null;
  calendarColor: string | null;
  userId: string;
  createdAt: string;
}

export interface CreateProfessionalRequest {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  commissionRate?: number;
  phone?: string;
  calendarColor?: string;
}

export interface UpdateProfessionalRequest {
  name?: string;
  specialty?: string;
  commissionRate?: number;
  phone?: string;
  calendarColor?: string;
}

export interface WorkingHour {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface SetWorkingHoursRequest {
  hours: Array<{
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }>;
}

export interface LinkServicesRequest {
  serviceIds: string[];
}

export type CommissionType = 'PERCENT' | 'FIXED';

export interface ServiceCommission {
  serviceId: string;
  serviceName: string;
  commissionType: CommissionType | null;
  commissionValue: number | null;
}

export interface SetServiceCommissionRequest {
  commissionType: CommissionType | null;
  commissionValue: number | null;
}

// Backend returns plain ISO strings: "2026-05-29T09:00:00"
export type AvailableSlot = string;
