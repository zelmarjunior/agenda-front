# Implementation Plan: Agenda Front — Plataforma de Agendamento (Frontend)

**Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md) | **Branch**: `001-salon-scheduling-platform`

---

## Executive Summary

Implementar o frontend (Next.js + React + TypeScript) para consumir a API do **Agenda Back**. O plano divide o trabalho em **4 fases** cronológicas:

1. **Phase 0** — Setup & Infrastructure (TypeScript config, build, env variables, linting)
2. **Phase 1** — Core Architecture (Auth, API client, routing, state management)
3. **Phase 2** — Feature Implementation (Dashboard, CRUD modules, forms)
4. **Phase 3** — Polish & Optimization (Performance, accessibility, testing)

**Target Completion**: 4–6 semanas (1 feature por semana)

---

## Constraints & Assumptions

| Constraint | Impact | Notes |
|-----------|--------|-------|
| **Backend Ready** | CRITICAL | Assume API backend 100% funcional com todos endpoints documentados |
| **Design System** | HIGH | Use Tailwind CSS para rapidez; sem custom design system no MVP |
| **Team Size** | MEDIUM | Estimado para 1–2 developers |
| **Testing Strategy** | MEDIUM | Test-First para hooks e utilities; integração para componentes |
| **Performance Budget** | HIGH | Bundle < 200KB; FCP < 2s |
| **Browser Support** | MEDIUM | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

---

## Technical Architecture

### 3.1 Stack Rationale

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | SSR/SSG when needed; file-based routing; built-in optimization |
| **Language** | TypeScript (strict) | Type safety; IDE autocomplete; fewer runtime bugs |
| **UI Framework** | React 18 | Hooks; concurrent rendering; large ecosystem |
| **Styling** | Tailwind CSS | Utility-first; rapid prototyping; small CSS bundle |
| **HTTP Client** | axios | Simple API; request/response interceptors; built-in timeout |
| **Server State** | SWR ou React Query | Caching; revalidation; offline support |
| **Form Validation** | Zod + React Hook Form | Type-safe; lightweight; great DX |
| **Testing** | Vitest + React Testing Library | Fast; modern; intuitive API |

### 3.2 Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── login.module.css
│   │   └── register/
│   │       ├── page.tsx
│   │       └── register.module.css
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar, header, nav
│   │   ├── page.tsx            # Dashboard home
│   │   ├── appointments/
│   │   ├── professionals/
│   │   ├── clients/
│   │   ├── services/
│   │   └── reports/
│   ├── layout.tsx              # Root layout
│   └── api/                    # API routes (webhooks, etc)
├── components/
│   ├── common/                 # Button, Badge, Modal, etc
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── AppointmentForm.tsx
│   │   └── ...
│   └── modals/
│       ├── ConfirmModal.tsx
│       └── ...
├── modules/
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── services/
│   │       └── authService.ts
│   ├── appointments/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── services/
│   │   └── components/
│   ├── professionals/
│   ├── clients/
│   └── services/
├── context/
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── services/
│   ├── api.ts                  # Axios client setup
│   ├── apiClient.ts            # Request/response interceptors
│   └── ...
├── hooks/
│   ├── useApi.ts               # Custom hook para fetch
│   ├── usePagination.ts
│   └── ...
├── types/
│   ├── api.types.ts            # DTOs from backend
│   ├── common.types.ts
│   └── ...
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── ...
├── styles/
│   ├── globals.css
│   └── variables.css
├── middleware.ts               # Next.js middleware (auth protection)
└── next.config.ts
```

---

## Phase Breakdown

### Phase 0: Setup & Infrastructure (Week 1)

**Goal**: Projeto pronto para desenvolvimento (build, types, env, lint, test)

#### Phase 0 Tasks

1. **P0-T1**: Configure TypeScript strict mode, tsconfig.json
   - [ ] Verify `strict: true` in tsconfig.json
   - [ ] Zero implicit any errors
   - [ ] Verify build succeeds

2. **P0-T2**: Setup environment variables (.env.example, .env.local)
   - [ ] Create `.env.example` with `NEXT_PUBLIC_API_BASE_URL`, etc
   - [ ] Create `.env.local` (git-ignored) com valores locais
   - [ ] Validate env on app startup

3. **P0-T3**: Configure ESLint + Prettier (aligned with backend standards)
   - [ ] Install `eslint-config-prettier`, `prettier`
   - [ ] Configure linting rules (no console logs, unused vars, etc)
   - [ ] Auto-format on save

4. **P0-T4**: Setup testing infrastructure (Vitest + React Testing Library)
   - [ ] Install Vitest, @testing-library/react, @testing-library/jest-dom
   - [ ] Create vitest.config.ts
   - [ ] Create example unit test

5. **P0-T5**: Create folder structure (src/modules, src/components, etc)
   - [ ] mkdir all directories
   - [ ] Create placeholder index.ts files

6. **P0-T6**: Setup Git workflow (branch naming, pre-commit hooks)
   - [ ] Create `.git/hooks/pre-commit` para lint + test
   - [ ] Validate branch naming convention (feature/, bugfix/)

**Estimated**: 3–4 days

---

### Phase 1: Core Architecture & Auth (Week 2)

**Goal**: Auth funcional, API client pronto, routing protegido

#### Phase 1 Tasks

1. **P1-T1**: Create TypeScript types/DTOs (from backend OpenAPI)
   - [ ] Create `types/auth.types.ts` (LoginRequest, LoginResponse, User, etc)
   - [ ] Create `types/appointments.types.ts`
   - [ ] Create `types/professionals.types.ts`
   - [ ] Create `types/clients.types.ts`
   - [ ] Create `types/services.types.ts`

2. **P1-T2**: Setup API client (axios + interceptors)
   - [ ] Create `services/api.ts` (axios instance com base URL)
   - [ ] Implement request interceptor (add JWT to Authorization header)
   - [ ] Implement response interceptor (handle 401, 403 errors)
   - [ ] Add error logging

3. **P1-T3**: Implement Auth Context + hooks
   - [ ] Create `context/AuthContext.tsx`
   - [ ] Create `modules/auth/hooks/useAuth.ts`
   - [ ] Create `modules/auth/services/authService.ts`
   - [ ] Implement login, logout, register

4. **P1-T4**: Setup Auth Guard + Protected Routes
   - [ ] Create `middleware.ts` (redirect to login if no token)
   - [ ] Create protected layout for (dashboard)
   - [ ] Test redirects (login → dashboard, dashboard → login)

5. **P1-T5**: Implement Login page
   - [ ] Create `app/(auth)/login/page.tsx`
   - [ ] Create `components/forms/LoginForm.tsx`
   - [ ] Form validation (email, password)
   - [ ] Error handling + toast notifications
   - [ ] Loading state + disabled button

6. **P1-T6**: Implement Register page
   - [ ] Create `app/(auth)/register/page.tsx`
   - [ ] Create `components/forms/RegisterForm.tsx`
   - [ ] Validation (business name, email, password strength)
   - [ ] Success redirect to login

7. **P1-T7**: Setup Toast/Notification system
   - [ ] Create `context/ToastContext.tsx`
   - [ ] Create `components/common/Toast.tsx`
   - [ ] Implement useToast hook

**Estimated**: 5–6 days

---

### Phase 2: Feature Implementation (Weeks 3–4)

**Goal**: Todas as principais features CRUD funcionando

#### Phase 2.1: Appointments (4–5 days)

1. **P2-T1**: List Appointments page
   - [ ] Create `app/(dashboard)/appointments/page.tsx`
   - [ ] Create `modules/appointments/components/AppointmentList.tsx`
   - [ ] Fetch de API + loading state
   - [ ] Pagination + filtering (date, professional, status)
   - [ ] Sorting

2. **P2-T2**: Appointment Detail modal
   - [ ] Create `modules/appointments/components/AppointmentDetail.tsx`
   - [ ] Show appointment info + client details
   - [ ] Action buttons (confirm, cancel, reschedule)

3. **P2-T3**: Create/Edit Appointment form
   - [ ] Create `modules/appointments/components/AppointmentForm.tsx`
   - [ ] Client selection dropdown
   - [ ] Professional + date/time picker
   - [ ] Service selection
   - [ ] Form validation + error handling

4. **P2-T4**: Appointments hooks
   - [ ] Create `modules/appointments/hooks/useAppointments.ts`
   - [ ] Create `modules/appointments/hooks/useAppointmentForm.ts`

#### Phase 2.2: Professionals (3–4 days)

1. **P2-T5**: List Professionals page
   - [ ] Create `app/(dashboard)/professionals/page.tsx`
   - [ ] List with actions (edit, delete, view availability)
   - [ ] Search + filtering

2. **P2-T6**: Professional Form
   - [ ] Create/Edit professional
   - [ ] Assign services
   - [ ] Set availability/hours

#### Phase 2.3: Clients (3–4 days)

1. **P2-T7**: List Clients page
   - [ ] Create `app/(dashboard)/clients/page.tsx`
   - [ ] Client search + filtering
   - [ ] View client history

2. **P2-T8**: Client Form
   - [ ] Create/Edit client
   - [ ] Contact info validation

#### Phase 2.4: Services & Dashboard (3–4 days)

1. **P2-T9**: Dashboard overview page
   - [ ] Create `app/(dashboard)/page.tsx`
   - [ ] Stats cards (total appointments, clients, revenue)
   - [ ] Recent appointments list
   - [ ] Quick actions

2. **P2-T10**: Services listing + inventory
   - [ ] Create `app/(dashboard)/services/page.tsx`
   - [ ] List services + products
   - [ ] CRUD for services

**Estimated**: 12–15 days (can parallelize some tasks)

---

### Phase 3: Polish, Testing & Optimization (Week 5–6)

**Goal**: Performance, accessibility, full test coverage, production-ready

#### Phase 3 Tasks

1. **P3-T1**: Unit tests (hooks, utilities, services)
   - [ ] Test useAuth hook
   - [ ] Test API client interceptors
   - [ ] Test form validation helpers
   - [ ] Target: > 70% coverage

2. **P3-T2**: Component tests (critical forms, modals)
   - [ ] Test LoginForm
   - [ ] Test AppointmentForm
   - [ ] Test Toast notifications

3. **P3-T3**: E2E tests (login → list → create)
   - [ ] Create Playwright ou Cypress tests
   - [ ] Login flow
   - [ ] Create appointment flow

4. **P3-T4**: Performance optimization
   - [ ] Code splitting + lazy loading routes
   - [ ] Image optimization (next/image)
   - [ ] Bundle analysis
   - [ ] Run Lighthouse audit

5. **P3-T5**: Accessibility improvements
   - [ ] Semantic HTML
   - [ ] ARIA labels
   - [ ] Keyboard navigation
   - [ ] Color contrast validation

6. **P3-T6**: Error handling & edge cases
   - [ ] Network error fallbacks
   - [ ] Timeout handling
   - [ ] Offline mode (if in scope)
   - [ ] Session expiration handling

7. **P3-T7**: Documentation
   - [ ] README setup instructions
   - [ ] Component storybook (optional)
   - [ ] API integration guide

8. **P3-T8**: Deploy setup
   - [ ] Vercel ou Docker configuration
   - [ ] CI/CD pipeline
   - [ ] Environment-specific builds

**Estimated**: 8–10 days

---

## Complexity Tracking

| Task | Complexity | Justification | Dependencies |
|------|-----------|---------------|--------------|
| Auth setup | HIGH | JWT flow, interceptors, context | P1-T1 |
| API client | MEDIUM | Standard axios setup | P1-T1 |
| Forms + validation | MEDIUM | React Hook Form + Zod | P1-T1 |
| Appointments CRUD | HIGH | Complex state, filtering, date handling | P1-T4 |
| Testing suite | MEDIUM | Vitest + RTL learning curve | P0-T4 |
| Performance optimization | MEDIUM | Bundle analysis, code splitting | P3-T4 |

---

## Definition of Done (Feature Complete)

A feature is considered **complete** when:

- [x] All tasks ✅ (code + tests)
- [x] TypeScript: zero errors (strict mode)
- [x] Tests: > 70% coverage on critical paths
- [x] Code review: peer approved
- [x] Accessibility: basic WCAG 2.1 AA
- [x] Performance: meets budgets (FCP < 2s, bundle < 200KB)
- [x] Documentation: README updated
- [x] Merged to `main` branch

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Backend API delays | MEDIUM | Mock API responses early; use Storybook for UI development |
| Type mismatch (frontend ↔ backend) | HIGH | Generate types from OpenAPI (e.g., openapi-typescript) |
| Performance regression | MEDIUM | Bundle analysis on every build; Lighthouse CI |
| State management complexity | MEDIUM | Start simple (Context API); migrate to Zustand if needed |
| Testing fatigue | MEDIUM | Focus on critical paths; use Snapshot tests for UI |

---

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Page Load (FCP) | < 2s | 🔄 |
| Lighthouse Score (Mobile) | ≥ 80 | 🔄 |
| Type Coverage | 100% | 🔄 |
| Test Coverage | ≥ 70% | 🔄 |
| Bundle Size (gzipped) | < 200KB | 🔄 |
| All features documented | 100% | 🔄 |

---

## Timeline (Gantt Overview)

```
Week 1: P0 (Setup)            |████| ← Infrastructure ready
Week 2: P1 (Auth + Core)      |     ████| ← Auth + API working
Week 3: P2.1 (Appointments)   |     |████| ← First feature
Week 4: P2.2–P2.4 (Features)  |     |     ████| ← Full CRUD
Week 5–6: P3 (Polish + Tests) |     |     |     ████| ← Production ready
```

---

## Branch Strategy

- **Main branch**: `main` (production-ready code)
- **Feature branches**: `feature/001-auth`, `feature/002-appointments`, etc
- **Bug branches**: `bugfix/issue-123`
- **Release branches**: `release/v1.0.0`

Each phase = 1 feature branch; merge via PR with CI checks.

---

## References

- Backend OpenAPI: [`backend-openapi-spec.yml`](../../backend-openapi-spec.yml) (raiz do projeto)
- Feature Spec: [spec.md](./spec.md)
