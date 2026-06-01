'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
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
import type { Product, ProductType, StockForecastItem } from '@/types/inventory.types';

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

  const { data: forecastData } = useSWR(
    ['stock-forecast', businessId],
    () => inventoryService.getForecast(businessId),
    { refreshInterval: 5 * 60 * 1000 },
  );

  const forecastMap = useMemo<Map<string, StockForecastItem>>(() => {
    const map = new Map<string, StockForecastItem>();
    forecastData?.forEach((f) => map.set(f.productId, f));
    return map;
  }, [forecastData]);

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

  // Products that are low stock OR will stockout soon
  const alertProducts = products.filter(
    (p) => p.isLowStock || forecastMap.get(p.id)?.willStockout,
  );

  return (
    <>
      {/* Low stock alert banner */}
      {alertProducts.length > 0 && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 flex items-start gap-3">
          <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-700">
              {alertProducts.length} produto{alertProducts.length !== 1 ? 's' : ''} precisam de atenção
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {alertProducts.map((p) => {
                const f = forecastMap.get(p.id);
                return (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-700"
                  >
                    {p.name}
                    {f?.willStockout
                      ? ` — faltará ${f.deficit.toFixed(1)} ${p.unit}`
                      : ` — ${p.currentStock} ${p.unit} (mín. ${p.minimumStock})`}
                  </span>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => { setLowStock(true); setPage(1); }}
            className="shrink-0 text-xs text-red-600 hover:text-red-700 font-semibold underline focus:outline-none"
          >
            Ver todos
          </button>
        </div>
      )}

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
                <th className="px-4 py-3 text-left text-xs font-semibold text-ocean-secondary uppercase tracking-wider">
                  Previsão
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
                    {(() => {
                      const f = forecastMap.get(p.id);
                      if (!f || f.futureAppointments === 0) return <span className="text-ocean-outline text-xs">—</span>;
                      if (f.willStockout) return (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          ⚠ Falta {f.deficit.toFixed(1)} {p.unit}
                        </span>
                      );
                      return (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                          ✓ {f.futureAppointments} ag.
                        </span>
                      );
                    })()}
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
