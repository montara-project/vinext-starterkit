import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { CommentsTable } from './comments-table'

export const metadata: Metadata = {
  ...META,
  title: 'Comments | Vinext Starterkit',
}

export default async function CommentsPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('comments.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('comments.subtitle')}</p>
      </div>
      <CommentsTable />
    </div>
  )
}
