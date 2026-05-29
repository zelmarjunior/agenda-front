'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/context/ToastContext';
import { ProductForm } from './ProductForm';
import { StockAdjustmentForm } from './StockAdjustmentForm';
import { inventoryService } from '../services/inventoryService';
import { getApiError } from '@/services/api';
import { useInventory } from '../hooks/useInventory';
import { storage } from '@/utils/storage';
import type { Product, ProductType } from '@/types/inventory.types';

const LIMIT = 20;

const TYPE_LABELS: Record<ProductType, string> = {
  SERVICE_USE: 'Uso em serviço',
  RETAIL: 'Varejo',
};

export function ProductList(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const { toast } = useToast();
  const {
    products,
    total,
    page,
    setPage,
    type,
    setType,
    lowStock,
    setLowStock,
    isLoading,
    error,
    mutate,
  } = useInventory();

  const [modal, setModal] = useState<'create' | 'edit' | 'adjust' | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  function openEdit(p: Product): void {
    setSelected(p);
    setModal('edit');
  }

  function openAdjust(p: Product): void {
    setSelected(p);
    setModal('adjust');
  }

  function closeModal(): void {
    setModal(null);
    setSelected(null);
  }

  async function handleCreate(values: {
    name: string;
    unit: string;
    type: ProductType;
    minimumStock: number;
  }): Promise<void> {
    try {
      await inventoryService.create(businessId, values);
      toast('Produto cadastrado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleEdit(values: {
    name: string;
    unit: string;
    type: ProductType;
    minimumStock: number;
  }): Promise<void> {
    if (!selected) return;
    try {
      await inventoryService.update(businessId, selected.id, values);
      toast('Produto atualizado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  async function handleAdjust(values: { quantityChange: number; reason: string }): Promise<void> {
    if (!selected) return;
    try {
      await inventoryService.adjustStock(businessId, selected.id, values);
      toast('Estoque ajustado!', 'success');
      closeModal();
      mutate();
    } catch (err) {
      toast(getApiError(err), 'error');
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={type ?? ''}
          onChange={(e) => {
            setType((e.target.value as ProductType) || undefined);
            setPage(1);
          }}
          className="ocean-input px-4 py-2 text-sm text-ocean-on-surface"
        >
          <option value="">Todos os tipos</option>
          <option value="SERVICE_USE">Uso em serviço</option>
          <option value="RETAIL">Varejo</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-ocean-secondary cursor-pointer hover:text-ocean-on-surface transition-colors">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => {
              setLowStock(e.target.checked);
              setPage(1);
            }}
            className="rounded border-ocean-outline-variant text-ocean-primary focus:ring-ocean-accent"
          />
          Apenas estoque baixo
        </label>
        <div className="ml-auto">
          <Button size="sm" onClick={() => setModal('create')}>
            + Novo produto
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState onRetry={() => mutate()} />
      ) : products.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Cadastre produtos para controlar seu estoque."
          action={
            <Button size="sm" onClick={() => setModal('create')}>
              + Novo produto
            </Button>
          }
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ocean-surface-container-low/50 border-b border-ocean-outline-variant/25">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Mínimo
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-outline-variant/15">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-ocean-surface-container-low/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ocean-on-surface">{p.name}</span>
                      {p.isLowStock && <Badge variant="danger">Baixo</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ocean-on-surface-variant">{TYPE_LABELS[p.type]}</td>
                  <td className="px-4 py-3 text-ocean-on-surface font-semibold">
                    {p.currentStock} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-ocean-on-surface-variant">
                    {p.minimumStock} {p.unit}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openAdjust(p)}>
                        Ajustar
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>
                        Editar
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

      <Modal open={modal === 'create'} onClose={closeModal} title="Novo produto">
        <ProductForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={closeModal} title="Editar produto">
        {selected && <ProductForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} />}
      </Modal>

      <Modal open={modal === 'adjust'} onClose={closeModal} title="Ajustar estoque" size="sm">
        {selected && (
          <StockAdjustmentForm product={selected} onSubmit={handleAdjust} onCancel={closeModal} />
        )}
      </Modal>
    </>
  );
}
