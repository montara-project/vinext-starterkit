import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import PageTable from '@/components/block/pages/table'

export const metadata: Metadata = {
  ...META,
  title: 'Pages | Vinext Starterkit',
}

export default async function PagesPage() {
  return <PageTable />
}