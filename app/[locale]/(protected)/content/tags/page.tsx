import { Metadata } from 'next'

import TagTable from '@/components/block/tags/table'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Tags | Vinext Starterkit',
}

export default async function TagsPage() {
  return <TagTable />
}
