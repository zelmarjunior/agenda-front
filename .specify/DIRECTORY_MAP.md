# .specify Directory Structure — Visual Map

Estrutura completa do Spec Kit para o projeto Agenda Front.

## 📦 Estrutura Completa

```
agenda-front/
│
├── .specify/                              ← Spec Kit (este diretório)
│   ├── README.md                          ← 📖 Leia isto primeiro!
│   ├── QUICK_REFERENCE.md                 ← ⚡ Referência rápida
│   ├── BACKEND_VS_FRONTEND.md             ← 🔄 Comparação
│   ├── feature.json                       ← ⚙️ Configuração
│   │
│   ├── memory/
│   │   └── constitution.md                ← 🏛️ 10 Princípios obrigatórios
│   │
│   ├── templates/
│   │   ├── spec-template.md               ← 📋 Template de Requisitos
│   │   ├── plan-template.md               ← 🗓️ Template de Plano
│   │   ├── tasks-template.md              ← ✅ Template de Tarefas
│   │   ├── checklist-template.md          ← ☑️ Template de Checklist
│   │   └── constitution-template.md       ← 🏛️ Template de Constituição
│   │
│   ├── scripts/
│   │   ├── check-constitution.sh
│   │   ├── validate-spec.sh
│   │   └── generate-types.sh
│   │
│   ├── extensions/
│   │   └── [customizations]
│   │
│   └── workflows/
│       └── [automation]
│
├── specs/                                 ← 📚 Especificações de Features
│   │
│   └── 001-salon-scheduling-platform/
│       ├── spec.md                        ← ✅ Requisitos completos
│       ├── plan.md                        ← ✅ Plano 4 fases
│       ├── tasks.md                       ← ✅ Tarefas por fase
│       ├── data-model.md                  ← ✅ Tipos TypeScript
│       ├── research.md                    ← ✅ Referências
│       ├── quickstart.md                  ← ✅ Setup local
│       │
│       ├── checklists/
│       │   ├── phase-0-setup.md           ← Checklist: Setup
│       │   ├── phase-1-architecture.md    ← Checklist: Arquitetura
│       │   └── phase-2-features.md        ← Checklist: Features
│       │
│       └── contracts/
│           └── [openapi-appointments.yml] ← API Contract (reference)
│
├── src/                                   ← 💻 Código-fonte
│   ├── app/                               ← Next.js pages
│   ├── modules/                           ← Feature modules
│   ├── components/                        ← Reusable components
│   ├── services/                          ← API client
│   ├── hooks/                             ← Custom hooks
│   ├── types/                             ← TypeScript types
│   ├── utils/                             ← Utilities
│   ├── context/                           ← React Context
│   └── styles/                            ← Global styles
│
└── [outros arquivos]
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── .env.example
    ├── README.md
    └── ...
```

---

## 🗺️ Mapa de Navegação

### 🏁 Começar Aqui

```
.specify/
├── README.md                    ← O que é Spec Kit?
├── QUICK_REFERENCE.md           ← Resumo de tudo
└── constitution.md              ← Os 10 Princípios
```

**Leitura recomendada**: 15 minutos

---

### 📊 Entender Projeto

```
specs/001-salon-scheduling-platform/
├── spec.md                      ← O que é Agenda Front?
├── plan.md                      ← Como será feito?
├── data-model.md                ← Que tipos?
└── research.md                  ← Que ferramentas?
```

**Leitura recomendada**: 30 minutos

---

### ✅ Fazer Uma Feature

```
1. Criar diretório:
   mkdir -p specs/[###-feature]/{checklists,contracts}

2. Copiar templates:
   cp .specify/templates/spec-template.md specs/[###-feature]/spec.md
   cp .specify/templates/plan-template.md specs/[###-feature]/plan.md
   cp .specify/templates/tasks-template.md specs/[###-feature]/tasks.md

3. Preencher:
   - spec.md (Requisitos)
   - plan.md (Arquitetura)
   - tasks.md (Tarefas)

4. Validar:
   - Constitution checks (7 gates no plan.md)
   - Passou? → Comece Phase 0
   - Falhou? → Refine plano

5. Implementar:
   - Use tasks.md para guiar trabalho
   - Use checklist-template.md por fase
   - Update docs quando código muda

6. Merge:
   - PR com compliance checklist
   - Constitution checks OK?
   - Testes OK?
   - Merge!
```

---

## 📈 Fluxo de Desenvolvimento

```
┌─────────────────────────────────────────────────────────┐
│ User describe feature (natural language)                │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 1. Preencher spec.md (O quê? Requisitos?)               │
│    Template: .specify/templates/spec-template.md         │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Preencher plan.md (Como? Arquitetura?)               │
│    Template: .specify/templates/plan-template.md         │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. CONSTITUTION CHECK (7 gates)                         │
│    Passar em TODOS os gates?                            │
│                                                         │
│    ☑️ I. Test-First                                    │
│    ☑️ II. Component-Driven                              │
│    ☑️ III. Type Safety                                  │
│    ☑️ IV. State Management                              │
│    ☑️ V. Performance                                    │
│    ☑️ VI. Accessibility                                 │
│    ☑️ VII. Tech Stack                                   │
│                                                         │
│    GATE FAIL? → Refine plan.md                          │
│    GATE PASS? → Continue ✅                             │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Preencher tasks.md (Tarefas granulares)             │
│    Template: .specify/templates/tasks-template.md        │
│    Break down: Phase 0 → Phase 1 → Phase 2 → ...       │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. PHASE 0: Setup & Foundation                          │
│    - TypeScript, ESLint, Prettier                       │
│    - Folder structure                                   │
│    - Example test                                       │
│    Use: specs/.../checklists/phase-0-setup.md          │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 6. PHASE 1: Architecture & Core                         │
│    - State management designed                          │
│    - API client setup                                   │
│    - Core types & hooks                                 │
│    Use: specs/.../checklists/phase-1-architecture.md    │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 7. PHASE 2: Feature Implementation                      │
│    - All main components built                          │
│    - Forms with validation                              │
│    - API integration                                    │
│    Use: specs/.../checklists/phase-2-features.md        │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 8. PHASE 3: Polish & Optimization                       │
│    - Tests (unit, component, e2e)                       │
│    - Performance optimization                          │
│    - Accessibility audit                               │
│    Use: specs/.../checklists/phase-3-polish.md          │
└────────┬────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ 9. MERGE & VERIFY                                       │
│    - PR with compliance checklist                       │
│    - Constitution OK?                                   │
│    - Tests OK?                                          │
│    - Review approved?                                   │
│    - Merge to main ✅                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Templates & Examples

### Como Usar Templates

```
Para TODA nova feature:

1. Copy spec-template.md
   cp .specify/templates/spec-template.md specs/[###-name]/spec.md

2. Copy plan-template.md
   cp .specify/templates/plan-template.md specs/[###-name]/plan.md

3. Copy tasks-template.md
   cp .specify/templates/tasks-template.md specs/[###-name]/tasks.md

4. Copy checklist-template.md (para cada phase)
   cp .specify/templates/checklist-template.md specs/[###-name]/checklists/phase-0.md
   cp .specify/templates/checklist-template.md specs/[###-name]/checklists/phase-1.md
   ...
```

### Exemplo: Feature "Authentication"

```
specs/002-authentication/
├── spec.md              # "What is login/register?"
├── plan.md              # "How: Context + useAuth hook"
├── tasks.md             # "Task-1-T1: Create AuthContext"
├── data-model.md        # "interface User, LoginRequest"
├── research.md          # "JWT best practices"
└── checklists/
    ├── phase-0.md       # "Setup checklist"
    ├── phase-1.md       # "Architecture checklist"
    └── phase-2.md       # "Features checklist"
```

---

## 🎯 Constitution Gates

Todos os PRs devem passar por estes gates:

```
┌─────────────────────────────────────────────┐
│ ☑️ I. Test-First Development               │
│    Testes planejados ANTES de código?      │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ ☑️ II. Component-Driven Design              │
│    Componentes reutilizáveis projetados?   │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ ☑️ III. Type Safety Absoluta                │
│    TypeScript strict + zero any?            │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ ☑️ IV. State Management Simplificado        │
│    Arquitetura clara (Context/hooks)?       │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ ☑️ V. Performance & Otimização              │
│    Budgets definidos (FCP < 2s)?            │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ ☑️ VI. Segurança & Privacidade              │
│    JWT, XSS prevention, dados seguros?      │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ ☑️ VII. Acessibilidade WCAG 2.1 AA          │
│    Mobile-first, a11y planejado?            │
└─────────────────────────────────────────────┘
         ↓
        ALL PASS? ✅
        → Merge approved!
```

---

## 📖 Reading Guide

**First Time?**
1. `.specify/README.md` (overview)
2. `.specify/QUICK_REFERENCE.md` (summary)
3. `.specify/memory/constitution.md` (principles)

**Want to Create Feature?**
1. `spec.md` template
2. `plan.md` template
3. `tasks.md` template
4. Use checklists

**Confused?**
1. Check `.specify/QUICK_REFERENCE.md`
2. Check `.specify/BACKEND_VS_FRONTEND.md`
3. Compare with backend examples

---

## ✅ Checklist: Spec Kit Setup Complete

- [x] Constitution created ✅
- [x] Templates created ✅
- [x] Directory structure created ✅
- [x] Documentation written ✅
- [x] Quick reference created ✅
- [x] Backend comparison created ✅
- [x] feature.json created ✅
- [x] Directory map created (this file) ✅

**Status**: Ready for Feature Specifications! 🚀

---

**Version**: 1.0.0  
**Created**: 2026-05-28  
**Status**: ✅ Complete
