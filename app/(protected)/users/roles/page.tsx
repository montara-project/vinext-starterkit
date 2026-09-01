import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { RolesTable } from './roles-table'

export const metadata: Metadata = {
  ...META,
  title: 'Roles | Vinext Starterkit',
}

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Roles</h1>
        <p className="text-muted-foreground text-sm">Manage user roles</p>
      </div>
      <RolesTable />
    </div>
  )
}