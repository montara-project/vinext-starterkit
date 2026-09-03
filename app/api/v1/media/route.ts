import { forbidden, hasPermission } from '@/lib/api/permissions'
import { auth } from '@/lib/auth/auth-server'
import { getDB, getR2 } from '@/lib/db'

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

function unauthorized() {
  return json({ error: 'Unauthorized' }, 401)
}

function requireSession(request: Request) {
  return auth.api.getSession({ headers: request.headers })
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'application/pdf',
])

export async function GET(request: Request) {
  const session = await requireSession(request)
  if (!session) return unauthorized()

  if (!(await hasPermission(session.user.id, 'media', 'read'))) return forbidden()

  const url = new URL(request.url)
  const db = getDB()

  const page = Math.max(0, Number(url.searchParams.get('page')) || 0)
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')) || 10))
  const search = url.searchParams.get('search')?.trim()

  let where = ''
  const binds: unknown[] = []
  if (search) {
    where = ` WHERE "name" LIKE ?`
    binds.push(`%${search}%`)
  }

  const totalRes = await db
    .prepare(`SELECT COUNT(*) as total FROM "media"${where}`)
    .bind(...binds)
    .first<{ total: number }>()
  const total = Number(totalRes?.total ?? 0)

  const offset = page * pageSize
  const items = await db
    .prepare(`SELECT * FROM "media"${where} ORDER BY "createdAt" DESC LIMIT ? OFFSET ?`)
    .bind(...binds, pageSize, offset)
    .all()

  return json({ data: items.results, metadata: { total, page, pageSize } })
}

export async function POST(request: Request) {
  const session = await requireSession(request)
  if (!session) return unauthorized()

  if (!(await hasPermission(session.user.id, 'media', 'create'))) return forbidden()

  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return json({ error: 'Multipart form data required' }, 400)
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return json({ error: 'File field "file" is required' }, 400)
  }

  if (file.size > MAX_FILE_SIZE) {
    return json({ error: 'File exceeds the maximum allowed size' }, 413)
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return json({ error: 'File type is not allowed' }, 415)
  }

  const db = getDB()
  const r2 = getR2()
  const id = crypto.randomUUID()
  const name = (formData.get('name') as string | null) || file.name || 'untitled'
  const mimeType = file.type || 'application/octet-stream'
  const key = `${id}-${file.name || 'file'}`
  const uploadedBy = session.user.id
  const createdAt = Date.now()
  const size = file.size

  await r2.put(key, file.stream(), { httpMetadata: { contentType: mimeType } })

  const url = new URL(request.url)
  const publicUrl = `${url.origin}/api/v1/media/file/${encodeURIComponent(key)}`

  await db
    .prepare(
      `INSERT INTO "media" ("id", "name", "url", "mimeType", "size", "key", "uploadedBy", "createdAt")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, name, publicUrl, mimeType, size, key, uploadedBy, createdAt)
    .run()

  const row = await db.prepare(`SELECT * FROM "media" WHERE "id" = ?`).bind(id).first()
  return json(row, 201)
}
