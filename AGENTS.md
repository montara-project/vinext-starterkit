# AGENTS.md

This starterkit deploys to a single Cloudflare Worker on the **free plan**. The
free tier is a hard budget that every feature must optimize for — but if a
feature is genuinely well-optimized and still must exceed the free limits
(e.g., a busy public site), it is acceptable. These rules exist to prevent
wasteful defaults, not to cap ambition.

## The budget (per account, not per worker)

| Resource | Free limit                                                 | Counts against it                                                                                                      |
| -------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Workers  | 100,000 requests/day, 10ms CPU per request                 | Every request to the Worker: page loads, API calls, auth callbacks, asset requests served by the Worker, cron triggers |
| D1       | 5 GB storage, 5M reads/day, 100k writes/day                | Every `prepare()` executed                                                                                             |
| R2       | 10 GB storage, 1M Class A ops/month, 10M Class B ops/month | `put`/`get`/`list` (Class B = reads), deletes (Class A)                                                                |

All Workers in one account share the 100k/day pool. One app is fine; do not
build as if the budget were infinite.

## Non-negotiable rules for every feature

1. **Cache before compute.** Public GET responses must set `Cache-Control`.
   Static assets are immutable. The Worker has `cache` and `images` enabled in
   `wrangler.jsonc` — use them. A cache hit costs ~0ms CPU and 0 D1 reads; a
   miss can cost 5-10ms of CPU and one or more D1 reads. Every uncached request
   you can eliminate extends the daily request budget.
2. **Pagination is mandatory on every list endpoint.** Never return unbounded
   arrays. The `/v1` catch-all already enforces `page`/`pageSize` (cap 100).
   Keep it that way in new endpoints.
3. **No N+1 queries.** Never loop a query per row in D1. Batch with `IN (...)` or
   a single `JOIN`. Each D1 read burns from the 5M/day read pool.
4. **Prepared statements only.** D1 caches prepared statement plans. Raw string
   SQL interpolation is forbidden (also a SQL-injection vector). Existing
   pattern: `db.prepare(...).bind(...)`.
5. **Index every column you filter or sort on.** `db/schema.sql` already indexes
   `slug`, `authorId`, `categoryId`, `status`, `uploadedBy`, `postId`. When
   adding a column that appears in a `WHERE`/`ORDER BY`, add an index in the
   same change.
6. **Stream, don't buffer.** R2 objects are served via `object.body` streams
   (see `/api/v1/media/file/{key}`). Never `await arrayBuffer()` on a large
   object just to re-send it.
7. **Trim JSON payloads.** Pick only the fields the UI needs. `SELECT *` on
   content-heavy tables (posts with `content` text) wastes bytes and CPU on
   `JSON.stringify`. If a list doesn't need `content`, exclude it.
8. **Reject early.** Auth checks run before any query. An unauthenticated
   request must return `401` without touching D1. Never do work before checking
   the session.
9. **No polling, no websockets on the free plan.** Real-time UI that polls an
   endpoint every few seconds will burn the 100k/day budget alone. Use static
   regeneration, SWR with long stale times, or server-sent events over a cached
   endpoint — or accept refresh-on-interaction only.
10. **10ms CPU is real.** Avoid per-request heavy work: large regex, big
    `JSON.parse`/`stringify`, crypto beyond the auth library, image processing,
    unbounded `Array.from` on query results. Move expensive work to build time
    (static generation) or to a D1 query.
11. **Keep the worker bundle lean.** One Worker serves frontend + API. Adding a
    heavy runtime dependency (moment, lodash, a charting lib server-side) grows
    cold-start time and per-request CPU. Prefer built-ins and `Intl`.

## When designing a new endpoint or feature

- Ask: how many requests per day will this realistically serve? How many D1
  reads per request? Multiply and check against 100k/day and 5M reads/day.
- Prefer a single query that returns everything needed over two smaller ones.
- If the response is shared across users (public content, config), it must be
  cacheable. If it is user-specific (dashboard), keep the query minimal.
- If data changes rarely, prefer `generateStaticParams` / static pages over a
  dynamic route that hits D1 on every request.

## Definition of done

Before submitting a feature, verify:

- [ ] Public GETs have `Cache-Control` (or a documented reason not to).
- [ ] List endpoints paginate and cap `pageSize`.
- [ ] No N+1 queries; queries use `prepare().bind()`.
- [ ] New filter/sort columns have indexes in `db/schema.sql`.
- [ ] Auth check precedes any D1 access.
- [ ] No polling/websockets added to reach the free budget.
- [ ] The request count math fits inside 100k/day for realistic traffic.

## CRUD Page Pattern (Page/Table/Column)

Setiap halaman CRUD di codebase ini WAJIB mengikuti pola 3-layer yang konsisten ini. Implementasi referensi lengkapnya adalah modul `comments` (`components/block/comments/`). Semua halaman CRUD lain (users, posts, pages, categories, tags, media) harus meniru struktur ini.

### Layer 1: `page.tsx` — Server Component (Thin)

File: `app/[locale]/(protected)/<resource>/page.tsx`

```tsx
import { Metadata } from 'next'
import { META } from '@/lib/constants/meta'
import <Resource>Table from '@/components/block/<resource>/table'

export const metadata: Metadata = {
  ...META,
  title: '<Resource> | Vinext Starterkit',
}

export default async function <Resource>Page() {
  return <<Resource>Table />
}
```

Aturan:

- Hanya set metadata. Tidak ada logic bisnis.
- Render satu client component (`<Resource>Table`).
- Jangan fetch data di server — semua data fetching di layer client.

### Layer 2: `table.tsx` — Client Component (Data Fetching + Layout)

File: `components/block/<resource>/table.tsx`

```tsx
'use client'

import { IconSearch } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { Input, InputWrapper } from '@/components/ui/input'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { queries } from '@/lib/api/queries'
import { getTotal } from '@/lib/constants/paginate'

import ReactTable from '../common/react-table'
import SectionCard from '../common/section-card'
import { <Resource>Column } from './column'

export default function <Resource>Table() {
  const t = useTranslations('pages')
  const { offset, limit, pageIndex } = usePaginationQuery()

  const defaultQueryParams = useMemo(() => ({ offset, limit }), [offset, limit])

  const { data, isFetching, isLoading, isError, error } = useQuery(
    queries.<resource>.list(defaultQueryParams)
  )
  const loading = isFetching || isLoading
  const total = getTotal(data)

  if (isError) {
    toast.error(error?.message || 'Failed to load <resource>')
  }

  const columns = <Resource>Column({ loading })
  const items = useMemo(
    () => (data?.data && data?.data?.length > 0 ? data.data : []),
    [data]
  )

  return (
    <SectionCard
      title={t('<resource>.title')}
      toolbar={
        <div className="flex flex-row items-center gap-2">
          <InputWrapper className="w-72">
            <IconSearch />
            <Input placeholder={t('<resource>.search')} />
          </InputWrapper>
        </div>
      }
    >
      <ReactTable
        total={total}
        data={items}
        pageIndex={pageIndex}
        pageSize={limit}
        columns={columns}
      />
    </SectionCard>
  )
}
```

Aturan:

- `usePaginationQuery()` dari `@/hooks/use-pagination-query` — berbasis nuqs (`?page=0&pageSize=10`).
- `useQuery(queries.<resource>.list(params))` — TanStack Query, query key dari `lib/api/queries/`.
- `getTotal(data)` dari `@/lib/constants/paginate` — ambil `metadata.total` dengan fallback.
- `loading = isFetching || isLoading` — tampilkan skeleton di kolom saat loading.
- Error ditampilkan via `toast.error()`.
- Columns adalah function call: `const columns = <Resource>Column({ loading })`.
- Data diekstrak dengan `useMemo` dari `data?.data` (array kosong sebagai fallback).

### Layer 3: `column.tsx` — Client Component (Columns Definition + Actions)

File: `components/block/<resource>/column.tsx`

```tsx
'use client'

import { IconCheck, IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { throwAxiosError } from '@/lib/api/axios-error'
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'
import { BaseColumnProps } from '@/types/column'

import RowColumnAction from '../common/row-column-action'
import SimpleAlertDialog from '../common/simple-alert-dialog'

export function <Resource>Column({ loading }: BaseColumnProps) {
  const columns = useMemo<ColumnDef<Models.<Resource>>[]>(
    () => [
      {
        accessorKey: 'fieldName',
        header: 'Field Name',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? <Skeleton className="h-5 w-full" /> : <span>{value}</span>
        },
        size: 60,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return loading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            <ActionCell record={row.original} />
          )
        },
        size: 40,
      },
    ],
    [loading]
  )
  return columns
}

interface ActionCellProps {
  record: Models.<Resource>
}

function ActionCell({ record }: ActionCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const queryClient = useQueryClient()
  const { offset, limit } = usePaginationQuery()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await services.<resource>.delete(record.id)
      } catch (error) {
        throwAxiosError(error as Error)
      }
    },
    onSuccess: () => {
      toast.success('<Resource> deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['<resource>', { offset, limit }] })
      setOpenDelete(false)
    },
  })

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      toast.error(message)
    }
  }

  return (
    <React.Fragment>
      <RowColumnAction
        onEdit={() => {}} // navigate to edit page
        onDelete={() => setOpenDelete(true)}
        dropdown={
          <React.Fragment>
            {/* custom dropdown items */}
          </React.Fragment>
        }
      />

      <SimpleAlertDialog
        title="Do you want to delete this <resource>?"
        description="This <resource> will be permanently deleted and cannot be undone."
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </React.Fragment>
  )
}
```

Aturan:

- Column function: `export function <Resource>Column({ loading }: BaseColumnProps)` — return `useMemo<ColumnDef<Models.<Resource>>[]>(() => [...], [loading])`.
- BaseColumnProps dari `@/types/column`: `{ loading: boolean }`.
- Skeleton: setiap cell render `<Skeleton className="h-5 w-full" />` saat loading, `<span>` saat tidak.
- Actions column: render `<ActionCell record={row.original} />` — component terpisah di file yang sama.
- `useMutation` untuk update/delete: `mutationFn` wrap dengan `throwAxiosError`, `onSuccess` invalidate query + toast.
- Query invalidation: `queryClient.invalidateQueries({ queryKey: ['<resource>', { offset, limit }] })`.
- Gunakan `throwAxiosError(error as Error)` dari `@/lib/api/axios-error` untuk parse Axios error.
- Confirmation dialog: `<SimpleAlertDialog>` — variant `"destructive"` untuk delete.
- Action buttons: `<RowColumnAction>` — support `onShow`, `onEdit`, `onDelete`, `dropdown`, `actions`.

### API Layer (Service/Query/Model)

Setiap resource memiliki 3 file di `lib/api/`:

**Service** (`lib/api/services/<resource>.ts`):

```ts
import { HTTP_METHOD, ResourceMethods } from '@/types/api'
import { Models } from '../models'
import { clientResource } from '../resource'

const path = '/v1/<resource>'
const methods = [HTTP_METHOD.GET, HTTP_METHOD.POST, HTTP_METHOD.PUT, HTTP_METHOD.DELETE]

export const <resource>Services: ResourceMethods<Models.<Resource>> = clientResource(path, methods)
```

**Query** (`lib/api/queries/<resource>.ts`):

```ts
import { queryOptions } from '@tanstack/react-query'
import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'
import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const list<Resource> = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['<resource>', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE
      const res = await services.<resource>.list(pagination)
      return res.data
    },
  })

const get<Resource> = (params: { id: string }) =>
  queryOptions({
    queryKey: ['<resource>', params.id],
    queryFn: async () => {
      const res = await services.<resource>.get(params.id)
      return res.data
    },
  })

export const <resource>Queries = { list: list<Resource>, get: get<Resource> } as const
```

**Model** (`lib/api/models/<resource>.ts`):

```ts
export interface <Resource> {
  id: string
  // ... fields
}
```

Semua service, query, dan model di-register di index files masing-masing:

- `lib/api/services/index.ts` → `services.<resource>`
- `lib/api/queries/index.ts` → `queries.<resource>`
- `lib/api/models/index.ts` → `Models.<Resource>`

### Shared Components

| Component            | Path                                            | Props                                                                          |
| -------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| `SectionCard`        | `@/components/block/common/section-card`        | `{ title, toolbar?, children }`                                                |
| `ReactTable`         | `@/components/block/common/react-table`         | `{ columns, data, pageSize, pageIndex, total, ... }`                           |
| `RowColumnAction`    | `@/components/block/common/row-column-action`   | `{ onShow?, onEdit?, onDelete?, dropdown?, actions? }`                         |
| `SimpleAlertDialog`  | `@/components/block/common/simple-alert-dialog` | `{ title, description, open, onOpenChange, onConfirm, confirmText, variant? }` |
| `usePaginationQuery` | `@/hooks/use-pagination-query`                  | Returns `{ offset, limit, pageIndex }`                                         |
| `throwAxiosError`    | `@/lib/api/axios-error`                         | `throwAxiosError(error)` — parse Axios error to Error                          |
| `BaseColumnProps`    | `@/types/column`                                | `{ loading: boolean }`                                                         |
| `getTotal`           | `@/lib/constants/paginate`                      | `getTotal(data)` — extract `metadata.total`                                    |
| `DataStateWrapper`   | `@/components/block/common/data-state-wrapper`  | Loading/error/empty state wrapper                                              |

### Conventions

1. **Naming:** Resource name camelCase untuk service/query key, PascalCase untuk component/type.
2. **File structure:** Setiap resource di `components/block/<resource>/` memiliki `table.tsx` + `column.tsx`.
3. **Query keys:** Gunakan array `['<resource>', params]` — params berupa `{ offset, limit }`.
4. **Invalidation:** Invalidate dengan query key yang sama persis dengan yang digunakan saat fetch.
5. **Error handling:** `mutationFn` → `throwAxiosError`, wrapper handler → `toast.error`.
6. **Loading state:** Skeleton per-cell, jangan loading spinner di atas table.
7. **Search:** Toolbar search input di `SectionCard` — belum terhubung ke API (placeholder untuk filter).
8. **i18n:** Gunakan `useTranslations('pages')` untuk judul dan placeholder.
9. **Referensi implementasi:** modul `comments` (`components/block/comments/table.tsx` + `column.tsx`) adalah contoh lengkap yang sudah memakai pattern ini. Gunakan sebagai template saat membangun halaman CRUD lain.
