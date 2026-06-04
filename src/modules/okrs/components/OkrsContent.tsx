'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/common/Modal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { storage } from '@/utils/storage';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/services/api';
import { okrsService } from '../okrsService';
import { useOkrs, useQuarterAlert } from '../hooks/useOkrs';
import { OkrCard } from './OkrCard';
import { OkrForm } from './OkrForm';
import type { Objective, CreateObjectiveRequest } from '@/types/okrs.types';

const PERIOD_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Q1', value: `${new Date().getFullYear()}-Q1` },
  { label: 'Q2', value: `${new Date().getFullYear()}-Q2` },
  { label: 'Q3', value: `${new Date().getFullYear()}-Q3` },
  { label: 'Q4', value: `${new Date().getFullYear()}-Q4` },
];

type ModalState = 'none' | 'create' | 'edit' | 'delete';

export function OkrsContent(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const [modal, setModal] = useState<ModalState>('none');
  const [selected, setSelected] = useState<Objective | null>(null);
  const [periodFilter, setPeriodFilter] = useState('');
  const [deleting, setDeleting] = useState(false);

  const quarterAlert = useQuarterAlert();
  const [alertDismissed, setAlertDismissed] = useState(false);

  const { objectives, isLoading, mutate } = useOkrs(periodFilter || undefined);

  function openCreate() { setSelected(null); setModal('create'); }
  function openEdit(o: Objective) { setSelected(o); setModal('edit'); }
  function openDelete(o: Objective) { setSelected(o); setModal('delete'); }
  function closeModal() { setModal('none'); setSelected(null); }

  async function handleCreate(data: CreateObjectiveRequest) {
    await okrsService.create(businessId, data);
    await mutate();
    toast('Objetivo criado com sucesso!', 'success');
    closeModal();
  }

  async function handleEdit(data: CreateObjectiveRequest) {
    if (!selected) return;
    await okrsService.update(businessId, selected.id, {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    await mutate();
    toast('Objetivo atualizado!', 'success');
    closeModal();
  }

  async function handleDelete() {
    if (!selected) return;
    setDeleting(true);
    try {
      await okrsService.delete(businessId, selected.id);
      await mutate();
      toast('Objetivo excluído.', 'success');
      closeModal();
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setDeleting(false);
    }
  }

  const showAlert = quarterAlert?.shouldAlertPlanning && !alertDismissed;

  return (
    <div>
      <Header
        title="OKRs"
        actions={
          <Button onClick={openCreate}>
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Objetivo
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-5">
        {/* Quarter alert banner */}
        {showAlert && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Hora de planejar!</p>
              <p className="text-sm text-amber-700 mt-0.5">{quarterAlert.message}</p>
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              className="text-amber-400 hover:text-amber-600 transition-colors"
              aria-label="Fechar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Period filter */}
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriodFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                periodFilter === opt.value
                  ? 'bg-ocean-primary text-white border-ocean-primary'
                  : 'bg-white text-ocean-secondary border-gray-200 hover:border-ocean-primary/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : objectives.length === 0 ? (
          <EmptyState
            title="Nenhum objetivo ainda"
            description="Crie seu primeiro OKR para começar a acompanhar as metas do negócio."
            action={<Button onClick={openCreate}>Criar primeiro objetivo</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {objectives.map((obj) => (
              <OkrCard
                key={obj.id}
                objective={obj}
                onEdit={openEdit}
                onDelete={openDelete}
                onUpdated={mutate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={modal === 'create'} onClose={closeModal} title="Novo Objetivo" size="lg">
        <OkrForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      {/* Edit modal */}
      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar Objetivo" size="lg">
        {selected && <OkrForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} />}
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={modal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir objetivo"
        message={`Tem certeza que deseja excluir "${selected?.title}"? Todos os resultados-chave serão removidos.`}
      />
    </div>
  );
}
