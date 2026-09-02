import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import PostTable from '@/components/block/posts/table'

export const metadata: Metadata = {
  ...META,
  title: 'Posts | Vinext Starterkit',
}

export default async function PostsPage() {
  return <PostTable />
}