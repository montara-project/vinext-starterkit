import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

import { env } from '@/config/env'
import { getDrizzle } from '@/lib/db'

const ONE_HOUR = 60 * 60 * 1
const ONE_DAY = ONE_HOUR * 24
const ONE_WEEK = ONE_DAY * 7
const ONE_MONTH = ONE_DAY * 30

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(getDrizzle(), { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: 'offline',
      prompt: 'select_account consent',
    },
  },
  session: {
    expiresIn: ONE_MONTH,
    updateAge: ONE_WEEK,
    cookieCache: {
      enabled: true,
      maxAge: ONE_DAY,
      strategy: 'jwe',
      refreshCache: true,
    },
    account: {
      storeStateStrategy: 'cookie',
    },
  },
})
