# Research & References

Documentation and external resources used in frontend development.

## Frontend Frameworks & Tools

### Next.js 14 (App Router)
- **Official Docs**: https://nextjs.org/docs
- **Key Features**: SSR, SSG, App Router, API routes, middleware, image optimization
- **Decision**: Chosen for built-in optimization and full-stack capabilities

### React 18
- **Official Docs**: https://react.dev
- **Key Features**: Hooks, Concurrent Rendering, Automatic Batching
- **Decision**: Mature ecosystem, most popular UI library

### TypeScript 5
- **Official Docs**: https://www.typescriptlang.org/docs
- **Benefits**: Type safety, IDE autocomplete, fewer runtime errors
- **Config**: `strict: true` (all strict checks enabled)

## Styling & UI

### Tailwind CSS
- **Official Docs**: https://tailwindcss.com
- **Decision**: Utility-first CSS; faster development than custom CSS
- **Alternative**: Shadcn/ui (for pre-built components)

### Alternative UI Libraries
- **Material-UI**: Too heavy for MVP; adds 150KB+ to bundle
- **Bootstrap**: More CSS; less customizable in Next.js
- **Chakra UI**: Good alternative; but Tailwind is lighter

## State Management

### Context API + Hooks (MVP)
- **For**: Auth state, Theme, Toast notifications
- **Pros**: No external library, built-in React
- **Cons**: Doesn't scale to 50+ consumers

### SWR or React Query (Future)
- **When**: If server state gets complex
- **Benefits**: Caching, revalidation, offline support
- **Choice**: SWR is lighter; React Query is feature-rich

## HTTP Client

### Axios vs Fetch API
| Feature | Axios | Fetch |
|---------|-------|-------|
| Interceptors | ✅ Yes | ❌ Complex |
| Timeouts | ✅ Yes | ❌ No native |
| Request cancellation | ✅ Yes | ⚠️ AbortController |
| Bundle size | 12KB | 0KB (built-in) |

**Decision**: Axios (simpler interceptors for JWT refresh)

## Testing

### Unit Testing: Vitest
- **Docs**: https://vitest.dev
- **Why**: Fast, ESM-first, similar to Jest API
- **vs Jest**: Vitest is faster for Next.js projects

### Component Testing: React Testing Library
- **Docs**: https://testing-library.com/react
- **Philosophy**: Test behavior, not implementation
- **vs Enzyme**: RTL encourages better testing practices

### E2E Testing: Playwright or Cypress
- **Playwright**: Faster, cross-browser, better for CI/CD
- **Cypress**: Better DX, but slower on large test suites
- **Decision**: Playwright (lighter, faster for CI)

## Form Handling

### React Hook Form + Zod
- **RHF Docs**: https://react-hook-form.com
- **Zod Docs**: https://zod.dev
- **Benefits**: Minimal re-renders, type-safe validation
- **vs Formik**: RHF has less overhead; better performance

## Build & Deployment

### Build Tool: Next.js (Webpack by default)
- **Optimization**: Image optimization, code splitting, automatic compression
- **Why**: Built-in; no additional config needed

### Deployment Options
1. **Vercel** (recommended): Zero-config, automatic CI/CD
2. **Docker**: Container; works on any Linux host
3. **Node.js server**: Manual deployment

## Performance Optimization

### Key Metrics (Web Vitals)
| Metric | Target | Tool |
|--------|--------|------|
| FCP (First Contentful Paint) | < 2s | Lighthouse |
| LCP (Largest Contentful Paint) | < 3s | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| TTFB (Time to First Byte) | < 600ms | Next.js Analytics |

### Techniques
1. **Code Splitting**: Automatic in Next.js (App Router)
2. **Image Optimization**: Use `next/image` component
3. **Font Optimization**: Use `next/font` for Google Fonts
4. **Bundle Analysis**: `next-bundle-analyzer`
5. **Lazy Loading**: `React.lazy()` + Suspense

## Security

### HTTPS & CSP
- Always use HTTPS in production
- Content Security Policy (CSP) headers

### XSS Prevention
- Sanitize user inputs with `DOMPurify`
- Use React's automatic escaping

### CSRF Protection
- Backend should set `SameSite=Strict` on cookies
- Frontend sends token in Authorization header

### JWT Best Practices
- Store token in `httpOnly` cookie (secure) OR localStorage (flexible)
- Short expiration time (15 min); refresh token in httpOnly cookie
- Validate token signature on backend

**Decision**: JWT in localStorage (allows logout on all tabs) + short expiration

## Accessibility

### WCAG 2.1 Level AA
- **Checklist**: https://www.w3.org/WAI/WCAG21/quickref/
- **Tools**: axe DevTools, Lighthouse accessibility audit

### Key Areas
1. **Semantic HTML**: `<button>`, `<label>`, `<nav>`, etc
2. **ARIA Labels**: For custom components
3. **Keyboard Navigation**: Tab order, focus visible
4. **Color Contrast**: AA = 4.5:1 for text

## Monitoring & Analytics

### Error Tracking
- **Sentry**: Automatic error reporting + source maps
- **Alternative**: Custom logging to backend

### Analytics
- **Google Analytics**: Track page views, events
- **Plausible**: Privacy-focused alternative

## Browser Support

**Target Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Excluded**: IE 11 (end of life)

**Polyfills**: None needed for target browsers

## Documentation Tools

### Storybook (Optional)
- **Docs**: https://storybook.js.org
- **Use Case**: Document reusable components
- **When**: If design system grows large

### JSDoc + TypeScript
- **Use**: Document complex functions
- **Example**:
```typescript
/**
 * Calculates appointment duration
 * @param startTime - ISO 8601 string
 * @param endTime - ISO 8601 string
 * @returns Duration in minutes
 */
function getAppointmentDuration(startTime: string, endTime: string): number {
  // ...
}
```

## Backend Integration

### OpenAPI Code Generation
- **Tool**: `openapi-typescript`
- **Use**: Auto-generate types from backend OpenAPI spec
- **Command**: `npx openapi-typescript schema.json -o src/types/api.types.ts`

### API Versioning
- URL pattern: `/api/v1/...`
- Request headers: `Accept: application/json`
- Response format: `{ data, message, statusCode }`

## DevTools & Extensions

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**: dsznajder.es7-react-js-snippets
- **Prettier**: esbenp.prettier-vscode
- **ESLint**: dbaeumer.vscode-eslint
- **Thunder Client**: rangav.vscode-thunder-client (API testing)

### Browser Extensions
- **React DevTools**: debug React component tree
- **Redux DevTools**: time-travel debugging (if using Redux)
- **axe DevTools**: accessibility audits

## Useful Libraries (Consider)

| Library | Size | Use Case | Status |
|---------|------|----------|--------|
| **DOMPurify** | 15KB | XSS prevention | ⭐ Consider |
| **clsx** | 1KB | Conditional classes | ✅ Maybe |
| **date-fns** | 30KB | Date formatting | ✅ Maybe |
| **framer-motion** | 35KB | Animations | ❌ MVP: Use CSS |
| **react-query** | 40KB | Server state | 🔄 Phase 2 |
| **zustand** | 3KB | Client state | ✅ Phase 2 (if Context isn't enough) |

## Common Pitfalls & Solutions

| Pitfall | Solution |
|---------|----------|
| JWT stored in global window object | Use localStorage with secure expiration |
| Too many Context providers | Combine related contexts |
| Images not optimized | Always use `next/image` |
| Form re-renders on every keystroke | Use React Hook Form (minimal re-renders) |
| TypeScript any type creeping in | Enable `noImplicitAny` in tsconfig |
| API calls in useEffect without cleanup | Always return cleanup function for AbortController |
| Hardcoded API URLs | Use environment variables |

## Roadmap & Future Considerations

### Phase 1 (MVP)
- Basic auth, CRUD operations, responsive design

### Phase 2 (Enhancements)
- Real-time updates (WebSocket)
- Offline support (Service Workers)
- Progressive Web App (PWA)
- Dark mode

### Phase 3 (Scale)
- Internationalization (i18n)
- Advanced caching strategies
- Micro-frontend architecture (if needed)
- Mobile app (React Native)

## References & Further Reading

1. **Next.js Performance**: https://nextjs.org/learn/foundations/how-nextjs-works
2. **React Best Practices**: https://react.dev/reference/rules-of-hooks
3. **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
4. **Web Vitals**: https://web.dev/vitals/
5. **JWT Auth**: https://tools.ietf.org/html/rfc7519
6. **RESTful API Design**: https://restfulapi.net
7. **Clean Code JavaScript**: https://github.com/ryanmcdermott/clean-code-javascript
