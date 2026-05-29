# Implementation Plan: [FEATURE]

**Date**: [DATE] | **Spec**: [link to spec.md]

**Input**: Feature specification from `specs/[###-feature-name]/spec.md`

---

## Summary

[Brief description of feature and implementation approach]

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), React 18+, Next.js 14+

**Primary Dependencies**: axios, React Hook Form, Zod, React Testing Library, Vitest

**UI Components**: Tailwind CSS (utility-first)

**State Management**: Context API + hooks

**Testing**: Vitest (unit), React Testing Library (components), Playwright (e2e)

**Target Platform**: Browser (mobile-first: 360px+)

**Performance Goals**: FCP < 2s, LCP < 3s, Lighthouse ≥ 80

**Constraints**: Bundle < 200KB (gzipped); WCAG 2.1 AA accessibility

**Scale/Scope**: [e.g., 100 components, 5 main pages, 50K LOC]

---

## Constitution Check

*GATE: Must pass before Phase 0. Re-check after Phase 1.*

| Gate | Status | Notes |
|------|--------|-------|
| **I. Test-First** — are failing tests planned before implementation tasks? | PASS / FAIL | |
| **II. Component-Driven** — are reusable components documented in design? | PASS / FAIL | |
| **III. Type Safety** — is TypeScript strict mode in all tasks? | PASS / FAIL | |
| **IV. State Management** — is state architecture (Context/hooks) clear? | PASS / FAIL | |
| **V. Performance** — are performance budgets (FCP, LCP, bundle) defined? | PASS / FAIL | |
| **VI. Accessibility** — are a11y requirements (WCAG 2.1 AA) specified? | PASS / FAIL | |
| **Tech Stack** — does plan use Next.js 14+ with no unapproved dependencies? | PASS / FAIL | |

---

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── spec.md              # ← Feature requirements
├── plan.md              # This file
├── tasks.md             # Actionable task list
├── data-model.md        # Type definitions
├── research.md          # Tool references
├── quickstart.md        # How to setup
└── checklists/
    └── phase-[N].md     # Checklist for each phase
```

### Source Code

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── [feature]/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   └── layout.tsx
├── modules/[feature]/
│   ├── components/       # Feature-specific components
│   ├── hooks/            # Feature-specific hooks
│   ├── types/            # TypeScript interfaces
│   ├── services/         # API calls
│   └── index.ts          # Exports
├── components/           # Shared components
├── services/             # Shared services (API client)
└── types/                # Shared types
```

---

## Phases

### Phase 0: Setup & Foundation
**Duration**: 1–2 days
**Deliverables**:
- TypeScript + ESLint + Prettier configured
- Example test setup
- Folder structure created

### Phase 1: Architecture & Core
**Duration**: 2–3 days
**Deliverables**:
- State management (Context, hooks) designed
- API client configured
- Core types defined
- Example components + hooks with tests

### Phase 2: Features Implementation
**Duration**: 3–5 days
**Deliverables**:
- All main pages built
- Forms with validation
- API integration
- Component tests

### Phase 3: Polish & Optimization
**Duration**: 2–3 days
**Deliverables**:
- Tests (unit, component, e2e)
- Performance optimization
- Accessibility audit
- Documentation complete

---

## Success Criteria

| Metric | Target |
|--------|--------|
| TypeScript Errors | 0 |
| ESLint Errors | 0 |
| Test Coverage (critical paths) | ≥ 70% |
| FCP | < 2s |
| LCP | < 3s |
| Lighthouse Score (mobile) | ≥ 80 |
| Accessibility (WCAG 2.1 AA) | ✅ Pass |

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| State management gets complex | MEDIUM | Start with Context; migrate to Zustand if needed |
| API integration delays | MEDIUM | Mock API early; use Storybook for UI dev |
| Performance regression | MEDIUM | Bundle analysis on every build |
| Accessibility overlooked | MEDIUM | Use axe devtools during development |

---

## Notes

- All dates are estimates; adjust based on actual progress
- Each phase has a gate review before proceeding
- Constitution compliance checked in every PR
