import useSWR from 'swr';
import { appointmentsService } from '../services/appointmentsService';
import { storage } from '@/utils/storage';
import {
  getByDate as _getByDate,
  getDayAppointments as _getDayAppointments,
} from '@/utils/appointmentCalendar';
import type { Appointment } from '@/types/appointments.types';

export function useAllAppointments(): {
  getByDate: (year: number, month: number) => Map<string, Appointment[]>;
  getDayAppointments: (dateStr: string) => Appointment[];
  isLoading: boolean;
  mutate: () => void;
} {
  const businessId = storage.getBusinessId();

  const { data, isLoading, mutate } = useSWR(
    businessId ? ['appts-all', businessId] : null,
    () => appointmentsService.list(businessId!, { limit: 500 }),
    { revalidateOnFocus: false },
  );

  const all: Appointment[] = data?.data ?? [];

  return {
    getByDate: (year, month) => _getByDate(all, year, month),
    getDayAppointments: (dateStr) => _getDayAppointments(all, dateStr),
    isLoading,
    mutate,
  };
}
