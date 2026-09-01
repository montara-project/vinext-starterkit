import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { PagesTable } from './pages-table'

export const metadata: Metadata = {
  ...META,
  title: 'Pages | Vinext Starterkit',
}

export default async function PagesPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('pages.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('pages.subtitle')}</p>
      </div>
      <PagesTable />
    </div>
  )
}
