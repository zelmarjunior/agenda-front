# Plano de Implementação: Clients Page

**Página**: `/clients`  
**Status**: ✅ Implementado

---

## Estrutura de Arquivos

```
src/
├── app/(dashboard)/clients/
│   ├── page.tsx
│   └── _lazy.tsx
└── modules/clients/
    ├── ClientList.tsx
    ├── ClientForm.tsx
    ├── ClientHistory.tsx
    ├── ClientProfileModal.tsx
    ├── clientsService.ts
    └── useClients.ts
```

---

## Decisões Técnicas

### 1. ClientProfileModal combina dados + histórico
O modal busca dados do cliente e seu histórico em requests paralelas (SWR). Exibe spinner enquanto ambos carregam.

### 2. Histórico como lista separada
`ClientHistory.tsx` é um componente separado dentro do modal, permitindo lazy load do histórico apenas quando o modal abre.

---

## Dependências

- `swr`, `react-hook-form`, `zod`
- `types/clients.types.ts`
- `AppointmentStatusBadge` reutilizado no histórico
