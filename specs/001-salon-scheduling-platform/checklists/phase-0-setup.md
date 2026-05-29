# Checklist: Frontend Setup (Phase 0)

**Feature**: 001-salon-scheduling-platform | **Phase**: 0 (Setup) | **Date**: 2026-05-28

Use this checklist to track progress on Phase 0 setup tasks.

---

## Pre-Flight Checks

- [ ] Node.js 18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Git initialized: `git status`
- [ ] Backend repo cloned: `ls ../../agenda-back`
- [ ] Backend API docs available: `../../agenda-back/specs/001-salon-scheduling-platform/contracts/openapi.yml`

---

## TypeScript Configuration (P0-T1)

- [ ] `tsconfig.json` has `"strict": true`
- [ ] `"noImplicitAny": true` enabled
- [ ] `"strictNullChecks": true` enabled
- [ ] `npm run build` succeeds
- [ ] Zero TypeScript errors in console

---

## Environment Variables (P0-T2)

- [ ] `.env.example` created in root
- [ ] `.env.local` created locally (not committed)
- [ ] `NEXT_PUBLIC_API_BASE_URL` set to `http://localhost:3000`
- [ ] `NEXT_PUBLIC_APP_NAME` set
- [ ] `src/utils/env.ts` validates env vars on startup

---

## ESLint & Prettier (P0-T3)

- [ ] ESLint installed: `npm list eslint`
- [ ] Prettier installed: `npm list prettier`
- [ ] `.eslintrc.json` created
- [ ] `.prettierrc.json` created (100 char line length, 2 spaces)
- [ ] `npm run lint` runs without errors
- [ ] `npm run format` formats code
- [ ] Pre-commit hook configured (husky)

---

## Testing Setup (P0-T4)

- [ ] Vitest installed: `npm list vitest`
- [ ] React Testing Library installed
- [ ] `vitest.config.ts` created
- [ ] `src/setup-tests.ts` created
- [ ] Example test created & passing: `npm test`
- [ ] Coverage report generates: `npm run test:cov`

---

## Folder Structure (P0-T5)

- [ ] `src/app/` exists
- [ ] `src/components/` exists
- [ ] `src/modules/` exists
- [ ] `src/services/` exists
- [ ] `src/hooks/` exists
- [ ] `src/types/` exists
- [ ] `src/utils/` exists
- [ ] `src/context/` exists
- [ ] `src/styles/` exists
- [ ] `src/app/layout.tsx` created
- [ ] `src/app/page.tsx` created

---

## Git Workflow (P0-T6)

- [ ] Husky installed: `npm list husky`
- [ ] `.husky/pre-commit` hook created
- [ ] Branch naming convention documented in `CONTRIBUTING.md`
- [ ] Commit message format documented
- [ ] `.gitignore` updated (`.env.local`, `coverage/`, etc)
- [ ] Initial commit made: `git log`

---

## Documentation (P0-T7)

- [ ] `README.md` updated with:
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Available scripts
  - [ ] Project structure
  - [ ] Tech stack
- [ ] `ARCHITECTURE.md` created
- [ ] `CONTRIBUTING.md` created
- [ ] `docs/` folder created

---

## Final Verification

- [ ] Dev server starts: `npm run dev`
- [ ] Can open http://localhost:3000 in browser
- [ ] No TypeScript errors
- [ ] No ESLint errors: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Git status clean: `git status`
- [ ] All commits have proper messages

---

## Approval Sign-Off

**Completed By**: _______________  
**Date**: _______________  
**Reviewed By**: _______________  
**Date**: _______________

---

## Notes

- Phase 0 must be 100% complete before starting Phase 1
- Each task should have a corresponding git commit
- Save this checklist with updates as you progress
