import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listComments = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['comments', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.comments.list(pagination)
      return res.data
    },
  })

interface GetCommentParams {
  id: string
}

const getComment = (params: GetCommentParams) =>
  queryOptions({
    queryKey: ['comment', params.id],
    queryFn: async () => {
      const res = await services.comments.get(params.id)
      return res.data
    },
  })

export const commentQueries = {
  list: listComments,
  get: getComment,
} as const
