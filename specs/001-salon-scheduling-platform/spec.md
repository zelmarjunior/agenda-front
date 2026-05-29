# Feature Specification: Agenda Front — Plataforma de Agendamento (Frontend)

**Date**: 2026-05-28 | **Feature**: Frontend da Plataforma de Agendamento | **Backend Spec**: [agenda-back/specs/001-salon-scheduling-platform/spec.md](../../../agenda-back/specs/001-salon-scheduling-platform/spec.md)

---

## 1. Overview

Construir o frontend (Next.js + TypeScript + React) para a plataforma **Agenda Back** — um sistema web de agendamento para salões de beleza e profissionais autônomos. O frontend consome a API REST do backend e oferece interfaces para:

- **Owners/Managers**: Dashboard gerencial, relatórios, gestão de profissionais e estoque
- **Professionals**: Agenda pessoal, visualização de clientes, confirmação de agendamentos
- **Clients**: Agendamento de serviços, histórico, notificações

**Tech Stack**:
- Framework: **Next.js 16.x** (App Router)
- Language: **TypeScript 5.x** (strict mode)
- UI Library: **React 19.x**
- Styling: **Tailwind CSS 4.x** (utility-first, JIT)
- HTTP Client: **axios 1.x** (via `services/api.ts`)
- State Management: **Context API** + **SWR 2.x** para server state
- Form Validation: **react-hook-form 7.x** + **Zod 4.x**
- Testing: **Vitest 4.x** + **React Testing Library 16.x** + **Playwright** (E2E — pendente)

---

## 2. User Roles & Personas

### 2.1 Owner/Manager
- Acesso total ao dashboard
- Gestão de profissionais, serviços, clientes
- Visualização de relatórios e métricas
- Configuração de horários e disponibilidade

### 2.2 Professional
- Visualização de agenda pessoal
- Confirmação/cancelamento de agendamentos
- Histórico de clientes

### 2.3 Client
- Agendamento de serviços
- Visualização de histórico
- Cancelamento de agendamentos

---

## 3. Core Features (MVP)

### 3.1 Authentication
- [x] Login em 2 etapas:
  - **Etapa 1**: Usuário informa email → frontend busca o negócio associado → exibe nome do negócio para confirmação
  - **Etapa 2**: Usuário confirma negócio e insere senha → POST `/auth/login` com `{ email, password, businessId }`
- [x] Register (novo negócio) → salvar `businessId` retornado no localStorage para pré-preencher login futuro
- [x] JWT token storage (localStorage com expiração curta)
- [x] Logout
- [x] Protected routes (Auth Guard via middleware.ts)
- [x] Refresh token logic

### 3.2 Business Dashboard
- [x] Overview de agendamentos do dia
- [x] Estatísticas rápidas (clientes, receita)
- [x] Listagem de agendamentos pendentes

### 3.3 Appointment Management
- [x] Visualização de agenda (calendário mensal + lista)
- [x] Calendário mensal com indicadores de agendamentos por dia (dots coloridos por status)
- [x] Vista de dia (timeline 07h–21h) ao clicar em um dia no calendário
- [x] Clicar num slot da timeline pré-preenche data/hora no formulário de criação
- [x] Criar agendamento com cliente, profissional, serviço, data e hora
- [x] Criação inline de cliente no próprio formulário de agendamento (sem trocar de tela)
- [x] Confirmação/cancelamento/conclusão de agendamento
- [x] Reagendamento de agendamento existente
- [x] Modal de criação centralizada e animada
- [x] Filtros por data e status na view de lista

### 3.4 Professional Management
- [x] Listagem de profissionais
- [x] Adicionar/editar profissional
- [x] Atribuir serviços a profissional
- [x] Definir disponibilidade/horários

### 3.5 Client Management
- [x] Listagem de clientes
- [x] Adicionar/editar cliente
- [x] Histórico de agendamentos do cliente

### 3.6 Service/Inventory Management
- [x] Listagem de serviços
- [x] Adicionar/editar serviço
- [x] Gestão de produtos em estoque

### 3.7 Notifications
- [x] Notificações de agendamento (toast/banner)
- [x] Confirmações via modal
- [x] Error handling visual

---

## 4. Key Non-Functional Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| **Responsive Design** | HIGH | Mobile-first; funcional em smartphones, tablets, desktops |
| **Performance** | HIGH | FCP < 2s, LCP < 3s; lazy loading de rotas e componentes |
| **Accessibility** | MEDIUM | WCAG 2.1 AA; semantic HTML, ARIA labels |
| **Type Safety** | HIGH | TypeScript strict mode; zero implicit any |
| **Error Handling** | HIGH | Tratamento elegante de erros; fallbacks visuais |
| **Offline Support** | LOW | Cache via Service Worker; sincronização quando online |

---

## 5. API Integration Requirements

- **Base URL**: `${NEXT_PUBLIC_API_BASE_URL}/api/v1`
- **Authentication**: Bearer Token (JWT) no header `Authorization`
- **Error Handling**: Tratamento de 401 (logout), 403 (forbidden), 404, 500
- **Rate Limiting**: Implementar backoff exponencial
- **Request/Response Validation**: Tipos TypeScript alinhados com OpenAPI do backend

---

## 6. Component Structure (High-Level)

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas públicas (login, register)
│   ├── (dashboard)/              # Protected routes
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── appointments/
│   │   ├── professionals/
│   │   ├── clients/
│   │   ├── services/
│   │   └── reports/
│   └── api/                       # API routes (webhooks, utilities)
├── components/                   # Componentes reutilizáveis
│   ├── common/
│   ├── layout/
│   ├── forms/
│   └── modals/
├── modules/                      # Agrupamento por domínio
│   ├── auth/
│   ├── appointments/
│   ├── professionals/
│   ├── clients/
│   └── services/
├── services/                     # API client + business logic
├── hooks/                        # Custom React hooks
├── context/                      # Context API providers
├── types/                        # Type definitions (DTOs, responses)
├── utils/                        # Utilities (formatters, validators)
└── styles/                       # Global styles
```

---

## 7. Technical Constraints

- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Bundle Size**: < 200KB (gzipped, excluding node_modules)
- **SSR/SSG**: Usar SSR apenas para páginas públicas; CSR para dashboard
- **Environment Variables**: Todas as URLs de API em variáveis de ambiente
- **No Direct API Keys**: Proxying via backend quando necessário

---

## 8. Security Considerations

- [x] HTTPS only (env validation)
- [x] CORS handling (API backend CORS configured)
- [x] XSS prevention (sanitizar user inputs)
- [x] CSRF tokens (se aplicável)
- [x] JWT expiration handling
- [x] Sensitive data NOT in localStorage (apenas token com expiração curta)

---

## 9. Acceptance Criteria

- [ ] Todo rota protegida requer autenticação válida
- [ ] Dashboard carrega em < 2s (FCP)
- [ ] Todos os forms validam inputs antes de enviar
- [ ] Erros de API exibem mensagens amigáveis ao usuário
- [ ] Responsivo em mobile (360px width), tablet (768px), desktop (1920px)
- [ ] Zero console errors ou warnings (em production build)
- [ ] TypeScript compila sem erros (strict mode)
- [ ] Cobertura de testes > 70% em componentes críticos

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Page Load Time (FCP) | < 2s |
| Largest Contentful Paint (LCP) | < 3s |
| Mobile Lighthouse Score | ≥ 80 |
| Type Coverage | 100% |
| Test Coverage | ≥ 70% |

---

## 11. Decisions Made

- [x] **Design system**: Custom Tailwind CSS — sem biblioteca externa. Primary color: `#6366F1` (Electric Indigo). Ver constituição seção XI.
- [x] **Animation library**: CSS puro com Tailwind (sem Framer Motion no MVP). Micro-animações via `transition-*` classes.
- [x] **Timezone handling**: Datas armazenadas em UTC no backend; exibidas em local time via `Intl.DateTimeFormat`. Formulários usam local time strings sem offset explícito.
- [x] **Real-time updates**: Não necessário no MVP. SWR revalidation cobre 99% dos casos. Reavaliar pós-MVP.
- [x] **Offline mode**: Fora do escopo do MVP.
- [x] **Login**: Login em 2 etapas (email → confirma negócio → senha). Ver seção 3.1.
- [x] **State management**: SWR (não React Query). Context API apenas para auth e toast.
- [x] **Calendar**: Calendário mensal + timeline diária com slot click, sem dependência externa (native Date API).

---

## 12. References

- Backend OpenAPI: [`backend-openapi-spec.yml`](../../backend-openapi-spec.yml) (raiz do projeto)
- Figma Design (if applicable): [Link to design file]
