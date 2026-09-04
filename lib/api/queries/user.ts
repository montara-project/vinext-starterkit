import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listUsers = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['users', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.users.list(pagination)
      return res.data
    },
  })

interface GetUserParams {
  id: string
}

const getUser = (params: GetUserParams) =>
  queryOptions({
    queryKey: ['user', params.id],
    queryFn: async () => {
      const res = await services.users.get(params.id)
      return res.data
    },
  })

export const userQueries = {
  list: listUsers,
  get: getUser,
} as const
