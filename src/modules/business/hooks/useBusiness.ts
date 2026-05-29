import useSWR from 'swr';
import { businessService } from '../services/businessService';
import { storage } from '@/utils/storage';
import type { Business } from '@/types/business.types';

export function useBusiness(): Business | undefined {
  const businessId = storage.getBusinessId();
  const { data } = useSWR(
    businessId ? ['business', businessId] : null,
    () => businessService.get(businessId!),
    { revalidateOnFocus: false },
  );
  return data;
}
