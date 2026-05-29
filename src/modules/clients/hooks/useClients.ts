import useSWR from 'swr';
import { useState } from 'react';
import { clientsService } from '../services/clientsService';
import { storage } from '@/utils/storage';

export function useClients(initialPage = 1) {
  const businessId = storage.getBusinessId();
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState('');

  const { data, error, isLoading, mutate } = useSWR(
    businessId ? ['clients', businessId, page, search] : null,
    () => clientsService.list(businessId!, { page, search: search || undefined }),
  );

  return {
    clients: data?.data ?? [],
    total: data?.total ?? 0,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    error,
    mutate,
  };
}
