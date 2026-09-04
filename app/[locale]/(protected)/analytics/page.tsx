import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { AnalyticsDashboard } from '@/components/block/analytics/analytics-dashboard'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Analytics | Vinext Starterkit',
}

export default async function AnalyticsPage() {
  const t = await getTranslations('pages')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('analytics.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('analytics.subtitle')}</p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}
