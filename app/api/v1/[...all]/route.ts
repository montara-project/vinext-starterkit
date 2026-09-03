import { auth } from '@/lib/auth/auth-server'
import { getDB, getR2 } from '@/lib/db'

type PkType = 'text' | 'number'
type TimestampFormat = 'iso' | 'milliseconds'

interface ResourceConfig {
  table: string
  pk: string
  pkType: PkType
  columns: string[]
  searchable?: string[]
  timestamps: TimestampFormat
}

/**
 * Whitelist of CRUD resources exposed under /api/v1/{resource}[/{id}].
 * Columns are allow-listed to prevent SQL injection; unknown fields are dropped.
 */
const RESOURCES: Record<string, ResourceConfig> = {
  posts: {
    table: 'posts',
    pk: 'id',
    pkType: 'text',
    columns: [
      'id',
      'title',
      'slug',
      'excerpt',
      'content',
      'status',
      'categoryId',
      'authorId',
      'createdAt',
      'updatedAt',
      'publishedAt',
    ],
    searchable: ['title', 'slug'],
    timestamps: 'iso',
  },
  pages: {
    table: 'pages',
    pk: 'id',
    pkType: 'text',
    columns: ['id', 'title', 'slug', 'content', 'status', 'createdAt', 'updatedAt'],
    searchable: ['title', 'slug'],
    timestamps: 'iso',
  },
  categories: {
    table: 'categories',
    pk: 'id',
    pkType: 'number',
    columns: ['id', 'name', 'slug', 'description', 'createdAt', 'updatedAt'],
    searchable: ['name', 'slug'],
    timestamps: 'iso',
  },
  tags: {
    table: 'tags',
    pk: 'id',
    pkType: 'number',
    columns: ['id', 'name', 'slug', 'createdAt', 'updatedAt'],
    searchable: ['name', 'slug'],
    timestamps: 'iso',
  },
  media: {
    table: 'media',
    pk: 'id',
    pkType: 'text',
    columns: ['id', 'name', 'url', 'mimeType', 'size', 'key', 'uploadedBy', 'createdAt'],
    searchable: ['name'],
    timestamps: 'iso',
  },
  comments: {
    table: 'comments',
    pk: 'id',
    pkType: 'text',
    columns: ['id', 'content', 'postId', 'authorId', 'status', 'createdAt'],
    searchable: ['content'],
    timestamps: 'iso',
  },
  users: {
    table: 'user',
    pk: 'id',
    pkType: 'text',
    columns: ['id', 'name', 'email', 'emailVerified', 'image', 'createdAt', 'updatedAt'],
    searchable: ['name', 'email'],
    timestamps: 'milliseconds',
  },
  roles: {
    table: 'roles',
    pk: 'id',
    pkType: 'text',
    columns: ['id', 'name', 'description', 'createdAt'],
    searchable: ['name'],
    timestamps: 'iso',
  },
  permissions: {
    table: 'permissions',
    pk: 'id',
    pkType: 'text',
    columns: ['id', 'name', 'description', 'createdAt'],
    searchable: ['name'],
    timestamps: 'iso',
  },
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

function unauthorized() {
  return json({ error: 'Unauthorized' }, 401)
}

function parseSegments(url: URL): { resource: string; id: string | null } | null {
  const segments = url.pathname.split('/').filter(Boolean)
  // /api/v1/{resource}[/{id}]
  if (segments.length < 3 || segments[0] !== 'api' || segments[1] !== 'v1' || segments.length > 4) {
    return null
  }
  return { resource: segments[2], id: segments[3] ?? null }
}

function requireSession(request: Request) {
  return auth.api.getSession({ headers: request.headers })
}

type Action = 'read' | 'create' | 'update' | 'delete'

function forbidden() {
  return json({ error: 'Forbidden' }, 403)
}

/**
 * Permission names follow `{resource}:{action}` (e.g. `posts:read`,
 * `users:create`, `roles:delete`). Access is granted by inserting that name
 * into `permissions`, linking it to a role in `role_permissions`, and
 * assigning the role to a user in `user_roles`.
 */
function permissionName(resource: string, action: Action): string {
  return `${resource}:${action}`
}

async function hasPermission(userId: string, resource: string, action: Action): Promise<boolean> {
  const row = await getDB()
    .prepare(
      `SELECT 1 AS granted
       FROM "user_roles" ur
       INNER JOIN "role_permissions" rp ON rp."roleId" = ur."roleId"
       INNER JOIN "permissions" p ON p."id" = rp."permissionId"
       WHERE ur."userId" = ? AND p."name" = ?
       LIMIT 1`
    )
    .bind(userId, permissionName(resource, action))
    .first()
  return row !== null && row !== undefined
}

function timestamp(config: ResourceConfig): string | number {
  return config.timestamps === 'milliseconds' ? Date.now() : new Date().toISOString()
}

export async function GET(request: Request) {
  const session = await requireSession(request)
  if (!session) return unauthorized()

  const url = new URL(request.url)
  const segments = url.pathname.split('/').filter(Boolean)

  // Serve an R2 object: /api/v1/media/file/{key}
  if (
    segments.length === 5 &&
    segments[0] === 'api' &&
    segments[1] === 'v1' &&
    segments[2] === 'media' &&
    segments[3] === 'file'
  ) {
    if (!(await hasPermission(session.user.id, 'media', 'read'))) return forbidden()
    const key = decodeURIComponent(segments[4])
    const object = await getR2().get(key)
    if (!object) return json({ error: 'Not found' }, 404)
    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Content-Disposition', 'attachment')
    return new Response(object.body, { headers })
  }

  const parsed = parseSegments(url)
  if (!parsed) return json({ error: 'Invalid path' }, 400)

  const config = RESOURCES[parsed.resource]
  if (!config) return json({ error: `Unknown resource: ${parsed.resource}` }, 404)

  if (!(await hasPermission(session.user.id, parsed.resource, 'read'))) return forbidden()

  const db = getDB()

  if (parsed.id) {
    const row = await db
      .prepare(`SELECT * FROM "${config.table}" WHERE "${config.pk}" = ?`)
      .bind(parsed.id)
      .first()
    if (!row) return json({ error: 'Not found' }, 404)
    return json(row)
  }

  const page = Math.max(0, Number(url.searchParams.get('page')) || 0)
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')) || 10))
  const search = url.searchParams.get('search')?.trim()

  let where = ''
  const binds: unknown[] = []
  if (search && config.searchable && config.searchable.length > 0) {
    where = ` WHERE (${config.searchable.map((column) => `"${column}" LIKE ?`).join(' OR ')})`
    for (let i = 0; i < config.searchable.length; i++) binds.push(`%${search}%`)
  }

  const totalRes = await db
    .prepare(`SELECT COUNT(*) as total FROM "${config.table}"${where}`)
    .bind(...binds)
    .first<{ total: number }>()
  const total = Number(totalRes?.total ?? 0)

  const offset = page * pageSize
  const items = await db
    .prepare(`SELECT * FROM "${config.table}"${where} ORDER BY "createdAt" DESC LIMIT ? OFFSET ?`)
    .bind(...binds, pageSize, offset)
    .all()

  return json({ data: items.results, meta: { total, page, pageSize } })
}

export async function POST(request: Request) {
  const session = await requireSession(request)
  if (!session) return unauthorized()

  const url = new URL(request.url)
  const parsed = parseSegments(url)
  if (!parsed || parsed.id) return json({ error: 'Invalid path' }, 400)

  const config = RESOURCES[parsed.resource]
  if (!config) return json({ error: `Unknown resource: ${parsed.resource}` }, 404)

  if (!(await hasPermission(session.user.id, parsed.resource, 'create'))) return forbidden()

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const allowed = new Set(config.columns)
  const created = timestamp(config)
  const record: Record<string, unknown> = { ...body, createdAt: created }
  if (config.columns.includes('updatedAt')) record.updatedAt = created
  if (config.pkType === 'text' && !record[config.pk]) {
    record[config.pk] = crypto.randomUUID()
  }

  const fields = Object.keys(record).filter(
    (field) => allowed.has(field) && record[field] !== undefined
  )
  if (fields.length === 0) return json({ error: 'No valid fields' }, 400)

  const columns = fields.map((field) => `"${field}"`).join(', ')
  const placeholders = fields.map(() => '?').join(', ')
  const values = fields.map((field) => record[field])

  const db = getDB()
  const result = await db
    .prepare(`INSERT INTO "${config.table}" (${columns}) VALUES (${placeholders})`)
    .bind(...values)
    .run()

  const pkValue =
    record[config.pk] ?? (config.pkType === 'number' ? result.meta.last_row_id : undefined)

  const row = await db
    .prepare(`SELECT * FROM "${config.table}" WHERE "${config.pk}" = ?`)
    .bind(pkValue)
    .first()
  return json(row, 201)
}

export async function PUT(request: Request) {
  const session = await requireSession(request)
  if (!session) return unauthorized()

  const url = new URL(request.url)
  const parsed = parseSegments(url)
  if (!parsed || !parsed.id) return json({ error: 'Invalid path' }, 400)

  const config = RESOURCES[parsed.resource]
  if (!config) return json({ error: `Unknown resource: ${parsed.resource}` }, 404)

  if (!(await hasPermission(session.user.id, parsed.resource, 'update'))) return forbidden()

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const db = getDB()
  const existing = await db
    .prepare(`SELECT * FROM "${config.table}" WHERE "${config.pk}" = ?`)
    .bind(parsed.id)
    .first()
  if (!existing) return json({ error: 'Not found' }, 404)

  const allowed = new Set(config.columns)
  const fields = Object.keys(body).filter(
    (field) => allowed.has(field) && field !== config.pk && body[field] !== undefined
  )
  if (fields.length === 0) return json({ error: 'No valid fields' }, 400)

  const values = fields.map((field) => body[field])
  let setClause = fields.map((field) => `"${field}" = ?`).join(', ')
  if (config.columns.includes('updatedAt')) {
    setClause += `, "updatedAt" = ?`
    values.push(timestamp(config))
  }
  values.push(parsed.id)

  await db
    .prepare(`UPDATE "${config.table}" SET ${setClause} WHERE "${config.pk}" = ?`)
    .bind(...values)
    .run()

  const row = await db
    .prepare(`SELECT * FROM "${config.table}" WHERE "${config.pk}" = ?`)
    .bind(parsed.id)
    .first()
  return json(row)
}

export async function DELETE(request: Request) {
  const session = await requireSession(request)
  if (!session) return unauthorized()

  const url = new URL(request.url)
  const parsed = parseSegments(url)
  if (!parsed || !parsed.id) return json({ error: 'Invalid path' }, 400)

  const config = RESOURCES[parsed.resource]
  if (!config) return json({ error: `Unknown resource: ${parsed.resource}` }, 404)

  if (!(await hasPermission(session.user.id, parsed.resource, 'delete'))) return forbidden()

  const db = getDB()
  const existing = await db
    .prepare(`SELECT * FROM "${config.table}" WHERE "${config.pk}" = ?`)
    .bind(parsed.id)
    .first()
  if (!existing) return json({ error: 'Not found' }, 404)

  await db.prepare(`DELETE FROM "${config.table}" WHERE "${config.pk}" = ?`).bind(parsed.id).run()
  return json({ success: true })
}
