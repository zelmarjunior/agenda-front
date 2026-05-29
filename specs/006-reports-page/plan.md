# Plano de Implementação: Reports Page

**Página**: `/reports`  
**Status**: ✅ Implementado

---

## Estrutura de Arquivos

```
src/
├── app/(dashboard)/reports/
│   ├── page.tsx
│   └── ReportsContent.tsx
└── modules/reports/
    ├── reportsService.ts
    └── (sem hooks SWR — fetch manual com botão)
```

---

## Decisões Técnicas

### 1. Fetch manual (não SWR)
Relatórios são gerados sob demanda com botão "Gerar". Não usam SWR (que revalida automaticamente) — evita re-execuções de queries pesadas.

### 2. Abas com estado local
Cada aba mantém seu próprio estado de filtros, resultado e loading. Troca de aba não apaga os resultados já carregados.

---

## Dependências

- `types/reports.types.ts`
- `reportsService.ts`
- `react-hook-form` para filtros de data
