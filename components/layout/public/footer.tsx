import { getTranslations } from 'next-intl/server'

export default async function PublicFooter() {
  const t = await getTranslations('home')
  const ta = await getTranslations('auth')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {ta('branding')}
        </p>
        <div className="flex items-center gap-6">
          <a
            className="transition-colors hover:text-foreground"
            href="https://github.com/cloudflare/vinext"
            rel="noreferrer"
            target="_blank"
          >
            {t('linkVinext')}
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="https://developers.cloudflare.com/workers/"
            rel="noreferrer"
            target="_blank"
          >
            {t('linkWorkers')}
          </a>
        </div>
      </div>
    </footer>
  )
}
