import { getDB } from '@/lib/db'

export type PermissionAction = 'read' | 'create' | 'update' | 'delete'

export function forbidden() {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}

/**
 * Permission names follow `{resource}:{action}` (e.g. `posts:read`,
 * `users:create`, `roles:delete`). Access is granted by inserting that name
 * into `permissions`, linking it to a role in `role_permissions`, and
 * assigning the role to a user in `user_roles`.
 */
function permissionName(resource: string, action: PermissionAction): string {
  return `${resource}:${action}`
}

export async function hasPermission(
  userId: string,
  resource: string,
  action: PermissionAction
): Promise<boolean> {
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
