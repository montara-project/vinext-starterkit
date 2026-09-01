import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { SeoSettingsForm } from './seo-settings-form'

export const metadata: Metadata = {
  ...META,
  title: 'SEO Settings | Vinext Starterkit',
}

export default function SeoSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">SEO Settings</h1>
        <p className="text-muted-foreground text-sm">Optimize your site for search engines</p>
      </div>
      <SeoSettingsForm />
    </div>
  )
}