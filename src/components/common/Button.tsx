import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

/* Glowsy Design System button variants */
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'text-white shadow-sm active:scale-95',
  secondary:
    'bg-white/70 backdrop-blur-sm text-ocean-on-surface border border-ocean-outline-variant hover:bg-white hover:border-ocean-outline focus:ring-ocean-accent active:scale-95',
  danger:
    'bg-ocean-error text-white hover:bg-[#93000a] focus:ring-ocean-error shadow-sm shadow-ocean-error/20 active:scale-95',
  ghost:
    'text-ocean-secondary hover:bg-ocean-surface-container hover:text-ocean-on-surface focus:ring-ocean-accent active:scale-95',
};

/* Primary uses inline gradient — injected via style prop */
const PRIMARY_GRAD = 'linear-gradient(135deg, #5B6CF0 0%, #9B5FE0 50%, #E85FC0 100%)';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    className = '',
    style,
    ...props
  },
  ref,
) {
  const isPrimary = variant === 'primary';

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZES[size]} ${className}`}
      style={isPrimary ? { background: PRIMARY_GRAD, ...style } : style}
      {...props}
    >
      {loading && (
        <svg aria-hidden="true" className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});
