import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { PermissionsMatrix } from './permissions-matrix'

export const metadata: Metadata = {
  ...META,
  title: 'Permissions | Vinext Starterkit',
}

export default async function PermissionsPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('permissions.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('permissions.subtitle')}</p>
      </div>
      <PermissionsMatrix />
    </div>
  )
}