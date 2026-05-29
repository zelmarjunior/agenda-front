# Agenda Front — Frontend da Plataforma de Agendamento

> Frontend em **Next.js + React + TypeScript** para a plataforma **Agenda** (agendamento para salões de beleza e profissionais autônomos).

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

**Prerequisites**: Node.js 18+, npm/yarn, Backend API running at http://localhost:3000

---

## 📚 Documentation

Read in this order:

1. **[Quick Start](./specs/001-salon-scheduling-platform/quickstart.md)** — 5-minute setup
2. **[Spec](./specs/001-salon-scheduling-platform/spec.md)** — Feature requirements
3. **[Plan](./specs/001-salon-scheduling-platform/plan.md)** — Architecture & phases
4. **[Data Model](./specs/001-salon-scheduling-platform/data-model.md)** — TypeScript types
5. **[Tasks](./specs/001-salon-scheduling-platform/tasks.md)** — Implementation tasks
6. **[Research](./specs/001-salon-scheduling-platform/research.md)** — Tool references

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Run production build

# Code Quality
npm run lint             # Run ESLint on src/
npm run format           # Format with Prettier
npm run format:check     # Check Prettier (CI)

# Testing
npm test                 # Run Vitest (once)
npm run test:watch       # Watch mode
npm run test:cov         # Coverage report
```

---

## 📁 Project Structure

```
agenda-front/
├── specs/                                    # Spec Kit documentation
│   └── 001-salon-scheduling-platform/
│       ├── spec.md                          # ← Start here!
│       ├── plan.md
│       ├── tasks.md
│       ├── data-model.md
│       ├── research.md
│       ├── quickstart.md
│       ├── checklists/
│       └── contracts/
├── src/
│   ├── app/                                 # Next.js App Router pages
│   ├── components/                          # Reusable React components
│   ├── modules/                             # Feature modules (domain-driven)
│   ├── services/                            # API client & business logic
│   ├── hooks/                               # Custom React hooks
│   ├── context/                             # React Context (state)
│   ├── types/                               # TypeScript type definitions
│   ├── utils/                               # Utilities & helpers
│   ├── styles/                              # Global styles
│   └── middleware.ts                        # Next.js middleware
├── .claude/                                 # Claude.dev configuration
├── public/                                  # Static assets
├── .env.example                             # Environment variables template
├── next.config.ts                           # Next.js configuration
├── tsconfig.json                            # TypeScript configuration
└── package.json
```

See [spec.md](./specs/001-salon-scheduling-platform/spec.md) for detailed structure.

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14+ | SSR/SSG, built-in optimization, file-based routing |
| **Language** | TypeScript 5.x | Type safety, IDE autocomplete, fewer bugs |
| **UI Library** | React 18+ | Hooks, concurrent rendering, huge ecosystem |
| **Styling** | Tailwind CSS | Utility-first, rapid prototyping, small bundle |
| **HTTP Client** | axios | Simple API, interceptors, timeouts |
| **Testing** | Vitest + RTL | Fast, modern, intuitive |

---

## 🔌 Backend Integration

**API Base URL**: http://localhost:3000/api/v1 (development)

**Authentication**: JWT Bearer token

**Backend Repo**: [../../agenda-back](../../agenda-back)

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3000 already in use** | `PORT=3001 npm run dev` |
| **API 404 errors** | Verify backend running: `curl http://localhost:3000` |
| **TypeScript errors** | Run `npm run lint` for details |
| **Module not found** | Run `npm install` again |

---

## 📊 Current Status

**Phase**: 0 (Setup) ✅ Complete  
**Phase 1**: Core Architecture & Auth (next)

| Task | Status |
|------|--------|
| TypeScript strict mode | ✅ |
| Environment variables | ✅ |
| ESLint + Prettier | ✅ |
| Vitest + RTL | ✅ |
| Folder structure | ✅ |
| Husky pre-commit | ✅ |

**Next Steps**: See [tasks.md](./specs/001-salon-scheduling-platform/tasks.md) — Phase 1

---

**Last Updated**: 2026-05-28  
**More Info**: See [CLAUDE.md](./CLAUDE.md)
