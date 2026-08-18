import { queryOptions } from '@tanstack/react-query'

import { authClient } from '@/lib/auth/auth-client'

const getProfile = () =>
  queryOptions({
    queryKey: ['account', 'profile'],
    queryFn: async () => {
      const res = await authClient.getSession()
      return res.data
    },
  })

export const accountQueries = {
  profile: getProfile,
}
