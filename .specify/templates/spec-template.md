# Feature Specification: [FEATURE_NAME]

**Date**: [DATE] | **Feature**: [FEATURE_DESCRIPTION] | **Ref**: [LINK_TO_BACKEND_SPEC]

---

## 1. Overview

[Clear description of what this feature does and why it matters]

**Tech Stack**:
- Framework: **Next.js 14+**
- Language: **TypeScript 5.x** (strict mode)
- UI Components: **React 18+**
- Styling: **Tailwind CSS**
- Testing: **Vitest + React Testing Library**

---

## 2. User Personas & Use Cases

### 2.1 [Persona A]
- [What they do]
- [What they need from this feature]

### 2.2 [Persona B]
- [What they do]
- [What they need from this feature]

---

## 3. Core Features

- [ ] Feature A
- [ ] Feature B
- [ ] Feature C

---

## 4. User Interface Requirements

### 4.1 Pages/Screens
- [Screen name]: [What it shows and does]

### 4.2 Components
- [Component name]: [Props, behavior, states]

### 4.3 States & Transitions
- Loading state: [How it looks]
- Error state: [How errors are shown]
- Empty state: [When no data]

---

## 5. API Integration

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/[resource]` | GET | [What it fetches] |
| `/api/v1/[resource]` | POST | [What it creates] |

---

## 6. Data Types (TypeScript)

```typescript
interface [DataType] {
  // Define structure
}

type [StatusEnum] = 'PENDING' | 'COMPLETED' | 'FAILED';
```

---

## 7. Non-Functional Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Responsive (mobile/tablet/desktop) | HIGH | Mobile-first design |
| Performance (< 2s FCP) | HIGH | Use lazy loading |
| Accessibility (WCAG 2.1 AA) | MEDIUM | Semantic HTML, ARIA labels |
| Type Safety | HIGH | TypeScript strict mode |
| Error Handling | HIGH | User-friendly messages |

---

## 8. Acceptance Criteria

- [ ] All screens render correctly on mobile, tablet, desktop
- [ ] All API calls handled with proper error states
- [ ] TypeScript compiles with zero errors (strict mode)
- [ ] Tests pass with > 70% coverage on critical paths
- [ ] No console errors or warnings in production build
- [ ] Lighthouse score ≥ 80 (mobile)

---

## 9. Open Questions

- [ ] Question 1?
- [ ] Question 2?

---

## 10. References

- Backend Spec: [Link]
- Design File: [Link]
- Related Features: [Link]
