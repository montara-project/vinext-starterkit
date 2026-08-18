import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { AUTH_PROVIDER } from '../constants/auth'
import { auth } from './auth-server'

/**
 * Require authentication and redirect to home page if not authenticated
 */
export async function requireSession() {
  const google = await getAccessToken()

  // Remove this comment to get Access Token
  // console.log(google)

  if (!google?.accessToken) {
    await auth.api.signOut({
      headers: await headers(),
    })

    throw redirect('/sign-in')
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw redirect('/sign-in')
  }

  return { ...session, data: google }
}

/**
 * Get current session
 * @returns Session object or null if not authenticated
 */
export async function getSession() {
  const google = await getAccessToken()

  if (!google) {
    return null
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  return { ...session, data: google }
}

/**
 * Get access token for Cognito provider
 * @returns Access token object with provider information or null if token is invalid
 */
export async function getAccessToken() {
  try {
    let google = await auth.api.getAccessToken({
      body: { providerId: AUTH_PROVIDER.GOOGLE },
      headers: await headers(),
    })

    if (!google?.accessToken) {
      const refreshToken = await auth.api.refreshToken({
        headers: await headers(),
        body: {
          providerId: AUTH_PROVIDER.GOOGLE,
        },
      })

      if (!refreshToken?.accessToken) {
        return null
      }

      google = {
        accessToken: refreshToken.accessToken,
        accessTokenExpiresAt: refreshToken.accessTokenExpiresAt,
        scopes: [],
        idToken: refreshToken.idToken ?? undefined,
      }
    }

    return { ...google, provider: AUTH_PROVIDER.GOOGLE }
  } catch (error: unknown) {
    console.error('Auth Error:', (error as Error).message)
    return null
  }
}

export async function redirectIfAuthenticated(href: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.session) {
    throw redirect(href)
  }
}
