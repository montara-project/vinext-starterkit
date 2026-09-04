import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Terms of Service | Vinext Starterkit',
}

export const revalidate = 300

type LegalSection = { heading: string; body: string }

export default async function TermsOfServicePage() {
  const t = await getTranslations('legal')
  const sections = t.raw('terms.sections') as LegalSection[]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t('terms.title')}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t('lastUpdated', { date: 'September 1, 2026' })}
        </p>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">{t('terms.intro')}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-bold tracking-tight">{section.heading}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
