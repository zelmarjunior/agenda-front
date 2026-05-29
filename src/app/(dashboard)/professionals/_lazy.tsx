'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const ProfessionalList = dynamic(
  () =>
    import('@/modules/professionals/components/ProfessionalList').then((m) => m.ProfessionalList),
  {
    loading: () => (
      <div className="py-16">
        <Spinner />
      </div>
    ),
    ssr: false,
  },
);

export default function LazyProfessionalList(): JSX.Element {
  return <ProfessionalList />;
}
