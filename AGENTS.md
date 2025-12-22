# AGENTS.md

## Commands

- **Dev**: `npm run dev` (uses dotenvx with .env.local, runs with turbopack)
- **Build**: `npm run build` (uses dotenvx with .env.production)
- **Type Check**: `npm run type-check` (runs tsc --noEmit)
- **Lint**: `npm run lint` (runs eslint)
- **Format**: `npm run format` (prettier --write .)
- **Format Check**: `npm run format:check` (prettier --check .)

## Architecture

- **Framework**: Next.js 15 (App Router) with React 19, TypeScript
- **Structure**: `src/app/` (routes: `(dashboard)/`, `(store)/`, `api/`), `src/components/` (UI + forms), `src/services/` (API calls), `src/hooks/` (custom hooks), `src/lib/` (utils, axios), `src/store/` (zustand), `src/types/`, `src/configs/`
- **Authentication**: NextAuth with custom JWT flow, backend proxy pattern (see README.md for cookie flow)
- **State**: Zustand for auth store, TanStack Query for server state
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **API**: Axios instances (`axiosInstance` for client, `serverAxios` for server)

## Code Style

- **Imports**: Always use `@/` alias (defined in tsconfig.json paths)
- **Formatting**: Tabs (width 2), single quotes, JSX single quotes, trailing commas, semi-colons
- **TypeScript**: Strict mode enabled; `@typescript-eslint/no-explicit-any` and `no-require-imports` are disabled
- **Logic**: Only check conditions in `layout.tsx`, not `page.tsx`; handle logic in hooks, render toasts in components (see README.md)
- **Validation**: Use Zod schemas from `src/types/`
