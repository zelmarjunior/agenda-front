# Tasks: Dashboard

**Página**: `/`  
**Status Geral**: ✅ Implementado | ⚠️ Testado (manual)

---

## Implementação

- [x] Criar estrutura de pastas Next.js (app router, route groups)
- [x] Implementar `AuthContext` (login, logout, estado global, persistência localStorage)
- [x] Implementar `ToastContext` (notificações toast)
- [x] Criar `services/api.ts` (axios com auth header + interceptor 401)
- [x] Criar `services/fetcher.ts` (SWR fetcher)
- [x] Implementar `utils/storage.ts` (token, businessId)
- [x] Implementar `utils/formatters.ts` (datas, moedas)
- [x] Criar `(dashboard)/layout.tsx` com sidebar e auth guard
- [x] Criar `DashboardContent.tsx`
- [x] Criar componentes comuns: Button, Badge, Modal, ConfirmModal, Pagination, Spinner, EmptyState, ErrorState, ErrorBoundary, ToastContainer

## Pendentes

- [ ] Métricas reais na home do dashboard (agendamentos hoje, faturamento do mês, alertas de estoque)
- [ ] Testes automatizados para AuthContext e interceptor de 401
- [ ] Testes para `utils/formatters.ts` e `utils/storage.ts`
