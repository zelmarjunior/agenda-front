'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
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
import { AppointmentCardList } from './AppointmentCardList';
import { AddServiceModal } from './AddServiceModal';
import { RecurringForm } from './RecurringForm';
import { NoShowForm } from './NoShowForm';
import { ClientProfileModal } from '@/modules/clients/components/ClientProfileModal';
import { useAllAppointments } from '../hooks/useAllAppointments';
import { appointmentsService } from '../services/appointmentsService';
import { getApiError } from '@/services/api';
import { storage } from '@/utils/storage';
import { toDateStr, formatDayFull } from '@/utils/calendar';
import { formatCurrency } from '@/utils/formatters';
import type { Appointment } from '@/types/appointments.types';

type DayView = 'timeline' | 'cards';
type ModalType = 'create' | 'edit' | 'cancel' | 'reschedule' | 'recurring' | 'noshow' | null;

export function AppointmentListPage(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();

  const today = toDateStr(new Date());
  const todayDate = new Date();

  const [dayView, setDayView] = useState<DayView>('timeline');
  const daySectionRef = useRef<HTMLDivElement>(null);
  const [calYear, setCalYear] = useState(todayDate.getFullYear());
  const [calMonth, setCalMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [modal, setModal] = useState<ModalType>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [profileClientId, setProfileClientId] = useState<string | null>(null);
  const [addServiceTarget, setAddServiceTarget] = useState<Appointment | null>(null);
  const [noShowTarget, setNoShowTarget] = useState<Appointment | null>(null);
  const [prefilledDatetime, setPrefilledDatetime] = useState<string | undefined>(undefined);
  const [recurringPrefilledClientId, setRecurringPrefilledClientId] = useState<string | undefined>(undefined);

  const { getByDate, getDayAppointments, isLoading, mutate } = useAllAppointments();

  const byDate = getByDate(calYear, calMonth);
  const dayAppointments = selectedDate ? getDayAppointments(selectedDate) : [];

  // Value indicators per day for month view
  const byDateValue = useMemo(() => {
    const map = new Map<string, { predicted: number; realized: number }>();
    byDate.forEach((appts, date) => {
      const predicted = appts
        .filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED')
        .reduce((sum, a) => sum + Number(a.finalPrice ?? a.service?.price ?? 0), 0);
      const realized = appts
        .filter((a) => a.status === 'COMPLETED')
        .reduce((sum, a) => sum + Number(a.finalPrice ?? 0), 0);
      map.set(date, { predicted, realized });
    });
    return map;
  }, [byDate]);

  // Day revenue summary
  const dayRevenuePredicted = dayAppointments
    .filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED')
    .reduce((sum, a) => sum + Number(a.finalPrice ?? a.service?.price ?? 0), 0);
  const dayRevenueRealized = dayAppointments
    .filter((a) => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + Number(a.finalPrice ?? 0), 0);

  function prevMonth(): void {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  }

  function nextMonth(): void {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  }

  function handleDaySelect(date: string): void {
    setSelectedDate(date);
    requestAnimationFrame(() => {
      daySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function goToPrevDay(): void {
    if (!selectedDate) return;
    const d = new Date(`${selectedDate}T12:00:00`);
    d.setDate(d.getDate() - 1);
    const prev = toDateStr(d);
    setSelectedDate(prev);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  }

  function goToNextDay(): void {
    if (!selectedDate) return;
    const d = new Date(`${selectedDate}T12:00:00`);
    d.setDate(d.getDate() + 1);
    const next = toDateStr(d);
    setSelectedDate(next);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
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
    setNoShowTarget(null);
    setPrefilledDatetime(undefined);
    setRecurringPrefilledClientId(undefined);
  }

  function openNoShow(appt: Appointment): void {
    setNoShowTarget(appt);
    setModal('noshow');
  }

  function openRecurringFromModal(clientId: string): void {
    setModal(null);
    setEditTarget(null);
    setPrefilledDatetime(undefined);
    setRecurringPrefilledClientId(clientId);
    setModal('recurring');
  }

  const handleCreate = useCallback(
    async (
      scheduledAt: string,
      values: { clientId: string; professionalId: string; serviceId: string; finalPrice?: string; paymentMethod?: string },
    ): Promise<void> => {
      try {
        await appointmentsService.create(businessId, {
          ...values,
          scheduledAt,
          finalPrice: values.finalPrice ? Number(values.finalPrice) : undefined,
          paymentMethod: values.paymentMethod || undefined,
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
      values: { clientId: string; professionalId: string; serviceId: string; finalPrice?: string; paymentMethod?: string },
    ): Promise<void> => {
      if (!editTarget) return;
      try {
        await appointmentsService.update(businessId, editTarget.id, {
          finalPrice: values.finalPrice ? Number(values.finalPrice) : undefined,
          paymentMethod: values.paymentMethod || undefined,
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

  const handleCreateRecurring = useCallback(
    async (data: Parameters<typeof appointmentsService.createRecurring>[1]): Promise<void> => {
      try {
        const result = await appointmentsService.createRecurring(businessId, data);
        const msg = result.conflicts.length > 0
          ? `${result.created.length} agendamentos criados. ${result.conflicts.length} conflito(s) ignorado(s).`
          : `${result.created.length} agendamentos recorrentes criados!`;
        toast(msg, result.conflicts.length > 0 ? 'info' : 'success');
        closeModal();
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, mutate, toast],
  );

  const handleNoShow = useCallback(
    async (reason: string): Promise<void> => {
      if (!noShowTarget) return;
      try {
        await appointmentsService.noShow(businessId, noShowTarget.id, reason);
        toast('Marcado como não atendido.', 'success');
        closeModal();
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, noShowTarget, mutate, toast],
  );

  const handleAddService = useCallback(
    async (appointmentId: string, serviceId: string): Promise<void> => {
      try {
        await appointmentsService.addService(businessId, appointmentId, serviceId);
        toast('Serviço adicionado!', 'success');
        mutate();
      } catch (err) {
        toast(getApiError(err), 'error');
      }
    },
    [businessId, mutate, toast],
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
      <Button size="sm" variant="secondary" onClick={() => setModal('recurring')}>
        ↺ Recorrente
      </Button>
      <Button size="sm" onClick={() => openCreate()}>
        + Novo
      </Button>
    </div>
  );

  return (
    <>
      <Header title="Agendamentos" actions={toggle} />

      {isLoading && !byDate.size ? (
        <div className="py-16 flex justify-center"><Spinner /></div>
      ) : (
        /* ── Combined View: Month Calendar + Day Section ────────────────── */
        <div className="space-y-4">
          {/* Month calendar */}
          <MonthCalendar
            year={calYear}
            month={calMonth}
            byDate={byDate}
            byDateValue={byDateValue}
            selectedDate={selectedDate}
            onDaySelect={handleDaySelect}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            isLoading={isLoading}
          />

          {/* Day section */}
          <div ref={daySectionRef} className="space-y-2">
            {/* Day navigation header + Dia/Horários toggle */}
            <div
              className="rounded-2xl"
              style={{
                background: 'rgba(var(--ocean-surface-container-rgb, 30 60 90), 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={goToPrevDay}
                  className="p-1.5 rounded-xl text-ocean-outline hover:text-ocean-on-surface hover:bg-ocean-surface-container transition-colors focus:outline-none"
                  aria-label="Dia anterior"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="text-center">
                  <p className="text-sm font-bold text-ocean-on-surface capitalize">
                    {selectedDate ? formatDayFull(selectedDate) : ''}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-0.5">
                    <span className="text-[11px] text-ocean-secondary">
                      Previsto: <span className="font-semibold text-ocean-on-surface">{formatCurrency(dayRevenuePredicted)}</span>
                    </span>
                    <span className="text-ocean-outline-variant">·</span>
                    <span className="text-[11px] text-ocean-secondary">
                      Realizado: <span className="font-semibold text-ocean-tertiary">{formatCurrency(dayRevenueRealized)}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={goToNextDay}
                  className="p-1.5 rounded-xl text-ocean-outline hover:text-ocean-on-surface hover:bg-ocean-surface-container transition-colors focus:outline-none"
                  aria-label="Próximo dia"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Dia / Horários toggle */}
              <div className="flex justify-center pb-3">
                <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  {(['timeline', 'cards'] as DayView[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setDayView(v)}
                      className={`px-4 py-1 text-xs font-semibold transition-all focus:outline-none ${
                        dayView === v
                          ? 'bg-ocean-primary text-white'
                          : 'text-ocean-secondary hover:text-ocean-on-surface hover:bg-white/10'
                      }`}
                    >
                      {v === 'timeline' ? 'Dia' : 'Horários'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content based on dayView */}
            {selectedDate && dayView === 'timeline' && (
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
                onAddService={setAddServiceTarget}
                onNoShow={openNoShow}
              />
            )}

            {selectedDate && dayView === 'cards' && (
              <AppointmentCardList
                appointments={dayAppointments}
                onEdit={openEdit}
                onConfirm={handleConfirm}
                onCancel={openCancel}
                onComplete={handleComplete}
                onReschedule={openReschedule}
                onViewClient={setProfileClientId}
                onNoShow={openNoShow}
                onAddService={setAddServiceTarget}
                onNewAppointment={() => openCreate()}
              />
            )}
          </div>
        </div>
      )}

      <Modal open={modal === 'create'} onClose={closeModal} title="Novo agendamento" size="md">
        <AppointmentForm
          prefilledDatetime={prefilledDatetime}
          onSubmit={handleCreate}
          onCancel={closeModal}
          onOpenRecurring={openRecurringFromModal}
        />
      </Modal>

      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar agendamento" size="md">
        {editTarget && (
          <AppointmentForm
            initial={editTarget}
            onSubmit={handleEdit}
            onCancel={closeModal}
            onOpenRecurring={openRecurringFromModal}
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

      <AddServiceModal
        appointment={addServiceTarget}
        onClose={() => setAddServiceTarget(null)}
        onConfirm={handleAddService}
      />

      <Modal open={modal === 'noshow'} onClose={closeModal} title="Não Atendido" size="sm">
        <NoShowForm onSubmit={handleNoShow} onCancel={closeModal} />
      </Modal>

      <Modal open={modal === 'recurring'} onClose={closeModal} title="Agendamento recorrente" size="md">
        <RecurringForm
          onSubmit={handleCreateRecurring}
          onCancel={closeModal}
          initialClientId={recurringPrefilledClientId}
        />
      </Modal>

      <ClientProfileModal clientId={profileClientId} onClose={() => setProfileClientId(null)} />
    </>
  );
}
