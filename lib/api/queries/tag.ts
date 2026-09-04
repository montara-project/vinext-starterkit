import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listTags = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['tags', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.tags.list(pagination)
      return res.data
    },
  })

interface GetTagParams {
  id: number
}

const getTag = (params: GetTagParams) =>
  queryOptions({
    queryKey: ['tag', params.id],
    queryFn: async () => {
      const res = await services.tags.get(params.id)
      return res.data
    },
  })

export const tagQueries = {
  list: listTags,
  get: getTag,
} as const
