'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Spinner } from '@/components/common/Spinner';
import { AppointmentStatusBadge } from '@/modules/appointments/components/AppointmentStatusBadge';
import { clientsService } from '../services/clientsService';
import { storage } from '@/utils/storage';
import { formatDateTime } from '@/utils/formatters';
import type { Client } from '@/types/clients.types';

interface ClientHistoryProps {
  client: Client;
}

export function ClientHistory({ client }: ClientHistoryProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(['client-history', businessId, client.id, page], () =>
    clientsService.appointments(businessId, client.id, page),
  );

  const appointments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {total} agendamento{total !== 1 ? 's' : ''} no total
      </p>

      {isLoading ? (
        <div className="py-8">
          <Spinner />
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Nenhum agendamento encontrado.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto -mx-2">
            {appointments.map((appt) => (
              <li key={appt.id} className="px-2 py-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{appt.service.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {appt.professional.name} · {formatDateTime(appt.scheduledAt)}
                  </p>
                  {appt.cancellationReason && (
                    <p className="text-xs text-red-500 mt-0.5">Motivo: {appt.cancellationReason}</p>
                  )}
                </div>
                <AppointmentStatusBadge status={appt.status} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
