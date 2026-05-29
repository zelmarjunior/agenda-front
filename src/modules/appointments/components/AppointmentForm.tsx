'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import { Button } from '@/components/common/Button';
import { professionalsService } from '@/modules/professionals/services/professionalsService';
import { clientsService } from '@/modules/clients/services/clientsService';
import { servicesService } from '@/modules/services/services/servicesService';
import { storage } from '@/utils/storage';
import { decodeToken } from '@/utils/jwt';
import { generateTimeSlots, toDateStr } from '@/utils/calendar';
import { getApiError } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import type { Appointment } from '@/types/appointments.types';
import type { Client } from '@/types/clients.types';

const ALL_TIME_SLOTS = generateTimeSlots();

const schema = z.object({
  clientId: z.string().min(1, 'Selecione ou crie uma cliente'),
  professionalId: z.string().min(1, 'Selecione um profissional'),
  serviceId: z.string().min(1, 'Selecione um serviço'),
  date: z.string().min(1, 'Informe a data'),
  time: z.string().min(1, 'Informe o horário'),
});

type FormValues = z.infer<typeof schema>;

interface AppointmentFormProps {
  initial?: Appointment;
  prefilledDatetime?: string;
  onSubmit: (scheduledAt: string, values: Omit<FormValues, 'date' | 'time'>) => Promise<void>;
  onCancel: () => void;
}

function parseDatetime(iso?: string): { date: string; time: string } {
  if (!iso) return { date: toDateStr(new Date()), time: '09:00' };
  const d = new Date(iso);
  const date = toDateStr(d);
  const h = String(d.getHours()).padStart(2, '0');
  const m = d.getMinutes() < 30 ? '00' : '30';
  return { date, time: `${h}:${m}` };
}

const inputCls =
  'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:text-gray-400';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

export function AppointmentForm({
  initial,
  prefilledDatetime,
  onSubmit,
  onCancel,
}: AppointmentFormProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();

  const currentPayload = decodeToken(storage.getToken() ?? '');
  const currentUserId = currentPayload?.sub ?? null;
  const isCurrentUserProfessional = currentPayload?.roles?.includes('PROFESSIONAL') ?? false;

  const { date: defaultDate, time: defaultTime } = parseDatetime(
    initial?.scheduledAt ?? prefilledDatetime,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: initial?.client.id ?? '',
      professionalId: initial?.professional.id ?? '',
      serviceId: initial?.service.id ?? '',
      date: defaultDate,
      time: defaultTime,
    },
  });

  const [extraClients, setExtraClients] = useState<Client[]>([]);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: clientsData, mutate: mutateClients } = useSWR(['clients-all', businessId], () =>
    clientsService.list(businessId, { limit: 200 }),
  );

  const { data: profData } = useSWR(['professionals-all', businessId], () =>
    professionalsService.list(businessId, { limit: 100 }),
  );

  const { data: svcData } = useSWR(['services-all', businessId], () =>
    servicesService.list(businessId, { limit: 100 }),
  );

  const professionalId = watch('professionalId');
  const serviceId = watch('serviceId');
  const date = watch('date');

  const canFetchSlots = !!professionalId && !!serviceId && !!date;

  const { data: slotsData, isLoading: loadingSlots } = useSWR(
    canFetchSlots ? ['slots', businessId, professionalId, serviceId, date] : null,
    () => professionalsService.availableSlots(businessId, professionalId, date, serviceId),
    { revalidateOnFocus: false },
  );

  // ── Auto-select logged-in professional ────────────────────────────────────

  useEffect(() => {
    if (!profData?.data || !currentUserId || initial) return;
    const mine = profData.data.find((p) => p.userId === currentUserId);
    if (mine) setValue('professionalId', mine.id, { shouldValidate: false });
  }, [profData?.data, currentUserId, initial, setValue]);

  // ── Reset time when slot-affecting fields change ──────────────────────────

  useEffect(() => {
    if (!initial) setValue('time', defaultTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalId, serviceId, date]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const allClients = [
    ...(clientsData?.data ?? []),
    ...extraClients.filter((e) => !(clientsData?.data ?? []).some((c) => c.id === e.id)),
  ];

  // Build available time options
  const availableTimeSlots: string[] = (() => {
    if (!canFetchSlots || !slotsData) return ALL_TIME_SLOTS;
    return slotsData.map((s) => {
      const d = new Date(s.startTime);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    });
  })();

  const slotsStatus: 'idle' | 'loading' | 'empty' | 'ok' = !canFetchSlots
    ? 'idle'
    : loadingSlots
      ? 'loading'
      : slotsData && slotsData.length === 0
        ? 'empty'
        : 'ok';

  // ── Inline client creation ─────────────────────────────────────────────────

  async function handleCreateClient(): Promise<void> {
    if (!newName.trim()) return;
    setCreatingClient(true);
    try {
      const created = await clientsService.create(businessId, {
        name: newName.trim(),
        phone: newPhone.trim() || undefined,
      });
      setExtraClients((prev) => [...prev, created]);
      setValue('clientId', created.id, { shouldValidate: true });
      setShowNewClient(false);
      setNewName('');
      setNewPhone('');
      mutateClients();
      toast(`Cliente "${created.name}" criada!`, 'success');
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setCreatingClient(false);
    }
  }

  async function onFormSubmit(values: FormValues): Promise<void> {
    const scheduledAt = new Date(`${values.date}T${values.time}:00`).toISOString();
    await onSubmit(scheduledAt, {
      clientId: values.clientId,
      professionalId: values.professionalId,
      serviceId: values.serviceId,
    });
  }

  const selectedClientName = allClients.find((c) => c.id === watch('clientId'))?.name;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-5">
      {/* ── Client ─────────────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="clientId" className={labelCls}>
          Cliente
        </label>
        <select
          id="clientId"
          {...register('clientId')}
          className={inputCls}
          aria-invalid={!!errors.clientId}
        >
          <option value="">Selecionar cliente...</option>
          {allClients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.phone ? ` · ${c.phone}` : ''}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p role="alert" className="mt-1 text-xs text-red-500">
            {errors.clientId.message}
          </p>
        )}

        {!showNewClient ? (
          <button
            type="button"
            onClick={() => setShowNewClient(true)}
            className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors focus:outline-none focus:underline"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nova cliente
          </button>
        ) : (
          <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-2.5">
            <p className="text-xs font-semibold text-blue-700">Criar nova cliente</p>
            <div>
              <label htmlFor="newName" className="block text-xs text-gray-600 mb-1">
                Nome *
              </label>
              <input
                id="newName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome completo"
                className={`${inputCls} text-xs py-2`}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="newPhone" className="block text-xs text-gray-600 mb-1">
                Telefone
              </label>
              <input
                id="newPhone"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className={`${inputCls} text-xs py-2`}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" size="sm" loading={creatingClient} onClick={handleCreateClient}>
                Criar cliente
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setShowNewClient(false);
                  setNewName('');
                  setNewPhone('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Professional ───────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="professionalId" className={labelCls + ' mb-0'}>
            Profissional
          </label>
          {isCurrentUserProfessional && (
            <span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              Você foi pré-selecionado
            </span>
          )}
        </div>
        <select
          id="professionalId"
          {...register('professionalId')}
          className={inputCls}
          aria-invalid={!!errors.professionalId}
        >
          <option value="">Selecionar profissional...</option>
          {(profData?.data ?? []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.userId === currentUserId ? '★ ' : ''}
              {p.name}
              {p.specialty ? ` · ${p.specialty}` : ''}
            </option>
          ))}
        </select>
        {errors.professionalId && (
          <p role="alert" className="mt-1 text-xs text-red-500">
            {errors.professionalId.message}
          </p>
        )}
      </div>

      {/* ── Service ────────────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="serviceId" className={labelCls}>
          Serviço
        </label>
        <select
          id="serviceId"
          {...register('serviceId')}
          className={inputCls}
          aria-invalid={!!errors.serviceId}
        >
          <option value="">Selecionar serviço...</option>
          {(svcData?.data ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.durationMinutes}min · R$ {Number(s.price).toFixed(2).replace('.', ',')}
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p role="alert" className="mt-1 text-xs text-red-500">
            {errors.serviceId.message}
          </p>
        )}
      </div>

      {/* ── Date + Time ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="date" className={labelCls}>
            Data
          </label>
          <input
            id="date"
            type="date"
            {...register('date')}
            className={inputCls}
            aria-invalid={!!errors.date}
          />
          {errors.date && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="time" className={labelCls + ' mb-0'}>
              Horário
            </label>
            {slotsStatus === 'loading' && (
              <span className="text-[10px] text-gray-400 animate-pulse">Verificando...</span>
            )}
            {slotsStatus === 'ok' && slotsData && (
              <span className="text-[10px] text-emerald-600 font-medium">
                {slotsData.length} disponível{slotsData.length !== 1 ? 'is' : ''}
              </span>
            )}
            {slotsStatus === 'empty' && (
              <span className="text-[10px] text-red-500 font-medium">Indisponível</span>
            )}
          </div>

          {slotsStatus === 'empty' ? (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-500">
              Sem horários disponíveis
            </div>
          ) : (
            <select
              id="time"
              {...register('time')}
              className={inputCls}
              aria-invalid={!!errors.time}
              disabled={loadingSlots}
            >
              {availableTimeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          {errors.time && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Summary ────────────────────────────────────────────────────────── */}
      {selectedClientName && slotsStatus !== 'empty' && (
        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-600">
          <span className="font-semibold text-gray-800">{selectedClientName}</span> será agendada
        </div>
      )}

      <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" loading={isSubmitting} disabled={slotsStatus === 'empty'}>
          {initial ? 'Reagendar' : 'Confirmar agendamento'}
        </Button>
      </div>
    </form>
  );
}
