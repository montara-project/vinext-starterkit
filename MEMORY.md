---
last_dream: 2026-09-01T04:19:01Z
---

# vinext-starterkit — Project Memory

## Architecture Decisions

- **Package manager**: pnpm@11.10.0 via corepack. `pnpm-workspace.yaml` uses `allowBuilds` to explicitly permit build scripts for swc/parcel/esbuild/workerd/core-js.
- **Linter**: oxlint with `perfectionist(sort-imports)` — external packages alphabetical with NO blank lines; blank line separates external group from `@/` alias group; relative imports last.
- **Auth**: better-auth, `requireSession()` from `@/lib/auth/handler`. Auth route lives at `/api/auth/[...all]` (excluded from middleware matcher).
- **i18n**: next-intl 4.14.1 with `i18n/routing.ts`, `i18n/navigation.ts`, `middleware.ts`, `messages/{locale}.json`. Root layout moved from `app/layout.tsx` to `app/[locale]/layout.tsx`.
- **DataGrid/DataTable**: DataGrid context provider + TanStack Table + `usePaginationQuery` (nuqs page/pageSize).
- **CRUD**: `clientResource('/v1/xxx', [GET, POST, PUT, DELETE])` → typed `ResourceMethods<TData>`; `queryOptions` pattern; mutations via `queryClient.invalidateQueries`.
- **Build**: Vinext (Vite 8 + Next.js App Router) + Cloudflare Workers. Requires wrangler ^4.127.1 to satisfy `@cloudflare/vite-plugin`.

## Gotchas

- `pnpm-workspace.yaml` `allowBuilds` values must be booleans (`true`/`false`), not placeholder strings like `set this to true or false` — pnpm ignores them silently.
- `next-intl`'s `redirect` (from `createNavigation`) expects an object with `{ href, locale }`, not a plain string. Use `next/navigation` for root redirects; middleware handles locale detection.
- Read tool mis-renders files with large multi-line import blocks (AlertDialog/Sidebar components) — fall back to `sed`/`cat` or Grep for exact content.
- Log-summarizer wrapper intercepts git command output in this environment — use `git rev-list --count HEAD` and `git log -1 --format="%h %s"` instead of `git log --oneline`.

## Recent Sessions

- 2026-09-01: Completed full A+B+C improvement implementation. Phase A: theme tokens, login form, dashboard content. Phase B: 20 feature pages (media, users, settings, comments, analytics) with DataTable/CRUD patterns. Phase C: i18n (next-intl, en/id), DataStateWrapper, avatar initials. All verification passed (lint, typecheck, build). Branch: `improvement` (13 commits).
