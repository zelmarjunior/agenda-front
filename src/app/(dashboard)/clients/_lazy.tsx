'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const ClientList = dynamic(
  () => import('@/modules/clients/components/ClientList').then((m) => m.ClientList),
  {
    loading: () => (
      <div className="py-16">
        <Spinner />
      </div>
    ),
    ssr: false,
  },
);

export default function LazyClientList(): JSX.Element {
  return <ClientList />;
}
