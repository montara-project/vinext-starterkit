import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Dashboard | Vinext Starterkit',
}

export default function DashboardPage() {
  return <div>DashboardPage</div>
}
