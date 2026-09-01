import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { PostsTable } from './posts-table'

export const metadata: Metadata = {
  ...META,
  title: 'Posts | Vinext Starterkit',
}

export default function PostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Posts</h1>
        <p className="text-muted-foreground text-sm">Manage blog posts</p>
      </div>
      <PostsTable />
    </div>
  )
}
