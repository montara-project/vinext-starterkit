import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'

import { PaginateDto } from '../dtos/paginate'
import { services } from '../services'

const listCategories = (params?: PaginateDto) =>
  queryOptions({
    queryKey: ['categories', params],
    queryFn: async () => {
      const pagination = params ?? DEFAULT_PAGINATE

      const res = await services.categories.list(pagination)
      return res.data
    },
  })

interface GetCategoryParams {
  id: number
}

const getCategory = (params: GetCategoryParams) =>
  queryOptions({
    queryKey: ['category', params.id],
    queryFn: async () => {
      const res = await services.categories.get(params.id)
      return res.data
    },
  })

export const categoryQueries = {
  list: listCategories,
  get: getCategory,
} as const
