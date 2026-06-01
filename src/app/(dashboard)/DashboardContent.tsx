'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { AppointmentDashboardModal } from '@/modules/appointments/components/AppointmentDashboardModal';
import { UpcomingAppointmentsPanel } from '@/modules/appointments/components/UpcomingAppointmentsPanel';
import { useAppointments } from '@/modules/appointments/hooks/useAppointments';
import { useProfessionals } from '@/modules/professionals/hooks/useProfessionals';
import { useClients } from '@/modules/clients/hooks/useClients';
import { PendingPaymentsPanel } from '@/modules/reports/components/PendingPaymentsPanel';
import { HeatmapPanel } from '@/modules/reports/components/HeatmapPanel';
import { inventoryService } from '@/modules/inventory/services/inventoryService';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { getDashboardWidgets, DEFAULT_WIDGETS, type DashboardWidgets } from '@/utils/dashboardConfig';
import { storage } from '@/utils/storage';
import { buildWaUrl, buildWaMessage, getWaTemplate } from '@/utils/whatsapp';
import type { Appointment, AppointmentStatus } from '@/types/appointments.types';

const STATUS_BADGE: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  CONFIRMED: { label: 'Confirmado', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'danger' },
  COMPLETED: { label: 'Atendido', variant: 'info' },
  NO_SHOW: { label: 'Não Atendido', variant: 'danger' },
};

interface StatCard {
  label: string;
  value: string | number;
  icon: JSX.Element;
  iconBg: string;
  iconColor: string;
}

export function DashboardContent(): JSX.Element {
  const businessId = storage.getBusinessId()!;

  // Inicia com DEFAULT para que SSR e hydration inicial sejam idênticos,
  // depois carrega do localStorage apenas no cliente.
  const [widgets, setWidgets] = useState<DashboardWidgets>(DEFAULT_WIDGETS);
  useEffect(() => {
    setWidgets(getDashboardWidgets(businessId));
  }, [businessId]);

  const today = new Date().toISOString().split('T')[0];
  const { appointments: todayAppts, isLoading: loadingAppts, mutate } = useAppointments({
    date: today,
    limit: 8,
  });

  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const { professionals, isLoading: loadingProfs } = useProfessionals();
  const { total: totalClients, isLoading: loadingClients } = useClients();

  const { data: lowStockProducts } = useSWR(
    widgets.lowStock ? ['low-stock', businessId] : null,
    () => inventoryService.getLowStock(businessId),
    { refreshInterval: 5 * 60 * 1000 },
  );

  const pendingCount = todayAppts.filter((a) => a.status === 'PENDING').length;
  const confirmedCount = todayAppts.filter((a) => a.status === 'CONFIRMED').length;

  const stats: StatCard[] = [
    {
      label: 'Agendamentos hoje',
      value: loadingAppts ? '—' : todayAppts.length,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      iconBg: 'rgba(14,165,233,0.12)',
      iconColor: '#0ea5e9',
    },
    {
      label: 'Pendentes',
      value: loadingAppts ? '—' : pendingCount,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: 'rgba(245,158,11,0.12)',
      iconColor: '#d97706',
    },
    {
      label: 'Confirmados',
      value: loadingAppts ? '—' : confirmedCount,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: 'rgba(0,99,153,0.12)',
      iconColor: '#006399',
    },
    {
      label: 'Profissionais',
      value: loadingProfs ? '—' : professionals.length,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      iconBg: 'rgba(0,101,145,0.12)',
      iconColor: '#006591',
    },
    {
      label: 'Clientes',
      value: loadingClients ? '—' : (totalClients ?? 0),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      iconBg: 'rgba(87,96,101,0.10)',
      iconColor: '#576065',
    },
  ];

  return (
    <div>
      <Header title={`Bom dia! ${formatDate(new Date())}`} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col gap-2"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: s.iconBg, color: s.iconColor }}
            >
              {s.icon}
            </div>
            <p className="text-xs font-medium text-ocean-on-surface-variant leading-tight">
              {s.label}
            </p>
            <p className="text-2xl font-bold text-ocean-on-surface leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {widgets.lowStock && lowStockProducts && lowStockProducts.length > 0 && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-700 mb-1.5">
              Estoque baixo — {lowStockProducts.length} produto{lowStockProducts.length !== 1 ? 's' : ''} precisam de reposição
            </p>
            <div className="flex flex-wrap gap-1.5">
              {lowStockProducts.map((p) => (
                <span key={p.id} className="rounded-full bg-red-100 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  {p.name} — {p.currentStock} {p.unit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports panels */}
      {(widgets.pendingPayments || widgets.heatmap) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {widgets.pendingPayments && <PendingPaymentsPanel />}
          {widgets.heatmap && <HeatmapPanel />}
        </div>
      )}

      {/* Today's schedule */}
      {widgets.schedule && <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-ocean-outline-variant/30 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ocean-on-surface">Agenda de hoje</h2>
          <span className="text-xs font-medium text-ocean-secondary">{formatDate(new Date())}</span>
        </div>

        {loadingAppts ? (
          <div className="py-12 flex justify-center">
            <Spinner />
          </div>
        ) : todayAppts.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2">
            <svg
              className="h-10 w-10 text-ocean-outline-variant"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-ocean-secondary">Nenhum agendamento para hoje.</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-ocean-outline-variant/20">
            {todayAppts.map((appt) => {
              const status = STATUS_BADGE[appt.status];
              return (
                <li
                  key={appt.id}
                  onClick={() => setEditTarget(appt)}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-ocean-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ocean-on-surface truncate">
                      {appt.client.name}
                    </p>
                    <p className="text-xs text-ocean-secondary mt-0.5">
                      {appt.service.name} · {appt.professional.name} ·{' '}
                      {formatDateTime(appt.scheduledAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {appt.client.phone && (() => {
                      const template = getWaTemplate(businessId);
                      const scheduled = new Date(appt.scheduledAt);
                      const apelido = (appt.client as any).nickname ?? appt.client.name.split(' ')[0];
                      const msg = buildWaMessage(template, {
                        nome: appt.client.name,
                        apelido,
                        horario: scheduled.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        data: scheduled.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
                        servico: appt.service.name,
                        profissional: appt.professional.name,
                      });
                      return (
                        <a
                          href={buildWaUrl(appt.client.phone, msg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Enviar WhatsApp"
                          className="text-green-500 hover:text-green-600 transition-colors"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                      );
                    })()}
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>}

      {widgets.upcomingAppointments && (
        <div className="mt-6">
          <UpcomingAppointmentsPanel daysCount={widgets.upcomingDaysCount} />
        </div>
      )}

      <AppointmentDashboardModal
        appointment={editTarget}
        onClose={() => setEditTarget(null)}
        onMutate={mutate}
      />
    </div>
  );
}
