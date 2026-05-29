'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/common/Spinner';
import { reportsService } from '@/modules/reports/services/reportsService';
import { storage } from '@/utils/storage';
import { formatCurrency } from '@/utils/formatters';

function defaultRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const to = now.toISOString().split('T')[0];
  return { from, to };
}

export function ReportsContent(): JSX.Element {
  const businessId = storage.getBusinessId()!;
  const [range, setRange] = useState(defaultRange);

  const params = { from: range.from, to: range.to };

  const { data: financial, isLoading: loadingFin } = useSWR(
    businessId ? ['report-financial', businessId, range.from, range.to] : null,
    () => reportsService.financial(businessId, params),
  );

  const { data: appointments, isLoading: loadingAppts } = useSWR(
    businessId ? ['report-appointments', businessId, range.from, range.to] : null,
    () => reportsService.appointments(businessId, params),
  );

  const { data: inventory, isLoading: loadingInv } = useSWR(
    businessId ? ['report-inventory', businessId, range.from, range.to] : null,
    () => reportsService.inventory(businessId, params),
  );

  return (
    <div>
      <Header title="Relatórios" />

      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-xl border border-gray-200 px-4 py-3">
        <span className="text-sm font-medium text-gray-700">Período:</span>
        <input
          type="date"
          value={range.from}
          onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500">até</span>
        <input
          type="date"
          value={range.to}
          onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Financeiro</h2>
          </div>
          {loadingFin ? (
            <div className="py-8">
              <Spinner />
            </div>
          ) : !financial ? (
            <p className="px-6 py-6 text-sm text-gray-500">Sem dados para o período.</p>
          ) : (
            <div>
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-xs text-gray-500">Receita total</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(financial.totalRevenue)}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Profissional
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Atend.</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Receita</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Comissão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {financial.byProfessional.map((row) => (
                      <tr key={row.professional.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">{row.professional.name}</td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {row.appointmentsCompleted}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          {formatCurrency(row.revenue)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {formatCurrency(row.commission)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Agendamentos por profissional</h2>
          </div>
          {loadingAppts ? (
            <div className="py-8">
              <Spinner />
            </div>
          ) : !appointments ? (
            <p className="px-6 py-6 text-sm text-gray-500">Sem dados para o período.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Profissional</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Agend.</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Concluídos</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Cancelados</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Ocupação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.byProfessional.map((row) => (
                    <tr key={row.professional.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{row.professional.name}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{row.totalScheduled}</td>
                      <td className="px-4 py-2 text-right text-green-700">{row.totalCompleted}</td>
                      <td className="px-4 py-2 text-right text-red-600">{row.totalCancelled}</td>
                      <td className="px-4 py-2 text-right text-gray-900">
                        {(row.occupancyRate * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.topServices.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-2">Serviços mais agendados</p>
                  <div className="flex flex-wrap gap-2">
                    {appointments.topServices.map((row) => (
                      <span
                        key={row.service.id}
                        className="text-xs bg-blue-50 text-blue-700 rounded-full px-3 py-1"
                      >
                        {row.service.name} ({row.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Estoque</h2>
          </div>
          {loadingInv ? (
            <div className="py-8">
              <Spinner />
            </div>
          ) : !inventory ? (
            <p className="px-6 py-6 text-sm text-gray-500">Sem dados para o período.</p>
          ) : (
            <div>
              {inventory.lowStockProducts.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-red-600 mb-2">
                    Produtos com estoque baixo
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {inventory.lowStockProducts.map((p) => (
                      <span
                        key={p.id}
                        className="text-xs bg-red-50 text-red-700 rounded-full px-3 py-1"
                      >
                        {p.name} — {p.currentStock} {p.unit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Produto</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">
                        Consumo no período
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inventory.consumptionByProduct.map((row) => (
                      <tr key={row.product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">{row.product.name}</td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {row.totalConsumed} {row.product.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
