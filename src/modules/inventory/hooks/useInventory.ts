import useSWR from 'swr';
import { useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import { storage } from '@/utils/storage';
import type { ProductType } from '@/types/inventory.types';

export function useInventory(initialPage = 1) {
  const businessId = storage.getBusinessId();
  const [page, setPage] = useState(initialPage);
  const [type, setType] = useState<ProductType | undefined>();
  const [lowStock, setLowStock] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    businessId ? ['inventory', businessId, page, type, lowStock] : null,
    () => inventoryService.list(businessId!, { page, type, lowStock }),
  );

  return {
    products: data?.data ?? [],
    total: data?.total ?? 0,
    page,
    setPage,
    type,
    setType,
    lowStock,
    setLowStock,
    isLoading,
    error,
    mutate,
  };
}
