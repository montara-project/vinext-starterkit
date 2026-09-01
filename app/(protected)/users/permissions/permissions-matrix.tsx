'use client'

import { Check, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

const permissions = [
  'Create Posts',
  'Edit Posts',
  'Delete Posts',
  'Manage Users',
  'Manage Settings',
  'View Analytics',
]

const roles = ['Admin', 'Editor', 'Author', 'Viewer']

const matrix: Record<string, string[]> = {
  Admin: [...permissions],
  Editor: ['Create Posts', 'Edit Posts', 'Delete Posts', 'View Analytics'],
  Author: ['Create Posts', 'Edit Posts', 'View Analytics'],
  Viewer: ['View Analytics'],
}

export function PermissionsMatrix() {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Permission</th>
            {roles.map((role) => (
              <th key={role} className="px-4 py-3 text-center font-medium">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission} className="border-b last:border-b-0">
              <td className="px-4 py-3">{permission}</td>
              {roles.map((role) => {
                const granted = matrix[role]?.includes(permission) ?? false
                return (
                  <td key={role} className="px-4 py-3 text-center">
                    {granted ? (
                      <Badge variant="success" appearance="light">
                        <Check className="size-3" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" appearance="ghost">
                        <X className="size-3" />
                        No
                      </Badge>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}