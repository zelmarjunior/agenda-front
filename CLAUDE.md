# Agenda Front — Frontend de Agendamento para Beleza

Frontend da plataforma **Agenda** — Next.js + React + Tailwind CSS.

---

## Stack

- **Framework**: Next.js (App Router)
- **Linguagem**: TypeScript (strict)
- **Estilo**: Tailwind CSS
- **HTTP**: axios
- **Testes**: Vitest + React Testing Library
- **Autenticação**: JWT (localStorage)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
# App: http://localhost:3001
# Backend necessário: http://localhost:3000
```

---

## Especificações

Cada página/feature tem sua spec em `specs/`:

```
specs/
├── 001-dashboard/
├── 002-appointments-page/
├── 003-professionals-page/
├── 004-clients-page/
├── 005-inventory-page/
├── 006-reports-page/
└── 007-ai-marketing/
```

Cada pasta contém:
- `spec.md` — user stories e critérios de aceite
- `plan.md` — design técnico e decisões de arquitetura
- `tasks.md` — tasks com status (✅ concluído / ⬜ pendente)

> Legado (não usar): `specs/001-salon-scheduling-platform/`

---

## Estado Atual dos Módulos (2026-05-29)

| Módulo | Especificado | Implementado | Testado |
|---|---|---|---|
| dashboard | ✅ | ✅ | ⚠️ manual |
| appointments-page | ✅ | ✅ | ✅ parcial |
| professionals-page | ✅ | ✅ | ⚠️ manual |
| clients-page | ✅ | ✅ | ⚠️ manual |
| inventory-page | ✅ | ✅ | ⚠️ manual |
| reports-page | ✅ | ✅ | ⚠️ manual |
| ai-marketing | ✅* | ✅ | ⚠️ manual |

> *Spec retroativa — feature foi implementada antes da spec.

---

## Estrutura do Projeto

```
src/
├── app/          # Next.js pages (App Router)
├── components/   # Componentes reutilizáveis
├── modules/      # Features (auth, appointments, etc)
├── services/     # Cliente HTTP / API
├── hooks/
├── types/
└── utils/
```

---

## Regras SDD — NÃO NEGOCIÁVEIS

### 1. Nenhum código novo sem spec

Antes de implementar qualquer feature nova:
1. Execute `/speckit-specify` com a descrição da feature
2. Revise e aprove o `spec.md` gerado
3. Execute `/speckit-plan` para gerar o `plan.md`
4. Execute `/speckit-tasks` para gerar o `tasks.md`
5. Só então comece a implementar

### 2. Toda feature nova começa com /speckit-specify

```bash
# Exemplo:
# /speckit-specify "página de configurações do negócio"
```

### 3. Specs devem ser atualizadas conforme o desenvolvimento avança

- Ao concluir uma task, marque `[x]` no `tasks.md`
- Se o design mudar durante a implementação, atualize `plan.md`
- Se novos requisitos surgirem, adicione ao `spec.md` antes de implementar

### 4. Organização por página/feature

- Cada módulo corresponde a uma página ou feature da UI
- Nunca misture responsabilidades entre módulos
- Estrutura: `src/modules/<feature>/`

---

## Scripts

```bash
npm run dev          # Dev (http://localhost:3001)
npm run build        # Build produção
npm run lint         # ESLint
npm run format       # Prettier
npm test             # Vitest
npm run test:watch   # Watch mode
npm run test:cov     # Coverage
```
