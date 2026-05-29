import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import LazyProductList from './_lazy';

export const metadata: Metadata = { title: 'Estoque' };

export default function InventoryPage(): JSX.Element {
  return (
    <div>
      <Header title="Estoque" />
      <LazyProductList />
    </div>
  );
}
