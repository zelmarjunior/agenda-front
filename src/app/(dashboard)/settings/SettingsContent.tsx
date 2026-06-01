'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/common/Spinner';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import { businessService } from '@/modules/business/services/businessService';
import { getApiError } from '@/services/api';
import { storage } from '@/utils/storage';
import {
  getWaTemplate,
  saveWaTemplate,
  buildWaMessage,
  buildWaUrl,
  DEFAULT_WA_TEMPLATE,
  WA_VARIABLES,
} from '@/utils/whatsapp';
import {
  getDashboardWidgets,
  saveDashboardWidgets,
  WIDGET_LABELS,
  type DashboardWidgets,
  type BoolWidgetKey,
} from '@/utils/dashboardConfig';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  address: z.string().optional(),
  phone: z.string().optional(),
  allowSelfScheduling: z.boolean(),
  soloMode: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
type Tab = 'geral' | 'whatsapp' | 'dashboard';

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const PREVIEW_VARS = {
  nome: 'Ana Paula Silva',
  apelido: 'Ana',
  horario: '14:30',
  data: 'segunda, 2 de junho',
  servico: 'Corte + Escova',
  profissional: 'Mariana',
};

export function SettingsContent(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('geral');

  const {
    data: business,
    isLoading,
    error,
    mutate,
  } = useSWR(businessId ? ['business', businessId] : null, () => businessService.get(businessId));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', address: '', phone: '', allowSelfScheduling: false, soloMode: false },
  });

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        address: business.address ?? '',
        phone: business.phone ?? '',
        allowSelfScheduling: business.allowSelfScheduling,
        soloMode: business.soloMode,
      });
    }
  }, [business, reset]);

  async function onSubmit(values: FormValues): Promise<void> {
    try {
      await businessService.update(businessId, {
        name: values.name,
        address: values.address || undefined,
        phone: values.phone || undefined,
        allowSelfScheduling: values.allowSelfScheduling,
        soloMode: values.soloMode,
      });
      storage.setSoloMode(values.soloMode);
      toast('Configurações salvas!', 'success');
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  // ── WhatsApp template state ───────────────────────────────────────────────
  const [waTemplate, setWaTemplate] = useState(() => getWaTemplate(businessId));
  const [dashWidgets, setDashWidgets] = useState<DashboardWidgets>(() => getDashboardWidgets(businessId));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertVariable(varLabel: string): void {
    const ta = textareaRef.current;
    if (!ta) {
      setWaTemplate((t) => t + varLabel);
      return;
    }
    const start = ta.selectionStart ?? waTemplate.length;
    const end = ta.selectionEnd ?? waTemplate.length;
    const next = waTemplate.slice(0, start) + varLabel + waTemplate.slice(end);
    setWaTemplate(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + varLabel.length, start + varLabel.length);
    });
  }

  function saveTemplate(): void {
    saveWaTemplate(businessId, waTemplate);
    toast('Template salvo!', 'success');
  }

  function resetTemplate(): void {
    setWaTemplate(DEFAULT_WA_TEMPLATE);
  }

  const previewMessage = buildWaMessage(waTemplate, PREVIEW_VARS);
  const previewUrl = business?.phone
    ? buildWaUrl(business.phone, previewMessage)
    : null;

  function toggleWidget(key: BoolWidgetKey, value: boolean): void {
    const next = { ...dashWidgets, [key]: value };
    setDashWidgets(next);
    saveDashboardWidgets(businessId, next);
  }

  function setUpcomingDays(days: number): void {
    const next = { ...dashWidgets, upcomingDaysCount: Math.max(1, Math.min(30, days)) };
    setDashWidgets(next);
    saveDashboardWidgets(businessId, next);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'geral', label: 'Geral' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <div>
      <Header title="Configurações" />

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none -mb-px border-b-2 ${
              tab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => mutate()} />
      ) : tab === 'geral' ? (
        /* ── Aba Geral ──────────────────────────────────────────────────── */
        <div className="max-w-xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
          >
            <h2 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
              Dados do negócio
            </h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do negócio
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={inputCls}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className={inputCls}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className={inputCls}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">Modo solo</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Só a dona/dono atende — oculta seleção de profissional nos agendamentos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('soloMode')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-agendamento</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Permitir que clientes agendem diretamente pelo link público
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('allowSelfScheduling')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" loading={isSubmitting} disabled={!isDirty}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </div>
      ) : tab === 'dashboard' ? (
        /* ── Aba Dashboard ──────────────────────────────────────────────── */
        <div className="max-w-xl">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
              Widgets visíveis no dashboard
            </h2>
            <p className="text-xs text-gray-500">
              Escolha quais painéis aparecem na sua tela inicial. As alterações são salvas automaticamente.
            </p>
            <div className="space-y-3">
              {(Object.keys(WIDGET_LABELS) as BoolWidgetKey[]).map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{WIDGET_LABELS[key]}</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dashWidgets[key]}
                        onChange={(e) => toggleWidget(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {key === 'upcomingAppointments' && dashWidgets.upcomingAppointments && (
                    <div className="flex items-center gap-3 py-2.5 pl-3 border-b border-gray-100">
                      <p className="text-sm text-gray-600 flex-1">Quantos dias à frente mostrar</p>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={dashWidgets.upcomingDaysCount}
                        onChange={(e) => setUpcomingDays(parseInt(e.target.value) || 7)}
                        className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">dias</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Aba WhatsApp ───────────────────────────────────────────────── */
        <div className="max-w-xl space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                Mensagem de confirmação
              </h2>
              <p className="text-xs text-gray-500 mt-3">
                Essa mensagem será aberta no WhatsApp ao clicar no ícone{' '}
                <span className="text-green-600 font-medium">WhatsApp</span> nos agendamentos.
                Use as variáveis abaixo para personalizar.
              </p>
            </div>

            {/* Variable chips */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Variáveis disponíveis
              </p>
              <div className="flex flex-wrap gap-2">
                {WA_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.label)}
                    title={v.description}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Clique em uma variável para inserir no cursor. Passe o mouse para ver o significado.
              </p>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Texto da mensagem
              </label>
              <textarea
                ref={textareaRef}
                value={waTemplate}
                onChange={(e) => setWaTemplate(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono leading-relaxed"
                placeholder="Digite sua mensagem aqui..."
              />
              <p className="text-[11px] text-gray-400 mt-1">
                {waTemplate.length} caracteres
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
              <Button size="sm" onClick={saveTemplate}>
                Salvar template
              </Button>
              <button
                type="button"
                onClick={resetTemplate}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors focus:outline-none underline"
              >
                Restaurar padrão
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
              Pré-visualização
            </h3>
            <p className="text-[11px] text-gray-400">
              Exemplo com dados fictícios:
            </p>

            {/* WhatsApp bubble */}
            <div className="flex justify-end">
              <div className="max-w-xs bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-sm">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                  {previewMessage || <span className="text-gray-400 italic">Digite uma mensagem acima...</span>}
                </p>
                <p className="text-[10px] text-gray-500 text-right mt-1">14:32 ✓✓</p>
              </div>
            </div>

            {previewUrl && (
              <div className="pt-1">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Testar no WhatsApp
                </a>
                <p className="text-[11px] text-gray-400 mt-1">
                  Abre uma conversa com o número do seu negócio
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
