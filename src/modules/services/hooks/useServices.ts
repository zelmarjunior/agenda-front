import useSWR from 'swr';
import { useState } from 'react';
import { servicesService } from '../services/servicesService';
import { storage } from '@/utils/storage';

export function useServices(initialPage = 1) {
  const businessId = storage.getBusinessId();
  const [page, setPage] = useState(initialPage);

  const { data, error, isLoading, mutate } = useSWR(
    businessId ? ['services', businessId, page] : null,
    () => servicesService.list(businessId!, { page }),
  );

  return {
    services: data?.data ?? [],
    total: data?.total ?? 0,
    page,
    setPage,
    isLoading,
    error,
    mutate,
  };
}
