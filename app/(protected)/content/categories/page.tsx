import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import { CategoriesTable } from './categories-table'

export const metadata: Metadata = {
  ...META,
  title: 'Categories | Vinext Starterkit',
}

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground text-sm">Manage content categories</p>
      </div>
      <CategoriesTable />
    </div>
  )
}
