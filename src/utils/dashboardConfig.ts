export interface DashboardWidgets {
  schedule: boolean;
  pendingPayments: boolean;
  heatmap: boolean;
  lowStock: boolean;
}

const DEFAULT: DashboardWidgets = {
  schedule: true,
  pendingPayments: true,
  heatmap: true,
  lowStock: true,
};

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

export const WIDGET_LABELS: Record<keyof DashboardWidgets, string> = {
  schedule: 'Agenda de hoje',
  pendingPayments: 'Pagamentos pendentes',
  heatmap: 'Mapa de calor',
  lowStock: 'Alertas de estoque',
};
