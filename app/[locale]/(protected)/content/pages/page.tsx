import { Metadata } from 'next'

import PageTable from '@/components/block/pages/table'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Pages | Vinext Starterkit',
}

export default async function PagesPage() {
  return <PageTable />
}
