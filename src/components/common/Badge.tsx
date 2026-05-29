type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

/* Ocean Design System status colors */
const STYLES: Record<BadgeVariant, string> = {
  default: 'bg-ocean-surface-container text-ocean-on-surface-variant',
  success: 'bg-[#c9e6ff] text-[#004c6e]',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-ocean-error-container text-ocean-error',
  info: 'bg-[#0ea5e9]/15 text-ocean-primary',
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
