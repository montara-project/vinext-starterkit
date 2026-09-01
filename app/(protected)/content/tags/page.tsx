import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { TagsTable } from './tags-table'

export const metadata: Metadata = {
  ...META,
  title: 'Tags | Vinext Starterkit',
}

export default function TagsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tags</h1>
        <p className="text-muted-foreground text-sm">Manage content tags</p>
      </div>
      <TagsTable />
    </div>
  )
}
