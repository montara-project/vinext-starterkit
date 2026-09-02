import { Metadata } from 'next'

import { META } from '@/lib/constants/meta'

import CategoryTable from '@/components/block/categories/table'

export const metadata: Metadata = {
  ...META,
  title: 'Categories | Vinext Starterkit',
}

export default async function CategoriesPage() {
  return <CategoryTable />
}