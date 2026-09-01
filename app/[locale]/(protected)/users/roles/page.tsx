import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { RolesTable } from './roles-table'

export const metadata: Metadata = {
  ...META,
  title: 'Roles | Vinext Starterkit',
}

export default async function RolesPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('roles.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('roles.subtitle')}</p>
      </div>
      <RolesTable />
    </div>
  )
}