import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'

import { env } from '@/config/env'

const ONE_HOUR = 60 * 60 * 1
const ONE_DAY = ONE_HOUR * 24
const ONE_WEEK = ONE_DAY * 7
const ONE_MONTH = ONE_DAY * 30

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
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
    expiresIn: ONE_MONTH, // 30 days in seconds
    updateAge: ONE_WEEK, // Refresh every 7 days
    cookieCache: {
      enabled: true,
      maxAge: ONE_DAY, // Cache for 1 week
      strategy: 'jwe',
      refreshCache: true, // Enable stateless refresh
    },
    account: {
      storeStateStrategy: 'cookie',
      storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
    },
  },
})
