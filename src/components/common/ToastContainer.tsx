'use client';

import { useToast, type ToastType } from '@/context/ToastContext';

const STYLES: Record<ToastType, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-600 text-white',
};

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'i',
};

export function ToastContainer(): JSX.Element {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return <></>;

  return (
    <div
      aria-live="polite"
      aria-label="Notificações"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium min-w-64 max-w-sm ${STYLES[t.type]}`}
        >
          <span aria-hidden="true" className="flex-shrink-0 font-bold">
            {ICONS[t.type]}
          </span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Fechar notificação"
            className="flex-shrink-0 opacity-75 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
