import type { Metadata } from 'next';
import LazyPage from './_lazy';

export const metadata: Metadata = { title: 'Agendamentos' };

export default function AppointmentsPage(): JSX.Element {
  return <LazyPage />;
}
