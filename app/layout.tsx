import './styles/globals.css'

import type { Metadata } from 'next'

import { Outfit } from 'next/font/google'

import { META } from '@/lib/constants/meta'
import DecorationProvider from '@/lib/providers/decoration'
import { cn } from '@/lib/utils'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = META

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans', outfit.variable, 'antialiased')}>
        <DecorationProvider>{children}</DecorationProvider>
      </body>
    </html>
  )
}
