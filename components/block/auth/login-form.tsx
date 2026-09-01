'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import { authClient, signInWithGoogle } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils'

import { Icons } from '../common/icons'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignInGoogle = async () => {
    await signInWithGoogle()
  }

  const handleSignInEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    await authClient.signIn.email({ email, password, callbackURL: '/dashboard' })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSignInEmail}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">{t('branding')}</span>
            </a>
            <h1 className="text-xl font-bold">{t('welcome')}</h1>
            <FieldDescription>
              {t('dontHaveAccount')} <Link href="/sign-up">{t('signUp')}</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Button type="submit">{t('login')}</Button>
          </Field>
          <FieldSeparator>{t('or')}</FieldSeparator>

          <div className="space-y-4">
            <Field>
              <Button variant="outline" type="button" onClick={handleSignInGoogle}>
                <Icons.googleColorful className="size-6" />
                {t('continueWithGoogle')}
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        {t('terms')} <a href="#">{t('termsOfService')}</a> {t('and')}{' '}
        <a href="#">{t('privacyPolicy')}</a>.
      </FieldDescription>
    </div>
  )
}
