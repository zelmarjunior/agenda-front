'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

export function SWRProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 10_000,
        errorRetryCount: 2,
        errorRetryInterval: 5_000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
