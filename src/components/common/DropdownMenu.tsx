'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

interface MenuPosition {
  top: number;
  right: number;
}

export function DropdownMenu({ items }: DropdownMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition>({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  function toggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const estimatedHeight = items.length * 36 + 10;
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const shouldOpenUp = spaceBelow < estimatedHeight && rect.top > estimatedHeight;
      setPos({
        top: shouldOpenUp ? rect.top - estimatedHeight - 4 : rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  }

  // After menu renders, measure actual height and reposition if it overflows viewport
  useLayoutEffect(() => {
    if (!open || !menuRef.current || !buttonRef.current) return;
    const menuRect = menuRef.current.getBoundingClientRect();
    const btnRect = buttonRef.current.getBoundingClientRect();
    if (menuRect.bottom > window.innerHeight - 8 && btnRect.top > menuRect.height + 8) {
      setPos({ top: btnRect.top - menuRect.height - 4, right: window.innerWidth - btnRect.right });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  // Close on scroll (fixed position would drift otherwise)
  useEffect(() => {
    if (!open) return;
    function onScroll() { setOpen(false); }
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const menu = open ? (
    <ul
      ref={menuRef}
      role="menu"
      style={{ top: pos.top, right: pos.right, position: 'fixed', zIndex: 9999 }}
      className="min-w-[160px] rounded-xl border border-ocean-outline-variant/30 bg-white shadow-xl py-1"
    >
      {items.map((item) => (
        <li key={item.label} role="menuitem">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              item.onClick();
            }}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              item.variant === 'danger'
                ? 'text-red-600 hover:bg-red-50'
                : 'text-ocean-on-surface hover:bg-ocean-surface-container-low/60'
            }`}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Mais ações"
        aria-expanded={open}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors focus:outline-none ${
          open
            ? 'bg-ocean-surface-container text-ocean-primary'
            : 'text-ocean-secondary hover:bg-ocean-surface-container-low/60 hover:text-ocean-on-surface'
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {typeof document !== 'undefined' && menu
        ? createPortal(menu, document.body)
        : null}
    </>
  );
}
