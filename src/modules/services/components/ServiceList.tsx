'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Pagination } from '@/components/common/Pagination';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import { ServiceForm } from './ServiceForm';
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
    durationMinutes: number;
  }): Promise<void> {
    try {
      await servicesService.create(businessId, {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        durationMinutes: values.durationMinutes,
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
    durationMinutes: number;
  }): Promise<void> {
    if (!selected) return;
    try {
      await servicesService.update(businessId, selected.id, {
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        durationMinutes: values.durationMinutes,
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
          <table className="w-full text-sm">
            <thead className="bg-ocean-surface-container-low/50 border-b border-ocean-outline-variant/25">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Duração
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-outline-variant/15">
              {services.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-ocean-surface-container-low/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ocean-on-surface">{s.name}</p>
                    {s.description && (
                      <p className="text-xs text-ocean-secondary mt-0.5">{s.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ocean-on-surface-variant">
                    {formatDuration(s.durationMinutes)}
                  </td>
                  <td className="px-4 py-3 text-ocean-on-surface font-semibold">
                    {formatCurrency(s.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(s)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setConfirmDelete(s)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
        </div>
      )}

      <Modal open={modal === 'create'} onClose={closeModal} title="Novo serviço">
        <ServiceForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar serviço">
        {selected && <ServiceForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} />}
      </Modal>

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
