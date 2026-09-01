'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { PasswordInput } from '@/components/block/form/password-input'
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

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const t = useTranslations('auth')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUpGoogle = async () => {
    try {
      const result = await signInWithGoogle()
      if (result?.error) {
        toast.error(result.error.message || 'Google sign-in failed')
      }
    } catch {
      toast.error('Google sign-in is not configured. Please sign in with email/password.')
    }
  }

  const handleSignUpEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/dashboard',
      })
      if (result?.error) {
        toast.error(result.error.message || 'Sign up failed')
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSignUpEmail}>
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
              {t('haveAccount')} <Link href="/sign-in">{t('signIn')}</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="name">{t('name')}</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder={t('namePlaceholder')}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
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
            <PasswordInput
              id="password"
              placeholder={t('passwordPlaceholder')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Button type="submit">{t('createAccount')}</Button>
          </Field>
          <FieldSeparator>{t('or')}</FieldSeparator>

          <div className="space-y-4">
            <Field>
              <Button variant="outline" type="button" onClick={handleSignUpGoogle}>
                <Icons.googleColorful className="size-6" />
                {t('continueWithGoogle')}
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        {t('terms')} <Link href="/terms-of-service">{t('termsOfService')}</Link> {t('and')}{' '}
        <Link href="/privacy-policy">{t('privacyPolicy')}</Link>.
      </FieldDescription>
    </div>
  )
}
