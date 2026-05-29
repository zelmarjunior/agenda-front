export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  commissionRate: number | null;
  userId: string;
  createdAt: string;
}

export interface CreateProfessionalRequest {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  commissionRate?: number;
}

export interface UpdateProfessionalRequest {
  name?: string;
  specialty?: string;
  commissionRate?: number;
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

export interface AvailableSlot {
  startTime: string;
  endTime: string;
}
