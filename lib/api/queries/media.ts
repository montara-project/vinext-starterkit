import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listMedia = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['media', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.media.list(pagination)
      return res.data
    },
  })

interface GetMediaParams {
  id: string
}

const getMedia = (params: GetMediaParams) =>
  queryOptions({
    queryKey: ['media', params.id],
    queryFn: async () => {
      const res = await services.media.get(params.id)
      return res.data
    },
  })

export const mediaQueries = {
  list: listMedia,
  get: getMedia,
} as const
