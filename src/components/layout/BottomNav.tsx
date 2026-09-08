'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NAV_ITEMS, useSidebarCounts } from './Sidebar';

const PRIMARY_HREFS = ['/', '/appointments'];

function MoreIcon(): JSX.Element {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

export function BottomNav(): JSX.Element {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const counts = useSidebarCounts();

  const primaryItems = NAV_ITEMS.filter((item) => PRIMARY_HREFS.includes(item.href));
  const moreItems = NAV_ITEMS.filter((item) => !PRIMARY_HREFS.includes(item.href));
  const isMoreActive = moreItems.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* Bottom bar */}
      <nav
        aria-label="Menu principal"
        style={{ backgroundColor: '#120F22', paddingBottom: 'env(safe-area-inset-bottom)' }}
        className="fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-white/10 shadow-2xl lg:hidden"
      >
        {primaryItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium focus:outline-none"
              style={{ color: isActive ? '#ffffff' : '#8B87A8' }}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.badgeKey && counts[item.badgeKey] > 0 && (
                <span
                  className="absolute top-1 right-1/2 translate-x-3 min-w-[16px] rounded-full px-1 py-0.5 text-center text-[9px] font-bold leading-none"
                  style={{
                    background:
                      item.badgeKey === 'inventory' ? '#ef4444' : 'linear-gradient(135deg, #5B6CF0, #E85FC0)',
                    color: '#fff',
                  }}
                >
                  {counts[item.badgeKey] > 99 ? '99+' : counts[item.badgeKey]}
                </span>
              )}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-label="Mais opções"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium focus:outline-none"
          style={{ color: isMoreActive ? '#ffffff' : '#8B87A8' }}
        >
          <MoreIcon />
          Mais
        </button>
      </nav>

      {/* "Mais" sheet */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMoreOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mais opções"
        style={{ backgroundColor: '#120F22' }}
        className={`fixed inset-x-0 bottom-0 z-60 rounded-t-2xl border-t border-white/10 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          moreOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>
            Mais opções
          </span>
          <button
            onClick={() => setMoreOpen(false)}
            aria-label="Fechar"
            className="p-1.5 rounded-lg focus:outline-none"
            style={{ color: '#A0AAFF' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul role="list" className="px-3 py-3 space-y-1 max-h-[65vh] overflow-y-auto">
          {moreItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMoreOpen(false)}
                  className={`ocean-sidebar-item ${isActive ? 'ocean-sidebar-item-active' : 'ocean-sidebar-item-inactive'} focus:outline-none`}
                  style={isActive ? { color: '#ffffff', borderLeftColor: '#9B5FE0' } : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badgeKey && counts[item.badgeKey] > 0 && (
                    <span
                      className="ml-auto min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold leading-none"
                      style={{
                        background:
                          item.badgeKey === 'inventory' ? '#ef4444' : 'linear-gradient(135deg, #5B6CF0, #E85FC0)',
                        color: '#fff',
                      }}
                    >
                      {counts[item.badgeKey] > 99 ? '99+' : counts[item.badgeKey]}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-1 border-t border-white/10">
          <button
            onClick={() => {
              setMoreOpen(false);
              logout();
            }}
            className="ocean-sidebar-item ocean-sidebar-item-inactive w-full focus:outline-none"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sair
          </button>
        </div>
      </div>
    </>
  );
}
