'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { useAppointments } from '@/modules/appointments/hooks/useAppointments';
import { useProfessionals } from '@/modules/professionals/hooks/useProfessionals';
import { useClients } from '@/modules/clients/hooks/useClients';
import { PendingPaymentsPanel } from '@/modules/reports/components/PendingPaymentsPanel';
import { HeatmapPanel } from '@/modules/reports/components/HeatmapPanel';
import { inventoryService } from '@/modules/inventory/services/inventoryService';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { getDashboardWidgets } from '@/utils/dashboardConfig';
import { storage } from '@/utils/storage';
import type { AppointmentStatus } from '@/types/appointments.types';

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
  const widgets = useMemo(() => getDashboardWidgets(businessId), [businessId]);

  const today = new Date().toISOString().split('T')[0];
  const { appointments: todayAppts, isLoading: loadingAppts } = useAppointments({
    date: today,
    limit: 8,
  });
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
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-ocean-surface-container-low/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ocean-on-surface truncate">
                      {appt.client.name}
                    </p>
                    <p className="text-xs text-ocean-secondary mt-0.5">
                      {appt.service.name} · {appt.professional.name} ·{' '}
                      {formatDateTime(appt.scheduledAt)}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>}
    </div>
  );
}
