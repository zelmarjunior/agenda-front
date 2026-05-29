# Quick Reference — Spec Kit

Tudo que você precisa saber para usar Spec Kit no Agenda Front.

## 1️⃣ Constitution (Princípios)

**Arquivo**: `.specify/memory/constitution.md`

**O que é**: 10 princípios OBRIGATÓRIOS para todo desenvolvimento.

**Princípios**:
1. ✅ Test-First Development
2. ✅ Component-Driven Design
3. ✅ Type Safety Absoluta
4. ✅ State Management Simplificado
5. ✅ Performance & Otimização
6. ✅ Segurança & Privacidade
7. ✅ Acessibilidade (WCAG 2.1 AA)
8. ✅ Padrões de Código
9. ✅ Arquitetura de Módulos (Feature-Driven)
10. ✅ Padrões Next.js

**Quando usar**: SEMPRE! Antes de qualquer feature.

---

## 2️⃣ Specification (spec.md)

**Template**: `.specify/templates/spec-template.md`

**Conteúdo**:
```
1. Overview — O que é?
2. User Personas — Para quem?
3. Core Features — O que faz?
4. UI Requirements — Como se parece?
5. API Integration — Onde buscam dados?
6. Data Types — Que tipos?
7. Non-Functional Reqs — Performance? Acessibilidade?
8. Acceptance Criteria — Como validar?
9. Open Questions — O que não sabe?
```

**Exemplo**:
```
Feature: Appointment Booking
Overview: Clientes marcam agendamentos com profissionais
Personas: Client, Professional, Owner
Features: 
  - [ ] Browse services
  - [ ] Select date/time
  - [ ] Confirm appointment
UI:
  - Pages: /appointments, /appointments/[id]
  - Components: DatePicker, ServiceSelector, ConfirmModal
API:
  - GET /appointments
  - POST /appointments
  - PATCH /appointments/:id
```

**Quando usar**: PRIMEIRA. Define o que será feito antes de arquitetar.

---

## 3️⃣ Plan (plan.md)

**Template**: `.specify/templates/plan-template.md`

**Conteúdo**:
```
1. Summary — Resumo técnico
2. Technical Context — Stack, ferramentas
3. Constitution Check — Passar nos 7 gates?
4. Project Structure — Pastas/arquivos
5. Phases — Divisão em fases
6. Success Criteria — Como medir sucesso?
7. Risk Mitigation — Problemas e soluções
```

**Exemplo**:
```
Summary: Implementar interface de agendamentos com React hooks + Context API
Tech Stack: Next.js 14, React 18, TypeScript, Tailwind, axios, Vitest + RTL
Constitution Check:
  - I. Test-First: ✅ PASS (testes planejados antes)
  - II. Component-Driven: ✅ PASS
  - III. Type Safety: ✅ PASS
  - IV. State Mgmt: ✅ PASS (Context + useAppointments hook)
  - V. Performance: ✅ PASS (< 2s FCP target)
  - VI. Accessibility: ✅ PASS (WCAG 2.1 AA planned)
  - Tech Stack: ✅ PASS
Phases:
  Phase 0: Setup types, mocks, tests (1-2 days)
  Phase 1: Build components + hooks (2-3 days)
  Phase 2: Integrate API (2-3 days)
  Phase 3: Polish + tests (2 days)
```

**Quando usar**: SEGUNDA. Depois de spec aprovada, desenha como implementar.

---

## 4️⃣ Tasks (tasks.md)

**Template**: `.specify/templates/tasks-template.md`

**Conteúdo**:
```
Phase N: [Phase Name]
  ✅ Task-N-T1: [Title]
     Description, Subtasks, Definition of Done, Time Estimate
  🟡 Task-N-T2: [Title]
     In Progress...
  ⚪ Task-N-T3: [Title]
     Not Started...
```

**Exemplo**:
```
Phase 1: Setup Types & Mocks
  ✅ Task-1-T1: Create TypeScript types for Appointments
     - [ ] Create AppointmentDTO interface
     - [ ] Create AppointmentStatus enum
     - [ ] Export from types/index.ts
     Definition of Done: TypeScript compiles, types exported
     Time: 1 hour
```

**Quando usar**: TERCEIRA. Quebra plan em tarefas concretas para fazer.

---

## 5️⃣ Checklists (checklist-template.md)

**Template**: `.specify/templates/checklist-template.md`

**Uso**: Um checklist POR FASE (phase-0.md, phase-1.md, etc).

**Conteúdo**:
```
Pre-Flight Checks
[Section 1]
[Section 2]
Code Quality
Testing
Performance & Accessibility
Documentation
Git & PR
Final Verification
Sign-Off
```

**Exemplo**:
```
Phase 0: Setup Checklist
  Pre-Flight:
    - [ ] Spec read and understood
    - [ ] Plan reviewed
  Code Quality:
    - [ ] TypeScript: zero errors
    - [ ] ESLint: no violations
  Testing:
    - [ ] Unit tests passing
    - [ ] ≥ 70% coverage
  Final Verification:
    - [ ] Feature works as spec
    - [ ] No regressions
```

**Quando usar**: DURANTE. A cada fase, use o checklist correspondente.

---

## 📊 Fluxo Completo

```
User describe feature (natural language)
         ↓
1. Preencher spec.md (O quê?)
         ↓
2. Preencher plan.md (Como?)
         ↓
3. Verificar Constitution (Está OK?)
         ↓ (GATE: Todos os 7 principles OK?)
         ↓
4. Preencher tasks.md (Tarefas granulares)
         ↓
5. Começar Phase 0 com tasks.md
         ↓
6. Usar checklist-template.md para cada fase
         ↓ (Done quando checklist 100% + constitution OK)
         ↓
7. Próxima fase
         ↓
8. Merge quando tudo OK (spec + plan + tasks + checklist + constitution)
```

---

## 🔒 Constitution Checks (7 Gates)

Toda feature TEM QUE PASSAR nesses checks antes de começar:

| # | Princípio | Pergunta | Se FAIL... |
|---|-----------|----------|-----------|
| I | Test-First | Testes planejados ANTES de código? | Redesenhe tasks com testes primeiro |
| II | Component-Driven | Componentes reutilizáveis projetados? | Redesenhe arquitetura |
| III | Type Safety | TypeScript strict mode + zero any? | Configure TypeScript |
| IV | State Mgmt | Arquitetura de estado clara (Context/hooks)? | Desenhe state flow |
| V | Performance | Budgets definidos (FCP < 2s)? | Adicione perf tests |
| VI | Accessibility | WCAG 2.1 AA planejado? | Adicione a11y tasks |
| Tech Stack | Next.js 14+, React 18+? | Valide dependências |

**Se algum gate FALHA → NÃO comece implementação**. Arregle o plano.

---

## 📁 Estrutura de Uma Feature Completa

```
specs/002-appointments/
├── spec.md                      # O quê? (requisitos)
├── plan.md                      # Como? (arquitetura)
├── tasks.md                     # Tarefas por fase
├── data-model.md                # Tipos TypeScript
├── research.md                  # Referências
├── quickstart.md                # Setup local
├── checklists/
│   ├── phase-0-setup.md         # Checklist Phase 0
│   ├── phase-1-arch.md          # Checklist Phase 1
│   └── phase-2-features.md      # Checklist Phase 2
└── contracts/
    └── appointments-api.yml     # OpenAPI (se necessário)
```

---

## 🎯 Exemplos Práticos

### Feature: Authentication

**spec.md**: "Usuário faz login com email/senha"
**plan.md**: "Context + useAuth hook + JWT em localStorage"
**tasks.md**:
- Task-1-T1: Create AuthContext
- Task-1-T2: Create useAuth hook
- Task-1-T3: Create LoginForm component
- Task-1-T4: Create middleware para rotas protegidas
**checklist-0.md**: "TypeScript? Testes? Performance?"

### Feature: Appointment List

**spec.md**: "Profissional vê lista de agendamentos do dia"
**plan.md**: "SWR para fetch, Tailwind table, pagination"
**tasks.md**:
- Task-2-T1: Create AppointmentTable component
- Task-2-T2: Create useAppointments hook (fetch + cache)
- Task-2-T3: Add filtering (date, status)
- Task-2-T4: Add pagination
**checklist-0.md**: Validar tudo

---

## 🚫 Erros Comuns

❌ **Erro**: Começar código antes de spec.md completa  
✅ **Certo**: spec.md → plan.md → tasks.md → DEPOIS código

❌ **Erro**: Pular constitution checks  
✅ **Certo**: 7 gates devem passar ANTES de iniciar phase 0

❌ **Erro**: Não atualizar docs quando código muda  
✅ **Certo**: Manter spec/plan/tasks sincronizados com código

❌ **Erro**: Usar checklist genérico  
✅ **Certo**: Criar checklist específico para cada fase

---

## 🆘 Help

**"Por onde começo?"**  
→ Leia `constitution.md` primeiro. Entenda os 10 princípios.

**"Qual template usar?"**  
→ spec.md (requisitos) → plan.md (arquitetura) → tasks.md (tarefas)

**"Como validar?"**  
→ Constitution checks (7 gates) no plan.md

**"Estou preso?"**  
→ Atualize os docs (spec/plan/tasks). Refine até ficar claro.

---

**Version**: 1.0.0 | **Last Updated**: 2026-05-28
