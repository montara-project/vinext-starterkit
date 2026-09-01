import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { PostsTable } from './posts-table'

export const metadata: Metadata = {
  ...META,
  title: 'Posts | Vinext Starterkit',
}

export default async function PostsPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('posts.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('posts.subtitle')}</p>
      </div>
      <PostsTable />
    </div>
  )
}
