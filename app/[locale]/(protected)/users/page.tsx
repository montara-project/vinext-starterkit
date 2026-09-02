import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import UserTable from '@/components/block/users/table'

export const metadata: Metadata = {
  ...META,
  title: 'Users | Vinext Starterkit',
}

export default async function UsersPage() {
  return <UserTable />
}