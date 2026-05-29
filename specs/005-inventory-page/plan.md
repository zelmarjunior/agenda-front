# Plano de Implementação: Inventory Page

**Página**: `/inventory`  
**Status**: ✅ Implementado

---

## Estrutura de Arquivos

```
src/
├── app/(dashboard)/inventory/
│   ├── page.tsx
│   └── _lazy.tsx
└── modules/inventory/
    └── InventoryContent.tsx   (componente principal, lazy loaded)
```

---

## Decisões Técnicas

### 1. isLowStock calculado no front
O backend retorna `currentStock` e `minimumStock`. O componente calcula `isLowStock = currentStock <= minimumStock` e aplica classes Tailwind condicionalmente.

### 2. Ajuste de estoque via PATCH
`PATCH /inventory/:id/adjust` aceita `{ quantityChange, reason }`. Quantidade pode ser positiva (entrada) ou negativa (saída manual).

---

## Dependências

- `swr`
- `react-hook-form`, `zod`
- `types/inventory.types.ts`
