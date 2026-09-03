'use client'

import { useTranslations } from 'next-intl'

import SectionCard from '../../common/section-card'
import { AppearanceSettingsForm } from './form'

export default function AppearanceContent() {
  const t = useTranslations('pages')

  return (
    <SectionCard title={t('settingsAppearance.title')}>
      <AppearanceSettingsForm />
    </SectionCard>
  )
}
