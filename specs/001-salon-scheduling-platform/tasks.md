# Implementation Tasks — Agenda Front

**Feature**: 001-salon-scheduling-platform | **Status**: Phase 6 Em Andamento 🟡 | **Date**: 2026-05-29

---

## Phase 0: Setup & Infrastructure

**Objective**: Projeto pronto para desenvolvimento (build, types, env, lint, test)  
**Duration**: 3–4 days  
**Owner**: Frontend Lead

---

### ✅ P0-T1: Configure TypeScript (Strict Mode)

**Description**: Validar e configurar TypeScript com strict mode obrigatório

**Subtasks**:
- [ ] Verify `tsconfig.json` has `"strict": true`
- [ ] Verify `"noImplicitAny": true`, `"strictNullChecks": true`
- [ ] Run `npm run lint` — verify zero TS errors
- [ ] Test build: `npm run build`
- [ ] Commit: `[feat] P0-T1: Configure TypeScript strict mode`

**Definition of Done**:
- TypeScript strict mode enabled
- `npm run build` succeeds with zero errors
- Zero implicit any warnings in `src/`

**Time Estimate**: 1–2 hours

---

### ✅ P0-T2: Setup Environment Variables

**Description**: Create `.env.example` and `.env.local` with all required variables

**Subtasks**:
- [ ] Create `.env.example` in project root
- [ ] Document all required vars (API URL, app name, etc)
- [ ] Create `.env.local` locally (git-ignored)
- [ ] Validate env on app startup (middleware)
- [ ] Create `src/utils/env.ts` to validate & export env vars
- [ ] Commit: `[feat] P0-T2: Setup environment variables`

**Example `.env.local`**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Agenda
```

**Definition of Done**:
- `.env.example` committed to repo
- `.env.local` created locally (git-ignored)
- App validates env vars on startup

**Time Estimate**: 1–2 hours

---

### ✅ P0-T3: Configure ESLint + Prettier

**Description**: Setup code quality tools aligned with backend standards

**Subtasks**:
- [ ] Install ESLint, Prettier, and plugins
  ```bash
  npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
  ```
- [ ] Create `.eslintrc.json`
- [ ] Create `.prettierrc.json` (100 char line length, 2 spaces)
- [ ] Add pre-commit hook (husky) to run lint + format
- [ ] Add npm scripts: `npm run lint`, `npm run format`
- [ ] Commit: `[feat] P0-T3: Setup ESLint + Prettier`

**Example `.eslintrc.json`**:
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  }
}
```

**Definition of Done**:
- ESLint config created
- Prettier config created
- No linting errors on `src/`
- Pre-commit hook functional

**Time Estimate**: 2–3 hours

---

### ✅ P0-T4: Setup Testing Infrastructure

**Description**: Configure Vitest + React Testing Library for unit/component tests

**Subtasks**:
- [ ] Install Vitest, @testing-library/react, @testing-library/jest-dom, vitest-environment-jsdom
  ```bash
  npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
  ```
- [ ] Create `vitest.config.ts`
- [ ] Create `src/setup-tests.ts` (import @testing-library/jest-dom)
- [ ] Add npm scripts: `npm test`, `npm run test:watch`, `npm run test:cov`
- [ ] Create example test: `src/utils/__tests__/formatters.test.ts`
- [ ] Run tests: verify pass
- [ ] Commit: `[feat] P0-T4: Setup Vitest + React Testing Library`

**Example `vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Definition of Done**:
- Vitest configured
- RTL setup complete
- Example test created & passing
- Coverage report generates

**Time Estimate**: 2–3 hours

---

### ✅ P0-T5: Create Folder Structure

**Description**: Create and organize folder structure for `src/`

**Subtasks**:
- [ ] Verify folders exist (already created ✅):
  ```
  src/
  ├── app/                 # Next.js pages
  ├── components/
  ├── modules/
  ├── services/
  ├── hooks/
  ├── types/
  ├── utils/
  ├── context/
  └── styles/
  ```
- [ ] Create placeholder `index.ts` files
- [ ] Create `src/app/layout.tsx` (root layout)
- [ ] Create `src/app/page.tsx` (home page)
- [ ] Commit: `[feat] P0-T5: Create folder structure`

**Definition of Done**:
- All folders created
- Placeholder files in place
- App compiles without errors

**Time Estimate**: 1–2 hours

---

### ✅ P0-T6: Setup Git Workflow

**Description**: Configure branch naming, commit conventions, pre-commit hooks

**Subtasks**:
- [x] Install husky
- [x] `.husky/pre-commit` criado
- ~~[ ] Pre-commit hook com lint + test~~ — **Removido em 2026-05-29** (esvaziado por decisão do time; validações rodam manualmente via `npm run lint` e `npm test`)
- [ ] Create `CONTRIBUTING.md`
- [ ] Create `.gitignore` additions (`.env.local`, `coverage/`, etc)

**Definition of Done**:
- Husky instalado ✅
- Pre-commit hook desabilitado ✅ (por escolha)
- CONTRIBUTING.md — pendente

**Time Estimate**: 1–2 hours

---

### ✅ P0-T7: Create README & Documentation

**Description**: Document how to run, develop, and deploy the frontend

**Subtasks**:
- [ ] Update root `README.md` with:
  - Project description
  - Setup instructions
  - Available scripts
  - Project structure overview
  - Tech stack
  - Contributing guidelines
- [ ] Create `ARCHITECTURE.md` (high-level overview)
- [ ] Create `docs/` folder for detailed docs
- [ ] Commit: `[docs] P0-T7: Create README & docs`

**Definition of Done**:
- README updated
- ARCHITECTURE.md created
- New developers can follow setup in < 5 min

**Time Estimate**: 1–2 hours

---

## Phase 1: Core Architecture & Auth ✅

*See [plan.md](./plan.md) for detailed Phase 1 tasks*

**Status**: ✅ Completo — 2026-05-28

### ⚪ P1-T1: Criar tipos TypeScript / DTOs (do OpenAPI)
- [ ] `src/types/auth.types.ts`
- [ ] `src/types/appointments.types.ts`
- [ ] `src/types/professionals.types.ts`
- [ ] `src/types/clients.types.ts`
- [ ] `src/types/services.types.ts`
- [ ] `src/types/api.types.ts` (SuccessResponse, PaginatedResponse, ErrorResponse)

### ⚪ P1-T2: Setup API client (axios + interceptors)
- [ ] `src/services/api.ts`
- [ ] Request interceptor (JWT header)
- [ ] Response interceptor (401 → logout, 403, 5xx)

### ⚪ P1-T3: Auth Context + hooks
- [ ] `src/context/AuthContext.tsx`
- [ ] `src/modules/auth/hooks/useAuth.ts`
- [ ] `src/modules/auth/services/authService.ts`
- [ ] Login em 2 etapas (email → confirma negócio → senha)

### ✅ P1-T4: Protected Routes (middleware)
- [x] `src/middleware.ts` — criado (estava com nome errado `proxy.ts`, corrigido em 2026-05-29)
- [x] Layout protegido `src/app/(dashboard)/layout.tsx`

### ⚪ P1-T5: Tela de Login (2 etapas)
- [ ] `src/app/(auth)/login/page.tsx`
- [ ] `src/components/forms/LoginForm.tsx`
- [ ] Etapa 1: campo email → fetch negócio
- [ ] Etapa 2: confirma negócio + senha

### ⚪ P1-T6: Tela de Registro
- [ ] `src/app/(auth)/register/page.tsx`
- [ ] `src/components/forms/RegisterForm.tsx`
- [ ] Salvar `businessId` no localStorage após registro

### ⚪ P1-T7: Sistema de Toast/Notificações
- [ ] `src/context/ToastContext.tsx`
- [ ] `src/components/common/Toast.tsx`
- [ ] `src/hooks/useToast.ts`

---

## Phase 2: Feature Implementation ✅

**Status**: ✅ Completo — 2026-05-28

- ✅ P2-T1/T2/T3/T4: Appointments (list, form, cancel, hooks)
- ✅ P2-T5/T6: Professionals (list, form)
- ✅ P2-T7/T8: Clients (list, form, search)
- ✅ P2-T9: Dashboard overview
- ✅ P2-T10: Services + Inventory (list, form, stock adjustment)
- ✅ Reports page (financial, appointments, inventory)

---

## Phase 3: Polish, Testing & Optimization ✅

**Status**: ✅ Completo — 2026-05-28

- ✅ P3-T1: Unit tests — `jwt.test.ts`, `storage.test.ts`, `formatters.test.ts` (35 tests passing)
- ✅ P3-T2: Component tests — `Button.test.tsx`, `CancelForm.test.tsx`, `AppointmentStatusBadge.test.tsx`
- ✅ P3-T4: Performance — `next/dynamic` lazy imports on all heavy list pages
- ✅ P3-T5: Accessibility — skip-to-content link, `aria-current`, `aria-hidden` decorative icons, `aria-live` toasts
- ✅ P3-T6: Error handling — `ErrorBoundary`, `ErrorState` with retry on all list pages
- ✅ P3-T8: CI/CD — GitHub Actions pipeline (lint → tsc → test → build)

---

## Phase 4: Feature Gaps ✅

**Status**: ✅ Completo — 2026-05-28

- ✅ P4-T1: Professional working hours modal (WorkingHoursForm)
- ✅ P4-T2: Professional services linking modal (LinkServicesForm)
- ✅ P4-T3: Client appointment history modal (ClientHistory)
- ✅ P4-T4: Business settings page (/settings)
- ✅ P4-T5: Responsive sidebar (mobile hamburger + backdrop)
- ✅ P4-T6: Custom 404 page (not-found.tsx)

---

## Phase 5: Production Readiness ✅

**Status**: ✅ Completo — 2026-05-28

- ✅ P5-T1: Form error handling — try/catch + `getApiError` toast in all mutation handlers (AppointmentList, ClientList, ProfessionalList, ServiceList, ProductList, SettingsContent)
- ✅ P5-T2: Per-page `<title>` metadata — server-component pages with title template `%s | Agenda`; `_lazy.tsx` client wrappers for `dynamic({ ssr: false })`
- ✅ P5-T3: Appointment agenda view — `AppointmentAgenda` (day-grouped, next 14 days) + `AppointmentListPage` Lista/Agenda toggle
- ✅ P5-T4: `public/robots.txt` (Disallow: / for private dashboard)
- ✅ P5-T5: Expanded tests — `formatTime`, `AppointmentAgenda` component (4 new tests); vitest `env` config for API URL; total 41 tests
- ✅ P5-T6: `formatTime` utility added to formatters.ts

---

## Task Status Legend

- ✅ Completed
- 🟡 In Progress
- ⚪ Not Started
- 🔄 Blocked / Waiting
- ❌ Cancelled

---

## Bugs Corrigidos (fora de fase)

| Data | Bug | Correção |
|------|-----|---------|
| 2026-05-29 | `src/proxy.ts` era o middleware de auth mas com nome errado — Next.js ignorava, `/appointments` retornava 404 para usuários não autenticados | Renomeado para `src/middleware.ts`; função exportada renomeada de `proxy` para `middleware` |
| 2026-05-29 | Pre-commit hook rodava `npx lint-staged` + `npm test` bloqueando commits | `.husky/pre-commit` esvaziado por decisão do time |

---

## Phase 6: Design System & E2E Tests 🟡

**Status**: 🟡 Em Andamento — 2026-05-28

**Objetivo**: Aplicar o design system definido na constituição (seção XI), adicionar loading skeletons, confirmar modais destrutivos, e implementar E2E com Playwright.

---

### ⚪ P6-T1: Instalar e Configurar Playwright

**Descrição**: Setup de testes E2E para os fluxos críticos

**Subtasks**:
- [ ] `npm install --save-dev @playwright/test`
- [ ] `npx playwright install`
- [ ] Criar `playwright.config.ts` na raiz (baseURL `http://localhost:3001`)
- [ ] Criar diretório `e2e/`
- [ ] Criar `e2e/auth.spec.ts` — fluxo de login em 2 etapas
- [ ] Criar `e2e/appointments.spec.ts` — criar, confirmar, concluir, cancelar agendamento
- [ ] Criar `e2e/professionals.spec.ts` — criar profissional, definir horários
- [ ] Criar `e2e/clients.spec.ts` — criar e editar cliente
- [ ] Adicionar script `test:e2e` no `package.json`
- [ ] Adicionar job E2E ao GitHub Actions workflow

**Definition of Done**: Todos os fluxos críticos cobertos; CI passa

**Estimativa**: 3–4 dias

---

### ⚪ P6-T2: Loading Skeletons em Todas as Listagens

**Descrição**: Substituir Spinners por Skeletons em listagens durante fetch inicial

**Subtasks**:
- [ ] Criar `src/components/common/Skeleton.tsx` (componente base com shimmer)
- [ ] Criar `TableSkeleton.tsx` (skeleton para tabelas com N linhas)
- [ ] Criar `CardSkeleton.tsx` (skeleton para cards do dashboard)
- [ ] Substituir `<Spinner />` nos estados de loading de: AppointmentList, ClientList, ProfessionalList, ServiceList, ProductList, DashboardContent, ReportsContent
- [ ] Teste de componente para Skeleton

**Definition of Done**: Zero spinners em listagens durante carregamento inicial

**Estimativa**: 1–2 dias

---

### ⚪ P6-T3: ConfirmModal para Ações Destrutivas

**Descrição**: Toda ação irreversível deve exigir confirmação explícita

**Subtasks**:
- [ ] Verificar se `ConfirmModal.tsx` já existe (sim, em `components/common/`)
- [ ] Garantir que cancelamento de agendamento usa ConfirmModal antes de abrir CancelForm
- [ ] Garantir que exclusão de serviço usa ConfirmModal
- [ ] Garantir que exclusão de produto usa ConfirmModal
- [ ] Garantir que desativação de profissional usa ConfirmModal
- [ ] Testes de componente para ConfirmModal

**Definition of Done**: Nenhuma ação destrutiva executa sem confirmação explícita

**Estimativa**: 1 dia

---

### ⚪ P6-T4: Design System — Cores e Tipografia

**Descrição**: Aplicar Electric Indigo (#6366F1) como cor primária em toda a UI

**Subtasks**:
- [ ] Atualizar `src/app/globals.css` com variáveis CSS do design system
- [ ] Verificar/corrigir cor do botão primário (deve ser indigo-500/600)
- [ ] Verificar/corrigir cor dos links ativos na sidebar (deve ser white)
- [ ] Verificar/corrigir fundo da sidebar (deve ser gray-900)
- [ ] Aplicar `Inter` ou `Plus Jakarta Sans` via `next/font` no root layout
- [ ] Rever todos os `focus:ring` para usar `ring-indigo-500` (não `ring-blue-500`)

**Definition of Done**: Design system aplicado consistentemente; visual revisado

**Estimativa**: 1–2 dias

---

### ⚪ P6-T5: Sidebar Colapsável com Ícones

**Descrição**: Sidebar deve ter estado colapsado (só ícones) e expandido (ícones + labels) em desktop

**Subtasks**:
- [ ] Adicionar estado `collapsed: boolean` na Sidebar
- [ ] Botão toggle no topo da sidebar
- [ ] Em estado colapsado: `w-16`, mostrar só ícones com tooltips
- [ ] Em estado expandido: `w-64`, mostrar ícones + labels
- [ ] Persistir preferência em localStorage
- [ ] Manter comportamento mobile (hamburger menu) inalterado

**Definition of Done**: Sidebar colapsável funcionando em desktop; mobile inalterado

**Estimativa**: 1 dia

---

### ⚪ P6-T6: Empty States Ilustrados

**Descrição**: Melhorar EmptyState com ilustrações SVG por módulo

**Subtasks**:
- [ ] Revisar `EmptyState.tsx` — adicionar suporte a `illustration?: ReactNode`
- [ ] Criar ilustrações SVG simples para: agendamentos, clientes, profissionais, serviços, estoque
- [ ] Aplicar em todas as páginas de listagem
- [ ] Call-to-action no EmptyState deve abrir modal de criação diretamente

**Definition of Done**: Todas as listagens têm EmptyState com ilustração e CTA funcional

**Estimativa**: 1 dia

---

### ⚪ P6-T7: Validação Inline em Formulários

**Descrição**: Formulários devem validar campo a campo (onBlur), não só no submit

**Subtasks**:
- [ ] Revisar AppointmentForm — validação inline
- [ ] Revisar ProfessionalForm — validação inline  
- [ ] Revisar ClientForm — validação inline
- [ ] Revisar ServiceForm — validação inline
- [ ] Revisar ProductForm — validação inline
- [ ] Revisar LoginForm/RegisterForm — já implementado, verificar

**Definition of Done**: Erros de validação aparecem ao sair do campo, sem precisar submeter

**Estimativa**: 1 dia

---

## Deployment Checklist (For Later)

- [ ] Environment variables configured for production
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production build
- [ ] TypeScript coverage 100%
- [ ] Test coverage ≥ 70%
- [ ] Lighthouse score ≥ 80 (mobile)
- [ ] SEO basics configured (meta tags, robots.txt)
- [ ] CI/CD pipeline configured (GitHub Actions or similar)

---

## Notes

- Phase 0 tasks must complete before Phase 1 starts
- Each task should have a corresponding git commit
- Keep commit messages clear and consistent
- Update this file as tasks progress
