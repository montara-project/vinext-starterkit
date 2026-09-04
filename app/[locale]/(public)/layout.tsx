import { PropsWithChildren } from 'react'

import PublicLayout from '@/components/layout/public/layout'

export default function PublicLayoutWrapper({ children }: PropsWithChildren) {
  return <PublicLayout>{children}</PublicLayout>
}
