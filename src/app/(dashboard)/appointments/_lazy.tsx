'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const AppointmentListPage = dynamic(
  () =>
    import('@/modules/appointments/components/AppointmentListPage').then(
      (m) => m.AppointmentListPage,
    ),
  {
    loading: () => (
      <div className="py-16">
        <Spinner />
      </div>
    ),
    ssr: false,
  },
);

export default function LazyPage(): JSX.Element {
  return <AppointmentListPage />;
}
