import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listRoles = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['roles', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.roles.list(pagination)
      return res.data
    },
  })

interface GetRoleParams {
  id: string
}

const getRole = (params: GetRoleParams) =>
  queryOptions({
    queryKey: ['role', params.id],
    queryFn: async () => {
      const res = await services.roles.get(params.id)
      return res.data
    },
  })

export const roleQueries = {
  list: listRoles,
  get: getRole,
} as const
