import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import RoleTable from '@/components/block/roles/table'

export const metadata: Metadata = {
  ...META,
  title: 'Roles | Vinext Starterkit',
}

export default async function RolesPage() {
  return <RoleTable />
}