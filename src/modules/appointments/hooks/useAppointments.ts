import useSWR from 'swr';
import { useState } from 'react';
import { appointmentsService } from '../services/appointmentsService';
import { storage } from '@/utils/storage';
import type { AppointmentFilters } from '@/types/appointments.types';

export function useAppointments(initialFilters: AppointmentFilters = {}) {
  const businessId = storage.getBusinessId();
  const [filters, setFilters] = useState<AppointmentFilters>(initialFilters);

  const key = businessId ? ['appointments', businessId, JSON.stringify(filters)] : null;

  const { data, error, isLoading, mutate } = useSWR(key, () =>
    appointmentsService.list(businessId!, filters),
  );

  return {
    appointments: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    filters,
    setFilters,
    mutate,
  };
}
