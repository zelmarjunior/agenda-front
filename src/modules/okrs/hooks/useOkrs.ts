import useSWR from 'swr';
import { storage } from '@/utils/storage';
import { okrsService } from '../okrsService';

export function useOkrs(periodName?: string) {
  const businessId = storage.getBusinessId();

  const { data, error, isLoading, mutate } = useSWR(
    businessId ? ['okrs', businessId, periodName ?? ''] : null,
    () => okrsService.list(businessId!, periodName),
  );

  return {
    objectives: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useQuarterAlert() {
  const businessId = storage.getBusinessId();

  const { data } = useSWR(
    businessId ? ['okrs-quarter-alert', businessId] : null,
    () => okrsService.getQuarterAlert(businessId!),
    { revalidateOnFocus: false },
  );

  return data ?? null;
}
