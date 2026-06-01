'use client';

import useSWR from 'swr';
import { reportsService } from '../services/reportsService';
import { storage } from '@/utils/storage';
import { formatDateTime, formatCurrency, formatPhone } from '@/utils/formatters';
import { Spinner } from '@/components/common/Spinner';

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
};

export function PendingPaymentsPanel(): JSX.Element {
  const businessId = storage.getBusinessId()!;

  const { data, isLoading } = useSWR(
    ['pending-payments', businessId],
    () => reportsService.pendingPayments(businessId),
    { refreshInterval: 5 * 60 * 1000 },
  );

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-ocean-outline-variant/25 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ocean-on-surface">Pagamentos pendentes</h2>
        {data && data.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
            {data.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 flex justify-center"><Spinner /></div>
      ) : !data?.length ? (
        <p className="py-8 text-center text-sm text-ocean-secondary">
          Nenhum pagamento pendente. ✓
        </p>
      ) : (
        <ul className="divide-y divide-ocean-outline-variant/15 max-h-64 overflow-y-auto">
          {data.map((item) => (
            <li key={item.appointmentId} className="flex items-center justify-between px-5 py-3 gap-3 hover:bg-ocean-surface-container-low/40 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ocean-on-surface truncate">{item.clientName}</p>
                <p className="text-xs text-ocean-secondary mt-0.5">
                  {item.serviceName} · {formatDateTime(item.scheduledAt)}
                </p>
                {item.clientPhone && (
                  <a
                    href={`https://wa.me/55${item.clientPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    {formatPhone(item.clientPhone)}
                  </a>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-ocean-on-surface">
                  {item.finalPrice != null ? formatCurrency(item.finalPrice) : '—'}
                </p>
                <p className="text-[10px] text-ocean-secondary mt-0.5">
                  {STATUS_LABEL[item.status] ?? item.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
