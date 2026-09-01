import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { AppearanceSettingsForm } from './appearance-settings-form'

export const metadata: Metadata = {
  ...META,
  title: 'Appearance | Vinext Starterkit',
}

export default function AppearanceSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Appearance</h1>
        <p className="text-muted-foreground text-sm">Customize the look and feel of your site</p>
      </div>
      <AppearanceSettingsForm />
    </div>
  )
}