import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { META } from '@/lib/constants/meta'

const links = [
  {
    href: 'https://github.com/cloudflare/vinext',
  },
  {
    href: 'https://developers.cloudflare.com/workers/',
  },
]

export const metadata: Metadata = {
  ...META,
  title: 'Home | Vinext Starterkit',
}

export const revalidate = 300

export default async function Home() {
  const t = await getTranslations('home')

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {t('heroBadge')}
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            {t('heroTitle')}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            {t('heroSubtitle')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">{t('develop')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('developDesc')}
            </p>
            <code className="mt-4 block rounded bg-muted px-3 py-2 text-sm">pnpm run dev</code>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">{t('build')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('buildDesc')}
            </p>
            <code className="mt-4 block rounded bg-muted px-3 py-2 text-sm">
              pnpm run build
            </code>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">{t('deploy')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('deployDesc')}
            </p>
            <code className="mt-4 block rounded bg-muted px-3 py-2 text-sm">
              pnpm run deploy
            </code>
          </div>
        </div>

        <nav className="flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
              href={link.href}
              key={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.href.includes('vinext') ? t('linkVinext') : t('linkWorkers')}
            </a>
          ))}
          <a
            className="rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            href="/api/hello"
          >
            {t('apiRoute')}
          </a>
        </nav>
      </section>
    </main>
  )
}
