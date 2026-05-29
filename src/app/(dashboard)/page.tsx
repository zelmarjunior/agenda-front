import type { Metadata } from 'next';
import { DashboardContent } from './DashboardContent';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage(): JSX.Element {
  return <DashboardContent />;
}
