'use client'

import { PropsWithChildren } from 'react'

import PublicFooter from './footer'
import PublicHeader from './header'

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  )
}
