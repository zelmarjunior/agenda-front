'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { useToast } from '@/context/ToastContext';
import { MonthCalendar } from './MonthCalendar';
import { DayTimeline } from './DayTimeline';
import { AppointmentForm } from './AppointmentForm';
import { CancelForm } from './CancelForm';
import { RescheduleForm } from './RescheduleForm';
import { AppointmentList } from './AppointmentList';
import { ClientProfileModal } from '@/modules/clients/components/ClientProfileModal';
import { useAllAppointments } from '../hooks/useAllAppointments';
import { appointmentsService } from '../services/appointmentsService';
import { getApiError } from '@/services/api';
import { storage } from '@/utils/storage';
import { toDateStr } from '@/utils/calendar';
import type { Appointment } from '@/types/appointments.types';

type View = 'calendar' | 'list';
type ModalType = 'create' | 'edit' | 'cancel' | 'reschedule' | null;

export function AppointmentListPage(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();

  const today = toDateStr(new Date());
  const todayDate = new Date();

  const [view, setView] = useState<View>('calendar');
  const [calYear, setCalYear] = useState(todayDate.getFullYear());
  const [calMonth, setCalMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [modal, setModal] = useState<ModalType>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [profileClientId, setProfileClientId] = useState<string | null>(null);
  const [prefilledDatetime, setPrefilledDatetime] = useState<string | undefined>(undefined);

  const { getByDate, getDayAppointments, isLoading, mutate } = useAllAppointments();

  const byDate = getByDate(calYear, calMonth);
  const dayAppointments = selectedDate ? getDayAppointments(selectedDate) : [];

  function prevMonth(): void {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else setCalMonth((m) => m - 1);
  }

  function nextMonth(): void {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else setCalMonth((m) => m + 1);
  }

  function openCreate(prefill?: string): void {
    setPrefilledDatetime(prefill);
    setModal('create');
  }

  function openCancel(appt: Appointment): void {
    setCancelTarget(appt);
    setModal('cancel');
  }

  function openReschedule(appt: Appointment): void {
    setRescheduleTarget(appt);
    setModal('reschedule');
  }

  function openEdit(appt: Appointment): void {
    setEditTarget(appt);
    setModal('edit');
  }

  function closeModal(): void {
    setModal(null);
    setCancelTarget(null);
    setRescheduleTarget(null);
    setEditTarget(null);
    setPrefilledDatetime(undefined);
  }

  const handleCreate = useCallback(
    async (
      scheduledAt: string,
      values: { clientId: string; professionalId: string; serviceId: string; finalPrice?: string },
    ): Promise<void> => {
      try {
        await appointmentsService.create(businessId, {
          ...values,
          scheduledAt,
          finalPrice: values.finalPrice ? Number(values.finalPrice) : undefined,
        });
        toast('Agendamento criado!', 'success');
        closeModal();
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, mutate, toast],
  );

  const handleEdit = useCallback(
    async (
      _scheduledAt: string,
      values: { clientId: string; professionalId: string; serviceId: string; finalPrice?: string },
    ): Promise<void> => {
      if (!editTarget) return;
      try {
        await appointmentsService.update(businessId, editTarget.id, {
          finalPrice: values.finalPrice ? Number(values.finalPrice) : undefined,
        });
        toast('Agendamento atualizado!', 'success');
        closeModal();
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, editTarget, mutate, toast],
  );

  const handleConfirm = useCallback(
    async (appt: Appointment): Promise<void> => {
      try {
        await appointmentsService.confirm(businessId, appt.id);
        toast('Agendamento confirmado!', 'success');
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, mutate, toast],
  );

  const handleComplete = useCallback(
    async (appt: Appointment): Promise<void> => {
      try {
        await appointmentsService.complete(businessId, appt.id);
        toast('Agendamento concluído!', 'success');
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, mutate, toast],
  );

  const handleCancel = useCallback(
    async (reason: string): Promise<void> => {
      if (!cancelTarget) return;
      try {
        await appointmentsService.cancel(businessId, cancelTarget.id, { reason });
        toast('Agendamento cancelado.', 'success');
        closeModal();
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, cancelTarget, mutate, toast],
  );

  const handleReschedule = useCallback(
    async (scheduledAt: string, reason: string): Promise<void> => {
      if (!rescheduleTarget) return;
      try {
        await appointmentsService.reschedule(businessId, rescheduleTarget.id, {
          scheduledAt,
          reason,
        });
        toast('Agendamento reagendado!', 'success');
        closeModal();
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, rescheduleTarget, mutate, toast],
  );

  const toggle = (
    <div className="flex items-center gap-2">
      <div className="flex rounded-xl overflow-hidden glass-card">
        {(['calendar', 'list'] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none ${
              view === v
                ? 'bg-ocean-primary text-white'
                : 'text-ocean-secondary hover:bg-ocean-surface-container hover:text-ocean-on-surface'
            }`}
          >
            {v === 'calendar' ? 'Calendário' : 'Lista'}
          </button>
        ))}
      </div>
      <Button size="sm" onClick={() => openCreate()}>
        + Novo
      </Button>
    </div>
  );

  return (
    <>
      <Header title="Agendamentos" actions={toggle} />

      {view === 'list' ? (
        <AppointmentList />
      ) : (
        <div className="space-y-4">
          {isLoading && !byDate.size ? (
            <div className="py-16 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <MonthCalendar
                year={calYear}
                month={calMonth}
                byDate={byDate}
                selectedDate={selectedDate}
                onDaySelect={setSelectedDate}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                isLoading={isLoading}
              />

              {selectedDate && (
                <DayTimeline
                  dateStr={selectedDate}
                  appointments={dayAppointments}
                  onTimeSlotClick={(dt) => openCreate(dt)}
                  onEdit={openEdit}
                  onConfirm={handleConfirm}
                  onCancel={openCancel}
                  onComplete={handleComplete}
                  onReschedule={openReschedule}
                  onViewClient={setProfileClientId}
                />
              )}
            </>
          )}
        </div>
      )}

      <Modal open={modal === 'create'} onClose={closeModal} title="Novo agendamento" size="md">
        <AppointmentForm
          prefilledDatetime={prefilledDatetime}
          onSubmit={handleCreate}
          onCancel={closeModal}
        />
      </Modal>

      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar agendamento" size="md">
        {editTarget && (
          <AppointmentForm
            initial={editTarget}
            onSubmit={handleEdit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal open={modal === 'cancel'} onClose={closeModal} title="Cancelar agendamento" size="sm">
        <CancelForm onSubmit={handleCancel} onCancel={closeModal} />
      </Modal>

      <Modal open={modal === 'reschedule'} onClose={closeModal} title="Reagendar" size="sm">
        {rescheduleTarget && (
          <RescheduleForm
            appointment={rescheduleTarget}
            onSubmit={handleReschedule}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <ClientProfileModal clientId={profileClientId} onClose={() => setProfileClientId(null)} />
    </>
  );
}
