'use client';

import { ClientStatsPanel } from './ClientStatsPanel';
import { ClientList } from './ClientList';

export function ClientsContent(): JSX.Element {
  return (
    <>
      <ClientStatsPanel />
      <ClientList />
    </>
  );
}
