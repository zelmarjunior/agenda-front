'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SWRProvider } from '@/components/providers/SWRProvider';
import { storage } from '@/utils/storage';

export default function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    if (!storage.getToken()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <SWRProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main id="main-content" className="flex-1 overflow-y-auto min-w-0">
          <div className="max-w-7xl mx-auto px-4 pt-6 pb-24 lg:px-8 lg:pt-8 lg:pb-10">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
      <BottomNav />
    </SWRProvider>
  );
}
