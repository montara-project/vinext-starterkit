import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { CategoriesTable } from './categories-table'

export const metadata: Metadata = {
  ...META,
  title: 'Categories | Vinext Starterkit',
}

export default async function CategoriesPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('categories.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('categories.subtitle')}</p>
      </div>
      <CategoriesTable />
    </div>
  )
}
