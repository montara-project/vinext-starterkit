'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export default function PublicHeader() {
  const t = useTranslations('home')
  const ta = useTranslations('auth')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="bg-foreground text-background flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-3.5" />
          </div>
          <span className="hidden sm:inline">{ta('branding')}</span>
        </Link>

        <nav className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-xs font-medium">
            {routing.locales.map((item) => (
              <button
                className={cn(
                  'rounded-md px-2 py-1 transition-colors',
                  item === locale
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                key={item}
                onClick={() => router.replace(pathname, { locale: item })}
                type="button"
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-in">{t('signIn')}</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
