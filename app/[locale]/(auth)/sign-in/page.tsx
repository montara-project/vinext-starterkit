import { Metadata } from 'next'

import { LoginForm } from '@/components/block/auth/login-form'
import { META } from '@/lib/constants/meta'

export const metadata: Metadata = {
  ...META,
  title: 'Sign In | Vinext Starterkit',
}

export default function SignInPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
