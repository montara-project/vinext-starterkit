import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { PermissionsMatrix } from './permissions-matrix'

export const metadata: Metadata = {
  ...META,
  title: 'Permissions | Vinext Starterkit',
}

export default function PermissionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Permissions</h1>
        <p className="text-muted-foreground text-sm">View role-permission assignments</p>
      </div>
      <PermissionsMatrix />
    </div>
  )
}