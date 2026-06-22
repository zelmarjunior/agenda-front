'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import { Button } from '@/components/common/Button';
import { professionalsService } from '@/modules/professionals/services/professionalsService';
import { clientsService } from '@/modules/clients/services/clientsService';
import { servicesService } from '@/modules/services/services/servicesService';
import { storage } from '@/utils/storage';
import { decodeToken } from '@/utils/jwt';
import { useBusiness } from '@/modules/business/hooks/useBusiness';
import { generateTimeSlots, toDateStr, formatDayFull } from '@/utils/calendar';
import { getApiError } from '@/services/api';
import { getWaTemplate, buildWaMessage, buildWaUrl } from '@/utils/whatsapp';
import { useToast } from '@/context/ToastContext';
import type { Appointment } from '@/types/appointments.types';
import type { Client } from '@/types/clients.types';

const ALL_TIME_SLOTS = generateTimeSlots();

const PAYMENT_METHODS = [
  { value: '', label: 'Meio de pagamento (opcional)' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'PIX', label: 'Pix' },
  { value: 'CREDIT', label: 'Cartão de crédito' },
  { value: 'DEBIT', label: 'Cartão de débito' },
  { value: 'OTHER', label: 'Outro' },
];

const schema = z.object({
  clientId: z.string().min(1, 'Selecione ou crie uma cliente'),
  professionalId: z.string().min(1, 'Selecione um profissional'),
  serviceId: z.string().min(1, 'Selecione um serviço'),
  date: z.string().min(1, 'Informe a data'),
  time: z.string().min(1, 'Informe o horário'),
  finalPrice: z.string().min(1, 'Informe o valor'),
  paymentMethod: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AppointmentFormProps {
  initial?: Appointment;
  prefilledDatetime?: string;
  onSubmit: (scheduledAt: string, values: Omit<FormValues, 'date' | 'time'>) => Promise<void>;
  onCancel: () => void;
  onOpenRecurring?: (clientId: string) => void;
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
  onOpenRecurring,
}: AppointmentFormProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const business = useBusiness();
  const soloMode = business?.soloMode ?? storage.getSoloMode();

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
      finalPrice: initial?.finalPrice != null
        ? String(Number(initial.finalPrice).toFixed(2))
        : initial?.service?.price != null
          ? String(Number(initial.service.price).toFixed(2))
          : '',
      paymentMethod: initial?.paymentMethod ?? '',
    },
  });

  const [extraClients, setExtraClients] = useState<Client[]>([]);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [clientSearchResults, setClientSearchResults] = useState<Client[]>([]);
  const [selectedClientObj, setSelectedClientObj] = useState<Client | null>(initial?.client ?? null);
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const clientSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [serviceSearch, setServiceSearch] = useState(initial?.service?.name ?? '');
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const doClientSearch = useCallback(async (query: string) => {
    try {
      const result = await clientsService.list(businessId, {
        limit: 30,
        search: query || undefined,
      });
      setClientSearchResults(result.data);
    } catch { /* silent */ }
  }, [businessId]);

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

  // ── Close dropdowns on outside click ─────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target as Node)) {
        setClientDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Sync search text when editing an existing appointment ────────────────
  useEffect(() => {
    if (initial?.client) {
      setClientSearch(initial.client.name);
      setSelectedClientObj(initial.client);
    }
    if (initial?.service) {
      setServiceSearch(initial.service.name);
    }
  }, [initial]);

  // ── Server-side search debounced ──────────────────────────────────────────
  useEffect(() => {
    if (!clientDropdownOpen) return;
    if (clientSearchTimerRef.current) clearTimeout(clientSearchTimerRef.current);
    clientSearchTimerRef.current = setTimeout(() => {
      doClientSearch(clientSearch);
    }, 300);
    return () => {
      if (clientSearchTimerRef.current) clearTimeout(clientSearchTimerRef.current);
    };
  }, [clientSearch, clientDropdownOpen, doClientSearch]);

  // ── Load initial results when dropdown opens ──────────────────────────────
  useEffect(() => {
    if (clientDropdownOpen && clientSearchResults.length === 0) {
      doClientSearch(clientSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDropdownOpen]);

  // ── Auto-select logged-in professional ────────────────────────────────────

  useEffect(() => {
    if (!profData?.data || initial) return;
    const mine = profData.data.find((p) => p.userId === currentUserId);
    if (mine) {
      setValue('professionalId', mine.id, { shouldValidate: false });
    } else if (soloMode && profData.data.length > 0) {
      setValue('professionalId', profData.data[0].id, { shouldValidate: false });
    }
  }, [profData?.data, currentUserId, soloMode, initial, setValue]);

  // ── Reset time when slot-affecting fields change ──────────────────────────

  useEffect(() => {
    if (!initial) setValue('time', defaultTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalId, serviceId, date]);

  // ── Auto-fill price when service changes ─────────────────────────────────

  useEffect(() => {
    if (initial) return;
    const svc = svcData?.data.find((s) => s.id === serviceId);
    if (svc) setValue('finalPrice', String(Number(svc.price).toFixed(2)));
  }, [serviceId, svcData, initial, setValue]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const allClients = [
    ...clientSearchResults,
    ...extraClients.filter((e) => !clientSearchResults.some((c) => c.id === e.id)),
  ];

  const filteredClients = allClients;

  const filteredServices = (svcData?.data ?? []).filter(
    (s) => !serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase()),
  );

  // Build available time options
  const availableTimeSlots: string[] = (() => {
    if (!canFetchSlots || !slotsData) return ALL_TIME_SLOTS;
    return slotsData.map((s) => {
      const d = new Date(s);
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
      setSelectedClientObj(created);
      setShowNewClient(false);
      setNewName('');
      setNewPhone('');
      doClientSearch(clientSearch);
      // Set value after state update so the new option is already in the DOM
      setTimeout(() => setValue('clientId', created.id, { shouldValidate: true }), 0);
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
      finalPrice: values.finalPrice,
      paymentMethod: values.paymentMethod || undefined,
    });
  }

  function onInvalid(errs: FieldErrors<FormValues>): void {
    const labels: Partial<Record<keyof FormValues, string>> = {
      clientId: 'Cliente',
      professionalId: 'Profissional',
      serviceId: 'Serviço',
      date: 'Data',
      time: 'Horário',
      finalPrice: 'Valor',
    };
    const missing = (Object.keys(errs) as (keyof FormValues)[])
      .map((k) => labels[k])
      .filter(Boolean) as string[];
    toast(
      missing.length > 0
        ? `Campos obrigatórios: ${missing.join(', ')}`
        : 'Preencha todos os campos obrigatórios.',
      'error',
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onInvalid)} noValidate className="space-y-5">
      {/* ── Client (searchable combobox) ───────────────────────────────────── */}
      <div>
        <label className={labelCls}>Cliente</label>
        <div className="relative" ref={clientDropdownRef}>
          <input
            type="text"
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value);
              setClientDropdownOpen(true);
              if (!e.target.value) setValue('clientId', '', { shouldValidate: false });
            }}
            onFocus={() => setClientDropdownOpen(true)}
            placeholder="Buscar cliente..."
            className={inputCls}
            autoComplete="off"
            aria-invalid={!!errors.clientId}
          />
          {clientDropdownOpen && (
            <ul className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              {filteredClients.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-400">Nenhuma cliente encontrada</li>
              ) : (
                filteredClients.map((c) => (
                  <li
                    key={c.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setValue('clientId', c.id, { shouldValidate: true });
                      setClientSearch(c.name);
                      setClientDropdownOpen(false);
                      setSelectedClientObj(c);
                    }}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                  >
                    <span className="font-medium text-gray-900">{c.name}</span>
                    {c.phone && <span className="text-xs text-gray-400 ml-2">{c.phone}</span>}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        {errors.clientId && (
          <p role="alert" className="mt-1 text-xs text-red-500">
            {errors.clientId.message}
          </p>
        )}

        {/* WhatsApp link — only for future appointments where client has phone */}
        {(() => {
          const selectedClient = selectedClientObj;
          const selectedDate = watch('date');
          const selectedTime = watch('time');
          const isFuture = selectedDate && selectedTime
            ? new Date(`${selectedDate}T${selectedTime}:00`) > new Date()
            : false;
          if (!selectedClient?.phone || !isFuture) return null;
          const template = getWaTemplate(businessId);
          const svc = svcData?.data.find((s) => s.id === watch('serviceId'));
          const prof = (profData?.data ?? []).find((p) => p.id === watch('professionalId'));
          const message = buildWaMessage(template, {
            nome: selectedClient.name,
            apelido: selectedClient.name.split(' ')[0],
            horario: selectedTime,
            data: formatDayFull(selectedDate),
            servico: svc?.name ?? '',
            profissional: prof?.name ?? '',
          });
          const waUrl = buildWaUrl(selectedClient.phone, message);
          return (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar mensagem no WhatsApp
            </a>
          );
        })()}

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

      {/* ── Professional (oculto em modo solo — auto-selecionado pelo useEffect) */}
      {!soloMode && (
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
      )}

      {/* ── Service (searchable combobox) ─────────────────────────────────── */}
      <div>
        <label className={labelCls}>Serviço</label>
        <div className="relative" ref={serviceDropdownRef}>
          <input
            type="text"
            value={serviceSearch}
            onChange={(e) => {
              setServiceSearch(e.target.value);
              setServiceDropdownOpen(true);
              if (!e.target.value) setValue('serviceId', '', { shouldValidate: false });
            }}
            onFocus={() => setServiceDropdownOpen(true)}
            placeholder="Buscar serviço..."
            className={inputCls}
            autoComplete="off"
            aria-invalid={!!errors.serviceId}
          />
          {serviceDropdownOpen && (
            <ul className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              {filteredServices.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-400">Nenhum serviço encontrado</li>
              ) : (
                filteredServices.map((s) => (
                  <li
                    key={s.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setValue('serviceId', s.id, { shouldValidate: true });
                      setServiceSearch(s.name);
                      setServiceDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                  >
                    <span className="font-medium text-gray-900">{s.name}</span>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">
                      {s.durationMinutes}min · R$ {Number(s.price).toFixed(2).replace('.', ',')}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        {errors.serviceId && (
          <p role="alert" className="mt-1 text-xs text-red-500">
            {errors.serviceId.message}
          </p>
        )}
      </div>

      {/* ── Date + Time ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <input
            id="time"
            type="time"
            {...register('time')}
            className={`${inputCls} ${slotsStatus === 'empty' ? 'border-amber-300 bg-amber-50/50' : ''}`}
            aria-invalid={!!errors.time}
            disabled={loadingSlots}
          />
          {slotsStatus === 'empty' && (
            <p className="mt-1 text-[10px] text-amber-600 font-medium">
              Sem disponibilidade — confirme o horário manualmente
            </p>
          )}
          {slotsStatus === 'ok' && availableTimeSlots.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {availableTimeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue('time', t, { shouldValidate: true });
                  }}
                  className={`rounded-lg border px-2 py-0.5 text-xs font-medium transition-colors ${
                    watch('time') === t
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {errors.time && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Price ──────────────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="finalPrice" className={labelCls}>
          Valor do atendimento (R$)
        </label>
        <input
          id="finalPrice"
          type="number"
          step="0.01"
          min="0"
          {...register('finalPrice')}
          className={inputCls}
          placeholder="0,00"
          aria-invalid={!!errors.finalPrice}
        />
        {errors.finalPrice && (
          <p role="alert" className="mt-1 text-xs text-red-500">
            {errors.finalPrice.message}
          </p>
        )}
      </div>

      {/* ── Payment Method ─────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="paymentMethod" className={labelCls}>
          Meio de pagamento
        </label>
        <select
          id="paymentMethod"
          {...register('paymentMethod')}
          className={inputCls}
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        {onOpenRecurring ? (
          <button
            type="button"
            onClick={() => {
              const clientId = watch('clientId');
              if (clientId) onOpenRecurring(clientId);
            }}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors focus:outline-none"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Agendamento recorrente
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" loading={isSubmitting}>
            {initial ? 'Reagendar' : 'Confirmar agendamento'}
          </Button>
        </div>
      </div>
    </form>
  );
}
