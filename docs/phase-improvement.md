# Vinext Starterkit — UI Improvement Plan

> Status: Disetujui (Phase A + B + C, termasuk i18n). Plan ini disusun dari hasil perbandingan UI dengan gogin-saas-boilerplate.

## Context

Perbandingan dengan gogin-saas-boilerplate mengungkap bahwa vinext-starterkit memiliki fondasi komponen yang lebih kaya (Lexical rich text editor, Maplibre map, dnd-kit, form fields beragam, role-based sidebar, API layer dengan category service, DataGrid components) tetapi halaman-halaman aktualnya masih kosong/placeholder, menggunakan hardcoded colors yang mengabaikan theme tokens, dan memiliki login form yang tidak lengkap. Tujuan: meningkatkan kualitas UI vinext-starterkit secara konsisten, modular, dan anti-slop.

---

## Phase A — Critical Fixes (UI Correctness, High Impact)

### A1. Landing Page — Theme Tokens
**File:** `app/(public)/(site)/page.tsx`
- Ganti semua hardcoded slate colors ke CSS variables theme tokens:
  - `bg-slate-50` → `bg-background`
  - `text-slate-950` → `text-foreground`
  - `text-orange-600` → `text-primary`
  - `border-slate-200` → `border`
  - `bg-white` → `bg-card`
  - `text-slate-700` / `text-slate-600` → `text-muted-foreground`
  - `bg-slate-100` → `bg-muted`
  - `border-slate-300` → `border`
  - `hover:bg-slate-100` → `hover:bg-muted`

### A2. Login Form — Password Field + Branding
**File:** `components/block/auth/login-form.tsx`
- Tambah password field (reuse `components/block/form/password-field.tsx` yang sudah ada)
- Ganti "Acme Inc." → "Vinext Starterkit" di dua tempat: `<span className="sr-only">` dan `<h1>`
- Ganti "Don&apos;t have an account? Sign up" link ke route `/sign-up` yang sudah ada
- Tambah email state dan handler untuk login lengkap (email + password)

### A3. Dashboard — Isi dengan Konten
**File:** `app/(protected)/dashboard/page.tsx`
- Ganti placeholder `"DashboardPage"` dengan konten nyata:
  - Welcome section dengan user info (nama dari auth session — `requireSession()` sudah menyediakan `AuthSession`)
  - Stat cards (menggunakan `Card` component)
  - Quick actions / recent activity
- Reuse `avatar.tsx`, `card.tsx`, `button.tsx` dari `components/ui/`

---

## Phase B — Fill Empty Pages (Feature Pages)

### B1. Data Table Pattern (Reusable)
**Existing assets:**
- `components/ui/data-grid-column-visibility.tsx` — column visibility toggle
- `components/ui/data-grid-pagination.tsx` — pagination controls
- `hooks/use-pagination-query.ts` — pagination query hook
- `lib/api/resource.ts` — base resource CRUD
- `lib/api/services/category.ts` + `lib/api/models/category.ts` + `lib/api/queries/category.ts` — existing CRUD service pattern

**Approach:** Buat generic reusable DataTable wrapper di `components/block/data-table/` yang memadukan TanStack Table (`@tanstack/react-table` sudah terinstall) + DataGrid components + existing hooks.

### B2. Content Pages
**Routes to create** (dari `data/sidebar-menu.ts`):
| Route | File | Contents |
|-------|------|----------|
| `/content/posts` | `app/(protected)/content/posts/page.tsx` | DataTable posts + create/edit using Lexical rich text editor |
| `/content/pages` | `app/(protected)/content/pages/page.tsx` | DataTable pages |
| `/content/categories` | `app/(protected)/content/categories/page.tsx` | DataTable categories (reuse `lib/api/services/category.ts`) |
| `/content/tags` | `app/(protected)/content/tags/page.tsx` | DataTable tags |

- Gunakan pattern existing `lib/api/services/category.ts` sebagai template CRUD service
- Untuk content editor page: reuse `components/block/editor/rich-text-editor.tsx` (Lexical)
- Untuk form fields: reuse `components/block/form/*` yang sudah ada

### B3. Media Pages
| Route | File | Contents |
|-------|------|----------|
| `/media/library` | `app/(protected)/media/library/page.tsx` | Grid gallery view, reuse `gallery-upload-field.tsx` + dnd-kit sortable |
| `/media/upload` | `app/(protected)/media/upload/page.tsx` | Upload form using `use-file-upload` hook |

### B4. Users & Settings Pages
| Route | File | Contents |
|-------|------|----------|
| `/users` | `app/(protected)/users/page.tsx` | DataTable users (CRUD with alert-dialog) |
| `/users/roles` | `app/(protected)/users/roles/page.tsx` | Roles management |
| `/users/permissions` | `app/(protected)/users/permissions/page.tsx` | Permissions matrix |
| `/comments` | `app/(protected)/comments/page.tsx` | Comments moderation table |
| `/analytics` | `app/(protected)/analytics/page.tsx` | Charts (chart CSS variables sudah ada di globals.css) |
| `/settings/general` | `app/(protected)/settings/general/page.tsx` | General settings form |
| `/settings/seo` | `app/(protected)/settings/seo/page.tsx` | SEO configuration |
| `/settings/appearance` | `app/(protected)/settings/appearance/page.tsx` | Theme/customization |

---

## Phase C — Polish & Consistency

### C1. i18n — next-intl (Confirmed Include)
**Library:** `next-intl` (paling idiomatis untuk Next.js App Router; gogin pakai react-i18next tapi itu untuk Vite SPA)
**Files:**
- `app/[locale]/layout.tsx` (refactor dari `app/layout.tsx`) — wrapper locale
- `i18n/routing.ts` + `i18n/request.ts` + `messages/en.json` + `messages/id.json` (baru)
- `next.config.ts` — tambah `createNextIntlPlugin`
- Semua hardcoded string di component/public/protected pages → `useTranslations()` atau `t()` dari next-intl
- Middleware di `middleware.ts` untuk locale detection/redirect (en default)
- Perlu refactor route group: pindahkan `app/(public)`, `app/(auth)`, `app/(protected)` ke dalam `app/[locale]/`

**Catatan:** Ini perubahan terbesar di Phase C — menyentuh struktur route. Lakukan paling akhir agar UI yang sudah jadi tinggal di-replace string-nya, bukan string dulu lalu UI.

### C2. Loading/Error/Empty States
- Untuk setiap page yang fetch data: handle `isPending`, `isError`, `isSuccess` dari TanStack Query
- Reuse `components/block/common/empty-section.tsx` untuk empty state
- Buat reusable `DataStateWrapper` component (loading spinner + error message + empty state + content)

### C3. Responsive Sidebar
- shadcn sidebar sudah collapsible, pastikan mobile: hamburger menu + overlay
- Test di mobile viewport

### C4. User Avatar
- Initial-based avatar (ambil huruf pertama dari fullname)
- Reuse `components/ui/avatar.tsx`
- Implement di `NavUser` component (`components/layout/sidebar/nav-user.tsx`)

---

## Phase D — Premium Features (Referensi Masa Depan)

### D1. Rich Text Editor Integration
- Integrasi Lexical editor untuk content editing di `/content/posts` dan `/content/pages`
- Full Lexical editor suite sudah ada di `components/block/editor/`
- Tinggal buat wrapper page yang combine editor + form fields + publish button

### D2. Chart Dashboard
- Chart CSS variables sudah ada di globals.css (`--chart-1` to `--chart-5`)
- Butuh library chart (belum terinstall — `recharts` atau `nivo`)
- Dashboard analytics sidebar menu sudah ada di `data/sidebar-menu.ts`

### D3. Map Integration
- Maplibre sudah terinstall (`components/ui/map.tsx` + `components/block/common/simple-map.tsx`)
- Integrasi untuk location-based fields di content/settings

---

## Design Approach (Anti-Slop)
Saat implementasi fase apapun, WAJIB invoke salah satu skill anti-slop:
- **Fase A (fixes):** `no-ai-slop` atau `avoid-ai-design`
- **Fase B (pages baru):** `design-taste-frontend` atau `hallmark` atau `repaint`
- **Fase C (polish):** `no-ai-slop`
- **Fase D (premium):** `design-taste-frontend` atau `repaint`

Larangan: Inter, purple-blue gradient, cream bg, pill badge, 3 icon cards, em-dash copy, fade-up-on-scroll.

---

## Critical Files (to modify)

| File | Phase | Change |
|------|-------|--------|
| `app/(public)/(site)/page.tsx` | A1 | Theme tokens |
| `components/block/auth/login-form.tsx` | A2 | Password field + branding |
| `app/(protected)/dashboard/page.tsx` | A3 | Konten dashboard |
| `app/(protected)/content/*/page.tsx` (new) | B2 | Content CRUD pages |
| `app/(protected)/media/*/page.tsx` (new) | B3 | Media gallery + upload |
| `app/(protected)/users/*/page.tsx` (new) | B4 | Users management |
| `app/(protected)/comments/page.tsx` (new) | B4 | Comments |
| `app/(protected)/analytics/page.tsx` (new) | B4 | Charts |
| `app/(protected)/settings/*/page.tsx` (new) | B4 | Settings pages |
| `components/layout/sidebar/nav-user.tsx` | C4 | Avatar display |

## Existing Utilities to Reuse

| Utility | Path | Used For |
|---------|------|----------|
| DataGrid visibility | `components/ui/data-grid-column-visibility.tsx` | All data tables |
| DataGrid pagination | `components/ui/data-grid-pagination.tsx` | All data tables |
| use-pagination-query | `hooks/use-pagination-query.ts` | Pagination state |
| resource.ts | `lib/api/resource.ts` | CRUD base class |
| category service | `lib/api/services/category.ts` | Template for new services |
| password-field | `components/block/form/password-field.tsx` | Login form password |
| rich-text-editor | `components/block/editor/rich-text-editor.tsx` | Content editor |
| gallery-upload-field | `components/block/form/gallery-upload-field.tsx` | Media upload |
| use-file-upload | `hooks/use-file-upload.tsx` | File upload handling |
| empty-section | `components/block/common/empty-section.tsx` | Empty states |
| avatar | `components/ui/avatar.tsx` | User avatar |
| map | `components/block/common/simple-map.tsx` | Location fields |

## Verification

1. `npm run dev` — app harus berjalan tanpa error
2. `npm run typecheck` — tidak ada TypeScript errors
3. `npm run lint` — 0 warnings/errors
4. Visual check:
   - Landing page menggunakan theme tokens (light + dark mode)
   - Login form punya email + password + Google OAuth
   - Dashboard menampilkan user info + stats
   - Sidebar navigation bekerja ke halaman baru
   - Responsive: mobile sidebar overlay
   - Dark mode toggle bekerja via next-themes
5. Index ke codebase-memory-mcp: `mcp__codebase-memory-mcp__index_repository(repo_root="/home/dy/code/vinext-starterkit")`
