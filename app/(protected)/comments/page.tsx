import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { CommentsTable } from './comments-table'

export const metadata: Metadata = {
  ...META,
  title: 'Comments | Vinext Starterkit',
}

export default function CommentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Comments</h1>
        <p className="text-muted-foreground text-sm">Review and moderate comments</p>
      </div>
      <CommentsTable />
    </div>
  )
}