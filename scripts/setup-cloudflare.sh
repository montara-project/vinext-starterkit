#!/usr/bin/env bash
#
# scripts/setup-cloudflare.sh
#
# One-shot provisioning for deploying vinext-starterkit to Cloudflare Workers (free tier).
# Creates the D1 database + R2 bucket, wires the bindings into wrangler.jsonc, applies the
# schema, sets secrets, and deploys.
#
# Prereqs: wrangler CLI available (npm i -g wrangler), logged in (wrangler login), and a
# Cloudflare account with Workers enabled.
#
# Usage:
#   ./scripts/setup-cloudflare.sh            # interactive prompts for secrets
#   BETTER_AUTH_SECRET=... GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... ./scripts/setup-cloudflare.sh
#
# The script is idempotent: re-running after a partial setup is safe.

set -euo pipefail

# --- Config (keep in sync with wrangler.jsonc) -------------------------------------
PROJECT_NAME="vinext-starterkit"
D1_DB_NAME="vinext-db"
R2_BUCKET_NAME="vinext-media"
WRANGLER_CONFIG="wrangler.jsonc"
SCHEMA_FILE="db/schema.sql"
PLACEHOLDER_ID="00000000-0000-0000-0000-000000000000"

# --- Helpers ------------------------------------------------------------------------
step() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }
ok()   { printf "\033[0;32m    %s\033[0m\n" "$*"; }
fail() { printf "\033[0;31m    %s\033[0m\n" "$*" >&2; }

command -v wrangler >/dev/null 2>&1 || {
  fail "wrangler CLI not found. Install it with: npm install -g wrangler"
  exit 1
}

# --- 0. Auth ------------------------------------------------------------------------
step "Checking Cloudflare auth"
if ! wrangler whoami >/dev/null 2>&1; then
  fail "Not logged in to Cloudflare. Run: wrangler login"
  exit 1
fi
ok "Logged in"

# --- 1. D1 database -----------------------------------------------------------------
step "Creating D1 database '$D1_DB_NAME'"
D1_CREATE_OUTPUT="$(wrangler d1 create "$D1_DB_NAME" 2>&1 || true)"
if echo "$D1_CREATE_OUTPUT" | grep -qi "already exists\|already in use\|already exists"; then
  ok "D1 database already exists, fetching its id"
fi
DATABASE_ID="$(echo "$D1_CREATE_OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1 || true)"
if [[ -z "$DATABASE_ID" ]]; then
  # Database already exists -> look it up instead of creating.
  DATABASE_ID="$(wrangler d1 list 2>/dev/null | python3 -c "
import json,sys
data = json.load(sys.stdin) if sys.stdin.read(1) else []
print(data)
" 2>/dev/null || true)"
  DATABASE_ID="$(wrangler d1 list --json 2>/dev/null | python3 -c "
import json,sys
rows=json.load(sys.stdin)
match=[r for r in rows if r.get('name')=='$D1_DB_NAME']
print(match[0]['uuid'] if match else '')
" || true)"
fi
if [[ -z "$DATABASE_ID" ]]; then
  fail "Could not determine database id for '$D1_DB_NAME'. Inspect: wrangler d1 list --json"
  exit 1
fi
ok "D1 database id: $DATABASE_ID"

# --- 2. Wire database_id into wrangler.jsonc -----------------------------------------
step "Wiring database_id into $WRANGLER_CONFIG"
if grep -q "$PLACEHOLDER_ID" "$WRANGLER_CONFIG"; then
  sed -i.bak "s/$PLACEHOLDER_ID/$DATABASE_ID/g" "$WRANGLER_CONFIG"
  rm -f "$WRANGLER_CONFIG.bak"
  ok "database_id replaced"
else
  ok "database_id already set"
fi

# --- 3. R2 bucket -------------------------------------------------------------------
step "Creating R2 bucket '$R2_BUCKET_NAME'"
if wrangler r2 bucket create "$R2_BUCKET_NAME" >/dev/null 2>&1; then
  ok "R2 bucket created"
else
  ok "R2 bucket already exists (or creation failed, continuing)"
fi

# --- 4. Apply schema ----------------------------------------------------------------
step "Applying $SCHEMA_FILE to D1 '$D1_DB_NAME'"
wrangler d1 execute "$D1_DB_NAME" --file="$SCHEMA_FILE" --remote
ok "Schema applied"

# --- 5. Secrets ---------------------------------------------------------------------
step "Setting Worker secrets"
secret_prompt() {
  local name="$1"
  local from_env="${2:-}"
  if [[ -n "$from_env" ]]; then
    printf '%s' "$from_env" | wrangler secret put "$name" >/dev/null 2>&1 || true
    ok "$name set from env"
  else
    read -rsp "Enter value for $name (input hidden): " value
    printf '\n'
    if [[ -n "$value" ]]; then
      printf '%s' "$value" | wrangler secret put "$name" >/dev/null 2>&1 || true
      ok "$name set"
    else
      fail "$name skipped (empty). Auth flows may not work until it is set."
    fi
  fi
}

secret_prompt "BETTER_AUTH_SECRET" "${BETTER_AUTH_SECRET:-}"
secret_prompt "GOOGLE_CLIENT_ID" "${GOOGLE_CLIENT_ID:-}"
secret_prompt "GOOGLE_CLIENT_SECRET" "${GOOGLE_CLIENT_SECRET:-}"

# --- 6. Regenerate types -------------------------------------------------------------
step "Regenerating Cloudflare types (worker-configuration.d.ts)"
corepack pnpm run cf-typegen
ok "Types regenerated"

# --- 7. Build + deploy ---------------------------------------------------------------
step "Building and deploying"
corepack pnpm run build
corepack pnpm run deploy

printf "\n\033[1;32mDone.\033[0m Your Worker is live at https://%s.your-name.workers.dev\n" "$PROJECT_NAME"
printf "Update the 'your-name' placeholders in wrangler.jsonc vars and .env to your real subdomain.\n"
