import { createAuthClient } from 'better-auth/react'

import { AUTH_PROVIDER } from '../constants/auth'

export const authClient = createAuthClient()

export const signInWithGoogle = () => {
  return authClient.signIn.social({
    provider: AUTH_PROVIDER.GOOGLE,
    callbackURL: `/dashboard`,
  })
}

export const signOut = () => {
  return authClient.signOut()
}

export const getAccessToken = async () => {
  const session = await authClient.getSession()

  if (session.data) {
    const { data } = await authClient.getAccessToken({ providerId: AUTH_PROVIDER.GOOGLE })
    return data?.accessToken
  }

  return null
}
