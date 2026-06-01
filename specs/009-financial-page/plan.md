# Plan: Página Financeira

**Página**: `/financeiro`  
**Última atualização**: 2026-05-30

---

## Arquitetura de Componentes

```
FinancialPage
├── FinancialHeader         ← título + filtro de período
├── CashflowSection
│   ├── CashSummaryCard     ← INCOME | EXPENSE | NET em destaque
│   ├── IncomeList          ← expansível: agendamentos concluídos do período
│   └── ExpenseList         ← expansível: custos fixos + variáveis do período
├── PeriodSummarySection
│   ├── SummaryCards        ← Receita Bruta / Custos / Lucro / Margem
│   └── PaymentBreakdown    ← gráfico pizza por meio de pagamento
├── RevenueChart            ← linha de evolução semanal/mensal (Recharts)
├── FixedCostsSection
│   ├── FixedCostList       ← lista com toggle ativo/inativo
│   └── AddFixedCostForm    ← inline form
├── VariableCostsSection
│   ├── VariableCostList    ← lista paginada
│   └── AddVariableCostForm ← inline form
└── AiInsightsSection
    ├── InsightsTrigger     ← botão "Analisar meu financeiro"
    └── InsightsStream      ← streaming markdown do response da IA
```

---

## Data Fetching

### Caixa do Dia / Período

```
GET /financial/cashflow?from=2026-05-30&to=2026-05-30
→ { income: 480, expense: 150, net: 330, entries: [...] }
```

### Resumo do Período

```
GET /financial/summary?from=2026-05-01&to=2026-05-30
→ { revenue: {...}, costs: {...}, profit: {...} }
```

### Insights de IA (Streaming)

```
GET /financial/insights?months=3   (EventSource / fetch com ReadableStream)
→ SSE stream → renderizado em markdown em tempo real
```

---

## Filtro de Período

```typescript
type Period = 'today' | 'week' | 'month' | 'last_month' | 'custom'

const periodRanges: Record<Period, () => { from: Date; to: Date }> = {
  today:      () => ({ from: startOfDay(now), to: endOfDay(now) }),
  week:       () => ({ from: startOfWeek(now), to: endOfWeek(now) }),
  month:      () => ({ from: startOfMonth(now), to: endOfMonth(now) }),
  last_month: () => ({ from: startOfMonth(subMonths(now,1)), to: endOfMonth(subMonths(now,1)) }),
  custom:     () => ({ from: customFrom, to: customTo }),
}
```

---

## Optimistic Updates

CRUD de custos fixos e variáveis usa **React Query** com `optimisticUpdate`:
1. Atualiza cache local imediatamente
2. Faz request ao backend
3. Em caso de erro: rollback com invalidação do cache

Isso garante feedback imediato sem esperar o round-trip.

---

## Proteção de Rota

```typescript
// middleware.ts (Next.js)
if (pathname.startsWith('/financeiro') && user.role !== 'OWNER') {
  redirect('/dashboard')
}
```

---

## Decisões de Design

- **Por que Recharts e não outra lib?** Se o projeto já usa Recharts no dashboard, reutiliza a dependência sem adicionar outra.
- **Por que SSE para insights e não polling?** Streaming dá feedback imediato ao usuário; polling adicionaria latência desnecessária e múltiplos requests.
- **Por que inline forms para custos?** Reduz fricção; o usuário não sai da página para cadastrar um custo simples.
