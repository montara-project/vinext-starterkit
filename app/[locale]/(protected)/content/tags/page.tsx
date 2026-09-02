import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import TagTable from '@/components/block/tags/table'

export const metadata: Metadata = {
  ...META,
  title: 'Tags | Vinext Starterkit',
}

export default async function TagsPage() {
  return <TagTable />
}