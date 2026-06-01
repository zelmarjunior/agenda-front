'use client';

import { ServiceStatsPanel } from './ServiceStatsPanel';
import { ServiceList } from './ServiceList';

export function ServicesContent(): JSX.Element {
  return (
    <>
      <ServiceStatsPanel />
      <ServiceList />
    </>
  );
}
