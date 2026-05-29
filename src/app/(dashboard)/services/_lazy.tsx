'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const ServiceList = dynamic(
  () => import('@/modules/services/components/ServiceList').then((m) => m.ServiceList),
  {
    loading: () => (
      <div className="py-16">
        <Spinner />
      </div>
    ),
    ssr: false,
  },
);

export default function LazyServiceList(): JSX.Element {
  return <ServiceList />;
}
