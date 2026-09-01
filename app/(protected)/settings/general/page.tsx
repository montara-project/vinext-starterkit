import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { GeneralSettingsForm } from './general-settings-form'

export const metadata: Metadata = {
  ...META,
  title: 'General Settings | Vinext Starterkit',
}

export default function GeneralSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">General Settings</h1>
        <p className="text-muted-foreground text-sm">Configure the basic information of your site</p>
      </div>
      <GeneralSettingsForm />
    </div>
  )
}