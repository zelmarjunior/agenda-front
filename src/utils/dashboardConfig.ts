export interface DashboardWidgets {
  schedule: boolean;
  pendingPayments: boolean;
  heatmap: boolean;
  lowStock: boolean;
  upcomingAppointments: boolean;
  upcomingDaysCount: number;
}

export type BoolWidgetKey = Exclude<keyof DashboardWidgets, 'upcomingDaysCount'>;

export const DEFAULT_WIDGETS: DashboardWidgets = {
  schedule: true,
  pendingPayments: true,
  heatmap: true,
  lowStock: true,
  upcomingAppointments: true,
  upcomingDaysCount: 7,
};

const DEFAULT = DEFAULT_WIDGETS;

const KEY_PREFIX = 'dashboard_widgets_';

export function getDashboardWidgets(businessId: string): DashboardWidgets {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(`${KEY_PREFIX}${businessId}`);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function saveDashboardWidgets(businessId: string, config: DashboardWidgets): void {
  localStorage.setItem(`${KEY_PREFIX}${businessId}`, JSON.stringify(config));
}

export const WIDGET_LABELS: Record<BoolWidgetKey, string> = {
  schedule: 'Agenda de hoje',
  pendingPayments: 'Pagamentos pendentes',
  heatmap: 'Mapa de calor',
  lowStock: 'Alertas de estoque',
  upcomingAppointments: 'Próximos agendamentos',
};
