# Vinext Starterkit

A modern CMS admin starter kit built with [Vinext](https://vinext.dev) (Next.js-based framework) and deployed on Cloudflare Workers.

## Tech Stack

- **Framework:** Vinext (Next.js + Vite) on Cloudflare Workers
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix Vega style)
- **Auth:** Better Auth (email/password + Google OAuth)
- **State:** TanStack React Query, TanStack React Table, TanStack React Form
- **Editor:** Lexical rich-text editor
- **Icons:** Tabler Icons + Lucide React
- **Package Manager:** pnpm

### Key Libraries

| Category           | Packages                                                         |
| ------------------ | ---------------------------------------------------------------- |
| UI Components      | shadcn/ui, Radix UI, Base UI, cmdk                               |
| Data Fetching      | TanStack React Query, Axios, nuqs                                |
| Forms & Validation | TanStack React Form, Zod v4, react-number-format                 |
| Tables             | TanStack React Table, @dnd-kit (drag & drop)                     |
| Maps               | MapLibre GL                                                      |
| Media              | Plyr (video player), Lexical (rich text editor)                  |
| Theming            | next-themes, tw-animate-css, motion                              |
| Utilities          | date-fns, lodash, clsx, tailwind-merge, class-variance-authority |
| Notifications      | sonner                                                           |
| Dev Tools          | Oxlint, Oxfmt, Husky, Commitlint, Release-it                     |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes (sign-in, sign-up)
│   ├── (protected)/        # Protected routes (dashboard)
│   ├── (public)/           # Public routes (landing site)
│   ├── api/                # API routes (auth, hello)
│   └── styles/             # Global CSS
├── components/
│   ├── block/              # Feature blocks (auth, common, editor, form)
│   ├── layout/             # Layout components (public, sidebar)
│   └── ui/                 # shadcn/ui components (43 components)
├── config/                 # Environment variable validation (t3-env)
├── data/                   # Static data (sidebar menu)
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/                # API client, DTOs, models, queries, services
│   ├── auth/               # Better Auth server/client & session handler
│   ├── constants/          # App constants (meta, auth, messages, pagination)
│   ├── providers/          # React providers (query, theme, decoration)
│   ├── date.ts             # Date formatting utilities
│   ├── string.ts           # String manipulation utilities
│   ├── utils.ts            # General utilities (cn)
│   └── validation.ts       # Zod validation schemas
├── types/                  # TypeScript type definitions
├── vite.config.ts          # Vite config with Vinext & Cloudflare plugins
├── wrangler.jsonc          # Cloudflare Worker configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 11+
- `wrangler` CLI: `npm install -g wrangler`
- Cloudflare account (for deployment)

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                  | Description                     |
| ------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL`     | Backend API base URL            |
| `NEXT_PUBLIC_OSM_API_URL` | OpenStreetMap Nominatim API URL |
| `BETTER_AUTH_URL`         | Better Auth base URL            |
| `BETTER_AUTH_SECRET`      | Better Auth secret key          |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID          |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret      |

### Development

```bash
pnpm dev
```

Starts the Vinext dev server at `http://localhost:3000`.

### Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `pnpm dev`           | Start development server                         |
| `pnpm build`         | Build for production (runs fmt, lint, typecheck) |
| `pnpm start`         | Start built Worker locally with Wrangler         |
| `pnpm deploy`        | Build and deploy to Cloudflare Workers           |
| `pnpm preview`       | Build and preview production build locally       |
| `pnpm lint`          | Run Oxlint                                       |
| `pnpm lint:fix`      | Run Oxlint with auto-fix                         |
| `pnpm fmt`           | Format code with Oxfmt                           |
| `pnpm fmt:check`     | Check formatting with Oxfmt                      |
| `pnpm typecheck`     | Run TypeScript type checking                     |
| `pnpm cf-typegen`    | Generate Cloudflare Worker types                 |
| `pnpm release`       | Release with Release-it                          |
| `pnpm release:patch` | Release patch version                            |
| `pnpm release:minor` | Release minor version                            |
| `pnpm release:major` | Release major version                            |

## Deployment

This project deploys to Cloudflare Workers (free tier). The full provisioning flow is also documented in [`DEPLOYMENT.md`](DEPLOYMENT.md) and automated in [`scripts/setup-cloudflare.sh`](scripts/setup-cloudflare.sh).

### 1. Install and login to `wrangler`

```bash
npm install -g wrangler
wrangler login
```

> If `wrangler` is not found, install it first with `npm install -g wrangler`, then log in. You need a Cloudflare account with Workers enabled (free plan is enough).

### 2. One-command setup (recommended)

```bash
corepack pnpm install
./scripts/setup-cloudflare.sh
```

The script is idempotent and does everything in order:

1. Verifies you are logged in to Cloudflare.
2. Creates the D1 database `vinext-db` and extracts its id.
3. Replaces the placeholder `database_id` in `wrangler.jsonc` with the real id.
4. Creates the R2 bucket `vinext-media`.
5. Applies `db/schema.sql` to the remote D1 database.
6. Prompts for (or reads from env) the secrets: `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
7. Regenerates Cloudflare types via `cf-typegen`.
8. Builds and deploys the worker.

To pass secrets non-interactively:

```bash
BETTER_AUTH_SECRET=$(openssl rand -base64 32) \
GOOGLE_CLIENT_ID=... \
GOOGLE_CLIENT_SECRET=... \
./scripts/setup-cloudflare.sh
```

### 3. Manual steps (alternative)

```bash
# 1. Create the D1 database and note the returned database_id
wrangler d1 create vinext-db

# 2. Paste that id into wrangler.jsonc under d1_databases[0].database_id

# 3. Create the R2 bucket
wrangler r2 bucket create vinext-media

# 4. Apply the schema
wrangler d1 execute vinext-db --file=db/schema.sql --remote

# 5. Set secrets
printf '%s' "$BETTER_AUTH_SECRET"   | wrangler secret put BETTER_AUTH_SECRET
printf '%s' "$GOOGLE_CLIENT_ID"     | wrangler secret put GOOGLE_CLIENT_ID
printf '%s' "$GOOGLE_CLIENT_SECRET" | wrangler secret put GOOGLE_CLIENT_SECRET

# 6. Regenerate types, build, and deploy
corepack pnpm run cf-typegen
corepack pnpm run build
corepack pnpm run deploy
```

### 4. Post-deploy

1. Replace the `your-name` placeholder in `wrangler.jsonc` vars (`NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL`) with your real subdomain: `https://<your-subdomain>.workers.dev`.
2. Update `.env` locally the same way for `dev`.
3. The first user is created through the app (sign up with email/password or Google). There is no seeded admin account.

The `wrangler.jsonc` configuration includes:

- Asset serving from `dist/client`
- D1 database binding (`DB`) and R2 bucket binding (`MEDIA`)
- Cache and Images bindings
- Observability enabled
- Source map uploads

## Evaluation

### What this kit is optimized for (and not for)

**Best for:**

- CMS / blog multi-bahasa (posts, pages, categories, tags, comments)
- Landing page + admin panel for small clients
- SaaS side-project with low-to-medium traffic (&lt;100k req/day)
- Internal tools with role-based access (users, roles, permissions)
- Projects needing rich text editor (Lexical) + media upload (R2) + maps (Maplibre)

**Not suitable for:**

- E-commerce (no product schema, cart, payment)
- Real-time applications (chat, collaboration — no WebSocket on free plan)
- Heavy analytics (10ms CPU limit, 5M D1 reads/day)
- High-traffic public API (100k req/day per account, all workers share pool)
- Multi-region / low-latency global (D1 replication single-region unless paid)
- Projects requiring platform portability (vendor-locked to Cloudflare Workers)

### Free tier boundaries

| Resource | Limit (per account)                                       | Notes                                                               |
| -------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| Workers  | 100k req/day, 10ms CPU/req                                | One app fills the pool; cache public pages to save budget           |
| D1       | 5GB storage, 5M reads/day, 100k writes/day                | Every `prepare()` counts; no full-text search; eventual consistency |
| R2       | 10GB storage, 1M Class A ops/month, 10M Class B ops/month | Sufficient for media serving at moderate scale                      |

All constraints are documented with 11 rules + a definition-of-done checklist in `AGENTS.md`.

### Cons (inherent trade-offs)

| Con                    | Details                                                                                                                                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vendor lock-in         | Cannot run on Node.js, Vercel, or other platforms. Bindings (`cloudflare:workers`, `env.DB`) are Cloudflare-specific. Migration = backend rewrite.                                                                                                  |
| D1 limitations         | No full-text search (LIKE scans only, can't index content body). Eventual consistency (read-after-write may be stale).                                                                                                                              |
| Tight CPU budget       | 10ms/request average — server-side Lexical rendering, `JSON.stringify` on large posts, or heavy `Array.from` on query results can exhaust it quickly.                                                                                               |
| No test framework      | `package.json` has no test script. No Jest/Vitest/Playwright. Not ready for test-driven development.                                                                                                                                                |
| Middleware deprecation | `vinext build` shows warning: `middleware.ts` is deprecated, must migrate to `proxy.ts`. Not yet addressed.                                                                                                                                         |
| Bundle size            | 487KB lockfile, heavy deps (Lexical full suite, Maplibre GL, dnd-kit, TanStack×3, motion, sonner). Cold starts on Workers may be slow.                                                                                                              |
| No TypeScript errors   | The "TS errors" mentioned in earlier evaluation were false positives from the Read tool's internal analyzer — `tsc --noEmit` and `oxlint` both pass with zero errors. All shadcn/ui components including `alert-dialog.tsx` are properly installed. |

## License

MIT © [masb0ymas](https://github.com/masb0ymas)
