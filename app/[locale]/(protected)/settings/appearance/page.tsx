import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { AppearanceSettingsForm } from './appearance-settings-form'

export const metadata: Metadata = {
  ...META,
  title: 'Appearance | Vinext Starterkit',
}

export default async function AppearanceSettingsPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('settingsAppearance.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('settingsAppearance.subtitle')}</p>
      </div>
      <AppearanceSettingsForm />
    </div>
  )
}