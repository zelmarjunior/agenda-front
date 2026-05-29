# Checklist: [FEATURE] — Phase [N]

**Feature**: [FEATURE_NAME] | **Phase**: [N] ([PHASE_NAME]) | **Date**: [DATE]

Use this checklist to track progress on Phase [N] tasks.

---

## Pre-Flight Checks

- [ ] Feature spec read and understood
- [ ] Implementation plan reviewed
- [ ] All dependencies available (backend ready, design approved)
- [ ] Development environment setup (node, npm, .env.local)
- [ ] Branch created: `feature/[###-feature-name]`

---

## [Checklist Section 1]

- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

---

## [Checklist Section 2]

- [ ] Subtask 1
- [ ] Subtask 2

---

## Code Quality

- [ ] TypeScript: zero errors (`npm run lint`)
- [ ] ESLint: no violations (`npm run lint`)
- [ ] Prettier: formatted (`npm run format`)
- [ ] Tests: passing (`npm test`)
- [ ] Coverage: ≥ 70% on critical paths

---

## Testing

- [ ] Unit tests written (hooks, utilities)
- [ ] Component tests written (critical components)
- [ ] E2E tests written (main flows)
- [ ] Manual testing completed (mobile, tablet, desktop)

---

## Performance & Accessibility

- [ ] Lighthouse score ≥ 80 (mobile)
- [ ] FCP < 2s
- [ ] LCP < 3s
- [ ] WCAG 2.1 AA compliance verified
- [ ] Bundle size analyzed (< 200KB gzipped)

---

## Documentation

- [ ] Code comments written (non-obvious logic)
- [ ] README updated (if needed)
- [ ] Types documented (JSDoc on public functions)
- [ ] Storybook stories created (if applicable)

---

## Git & PR

- [ ] Branch up-to-date with `main`
- [ ] All commits have meaningful messages
- [ ] PR description filled (what, why, how)
- [ ] No merge conflicts
- [ ] CI/CD checks pass

---

## Final Verification

- [ ] Feature works as spec describes
- [ ] No regressions in existing features
- [ ] Browser console: zero errors/warnings
- [ ] Network tab: no 404s or slow requests
- [ ] State management: no duplicate/conflicting data

---

## Sign-Off

**Completed By**: _______________  
**Date**: _______________  
**Reviewed By**: _______________  
**Date**: _______________

---

## Notes

- Mark each section complete as you go
- Document blockers and decisions
- Save and commit this checklist with PR
