'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps): JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    } else {
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(11,28,48,0.45)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full ${SIZES[size]} glass-card rounded-2xl flex flex-col max-h-[90vh]`}
        style={{
          boxShadow: '0 24px 64px rgba(0,101,145,0.18)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.96)',
          transition: 'transform 0.25s ease, opacity 0.25s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ocean-outline-variant/30 shrink-0">
          <h2 id="modal-title" className="text-base font-semibold text-ocean-on-surface">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-xl p-1.5 text-ocean-outline hover:text-ocean-on-surface hover:bg-ocean-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-accent"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto overflow-x-hidden flex-1">{children}</div>
      </div>
    </div>
  );
}
