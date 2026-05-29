import type { Metadata } from 'next';
import { ReportsContent } from './ReportsContent';

export const metadata: Metadata = { title: 'Relatórios' };

export default function ReportsPage(): JSX.Element {
  return <ReportsContent />;
}
