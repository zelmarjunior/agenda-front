'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { AppointmentStatusBadge } from '@/modules/appointments/components/AppointmentStatusBadge';
import { clientsService } from '../services/clientsService';
import { storage } from '@/utils/storage';
import { formatDateTime, formatPhone } from '@/utils/formatters';

interface ClientProfileModalProps {
  clientId: string | null;
  onClose: () => void;
}

export function ClientProfileModal({ clientId, onClose }: ClientProfileModalProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [historyPage, setHistoryPage] = useState(1);
  const [notes, setNotes] = useState('');
  const [notesClientId, setNotesClientId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  /* Full client data (includes notes) */
  const { data: client, isLoading: loadingClient } = useSWR(
    clientId ? ['client', businessId, clientId] : null,
    () => clientsService.get(businessId, clientId!),
  );

  /* Appointment history */
  const { data: historyData, isLoading: loadingHistory } = useSWR(
    clientId ? ['client-history', businessId, clientId, historyPage] : null,
    () => clientsService.appointments(businessId, clientId!, historyPage),
  );

  /* Sync notes when a different client is loaded (derived state during render) */
  if (client && client.id !== notesClientId) {
    setNotesClientId(client.id);
    setNotes(client.notes ?? '');
  }

  const handleSaveNotes = useCallback(async (): Promise<void> => {
    if (!client) return;
    setSaveStatus('saving');
    try {
      await clientsService.update(businessId, client.id, {
        name: client.name,
        phone: client.phone ?? undefined,
        email: client.email ?? undefined,
        notes: notes.trim() || undefined,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  }, [businessId, client, notes]);

  const appointments = historyData?.data ?? [];
  const total = historyData?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <Modal open={!!clientId} onClose={onClose} title="Perfil do cliente" size="lg">
      {loadingClient ? (
        <div className="py-12 flex justify-center">
          <Spinner />
        </div>
      ) : !client ? (
        <p className="text-sm text-ocean-secondary text-center py-8">Cliente não encontrado.</p>
      ) : (
        <div className="space-y-6">
          {/* Client info */}
          <div
            className="rounded-2xl p-4 flex items-start gap-4"
            style={{
              background: 'rgba(14,165,233,0.06)',
              border: '1px solid rgba(14,165,233,0.15)',
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #006591)' }}
            >
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-ocean-on-surface truncate">{client.name}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                {client.phone && (
                  <span className="text-xs text-ocean-secondary flex items-center gap-1">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {formatPhone(client.phone)}
                  </span>
                )}
                {client.email && (
                  <span className="text-xs text-ocean-secondary flex items-center gap-1">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {client.email}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ocean-outline mt-1">
                Cliente desde{' '}
                {new Date(client.createdAt).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xl font-bold text-ocean-primary">{total}</p>
              <p className="text-[10px] text-ocean-secondary uppercase tracking-wide">
                atendimentos
              </p>
            </div>
          </div>

          {/* Observations / notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="client-notes" className="text-sm font-semibold text-ocean-on-surface">
                Observações
              </label>
              {saveStatus !== 'idle' && (
                <span
                  className={`text-xs font-medium ${saveStatus === 'saved' ? 'text-ocean-tertiary' : saveStatus === 'error' ? 'text-ocean-error' : 'text-ocean-secondary'}`}
                >
                  {saveStatus === 'saving' && 'Salvando...'}
                  {saveStatus === 'saved' && '✓ Salvo'}
                  {saveStatus === 'error' && 'Erro ao salvar'}
                </span>
              )}
            </div>
            <textarea
              id="client-notes"
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setSaveStatus('idle');
              }}
              onBlur={handleSaveNotes}
              className="ocean-input w-full px-4 py-2.5 text-sm text-ocean-on-surface placeholder:text-ocean-outline resize-none"
              placeholder="Preferências, alergias, observações importantes sobre este cliente..."
            />
            <p className="mt-1 text-xs text-ocean-outline">
              Salvo automaticamente ao sair do campo.
            </p>
          </div>

          {/* Appointment history */}
          <div>
            <h4 className="text-sm font-semibold text-ocean-on-surface mb-3">
              Histórico de atendimentos
            </h4>

            {loadingHistory ? (
              <div className="py-6 flex justify-center">
                <Spinner />
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-ocean-secondary text-center py-6">
                Nenhum atendimento registrado.
              </p>
            ) : (
              <>
                <ul className="divide-y divide-ocean-outline-variant/20 max-h-64 overflow-y-auto -mx-1 px-1">
                  {appointments.map((appt) => (
                    <li key={appt.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ocean-on-surface truncate">
                          {appt.service?.name ?? '—'}
                        </p>
                        <p className="text-xs text-ocean-secondary mt-0.5">
                          {appt.professional?.name ?? '—'} · {formatDateTime(appt.scheduledAt)}
                        </p>
                        {appt.cancellationReason && (
                          <p className="text-xs text-ocean-error mt-0.5">
                            Motivo: {appt.cancellationReason}
                          </p>
                        )}
                      </div>
                      <AppointmentStatusBadge status={appt.status} />
                    </li>
                  ))}
                </ul>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 text-xs text-ocean-secondary">
                    <button
                      disabled={historyPage <= 1}
                      onClick={() => setHistoryPage((p) => p - 1)}
                      className="px-3 py-1.5 rounded-xl glass-card disabled:opacity-40 hover:bg-ocean-surface-container transition-colors focus:outline-none"
                    >
                      ← Anterior
                    </button>
                    <span>
                      Página {historyPage} de {totalPages}
                    </span>
                    <button
                      disabled={historyPage >= totalPages}
                      onClick={() => setHistoryPage((p) => p + 1)}
                      className="px-3 py-1.5 rounded-xl glass-card disabled:opacity-40 hover:bg-ocean-surface-container transition-colors focus:outline-none"
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
