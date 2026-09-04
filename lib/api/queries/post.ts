import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listPosts = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['posts', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.posts.list(pagination)
      return res.data
    },
  })

interface GetPostParams {
  id: string
}

const getPost = (params: GetPostParams) =>
  queryOptions({
    queryKey: ['post', params.id],
    queryFn: async () => {
      const res = await services.posts.get(params.id)
      return res.data
    },
  })

export const postQueries = {
  list: listPosts,
  get: getPost,
} as const
