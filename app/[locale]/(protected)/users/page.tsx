import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { UsersTable } from './users-table'

export const metadata: Metadata = {
  ...META,
  title: 'Users | Vinext Starterkit',
}

export default async function UsersPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('users.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('users.subtitle')}</p>
      </div>
      <UsersTable />
    </div>
  )
}
