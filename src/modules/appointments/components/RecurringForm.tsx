'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import { Button } from '@/components/common/Button';
import { professionalsService } from '@/modules/professionals/services/professionalsService';
import { servicesService } from '@/modules/services/services/servicesService';
import { clientsService } from '@/modules/clients/services/clientsService';
import { storage } from '@/utils/storage';
import { formatDuration, formatCurrency } from '@/utils/formatters';
import type { CreateRecurringRuleRequest, RecurringFrequency } from '@/types/appointments.types';

const FREQ_LABELS: Record<RecurringFrequency, string> = {
  WEEKLY: 'Semanal (toda semana)',
  BIWEEKLY: 'Quinzenal (a cada 2 semanas)',
  MONTHLY: 'Mensal (mesmo dia todo mês)',
  CUSTOM: 'Personalizado (semanal)',
};

const PAYMENT_METHODS = [
  { value: '', label: 'Meio de pagamento (opcional)' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'PIX', label: 'Pix' },
  { value: 'CREDIT', label: 'Cartão de crédito' },
  { value: 'DEBIT', label: 'Cartão de débito' },
];

const schema = z.object({
  clientId: z.string().min(1, 'Selecione um cliente'),
  professionalId: z.string().min(1, 'Selecione um profissional'),
  serviceId: z.string().min(1, 'Selecione um serviço'),
  startDate: z.string().min(1, 'Informe a data de início'),
  startTime: z.string().min(1, 'Informe o horário'),
  frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM']),
  occurrences: z.coerce.number().int().min(1).max(52).default(8),
  paymentMethod: z.string().optional(),
});

type FormValues = {
  clientId: string;
  professionalId: string;
  serviceId: string;
  startDate: string;
  startTime: string;
  frequency: RecurringFrequency;
  occurrences: number;
  paymentMethod?: string;
};

interface RecurringFormProps {
  onSubmit: (data: CreateRecurringRuleRequest) => Promise<void>;
  onCancel: () => void;
  initialClientId?: string;
}

const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

export function RecurringForm({ onSubmit, onCancel, initialClientId }: RecurringFormProps): JSX.Element {
  const businessId = storage.getBusinessId()!;

  const { data: clients } = useSWR(['clients-all', businessId], () => clientsService.list(businessId, { limit: 200 }));
  const { data: profs } = useSWR(['professionals-all', businessId], () => professionalsService.list(businessId, { limit: 100 }));
  const { data: svcs } = useSWR(['services-all', businessId], () => servicesService.list(businessId, { limit: 100 }));

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      clientId: initialClientId ?? '',
      frequency: 'WEEKLY',
      occurrences: 8,
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
    },
  });

  const serviceId = watch('serviceId');
  const selectedSvc = svcs?.data.find((s) => s.id === serviceId);

  async function onFormSubmit(values: FormValues): Promise<void> {
    await onSubmit({
      clientId: values.clientId,
      professionalId: values.professionalId,
      serviceId: values.serviceId,
      startDate: values.startDate,
      startTime: values.startTime,
      frequency: values.frequency,
      occurrences: values.occurrences,
      paymentMethod: values.paymentMethod || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-4">
      {/* Client */}
      <div>
        <label htmlFor="r-client" className={labelCls}>Cliente</label>
        <select id="r-client" {...register('clientId')} className={inputCls}>
          <option value="">Selecionar cliente...</option>
          {clients?.data.map((c) => (
            <option key={c.id} value={c.id}>{c.name}{c.phone ? ` · ${c.phone}` : ''}</option>
          ))}
        </select>
        {errors.clientId && <p role="alert" className="mt-1 text-xs text-red-500">{errors.clientId.message}</p>}
      </div>

      {/* Professional */}
      <div>
        <label htmlFor="r-prof" className={labelCls}>Profissional</label>
        <select id="r-prof" {...register('professionalId')} className={inputCls}>
          <option value="">Selecionar profissional...</option>
          {profs?.data.map((p) => (
            <option key={p.id} value={p.id}>{p.name}{p.specialty ? ` · ${p.specialty}` : ''}</option>
          ))}
        </select>
        {errors.professionalId && <p role="alert" className="mt-1 text-xs text-red-500">{errors.professionalId.message}</p>}
      </div>

      {/* Service */}
      <div>
        <label htmlFor="r-svc" className={labelCls}>Serviço</label>
        <select id="r-svc" {...register('serviceId')} className={inputCls}>
          <option value="">Selecionar serviço...</option>
          {svcs?.data.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {formatDuration(s.durationMinutes)} · {formatCurrency(s.price)}
            </option>
          ))}
        </select>
        {errors.serviceId && <p role="alert" className="mt-1 text-xs text-red-500">{errors.serviceId.message}</p>}
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="r-date" className={labelCls}>Data do 1º agendamento</label>
          <input id="r-date" type="date" {...register('startDate')} className={inputCls} />
          {errors.startDate && <p role="alert" className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
        </div>
        <div>
          <label htmlFor="r-time" className={labelCls}>Horário</label>
          <input id="r-time" type="time" step="1800" {...register('startTime')} className={inputCls} />
          {errors.startTime && <p role="alert" className="mt-1 text-xs text-red-500">{errors.startTime.message}</p>}
        </div>
      </div>

      {/* Frequency + Occurrences */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="r-freq" className={labelCls}>Frequência</label>
          <select id="r-freq" {...register('frequency')} className={inputCls}>
            {(Object.keys(FREQ_LABELS) as RecurringFrequency[]).map((f) => (
              <option key={f} value={f}>{FREQ_LABELS[f]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="r-occ" className={labelCls}>Nº de ocorrências (máx 52)</label>
          <input id="r-occ" type="number" min="1" max="52" {...register('occurrences')} className={inputCls} />
          {errors.occurrences && <p role="alert" className="mt-1 text-xs text-red-500">{errors.occurrences.message}</p>}
        </div>
      </div>

      {/* Payment method */}
      <div>
        <label htmlFor="r-pay" className={labelCls}>Meio de pagamento</label>
        <select id="r-pay" {...register('paymentMethod')} className={inputCls}>
          {PAYMENT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {selectedSvc && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-800">
          Serão criados até <strong>{watch('occurrences')}</strong> agendamentos de{' '}
          <strong>{formatDuration(selectedSvc.durationMinutes)}</strong> cada.
        </div>
      )}

      <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm" loading={isSubmitting}>Criar série</Button>
      </div>
    </form>
  );
}
