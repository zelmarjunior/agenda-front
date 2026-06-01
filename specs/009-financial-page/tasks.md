# Tasks: Página Financeira

**Status geral**: ✅ Implementado (2026-05-30)

---

## Fase 1 — Proteção de Rota e Layout

- [ ] **T1.1** Adicionar `/financeiro` na proteção de rota (só OWNER)
- [x] **T1.2** Criar página `app/financeiro/page.tsx` com layout de seções
- [x] **T1.3** Criar `FinancialHeader` com seletor de período (hoje, semana, mês, mês anterior)
- [x] **T1.4** Adicionar item "Financeiro" no menu lateral (com ícone)

## Fase 2 — Caixa do Dia/Período

- [x] **T2.1** Integrar `GET /financial/cashflow` com SWR
- [x] **T2.2** Criar cards de INCOME / EXPENSE / NET em destaque
- [x] **T2.3** Listar entradas do caixa com tipo e descrição
- [x] **T2.4** Breakdown por meio de pagamento
- [ ] **T2.5** Skeleton loader para o caixa

## Fase 3 — Resumo e Gráficos

- [x] **T3.1** Integrar `GET /financial/summary` para cards de resumo
- [x] **T3.2** Criar `SummaryCards` (Receita Bruta / Custos / Lucro / Margem)
- [ ] **T3.3** Criar `PaymentBreakdown` com gráfico de pizza por meio de pagamento
- [ ] **T3.4** Criar `RevenueChart` com linha de evolução do período (Recharts)
- [ ] **T3.5** Interatividade: clique no segmento do gráfico filtra a lista de entradas

## Fase 4 — CRUD de Custos Fixos

- [x] **T4.1** Integrar `GET /financial/fixed-costs`
- [x] **T4.2** Listar custos fixos ativos
- [x] **T4.3** Criar `AddFixedCostForm` inline
- [x] **T4.4** Implementar `POST /financial/fixed-costs`
- [ ] **T4.5** Implementar `PUT /financial/fixed-costs/:id` (edição inline)
- [x] **T4.6** Implementar `DELETE /financial/fixed-costs/:id` com confirmação

## Fase 5 — CRUD de Custos Variáveis

- [x] **T5.1** Criar `VariableCostList` com lista paginada
- [x] **T5.2** Criar `AddVariableCostForm` inline
- [x] **T5.3** Integrar CRUD de custos variáveis

## Fase 6 — Insights de IA

- [x] **T6.1** Criar `AiInsightsSection` com botão "Analisar financeiro"
- [x] **T6.2** Implementar fetch com SSE/streaming para `GET /financial/insights`
- [x] **T6.3** Renderizar resposta da IA em tempo real com cursor animado
- [x] **T6.4** Estado de loading + erro com retry

## Fase 7 — Polimento

- [x] **T7.1** Responsividade mobile (grid adaptativo)
- [x] **T7.2** Empty state para cada seção (sem custos, sem dados)
- [ ] **T7.3** Testar com dados de 3 meses de agendamentos
