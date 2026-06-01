'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const ClientsContent = dynamic(
  () => import('@/modules/clients/components/ClientsContent').then((m) => m.ClientsContent),
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
  return <ClientsContent />;
}
