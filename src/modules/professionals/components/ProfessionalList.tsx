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
import { ProfessionalForm } from './ProfessionalForm';
import { WorkingHoursForm } from './WorkingHoursForm';
import { LinkServicesForm } from './LinkServicesForm';
import { ProfessionalCommissionsModal } from './ProfessionalCommissionsModal';
import { professionalsService } from '../services/professionalsService';
import { getApiError } from '@/services/api';
import { useProfessionals } from '../hooks/useProfessionals';
import { useBusiness } from '@/modules/business/hooks/useBusiness';
import { storage } from '@/utils/storage';
import type { DayOfWeek, Professional } from '@/types/professionals.types';

const LIMIT = 20;

type ModalType = 'create' | 'edit' | 'hours' | 'services' | 'commissions' | 'delete' | null;

export function ProfessionalList(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const { professionals, total, page, setPage, isLoading, error, mutate } = useProfessionals();
  const business = useBusiness();
  const soloMode = business?.soloMode ?? storage.getSoloMode();

  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Professional | null>(null);
  const [deleting, setDeleting] = useState(false);

  function open(type: ModalType, p?: Professional): void {
    setSelected(p ?? null);
    setModal(type);
  }

  function closeModal(): void {
    setModal(null);
    setSelected(null);
  }

  async function handleCreate(values: {
    name: string;
    email?: string;
    password?: string;
    specialty?: string;
    commissionRate?: number;
  }): Promise<void> {
    try {
      await professionalsService.create(businessId, {
        name: values.name,
        email: values.email!,
        password: values.password!,
        specialty: values.specialty,
        commissionRate: values.commissionRate,
      });
      toast('Profissional cadastrado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleEdit(values: {
    name: string;
    email?: string;
    password?: string;
    specialty?: string;
    commissionRate?: number;
  }): Promise<void> {
    if (!selected) return;
    try {
      await professionalsService.update(businessId, selected.id, {
        name: values.name,
        specialty: values.specialty,
        commissionRate: values.commissionRate,
      });
      toast('Profissional atualizado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleWorkingHours(
    hours: Array<{ dayOfWeek: DayOfWeek; startTime: string; endTime: string }>,
  ): Promise<void> {
    if (!selected) return;
    try {
      await professionalsService.setWorkingHours(businessId, selected.id, { hours });
      toast('Horários salvos!', 'success');
      closeModal();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleLinkServices(serviceIds: string[]): Promise<void> {
    if (!selected) return;
    try {
      await professionalsService.linkServices(businessId, selected.id, { serviceIds });
      toast('Serviços vinculados!', 'success');
      closeModal();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleDelete(): Promise<void> {
    if (!selected) return;
    setDeleting(true);
    try {
      await professionalsService.delete(businessId, selected.id);
      toast('Profissional excluído.', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        {soloMode ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" />
            Modo profissional único ativo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
            Modo multiprofissional
          </span>
        )}
        <Button size="sm" onClick={() => open('create')}>
          + Novo profissional
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => mutate()} />
      ) : professionals.length === 0 ? (
        <EmptyState
          title="Nenhum profissional cadastrado"
          description="Adicione profissionais para começar a agendar."
          action={
            <Button size="sm" onClick={() => open('create')}>
              + Novo profissional
            </Button>
          }
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ocean-surface-container-low/50 border-b border-ocean-outline-variant/25">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                    Comissão
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-outline-variant/15">
                {professionals.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-ocean-surface-container-low/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-ocean-on-surface">{p.name}</td>
                    <td className="px-4 py-3 text-ocean-on-surface-variant">
                      {p.specialty ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-ocean-on-surface-variant">
                      {p.commissionRate != null ? `${p.commissionRate}%` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Button size="sm" variant="secondary" onClick={() => open('hours', p)}>
                          Horários
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => open('services', p)}>
                          Serviços
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => open('commissions', p)}>
                          Comissões
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => open('edit', p)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => open('delete', p)}>
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
        </div>
      )}

      <Modal open={modal === 'create'} onClose={closeModal} title="Novo profissional">
        <ProfessionalForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar profissional">
        {selected && (
          <ProfessionalForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} />
        )}
      </Modal>

      <Modal
        open={modal === 'hours'}
        onClose={closeModal}
        title={`Horários — ${selected?.name ?? ''}`}
        size="md"
      >
        {selected && (
          <WorkingHoursForm existing={[]} onSubmit={handleWorkingHours} onCancel={closeModal} />
        )}
      </Modal>

      <Modal
        open={modal === 'services'}
        onClose={closeModal}
        title={`Serviços — ${selected?.name ?? ''}`}
        size="md"
      >
        {selected && (
          <LinkServicesForm
            currentServiceIds={[]}
            onSubmit={handleLinkServices}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <ConfirmModal
        open={modal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir profissional"
        message={`Tem certeza que deseja excluir "${selected?.name}"? O profissional será removido da listagem. Os agendamentos existentes são mantidos no histórico.`}
        confirmLabel="Excluir"
      />

      <ProfessionalCommissionsModal
        professionalId={modal === 'commissions' ? (selected?.id ?? null) : null}
        professionalName={selected?.name ?? ''}
        open={modal === 'commissions'}
        onClose={closeModal}
      />
    </>
  );
}
