import { Metadata } from 'next'

import CategoryTable from '@/components/block/categories/table'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Categories | Vinext Starterkit',
}

export default async function CategoriesPage() {
  return <CategoryTable />
}
