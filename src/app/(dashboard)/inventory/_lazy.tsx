'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/common/Spinner';

const ProductList = dynamic(
  () => import('@/modules/inventory/components/ProductList').then((m) => m.ProductList),
  {
    loading: () => (
      <div className="py-16">
        <Spinner />
      </div>
    ),
    ssr: false,
  },
);

export default function LazyProductList(): JSX.Element {
  return <ProductList />;
}
