# .specify — Project Specification System

Este diretório contém a estrutura de especificação e planejamento de features usando **Spec Kit**.

## 📁 Estrutura

```
.specify/
├── memory/
│   └── constitution.md          # Princípios fundamentais do projeto
├── templates/
│   ├── constitution-template.md # Template para nova constituição
│   ├── spec-template.md         # Template para especificação de feature
│   ├── plan-template.md         # Template para plano de implementação
│   ├── tasks-template.md        # Template para lista de tarefas
│   └── checklist-template.md    # Template para checklist de fase
├── scripts/
│   └── [utilitários]
├── extensions/
│   └── [integrações customizadas]
└── workflows/
    └── [workflows automáticos]
```

## 🏛️ Constituição

A **constituição** (`constitution.md`) define os princípios e padrões obrigatórios para TODO desenvolvimento neste projeto.

### Princípios Fundamentais:

1. **Test-First Development** — Testes escritos ANTES de código
2. **Component-Driven Design** — Componentes reutilizáveis, bem-tipados
3. **Type Safety Absoluta** — TypeScript strict mode, zero `any`
4. **State Management Simplificado** — useState → Context → Zustand
5. **Performance & Otimização** — Bundle < 200KB, FCP < 2s
6. **Segurança & Privacidade** — HTTPS, XSS prevention, JWT management
7. **Acessibilidade** — WCAG 2.1 AA, mobile-first responsive
8. **Padrões de Código** — Inglês, convenções claras, bem documentado
9. **Arquitetura de Módulos** — Feature-driven, coesão alta
10. **Padrões Next.js** — Server Components, Route Groups, App Router

## 📋 Templates de Feature

Cada feature segue este fluxo de especificação:

### 1. **spec.md** — Definir Requisitos
- O que precisa ser feito?
- Para quem (personas)?
- UI/UX requirements?
- Dados e tipos?
- Critérios de aceitação?

### 2. **plan.md** — Arquitetar Solução
- Como será implementado?
- Fases e subfases?
- Arquitetura de state?
- Componentes principais?
- Riscos e mitigação?

### 3. **tasks.md** — Detalhar Trabalho
- Tarefas específicas por fase
- Subtarefas concretas
- Definição de pronto
- Tempo estimado
- Dependências

### 4. **checklist-template.md** — Validar Conclusão
- Validação de qualidade
- Testes escritos?
- Performance OK?
- Acessibilidade checada?
- PR pronto?

## 🚀 Como Usar

### Criar Nova Feature

1. **Criar diretório de spec**:
   ```bash
   mkdir -p specs/[###-feature-name]
   mkdir -p specs/[###-feature-name]/checklists
   mkdir -p specs/[###-feature-name]/contracts
   ```

2. **Copiar templates**:
   ```bash
   cp .specify/templates/spec-template.md specs/[###-feature-name]/spec.md
   cp .specify/templates/plan-template.md specs/[###-feature-name]/plan.md
   cp .specify/templates/tasks-template.md specs/[###-feature-name]/tasks.md
   cp .specify/templates/checklist-template.md specs/[###-feature-name]/checklists/phase-0.md
   ```

3. **Preencher templates**:
   - Começar com `spec.md` — definir requisitos com usuário
   - Depois `plan.md` — desenhar arquitetura
   - Depois `tasks.md` — quebrar em tarefas
   - Usar `checklists/phase-[N].md` durante desenvolvimento

### Exemplo: Feature "Agendamentos"

```
specs/002-appointments/
├── spec.md          # O que é um agendamento?
├── plan.md          # Como será arquitetado?
├── tasks.md         # Tarefas por fase
├── data-model.md    # Tipos TypeScript
├── research.md      # Referências de tools
├── quickstart.md    # Como rodar localmente
├── checklists/
│   ├── phase-0.md   # Setup checklist
│   ├── phase-1.md   # Architecture checklist
│   └── phase-2.md   # Feature implementation checklist
└── contracts/
    └── openapi-appointments.yml  # Contrato com backend
```

## ✅ Checklist de Spec Kit para Feature Completa

- [ ] **spec.md**: Requisitos claros, personas definidas, critérios de aceitação
- [ ] **plan.md**: Arquitetura, fases, structure, sucesso definido
- [ ] **tasks.md**: Tarefas granulares, dependências, tempo estimado
- [ ] **data-model.md**: Tipos TypeScript, DTOs, estrutura de dados
- [ ] **research.md**: Referências de tools, decisões arquiteturais
- [ ] **quickstart.md**: Como começar a desenvolver a feature
- [ ] **Constituição**: Todos os princípios respeitados no plan/tasks
- [ ] **Checklists**: Um para cada fase

## 🔄 Constitution Check Gates

Toda feature DEVE passar por estas validações ANTES de começar implementação:

| Gate | Questão | Pass/Fail |
|------|---------|-----------|
| **I. Test-First** | Testes planejados ANTES de código? | |
| **II. Component-Driven** | Componentes reutilizáveis projetados? | |
| **III. Type Safety** | TypeScript strict mode? | |
| **IV. State Management** | Arquitetura de estado clara? | |
| **V. Performance** | Budgets definidos? | |
| **VI. Accessibility** | WCAG 2.1 AA? | |
| **Tech Stack** | Next.js 14+, React 18+, TypeScript? | |

Se algum gate falhar → **NÃO COMECE** implementação. Refine o plano primeiro.

## 📖 Referências

### Documentação Backend (para copiar padrões)

```
../../agenda-back/.specify/
├── memory/constitution.md
├── templates/
└── [mesma estrutura]
```

### Documentação Frontend

```
specs/001-salon-scheduling-platform/
├── spec.md          # Requisitos completos da plataforma
├── plan.md          # Plano de implementação (4 fases)
├── tasks.md         # Tarefas de cada fase
└── data-model.md    # Tipos TypeScript compartilhados
```

## 🎯 Fluxo de Desenvolvimento

```
1. Usuário descreve feature em linguagem natural
            ↓
2. Preencher spec.md (requisitos + critérios)
            ↓
3. Preencher plan.md (arquitetura + fases)
            ↓
4. Verificar Constitution (passa nos 7 gates?)
            ↓
5. Preencher tasks.md (tarefas por fase)
            ↓
6. Começar implementação com fase 0
            ↓
7. Usar checklist-template.md para cada fase
            ↓
8. Merge quando checklist + constitution OK
```

## 💡 Dicas

1. **Constitution First**: Leia sempre a constituição ANTES de começar a escrever spec/plan.
2. **Templates Guiam**: Não invente estrutura própria; use os templates.
3. **Gates Salvam**: Os constitution checks evitam retrabalho — não pule!
4. **Checklist é Lei**: Use checklists de fase para não esquecer nada.
5. **PR Compliance**: Todo PR deve verificar conformidade com constitution nos checklists.

## ❓ Perguntas Comuns

**P: E se a constituição não se aplica?**  
R: Mude a constituição! Mas documente por que e obtenha aprovação da equipe.

**P: Preciso preencher TUDO nos templates?**  
R: Sim. Se uma seção não se aplica, escreva "N/A" com justificativa.

**P: Quando começo a codificar?**  
R: Depois que plan.md passa em todos os constitution checks (7 gates).

**P: E se mudar de ideia durante o desenvolvimento?**  
R: Atualize os docs (spec.md, plan.md) no mesmo PR que o código. Mantenha sincronizado.

---

**Status**: ✅ Configurado e Pronto para Use  
**Last Updated**: 2026-05-28  
**Version**: 1.0.0
