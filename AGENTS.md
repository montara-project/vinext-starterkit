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
