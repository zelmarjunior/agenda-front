import { Badge } from '@/components/common/Badge';
import type { AppointmentStatus } from '@/types/appointments.types';

const CONFIG: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  CONFIRMED: { label: 'Confirmado', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'danger' },
  COMPLETED: { label: 'Atendido', variant: 'info' },
  NO_SHOW: { label: 'Não Atendido', variant: 'danger' },
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }): JSX.Element {
  const { label, variant } = CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
