import { Metadata } from 'next'

import PostTable from '@/components/block/posts/table'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Posts | Vinext Starterkit',
}

export default async function PostsPage() {
  return <PostTable />
}
