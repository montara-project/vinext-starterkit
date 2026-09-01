import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Home | Vinext Starterkit',
}

export const revalidate = 300

const steps = [
  { key: 'develop', command: 'pnpm run dev' },
  { key: 'build', command: 'pnpm run build' },
  { key: 'deploy', command: 'pnpm run deploy' },
] as const

export default async function Home() {
  const t = await getTranslations('home')

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t('heroSubtitle')}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/sign-in">{t('signIn')}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/api/hello">{t('apiRoute')}</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">{t('heroBadge')}</p>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('workflowTitle')}</h2>
            <p className="mt-3 text-muted-foreground">{t('workflowDesc')}</p>
          </div>

          <ol>
            {steps.map((step, index) => (
              <li
                className="grid gap-3 border-t py-6 last:border-b sm:grid-cols-[3.5rem_1fr] sm:gap-8"
                key={step.key}
              >
                <span className="text-sm tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <div>
                    <h3 className="font-semibold">{t(step.key)}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {t(`${step.key}Desc`)}
                    </p>
                  </div>
                  <code className="shrink-0 self-start rounded-md bg-muted px-3 py-1.5 font-mono text-sm sm:self-auto">
                    {step.command}
                  </code>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
