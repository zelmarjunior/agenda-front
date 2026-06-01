import type { Metadata } from 'next';
import { FinancialContent } from './FinancialContent';

export const metadata: Metadata = { title: 'Financeiro' };

export default function FinancialPage(): JSX.Element {
  return <FinancialContent />;
}
