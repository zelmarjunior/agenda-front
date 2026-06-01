'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Pagination } from '@/components/common/Pagination';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import { ClientForm } from './ClientForm';
import { ClientHistory } from './ClientHistory';
import { clientsService } from '../services/clientsService';
import { getApiError } from '@/services/api';
import { useClients } from '../hooks/useClients';
import { storage } from '@/utils/storage';
import { formatPhone } from '@/utils/formatters';
import type { Client } from '@/types/clients.types';

const LIMIT = 20;

export function ClientList(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const { clients, total, page, setPage, search, setSearch, isLoading, error, mutate } =
    useClients();

  const [modal, setModal] = useState<'create' | 'edit' | 'history' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openEdit(c: Client): void {
    setSelected(c);
    setModal('edit');
  }

  function openHistory(c: Client): void {
    setSelected(c);
    setModal('history');
  }

  function openDelete(c: Client): void {
    setSelected(c);
    setModal('delete');
  }

  function closeModal(): void {
    setModal(null);
    setSelected(null);
  }

  async function handleDelete(): Promise<void> {
    if (!selected) return;
    setDeleting(true);
    try {
      await clientsService.delete(businessId, selected.id);
      toast('Cliente excluído.', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function handleCreate(values: {
    name: string;
    nickname?: string;
    phone?: string;
    email?: string;
    cpf?: string;
    birthDate?: string;
  }): Promise<void> {
    try {
      await clientsService.create(businessId, {
        name: values.name,
        nickname: values.nickname || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        cpf: values.cpf || undefined,
        birthDate: values.birthDate || undefined,
      });
      toast('Cliente cadastrado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleEdit(values: {
    name: string;
    nickname?: string;
    phone?: string;
    email?: string;
    cpf?: string;
    birthDate?: string;
  }): Promise<void> {
    if (!selected) return;
    try {
      await clientsService.update(businessId, selected.id, {
        name: values.name,
        nickname: values.nickname || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        cpf: values.cpf || undefined,
        birthDate: values.birthDate || undefined,
      });
      toast('Cliente atualizado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="search"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="ocean-input px-4 py-2 text-sm text-ocean-on-surface placeholder:text-ocean-outline w-64"
        />
        <div className="ml-auto">
          <Button size="sm" onClick={() => setModal('create')}>
            + Novo cliente
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => mutate()} />
      ) : clients.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description={search ? 'Tente outro termo de busca.' : 'Cadastre seu primeiro cliente.'}
          action={
            !search ? (
              <Button size="sm" onClick={() => setModal('create')}>
                + Novo cliente
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ocean-surface-container-low/50 border-b border-ocean-outline-variant/25">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-outline-variant/15">
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-ocean-surface-container-low/40 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-ocean-on-surface">{c.name}</td>
                  <td className="px-4 py-3 text-ocean-on-surface-variant">
                    {c.phone ? formatPhone(c.phone) : '—'}
                  </td>
                  <td className="px-4 py-3 text-ocean-on-surface-variant">{c.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openHistory(c)}>
                        Histórico
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => openDelete(c)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
        </div>
      )}

      <Modal open={modal === 'create'} onClose={closeModal} title="Novo cliente">
        <ClientForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar cliente">
        {selected && <ClientForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} />}
      </Modal>

      <Modal
        open={modal === 'history'}
        onClose={closeModal}
        title={`Histórico — ${selected?.name ?? ''}`}
        size="lg"
      >
        {selected && <ClientHistory client={selected} />}
      </Modal>

      <ConfirmModal
        open={modal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir cliente"
        message={`Tem certeza que deseja excluir "${selected?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </>
  );
}
