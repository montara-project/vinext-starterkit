import { Metadata } from 'next'

import AppearanceContent from '@/components/block/settings/appearance/content'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Appearance | Vinext Starterkit',
}

export default async function AppearanceSettingsPage() {
  return <AppearanceContent />
}
