'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { servicesService } from '../services/servicesService';
import { storage } from '@/utils/storage';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';
import type { ServiceProfessional } from '@/types/services.types';

interface ServiceProfessionalsModalProps {
  serviceId: string;
  serviceName: string;
  open: boolean;
  onClose: () => void;
}

export function ServiceProfessionalsModal({
  serviceId,
  serviceName,
  open,
  onClose,
}: ServiceProfessionalsModalProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const [toggling, setToggling] = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR(
    open ? ['service-professionals', businessId, serviceId] : null,
    () => servicesService.getProfessionals(businessId, serviceId),
    { revalidateOnFocus: false },
  );

  async function handleToggle(prof: ServiceProfessional): Promise<void> {
    if (toggling) return;
    setToggling(prof.id);

    // optimistic update
    mutate(
      (prev) =>
        prev?.map((p) => (p.id === prof.id ? { ...p, linked: !p.linked } : p)),
      false,
    );

    try {
      await servicesService.toggleProfessional(businessId, serviceId, prof.id);
    } catch (err) {
      // rollback
      mutate(
        (prev) =>
          prev?.map((p) => (p.id === prof.id ? { ...p, linked: prof.linked } : p)),
        false,
      );
      toast(getApiError(err), 'error');
    } finally {
      setToggling(null);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Profissionais — ${serviceName}`} size="sm">
      {isLoading ? (
        <div className="py-8">
          <Spinner />
        </div>
      ) : !data?.length ? (
        <p className="py-6 text-center text-sm text-ocean-secondary">
          Nenhum profissional cadastrado.
        </p>
      ) : (
        <ul className="divide-y divide-ocean-outline-variant/20">
          {data.map((prof) => (
            <li key={prof.id} className="flex items-center justify-between py-3 px-1">
              <div className="flex items-center gap-3">
                {prof.calendarColor && (
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ background: prof.calendarColor }}
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-ocean-on-surface">{prof.name}</p>
                  {prof.specialty && (
                    <p className="text-xs text-ocean-secondary">{prof.specialty}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={prof.linked}
                aria-label={`${prof.linked ? 'Desvincular' : 'Vincular'} ${prof.name}`}
                disabled={toggling === prof.id}
                onClick={() => handleToggle(prof)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-primary focus:ring-offset-2 disabled:opacity-50 ${
                  prof.linked ? 'bg-ocean-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    prof.linked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
