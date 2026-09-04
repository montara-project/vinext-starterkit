import { Metadata } from 'next'

import UserTable from '@/components/block/users/table'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Users | Vinext Starterkit',
}

export default async function UsersPage() {
  return <UserTable />
}
