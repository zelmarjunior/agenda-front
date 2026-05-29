<!-- SPECKIT START -->

# Agenda Front — Especificação & Planejamento

Bem-vindo ao projeto frontend da plataforma **Agenda** (agendamento para salões de beleza).

## 📚 Documentação Rápida

Leia nesta ordem:

1. **[quickstart.md](./specs/001-salon-scheduling-platform/quickstart.md)** — Setup rápido (5 min)
2. **[spec.md](./specs/001-salon-scheduling-platform/spec.md)** — Requisitos e features
3. **[plan.md](./specs/001-salon-scheduling-platform/plan.md)** — Arquitetura e plano de implementação
4. **[tasks.md](./specs/001-salon-scheduling-platform/tasks.md)** — Tarefas por fase (quando pronto)
5. **[data-model.md](./specs/001-salon-scheduling-platform/data-model.md)** — Tipos TypeScript & DTOs

## 🏗️ Estrutura do Projeto

```
.
├── specs/
│   └── 001-salon-scheduling-platform/
│       ├── spec.md          ← Leia isto
│       ├── plan.md
│       ├── tasks.md
│       ├── data-model.md
│       ├── research.md
│       ├── quickstart.md
│       ├── checklists/
│       └── contracts/
├── src/
│   ├── app/                 # Next.js pages (App Router)
│   ├── components/
│   ├── modules/             # Features (auth, appointments, etc)
│   ├── services/            # API client
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── styles/
├── .claude/
│   └── settings.local.json
└── ...
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
cp .env.example .env.local

# 3. Start dev server
npm run dev

# Open http://localhost:3000
```

## 📋 Current Phase: Phase 0 (Setup)

**What to do next**:
- [ ] Read [spec.md](./specs/001-salon-scheduling-platform/spec.md)
- [ ] Read [plan.md](./specs/001-salon-scheduling-platform/plan.md)
- [ ] Configure TypeScript (strict mode)
- [ ] Setup ESLint + Prettier
- [ ] Create folder structure (already done ✅)

## 🔗 Backend Integration

**Backend API**: http://localhost:3000/api/v1  
**Backend Repo**: `../../agenda-back`  
**OpenAPI Contract**: `../../agenda-back/specs/001-salon-scheduling-platform/contracts/openapi.yml`

Make sure the backend is running before starting the frontend!

## 📖 Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.x (strict)
- **UI**: React 18+
- **Styling**: Tailwind CSS
- **HTTP**: axios
- **Testing**: Vitest + React Testing Library
- **Auth**: JWT (stored in localStorage)

## 🛠️ Available Scripts

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Run production build
npm run lint             # ESLint
npm run format           # Prettier format
npm test                 # Run Vitest
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
```

## ✅ Checklist (Phase 0)

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created
- [ ] Dev server runs (`npm run dev`)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Test setup working (`npm test`)

## 📞 Support

- Check [spec.md](./specs/001-salon-scheduling-platform/spec.md) for feature details
- Check [research.md](./specs/001-salon-scheduling-platform/research.md) for tool references
- Check backend API docs: `../../agenda-back/specs/001-salon-scheduling-platform/contracts/openapi.yml`

---

**Last Updated**: 2026-05-28  
**Feature**: 001-salon-scheduling-platform  
**Status**: Phase 0 (Setup) 🟡

<!-- SPECKIT END -->
