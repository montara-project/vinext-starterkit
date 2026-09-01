# Deployment Guide — Cloudflare Workers (Free Tier)

This guide explains how to take vinext-starterkit from a local dev server to a
live deployment on Cloudflare Workers. The entire provisioning flow is automated
in [`scripts/setup-cloudflare.sh`](scripts/setup-cloudflare.sh), so an AI or a
human can bootstrap a production instance in one command.

## Architecture

A single Cloudflare Worker serves everything:

| Concern                                           | Implementation                                          |
| ------------------------------------------------- | ------------------------------------------------------- |
| Frontend (Next.js-style App Router)               | vinext build output, bound as `ASSETS`                  |
| Auth (better-auth, email/password + Google OAuth) | `app/api/auth/[...all]/route.ts`                        |
| REST API (CRUD)                                   | `app/api/v1/[...all]/route.ts` (catch-all)              |
| Media upload + serving                            | `app/api/v1/media/route.ts` + R2 bucket `MEDIA`         |
| Database                                          | Cloudflare D1 (`DB` binding), schema in `db/schema.sql` |

Better-auth persists sessions, users, and OAuth accounts in D1 through the
**drizzle adapter** (`better-auth/adapters/drizzle` + `drizzle-orm/d1`), which
is the officially supported way to use D1 with better-auth. There is no
`@better-auth/d1-adapter` package; the drizzle path is the correct one.

Bindings are accessed via `import { env } from 'cloudflare:workers'`
(`lib/db.ts`), which is the runtime module the `@cloudflare/vite-plugin`
injects. No `getCloudflareContext` import is needed.

## Prerequisites

- Node.js 18+ and `corepack pnpm`
- `wrangler` CLI: `npm install -g wrangler`
- A Cloudflare account with Workers enabled (free plan is enough)
- Google OAuth credentials (for Google sign-in): create a project at
  https://console.cloud.google.com/apis/credentials, add an OAuth client of
  type Web application, and set the redirect URI to
  `https://<your-subdomain>.workers.dev/api/auth/callback/google`

## One-command setup

```bash
corepack pnpm install
wrangler login
./scripts/setup-cloudflare.sh
```

The script does, in order:

1. Verifies you are logged in to Cloudflare.
2. Creates the D1 database `vinext-db` and extracts its id.
3. Replaces the placeholder `database_id` in `wrangler.jsonc` with the real id.
4. Creates the R2 bucket `vinext-media`.
5. Applies `db/schema.sql` to the remote D1 database.
6. Prompts for (or reads from env) the secrets: `BETTER_AUTH_SECRET`,
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
7. Regenerates `worker-configuration.d.ts` via `wrangler types`.
8. Builds the worker and deploys it.

To pass secrets non-interactively:

```bash
BETTER_AUTH_SECRET=$(openssl rand -base64 32) \
GOOGLE_CLIENT_ID=... \
GOOGLE_CLIENT_SECRET=... \
./scripts/setup-cloudflare.sh
```

## Manual steps (if you prefer to do it by hand)

```bash
# 1. Create the D1 database and note the returned database_id
wrangler d1 create vinext-db

# 2. Paste that id into wrangler.jsonc under d1_databases[0].database_id

# 3. Create the R2 bucket
wrangler r2 bucket create vinext-media

# 4. Apply the schema
wrangler d1 execute vinext-db --file=db/schema.sql --remote

# 5. Set secrets
printf '%s' "$BETTER_AUTH_SECRET"  | wrangler secret put BETTER_AUTH_SECRET
printf '%s' "$GOOGLE_CLIENT_ID"    | wrangler secret put GOOGLE_CLIENT_ID
printf '%s' "$GOOGLE_CLIENT_SECRET" | wrangler secret put GOOGLE_CLIENT_SECRET

# 6. Regenerate binding types, build, deploy
corepack pnpm run cf-typegen
corepack pnpm run build
corepack pnpm run deploy
```

## Post-deploy

1. Replace the `your-name` placeholder in `wrangler.jsonc` vars
   (`NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL`) with your real subdomain:
   `https://<your-subdomain>.workers.dev`.
2. Update `.env` locally the same way for `dev`.
3. The first user must be created through the app (sign up with email/password
   or Google). There is no seeded admin account.

## Local development

```bash
corepack pnpm install
cp .env.example .env   # fill in BETTER_AUTH_SECRET, GOOGLE_*, NEXT_PUBLIC_*
corepack pnpm run dev  # serves on http://localhost:5173
```

To run the worker locally with D1/R2 bindings (uses a local D1 via
miniflare): `corepack pnpm run preview` after wiring the real `database_id`
into `wrangler.jsonc`.

## API reference (`/api/v1/*`)

All endpoints require a session cookie from `/api/auth/sign-in`. Unauthenticated
requests get `401 { error: "Unauthorized" }`.

| Method | Path                       | Description                                                                                     |
| ------ | -------------------------- | ----------------------------------------------------------------------------------------------- |
| GET    | `/api/v1/{resource}`       | List with `?page=0&pageSize=10&search=...` → `{ data: [...], meta: { total, page, pageSize } }` |
| GET    | `/api/v1/{resource}/{id}`  | Get one → the row object                                                                        |
| POST   | `/api/v1/{resource}`       | Create → the created row (201)                                                                  |
| PUT    | `/api/v1/{resource}/{id}`  | Update → the updated row                                                                        |
| DELETE | `/api/v1/{resource}/{id}`  | Delete → `{ success: true }`                                                                    |
| POST   | `/api/v1/media`            | Multipart upload (`file` field, optional `name`) → media row (201)                              |
| GET    | `/api/v1/media/file/{key}` | Stream an uploaded file back from R2                                                            |

Supported resources: `posts`, `pages`, `categories`, `tags`, `media`,
`comments`, `users`, `roles`, `permissions`. Columns are allow-listed server
side; unknown fields in the body are ignored.

## Notes

- D1 and R2 have generous free tiers: 5 GB storage, 5 million reads/day for
  D1; 10 GB storage, 1 million class A operations/month for R2.
- Secrets (`BETTER_AUTH_SECRET`, Google creds) are stored as Worker secrets,
  never committed to the repo. `BETTER_AUTH_SECRET` must be at least 32
  characters.
- The `database_id` in `wrangler.jsonc` is a placeholder until you run the
  setup script; `wrangler deploy` will fail if it is still the placeholder.
