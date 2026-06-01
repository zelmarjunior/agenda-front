'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { AppointmentStatusBadge } from '@/modules/appointments/components/AppointmentStatusBadge';
import { ClientAnamnesisPanel } from '@/modules/anamnesis/ClientAnamnesisPanel';
import { clientsService } from '../services/clientsService';
import { storage } from '@/utils/storage';
import { formatDateTime, formatPhone, formatCurrency } from '@/utils/formatters';

interface ClientProfileModalProps {
  clientId: string | null;
  onClose: () => void;
}

export function ClientProfileModal({ clientId, onClose }: ClientProfileModalProps): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const router = useRouter();
  const [historyPage, setHistoryPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'historico' | 'anamnese'>('historico');
  const [notes, setNotes] = useState('');
  const [notesClientId, setNotesClientId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  /* Full client data (includes notes) */
  const { data: client, isLoading: loadingClient } = useSWR(
    clientId ? ['client', businessId, clientId] : null,
    () => clientsService.get(businessId, clientId!),
  );

  /* Summary panel */
  const { data: summary } = useSWR(
    clientId ? ['client-summary', businessId, clientId] : null,
    () => clientsService.getSummary(businessId, clientId!),
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
          {/* Client info header */}
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
                  <span className="text-xs text-ocean-secondary">{formatPhone(client.phone)}</span>
                )}
                {client.email && (
                  <span className="text-xs text-ocean-secondary">{client.email}</span>
                )}
              </div>
              <p className="text-[11px] text-ocean-outline mt-1">
                Cliente desde{' '}
                {new Date(client.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            {/* Action buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              {client.phone && (
                <a
                  href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ background: '#25D366' }}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={() => { onClose(); router.push(`/appointments?newClient=${client.id}&newClientName=${encodeURIComponent(client.name)}`); }}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
                style={{ background: '#0ea5e9' }}
              >
                + Agendar
              </button>
            </div>
          </div>

          {/* Summary panel — 4 metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: 'Visitas',
                value: summary ? String(summary.totalVisits) : '—',
                color: '#0ea5e9',
              },
              {
                label: 'Total gasto',
                value: summary ? formatCurrency(summary.totalSpent) : '—',
                color: '#10b981',
              },
              {
                label: 'Último atend.',
                value: summary?.lastAppointmentDate
                  ? new Date(summary.lastAppointmentDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                  : '—',
                color: '#6366f1',
              },
              {
                label: 'Próximo',
                value: summary?.nextAppointmentDate
                  ? new Date(summary.nextAppointmentDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                  : 'Nenhum',
                sub: summary?.nextAppointmentService ?? undefined,
                color: '#f59e0b',
              },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl p-3 text-center"
                style={{ background: `${m.color}12`, border: `1px solid ${m.color}30` }}
              >
                <p className="text-lg font-bold" style={{ color: m.color }}>
                  {m.value}
                </p>
                {m.sub && <p className="text-[10px] text-ocean-secondary truncate">{m.sub}</p>}
                <p className="text-[10px] text-ocean-outline uppercase tracking-wide mt-0.5">
                  {m.label}
                </p>
              </div>
            ))}
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

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)' }}>
            {(['historico', 'anamnese'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none ${activeTab === tab ? 'bg-ocean-primary text-white' : 'text-ocean-secondary hover:text-ocean-on-surface'}`}
              >
                {tab === 'historico' ? 'Histórico' : 'Anamnese'}
              </button>
            ))}
          </div>

          {activeTab === 'anamnese' && <ClientAnamnesisPanel clientId={client.id} />}

          {/* Appointment history */}
          {activeTab === 'historico' && <div>
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
          </div>}
        </div>
      )}
    </Modal>
  );
}
