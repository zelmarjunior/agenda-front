'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Pagination } from '@/components/common/Pagination';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { DropdownMenu } from '@/components/common/DropdownMenu';
import { useToast } from '@/context/ToastContext';
import { ServiceForm } from './ServiceForm';
import { ServiceProfessionalsModal } from './ServiceProfessionalsModal';
import { servicesService } from '../services/servicesService';
import { getApiError } from '@/services/api';
import { useServices } from '../hooks/useServices';
import { storage } from '@/utils/storage';
import { formatCurrency, formatDuration } from '@/utils/formatters';
import type { Service } from '@/types/services.types';

const LIMIT = 20;

export function ServiceList(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const { services, total, page, setPage, isLoading, error, mutate } = useServices();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [profsTarget, setProfsTarget] = useState<Service | null>(null);

  function openEdit(s: Service): void {
    setSelected(s);
    setModal('edit');
  }

  function closeModal(): void {
    setModal(null);
    setSelected(null);
  }

  async function handleCreate(values: {
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    durationMinutes: number;
    color?: string;
  }): Promise<void> {
    try {
      await servicesService.create(businessId, {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        costPrice: values.costPrice || undefined,
        durationMinutes: values.durationMinutes,
        color: values.color || undefined,
      });
      toast('Serviço cadastrado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleEdit(values: {
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    durationMinutes: number;
    color?: string;
  }): Promise<void> {
    if (!selected) return;
    try {
      await servicesService.update(businessId, selected.id, {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        costPrice: values.costPrice || undefined,
        durationMinutes: values.durationMinutes,
        color: values.color || undefined,
      });
      toast('Serviço atualizado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleDelete(): Promise<void> {
    if (!confirmDelete) return;
    try {
      await servicesService.delete(businessId, confirmDelete.id);
      toast('Serviço removido.', 'success');
      setConfirmDelete(null);
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setModal('create')}>
          + Novo serviço
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => mutate()} />
      ) : services.length === 0 ? (
        <EmptyState
          title="Nenhum serviço cadastrado"
          description="Cadastre os serviços oferecidos pelo seu negócio."
          action={
            <Button size="sm" onClick={() => setModal('create')}>
              + Novo serviço
            </Button>
          }
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <ul className="divide-y divide-ocean-outline-variant/15">
            {services.map((s) => (
              <li key={s.id} className="flex items-center gap-2 px-4 py-3 hover:bg-ocean-surface-container-low/40 transition-colors">
                <button
                  type="button"
                  onClick={() => openEdit(s)}
                  className="flex-1 flex items-center gap-3 min-w-0 text-left focus:outline-none"
                >
                  <span
                    className="shrink-0 h-3 w-3 rounded-full border border-white/20"
                    style={{ background: s.color ?? '#94a3b8' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ocean-on-surface truncate">{s.name}</p>
                    {s.description && (
                      <p className="text-xs text-ocean-secondary truncate">{s.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-xs text-ocean-secondary">
                    <span>{formatDuration(s.durationMinutes)}</span>
                    <span className="font-semibold text-ocean-on-surface">{formatCurrency(s.price)}</span>
                  </div>
                </button>
                <div className="shrink-0">
                  <DropdownMenu
                    items={[
                      { label: 'Profissionais', onClick: () => setProfsTarget(s) },
                      { label: 'Editar', onClick: () => openEdit(s) },
                      { label: 'Excluir', onClick: () => setConfirmDelete(s), variant: 'danger' },
                    ]}
                  />
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
        </div>
      )}

      <Modal open={modal === 'create'} onClose={closeModal} title="Novo serviço">
        <ServiceForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar serviço">
        {selected && <ServiceForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} />}
      </Modal>

      {profsTarget && (
        <ServiceProfessionalsModal
          serviceId={profsTarget.id}
          serviceName={profsTarget.name}
          open={!!profsTarget}
          onClose={() => setProfsTarget(null)}
        />
      )}

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Excluir serviço"
        message={`Deseja excluir o serviço "${confirmDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </>
  );
}
