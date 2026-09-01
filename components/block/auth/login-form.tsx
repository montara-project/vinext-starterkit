'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'
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
import { authClient, signInWithGoogle } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils'

import { Icons } from '../common/icons'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
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
              <span className="sr-only">Vinext Starterkit</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Vinext Starterkit</h1>
            <FieldDescription>
              Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
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
            <Button type="submit">Login</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>

          <div className="space-y-4">
            <Field>
              <Button variant="outline" type="button" onClick={handleSignInGoogle}>
                <Icons.googleColorful className="size-6" />
                Continue with Google
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
