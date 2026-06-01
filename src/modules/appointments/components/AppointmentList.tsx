'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { AppointmentForm } from './AppointmentForm';
import { CancelForm } from './CancelForm';
import { NoShowForm } from './NoShowForm';
import { appointmentsService } from '../services/appointmentsService';
import { getApiError } from '@/services/api';
import { useAppointments } from '../hooks/useAppointments';
import { storage } from '@/utils/storage';
import { formatDateTime } from '@/utils/formatters';
import type { Appointment, AppointmentStatus } from '@/types/appointments.types';

const STATUS_OPTIONS: { value: AppointmentStatus | ''; label: string }[] = [
  { value: '', label: 'Todos os status' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'COMPLETED', label: 'Atendido' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'NO_SHOW', label: 'Não Atendido' },
];

const LIMIT = 20;

export function AppointmentList(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();

  const { appointments, total, isLoading, error, filters, setFilters, mutate } = useAppointments({
    page: 1,
    limit: LIMIT,
  });

  const [modal, setModal] = useState<'create' | 'edit' | 'cancel' | 'noshow' | null>(null);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const page = filters.page ?? 1;

  function openEdit(appt: Appointment): void {
    setSelected(appt);
    setModal('edit');
  }

  function openCancel(appt: Appointment): void {
    setSelected(appt);
    setModal('cancel');
  }

  function closeModal(): void {
    setModal(null);
    setSelected(null);
  }

  async function handleCreate(
    scheduledAt: string,
    values: { clientId: string; professionalId: string; serviceId: string },
  ): Promise<void> {
    try {
      await appointmentsService.create(businessId, { ...values, scheduledAt });
      toast('Agendamento criado com sucesso!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleEdit(scheduledAt: string): Promise<void> {
    if (!selected) return;
    try {
      await appointmentsService.reschedule(businessId, selected.id, {
        scheduledAt,
        reason: 'Reagendado pelo administrador',
      });
      toast('Agendamento reagendado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleConfirm(appt: Appointment): Promise<void> {
    try {
      await appointmentsService.confirm(businessId, appt.id);
      toast('Agendamento confirmado!', 'success');
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleComplete(appt: Appointment): Promise<void> {
    try {
      await appointmentsService.complete(businessId, appt.id);
      toast('Agendamento concluído!', 'success');
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleCancel(reason: string): Promise<void> {
    if (!selected) return;
    try {
      await appointmentsService.cancel(businessId, selected.id, { reason });
      toast('Agendamento cancelado.', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleNoShow(reason: string): Promise<void> {
    if (!selected) return;
    try {
      await appointmentsService.noShow(businessId, selected.id, reason);
      toast('Marcado como não atendido.', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="date"
          value={filters.date ?? ''}
          onChange={(e) => setFilters({ ...filters, date: e.target.value || undefined, page: 1 })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: (e.target.value as AppointmentStatus) || undefined,
              page: 1,
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <Button size="sm" onClick={() => setModal('create')}>
            + Novo agendamento
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => mutate()} />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="Nenhum agendamento encontrado"
          description="Ajuste os filtros ou crie um novo agendamento."
          action={
            <Button size="sm" onClick={() => setModal('create')}>
              + Novo agendamento
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Data/Hora</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Cliente</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Profissional</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Serviço</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                      {formatDateTime(appt.scheduledAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{appt.client.name}</td>
                    <td className="px-4 py-3 text-gray-700">{appt.professional.name}</td>
                    <td className="px-4 py-3 text-gray-700">{appt.service.name}</td>
                    <td className="px-4 py-3">
                      <AppointmentStatusBadge status={appt.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {appt.status === 'PENDING' && (
                          <Button size="sm" variant="secondary" onClick={() => handleConfirm(appt)}>
                            Confirmar
                          </Button>
                        )}
                        {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => openEdit(appt)}>
                              Reagendar
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => openCancel(appt)}>
                              Cancelar
                            </Button>
                          </>
                        )}
                        {appt.status === 'CONFIRMED' && (
                          <Button size="sm" onClick={() => handleComplete(appt)}>
                            Concluir
                          </Button>
                        )}
                        {(appt.status === 'PENDING' || appt.status === 'CONFIRMED' || appt.status === 'COMPLETED') && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => { setSelected(appt); setModal('noshow'); }}
                          >
                            Não Atendido
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPageChange={(p) => setFilters({ ...filters, page: p })}
          />
        </div>
      )}

      {/* Create modal */}
      <Modal open={modal === 'create'} onClose={closeModal} title="Novo agendamento">
        <AppointmentForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      {/* Edit / reschedule modal */}
      <Modal open={modal === 'edit'} onClose={closeModal} title="Reagendar">
        {selected && (
          <AppointmentForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} />
        )}
      </Modal>

      {/* Cancel modal */}
      <Modal open={modal === 'cancel'} onClose={closeModal} title="Cancelar agendamento" size="sm">
        <CancelForm onSubmit={handleCancel} onCancel={closeModal} />
      </Modal>

      {/* No-show modal */}
      <Modal open={modal === 'noshow'} onClose={closeModal} title="Não Atendido" size="sm">
        <NoShowForm onSubmit={handleNoShow} onCancel={closeModal} />
      </Modal>
    </>
  );
}
