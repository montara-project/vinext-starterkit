'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { Link, useRouter } from '@/i18n/navigation'
import { SignInSchema } from '@/lib/api/dtos/auth/schema'
import { authClient, signInWithGoogle } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils'

import { Icons } from '../common/icons'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const t = useTranslations('auth')

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: SignInSchema,
      onChange: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true)

      try {
        await authClient.signIn.email({ ...value })
        router.push('/dashboard')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
        toast.error(message)
      } finally {
        setLoading(false)
        form.reset()
      }
    },
  })

  const handleSignInGoogle = async () => {
    try {
      const result = await signInWithGoogle()
      if (result?.error) {
        toast.error(result.error.message || 'Google sign-in failed')
      }
    } catch {
      toast.error('Google sign-in is not configured. Please sign in with email/password.')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
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

          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField
                type="email"
                label={t('email')}
                placeholder={t('emailPlaceholder')}
              />
            )}
          />

          <form.AppField
            name="password"
            children={(field) => (
              <field.PasswordField label={t('password')} placeholder={t('passwordPlaceholder')} />
            )}
          />

          <Field>
            <Button type="submit" disabled={form.state.isSubmitting || loading}>
              {t('login')}
            </Button>
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
        {t('terms')} <Link href="/terms-of-service">{t('termsOfService')}</Link> {t('and')}{' '}
        <Link href="/privacy-policy">{t('privacyPolicy')}</Link>.
      </FieldDescription>
    </div>
  )
}
