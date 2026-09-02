import { Metadata } from 'next'

import RoleTable from '@/components/block/roles/table'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Roles | Vinext Starterkit',
}

export default async function RolesPage() {
  return <RoleTable />
}
