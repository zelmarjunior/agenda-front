type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

/* Glowsy Design System status colors */
const STYLES: Record<BadgeVariant, string> = {
  default: 'bg-ocean-surface-container text-ocean-on-surface-variant',
  success: 'bg-[#DDD0F4] text-[#5B2EA0]',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-ocean-error-container text-ocean-error',
  info:    'bg-[#A0AAFF]/20 text-[#5B6CF0]',
};

export function Badge({ variant = 'default', children }: BadgeProps): JSX.Element {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
