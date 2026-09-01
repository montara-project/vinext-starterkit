import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { AnalyticsDashboard } from './analytics-dashboard'

export const metadata: Metadata = {
  ...META,
  title: 'Analytics | Vinext Starterkit',
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Overview of your site performance</p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}