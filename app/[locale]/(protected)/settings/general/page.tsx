import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { GeneralSettingsForm } from './general-settings-form'

export const metadata: Metadata = {
  ...META,
  title: 'General Settings | Vinext Starterkit',
}

export default async function GeneralSettingsPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('settingsGeneral.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('settingsGeneral.subtitle')}</p>
      </div>
      <GeneralSettingsForm />
    </div>
  )
}