import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { PagesTable } from './pages-table'

export const metadata: Metadata = {
  ...META,
  title: 'Pages | Vinext Starterkit',
}

export default function PagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Pages</h1>
        <p className="text-muted-foreground text-sm">Manage static pages</p>
      </div>
      <PagesTable />
    </div>
  )
}
