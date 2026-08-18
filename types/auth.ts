import { Models } from '@/lib/api/models'

export type AuthSession = {
  user: Models.User
  session: {
    token: string
  }
  data: {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    provider: 'custom' | 'google'
  }
}
