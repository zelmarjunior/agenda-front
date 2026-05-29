import useSWR from 'swr';
import { useState } from 'react';
import { professionalsService } from '../services/professionalsService';
import { storage } from '@/utils/storage';

export function useProfessionals(initialPage = 1) {
  const businessId = storage.getBusinessId();
  const [page, setPage] = useState(initialPage);

  const { data, error, isLoading, mutate } = useSWR(
    businessId ? ['professionals', businessId, page] : null,
    () => professionalsService.list(businessId!, { page }),
  );

  return {
    professionals: data?.data ?? [],
    total: data?.total ?? 0,
    page,
    setPage,
    isLoading,
    error,
    mutate,
  };
}
