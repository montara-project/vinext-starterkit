# Vinext Starterkit

A modern CMS admin starter kit built with [Vinext](https://vinext.dev) (Next.js-based framework) and deployed on Cloudflare Workers.

## Tech Stack

- **Framework:** Vinext (Next.js + Vite) on Cloudflare Workers
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix Vega style)
- **Auth:** Better Auth (Google OAuth)
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
│   ├── (auth)/             # Authentication routes (sign-in)
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

This project is configured to deploy to Cloudflare Workers:

```bash
pnpm deploy
```

The `wrangler.jsonc` configuration includes:

- Asset serving from `dist/client`
- Cache and Images bindings
- Observability enabled
- Source map uploads

## License

MIT © [masb0ymas](https://github.com/masb0ymas)
