# Tasks: Clients Page

**Página**: `/clients`  
**Status Geral**: ✅ Implementado | ⚠️ Testado (manual)

---

## Implementação

- [x] Criar `types/clients.types.ts`
- [x] Implementar `clientsService.ts` (getAll, create, update, getHistory)
- [x] Implementar `useClients.ts` com SWR
- [x] Implementar `ClientList.tsx` com paginação
- [x] Implementar `ClientForm.tsx` (criar + editar)
- [x] Implementar `ClientHistory.tsx` (lista de agendamentos)
- [x] Implementar `ClientProfileModal.tsx` (dados + histórico)
- [x] Criar `app/(dashboard)/clients/page.tsx` com lazy loading

## Pendentes

- [ ] Testes unitários para ClientProfileModal e ClientHistory
- [ ] Busca/filtro de clientes por nome ou telefone
- [ ] Indicador de cliente VIP (muitos agendamentos concluídos)
