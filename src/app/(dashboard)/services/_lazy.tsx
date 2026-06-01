'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const ServicesContent = dynamic(
  () => import('@/modules/services/components/ServicesContent').then((m) => m.ServicesContent),
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
  return <ServicesContent />;
}
