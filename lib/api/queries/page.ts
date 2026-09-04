import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listPages = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['pages', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.pages.list(pagination)
      return res.data
    },
  })

interface GetPageParams {
  id: string
}

const getPage = (params: GetPageParams) =>
  queryOptions({
    queryKey: ['page', params.id],
    queryFn: async () => {
      const res = await services.pages.get(params.id)
      return res.data
    },
  })

export const pageQueries = {
  list: listPages,
  get: getPage,
} as const
