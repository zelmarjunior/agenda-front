# Quick Start Guide - Agenda Front

Get the frontend running locally in 5 minutes.

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running at `http://localhost:3000`

## Setup

### 1. Clone & Install

```bash
cd agenda-front
npm install
```

### 2. Environment Variables

```bash
# Copy example file
cp .env.example .env.local

# Edit with your local values
nano .env.local
```

**Contents of `.env.local`**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Agenda
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── modules/          # Feature modules (auth, appointments, etc)
├── services/         # API client
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
└── utils/            # Utilities
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run format           # Format with Prettier

# Testing
npm test                 # Run tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report

# Database (backend only)
# npm run typeorm migration:run  # (não é necessário no frontend)
```

## API Integration

The frontend communicates with the backend via axios. All API calls are made through `services/api.ts`.

### Example: Login

```typescript
import { useAuth } from '@/modules/auth/hooks/useAuth';

export function LoginForm() {
  const { login } = useAuth();

  async function handleSubmit(email: string, password: string) {
    await login(email, password);
  }

  return (/* form JSX */);
}
```

## Debugging

### Enable Console Logs

Set `DEBUG=*` before running:

```bash
DEBUG=* npm run dev
```

### VS Code Debugging

1. Open VS Code
2. Go to Run & Debug (Ctrl+Shift+D)
3. Select "Next.js: debug full stack"
4. Set breakpoints in `src/` files
5. F5 to start debugging

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Change: `PORT=3001 npm run dev` |
| API 404 errors | Verify backend is running on `http://localhost:3000` |
| Module not found | Run `npm install` again |
| TypeScript errors | Run `npm run lint` to see details |

## Next Steps

1. Read [spec.md](./spec.md) for feature requirements
2. Review [plan.md](./plan.md) for implementation phases
3. Check [tasks.md](./tasks.md) for current sprint tasks
4. Start with Phase 0 tasks (setup, linting, testing)

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Backend API Docs](../../agenda-back/specs/001-salon-scheduling-platform/contracts/openapi.yml)

## Support

For issues or questions:
1. Check the [spec.md](./spec.md) for requirements
2. Review the [plan.md](./plan.md) for architecture decisions
3. Open an issue on GitHub
