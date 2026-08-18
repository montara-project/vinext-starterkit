import { PropsWithChildren } from 'react'

import SidebarLayout from '@/components/layout/sidebar/layout'
import { requireSession } from '@/lib/auth/handler'
import { AuthSession } from '@/types/auth'

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const auth: AuthSession = await requireSession()

  return <SidebarLayout auth={auth}>{children}</SidebarLayout>
}
