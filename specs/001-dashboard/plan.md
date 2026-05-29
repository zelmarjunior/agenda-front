# Plano de Implementação: Dashboard

**Página**: `/`  
**Status**: ✅ Implementado

---

## Decisões Técnicas

### 1. Next.js App Router com grupo de rotas
`(dashboard)/` é um route group — agrupa todas as rotas autenticadas sem afetar a URL. O `layout.tsx` nesse grupo aplica sidebar + auth check.

### 2. AuthContext com localStorage
JWT e `businessId` são armazenados no localStorage via `utils/storage.ts`. O `AuthContext` lê no mount e popula o estado global. O interceptor axios lê do storage diretamente.

### 3. Interceptor axios para 401
`services/api.ts` tem um response interceptor: em qualquer 401, faz `storage.clear()` e redireciona para `/login`.

---

## Estrutura de Arquivos

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx           ← Sidebar + auth guard
│       ├── page.tsx             ← Dashboard home
│       ├── DashboardContent.tsx
│       └── [outras páginas]/
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx (inline no layout)
├── context/
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
└── services/
    ├── api.ts               ← axios instance + interceptors
    └── fetcher.ts           ← SWR fetcher
```

---

## Dependências

- `next`, `react`
- `axios`, `swr`
- `tailwindcss`
- `utils/storage.ts` (token/businessId persistence)
