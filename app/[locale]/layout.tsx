import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Outfit } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

import { routing } from '@/i18n/routing'
import { META } from '@/lib/constants/meta'
import DecorationProvider from '@/lib/providers/decoration'
import { cn } from '@/lib/utils'

import '../styles/globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = META

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('font-sans', outfit.variable, 'antialiased')}>
        <NextIntlClientProvider messages={messages}>
          <DecorationProvider>{children}</DecorationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
