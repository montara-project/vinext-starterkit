import { Metadata } from 'next'

import CommentTable from '@/components/block/comments/table'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Comments | Vinext Starterkit',
}

export default async function CommentsPage() {
  return <CommentTable />
}
