'use client';

import { ProfessionalStatsPanel } from './ProfessionalStatsPanel';
import { ProfessionalList } from './ProfessionalList';

export function ProfessionalsContent(): JSX.Element {
  return (
    <>
      <ProfessionalStatsPanel />
      <ProfessionalList />
    </>
  );
}
