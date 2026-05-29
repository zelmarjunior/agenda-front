# Backend vs Frontend — Comparação de Estrutura

Veja como o **backend** e **frontend** compartilham os mesmos princípios, mas adaptados para suas tecnologias.

---

## 📋 Constituição

### Backend (NestJS + TypeORM)

**Arquivo**: `../../agenda-back/.specify/memory/constitution.md`

**Princípios Principais**:
1. Test-First Development (Jest + Supertest)
2. **API-First Design** (OpenAPI contratos)
3. Arquitetura em Camadas (Controller → Service → Repository)
4. Segurança por Padrão (JWT, Guards)
5. Simplicidade (YAGNI)
6. Integridade de Dados (soft delete, migrations)
7. Padrões de Resposta (data, message, statusCode)
8. Privacidade/LGPD
9. Padrões de Código (inglês, strict TypeScript)
10. Padrões NestJS (modules, dependency injection)

### Frontend (Next.js + React)

**Arquivo**: `.specify/memory/constitution.md` (ESTE PROJETO)

**Princípios Principais**:
1. Test-First Development (Vitest + RTL)
2. **Component-Driven Design** (reutilizáveis)
3. Type Safety Absoluta (strict TypeScript)
4. State Management Simplificado (Context → Zustand)
5. Performance & Otimização (< 2s FCP)
6. Segurança & Privacidade (JWT, XSS prevention)
7. Acessibilidade (WCAG 2.1 AA)
8. Padrões de Código (inglês, inglês, inglês)
9. Arquitetura de Módulos (Feature-Driven)
10. **Padrões Next.js** (Server Components, App Router)

---

## 📁 Estrutura .specify

### Backend

```
agenda-back/.specify/
├── memory/
│   └── constitution.md      # Princípios NestJS
├── templates/
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── tasks-template.md
│   ├── checklist-template.md
│   └── constitution-template.md
├── scripts/
├── extensions/
├── workflows/
└── README.md
```

### Frontend

```
agenda-front/.specify/
├── memory/
│   └── constitution.md      # Princípios React/Next.js
├── templates/
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── tasks-template.md
│   ├── checklist-template.md
│   └── constitution-template.md
├── scripts/
├── extensions/
├── workflows/
├── README.md
└── QUICK_REFERENCE.md       # Este projeto (adicionado)
```

**Diferença**: Frontend tem `QUICK_REFERENCE.md` adicional.

---

## 🏗️ Arquitetura de Camadas

### Backend (NestJS)

```
HTTP Request
    ↓
[Controller]          ← Routes, parsing, validation
    ↓
[Service]             ← Business logic, orchestration
    ↓
[Repository]          ← Database queries
    ↓
[Database]            ← MySQL
```

**Guards**: JWT authentication, business scope

**Exception Filter**: Tratamento global de erros

### Frontend (Next.js + React)

```
HTTP Request (from browser)
    ↓
[Middleware]          ← Authentication check, redirect
    ↓
[Page/Component]      ← UI rendering, user interaction
    ↓
[Hooks/Services]      ← Fetch data, transform, manage state
    ↓
[API Client]          ← Axios with interceptors
    ↓
[Backend API]         ← ../../agenda-back
```

**Context API**: Global state (auth, theme, notifications)

**Error Boundary**: React error handling

---

## 🧪 Testing Strategy

### Backend

| Layer | Test Type | Tool | Coverage Target |
|-------|-----------|------|-----------------|
| Service | Unit | Jest | ≥ 80% |
| Controller | Integration | Supertest | ≥ 70% |
| Repository | Integration | Jest + DB | ≥ 70% |
| E2E | End-to-End | Supertest | Critical paths |

**Command**: `npm run test:cov`

### Frontend

| Layer | Test Type | Tool | Coverage Target |
|-------|-----------|------|-----------------|
| Hooks | Unit | Vitest | ≥ 80% critical |
| Utils | Unit | Vitest | ≥ 80% critical |
| Components | Component | RTL | ≥ 70% critical |
| Features | E2E | Playwright | Critical paths |

**Command**: `npm run test:cov`

---

## 🔐 Security

### Backend

- JWT authentication (Bearer token)
- Guards (JwtAuthGuard, BusinessScopeGuard)
- Input validation (class-validator DTOs)
- Environment variables (no secrets in code)
- Soft delete (data never lost)

### Frontend

- JWT in localStorage (auto-expiration)
- Middleware redirects to login (no token)
- XSS prevention (React escaping)
- Input validation (Zod + React Hook Form)
- HTTPS only in production
- No sensitive data in logs

---

## 📊 Constitution Checks (Gates)

### Backend Checks

| Gate | Checked In | Pass/Fail |
|------|-----------|-----------|
| I. Test-First | plan.md tasks section | PASS/FAIL |
| II. API-First | plan.md contracts | PASS/FAIL |
| III. Layered Architecture | plan.md structure | PASS/FAIL |
| IV. Security | plan.md auth section | PASS/FAIL |
| V. Simplicity | plan.md complexity table | PASS/FAIL |
| Tech Stack | plan.md dependencies | PASS/FAIL |

### Frontend Checks

| Gate | Checked In | Pass/Fail |
|------|-----------|-----------|
| I. Test-First | plan.md tasks section | PASS/FAIL |
| II. Component-Driven | plan.md structure | PASS/FAIL |
| III. Type Safety | plan.md TypeScript setup | PASS/FAIL |
| IV. State Management | plan.md state architecture | PASS/FAIL |
| V. Performance | plan.md performance section | PASS/FAIL |
| VI. Accessibility | plan.md WCAG 2.1 AA | PASS/FAIL |
| Tech Stack | plan.md dependencies | PASS/FAIL |

---

## 🎯 Feature Development Phases

### Backend Example: "Create Appointments"

**Phase 0**: Setup (1 day)
- Migrations, Entity, DTO, Repository scaffold

**Phase 1**: Tests + API Contract (1 day)
- Unit tests (Service), Integration tests (Controller)
- OpenAPI documented

**Phase 2**: Implementation (2 days)
- Service logic, Repository queries, Controller endpoints

**Phase 3**: Polish (1 day)
- Error handling, validation, documentation

### Frontend Example: "List Appointments"

**Phase 0**: Setup (1 day)
- Types, Mocks, Test scaffolds

**Phase 1**: Components + Hooks (2 days)
- AppointmentTable component, useAppointments hook
- Component tests with RTL

**Phase 2**: Integration (1 day)
- Connect to backend API, add filtering/pagination

**Phase 3**: Polish (1 day)
- Performance, accessibility, documentation

---

## 📚 Documentation Structure

### Backend Feature Example

```
specs/001-salon-scheduling-platform/
├── spec.md              # "What is Agenda Back?"
├── plan.md              # "4-phase implementation"
├── tasks.md             # "NestJS tasks per phase"
├── data-model.md        # "Database entities"
├── research.md          # "Tech stack decisions"
└── contracts/
    └── openapi.yml      # API contract FIRST
```

### Frontend Feature Example

```
specs/001-salon-scheduling-platform/
├── spec.md              # "What is Agenda Front?"
├── plan.md              # "4-phase implementation"
├── tasks.md             # "React tasks per phase"
├── data-model.md        # "TypeScript types"
├── research.md          # "Tech stack decisions"
└── contracts/
    └── [reference backend openapi]
```

---

## 🔄 Synchronization Points

Both backend and frontend must stay synchronized:

### API Contract
- **Source**: Backend OpenAPI (`../../agenda-back/specs/.../contracts/openapi.yml`)
- **Usage Frontend**: Generate types with `openapi-typescript`
- **Ensure**: Request/response types match exactly

### Type Definitions
- **Backend**: Entity + DTO in NestJS
- **Frontend**: Corresponding TypeScript interfaces from OpenAPI
- **Tool**: `openapi-typescript` auto-generates frontend types

### Error Handling
- **Backend**: Global ExceptionFilter formats errors
- **Frontend**: Interceptor handles errors (401, 403, 500, etc)
- **Contract**: Both use same response structure: `{ error, message, statusCode }`

### Authentication
- **Backend**: JWT issued, validated, refresh logic
- **Frontend**: JWT stored, interceptor adds to headers, auto-logout on 401
- **Flow**: Same JWT, different handling

---

## ✅ Checklist: Projeto Alinhado

- [ ] Backend constitution vs Frontend constitution — princípios aligned?
- [ ] API contract definido no backend — frontend types gerados?
- [ ] Error responses — backend e frontend usar mesmo formato?
- [ ] Authentication — backend issues JWT, frontend stores + uses?
- [ ] Testing — backend ≥ 80%, frontend ≥ 70%?
- [ ] Documentation — spec/plan/tasks completas em ambos?
- [ ] Code style — inglês, TypeScript strict, linting em ambos?

---

## 🎓 Learning Path

1. **Read Backend Constitution** → Entender fundamentos
2. **Read Frontend Constitution** → Entender adaptações para React
3. **Compare Both** → Ver diferenças by-layer
4. **Implement Feature (Backend First)** → NestJS
5. **Implement Feature (Frontend)** → React
6. **Sync Types** → openapi-typescript
7. **Test Both** → Jest + Vitest
8. **Deploy** → Backend, then Frontend

---

**Version**: 1.0.0 | **Last Updated**: 2026-05-28
