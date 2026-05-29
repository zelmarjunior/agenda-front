# Spec Kit — Projeto Agenda Front

<!-- SPECKIT START -->

## 🎯 O que é Spec Kit?

**Spec Kit** é um sistema de especificação e planejamento que garante que TODO desenvolvimento siga princípios claros, consistentes e obrigatórios.

Tem 3 partes:

1. **Constitution** — 10 Princípios obrigatórios
2. **Templates** — Estrutura para spec/plan/tasks
3. **Documentation** — Guias, referências, checklists

---

## 📚 Documentação

Leia **nesta ordem**:

### 1. Começar (5 min)
- **[`.specify/README.md`](./.specify/README.md)** — O que é Spec Kit?
- **[`.specify/QUICK_REFERENCE.md`](./.specify/QUICK_REFERENCE.md)** — Resumo rápido

### 2. Princípios (20 min)
- **[`.specify/memory/constitution.md`](./.specify/memory/constitution.md)** — 10 Princípios

### 3. Comparação (10 min)
- **[`.specify/BACKEND_VS_FRONTEND.md`](./.specify/BACKEND_VS_FRONTEND.md)** — Backend vs Frontend

### 4. Mapas (5 min)
- **[`.specify/DIRECTORY_MAP.md`](./.specify/DIRECTORY_MAP.md)** — Estrutura visual

### 5. Feature Atual
- **[`specs/001-salon-scheduling-platform/spec.md`](../specs/001-salon-scheduling-platform/spec.md)** — Requisitos atuais
- **[`specs/001-salon-scheduling-platform/plan.md`](../specs/001-salon-scheduling-platform/plan.md)** — Plano de implementação
- **[`specs/001-salon-scheduling-platform/tasks.md`](../specs/001-salon-scheduling-platform/tasks.md)** — Tarefas

---

## 🏛️ Constitution — 10 Princípios

Toda feature DEVE respeitar esses 10 princípios:

| # | Princípio | O que significa? |
|---|-----------|-----------------|
| I | Test-First Development | Escrever testes ANTES de código |
| II | Component-Driven Design | Componentes reutilizáveis, bem-tipados |
| III | Type Safety Absoluta | TypeScript strict, zero `any` |
| IV | State Management | useState → Context → SWR/React Query |
| V | Integração com API Backend | axios, interceptors, tipos do OpenAPI |
| VI | Acessibilidade & Responsividade | WCAG 2.1 AA, mobile-first (360px+) |
| VII | Performance & Otimização | < 2s FCP, < 200KB bundle, Lighthouse ≥ 80 |
| VIII | Segurança & Privacidade | JWT, XSS prevention, dados seguros |
| IX | Padrões de Código | Inglês, convenções claras, Prettier + ESLint |
| X | Arquitetura de Módulos | Feature-driven, coesão alta |

**Leia**: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)

---

## 🚀 Como Criar Uma Feature

### 1. Criar Diretório

```bash
mkdir -p specs/[###-feature-name]/{checklists,contracts}
cd specs/[###-feature-name]
```

### 2. Copiar Templates

```bash
cp ../../.specify/templates/spec-template.md spec.md
cp ../../.specify/templates/plan-template.md plan.md
cp ../../.specify/templates/tasks-template.md tasks.md
cp ../../.specify/templates/checklist-template.md checklists/phase-0.md
```

### 3. Preencher spec.md

Defina:
- O quê? (Overview)
- Para quem? (Personas)
- Quais features?
- Como se parece? (UI)
- Que dados? (Types)
- Critérios de aceitação?

### 4. Preencher plan.md

Defina:
- Como será arquitetado?
- Quais fases?
- Structure de arquivos?
- Constitution checks (7 gates)
- Riscos?

### 5. Validar Constitution (CRITICAL!)

Todos os **7 gates DEVEM passar**:

- [ ] I. Test-First — Testes planejados antes de código?
- [ ] II. Component-Driven — Componentes reutilizáveis?
- [ ] III. Type Safety — TypeScript strict?
- [ ] IV. State Management — Arquitetura clara (local vs Context vs SWR)?
- [ ] V. API Integration — axios + interceptors + tipos do OpenAPI definidos?
- [ ] VI. Accessibility — WCAG 2.1 AA + Mobile-first (360px+)?
- [ ] VII. Performance — Budgets definidos (FCP < 2s, bundle < 200KB, Lighthouse ≥ 80)?

**Se algum gate FALHA → REFINE O PLANO. NÃO comece implementação!**

### 6. Preencher tasks.md

Quebre em tarefas:
- Phase 0 tasks
- Phase 1 tasks
- Phase 2 tasks
- etc

Cada task tem:
- Descrição
- Subtasks
- Definition of Done
- Time estimate
- Dependencies

### 7. Começar Implementação

Use `tasks.md` para guiar trabalho.
Use `checklists/phase-[N].md` por fase.

---

## 📋 Templates

Todos os templates estão em `.specify/templates/`:

| Template | Para | Quando usar |
|----------|------|-------------|
| `spec-template.md` | Requisitos | PRIMEIRA: definir o quê |
| `plan-template.md` | Arquitetura | SEGUNDA: definir como |
| `tasks-template.md` | Tarefas | TERCEIRA: quebrar em work |
| `checklist-template.md` | Validação | DURANTE: por fase |
| `constitution-template.md` | Constituição | Raramente: nova constituição |

---

## ☑️ Gates: Constitution Checks

Antes de começar QUALQUER implementação, verificar:

```
Gate I: Test-First Development
  ✓ Testes planejados ANTES de implementação?
  ✓ Cycle Red → Green → Refactor planejado?

Gate II: Component-Driven Design
  ✓ Componentes reutilizáveis identificados?
  ✓ Arquitetura de props clara?

Gate III: Type Safety Absoluta
  ✓ TypeScript strict mode?
  ✓ Todos os tipos explícitos?

Gate IV: State Management Simplificado
  ✓ useState vs Context vs Zustand definido?
  ✓ Data flow claro?

Gate V: Integração com API Backend
  ✓ axios client planejado (services/api.ts)?
  ✓ Interceptors para JWT + 401 handling?
  ✓ Tipos gerados/alinhados com OpenAPI backend?

Gate VI: Acessibilidade WCAG 2.1 AA
  ✓ Mobile-first (360px+)?
  ✓ Semantic HTML?
  ✓ ARIA labels em componentes customizados?

Gate VII: Performance & Otimização
  ✓ FCP < 2s target?
  ✓ Bundle size < 200KB (gzipped)?
  ✓ Code splitting planejado?
```

**TODAS as 7 gates DEVEM passar. Caso contrário, refine o plano.**

---

## 🔄 Fluxo Completo

```
User describe feature
         ↓
Preencher spec.md (requisitos)
         ↓
Preencher plan.md (arquitetura)
         ↓
7 Constitution Gates Check?
    ↓ (If FAIL → Refine plan)
    ↓ (If PASS ✅ → Continue)
Preencher tasks.md (tarefas)
         ↓
Phase 0: Setup
  Use: checklists/phase-0.md
  When done → Phase 1
         ↓
Phase 1: Architecture & Core
  Use: checklists/phase-1.md
  When done → Phase 2
         ↓
Phase 2: Features
  Use: checklists/phase-2.md
  When done → Phase 3
         ↓
Phase 3: Polish & Tests
  Use: checklists/phase-3.md
  When done → Merge!
         ↓
PR + Compliance Checklist
  Constitution OK? ✅
  Tests OK? ✅
  Code OK? ✅
  Review OK? ✅
         ↓
MERGE ✅
```

---

## 📊 Current Feature: 001-salon-scheduling-platform

O projeto atual está em **Phase 0** (Setup).

### Documentos

- **[spec.md](../specs/001-salon-scheduling-platform/spec.md)** — Requisitos completos
- **[plan.md](../specs/001-salon-scheduling-platform/plan.md)** — Plano 4 fases
- **[tasks.md](../specs/001-salon-scheduling-platform/tasks.md)** — Tarefas Phase 0
- **[data-model.md](../specs/001-salon-scheduling-platform/data-model.md)** — Tipos TypeScript
- **[research.md](../specs/001-salon-scheduling-platform/research.md)** — Tool references
- **[quickstart.md](../specs/001-salon-scheduling-platform/quickstart.md)** — Setup local

### Checklist

- **[checklists/phase-0-setup.md](../specs/001-salon-scheduling-platform/checklists/phase-0-setup.md)** — Current phase

### Status

```
Phase 0: Setup & Infrastructure
  - TypeScript configuration: ✅
  - Folder structure: ✅
  - Documentation: ✅
  - Next: Configure ESLint + Prettier
```

---

## 🎓 Learning Resources

### Backend Constitution (para comparação)

Se quer ver como backend faz:  
→ **[`../../agenda-back/.specify/memory/constitution.md`](../../agenda-back/.specify/memory/constitution.md)**

### Backend vs Frontend

→ **[`.specify/BACKEND_VS_FRONTEND.md`](./.specify/BACKEND_VS_FRONTEND.md)**

---

## ❓ FAQs

**P: Por onde começo?**  
R: 1. Leia `.specify/QUICK_REFERENCE.md`  
   2. Leia `constitution.md`  
   3. Leia feature spec atual em `specs/001-salon-scheduling-platform/spec.md`

**P: Como criar nova feature?**  
R: Siga os 7 passos em "Como Criar Uma Feature" acima.

**P: Constitution checks — o que fazer se um gate falha?**  
R: **NÃO comece implementação.** Refine `plan.md` até passar.

**P: Preciso preencher TODOS os templates?**  
R: Sim. Se algo não se aplica, escreva "N/A" com razão.

**P: Como sincronizar com backend?**  
R: Tipos vêm do OpenAPI backend. Use `openapi-typescript`.

**P: E se mudar de ideia durante desenvolvimento?**  
R: Atualize os docs (spec/plan/tasks) no mesmo PR do código. Mantenha sincronizado.

---

## 📞 Support

- Confuso? → Leia `.specify/QUICK_REFERENCE.md`
- Quer saber mais? → Leia `.specify/DIRECTORY_MAP.md`
- Quer comparar? → Leia `.specify/BACKEND_VS_FRONTEND.md`
- Quer exemplo? → Veja `specs/001-salon-scheduling-platform/`

---

<!-- SPECKIT END -->

**Status**: ✅ Spec Kit Setup Complete  
**Version**: 1.0.0  
**Last Updated**: 2026-05-28

Now go build! 🚀
