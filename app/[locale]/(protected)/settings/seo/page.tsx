import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

import { SeoSettingsForm } from './seo-settings-form'

export const metadata: Metadata = {
  ...META,
  title: 'SEO Settings | Vinext Starterkit',
}

export default async function SeoSettingsPage() {
  const t = await getTranslations('pages')
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('settingsSeo.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('settingsSeo.subtitle')}</p>
      </div>
      <SeoSettingsForm />
    </div>
  )
}
