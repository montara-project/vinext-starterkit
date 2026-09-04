import { ApiListResponse } from '@/types/api'

import { PaginateDto } from '../api/dtos/paginate'

export const DEFAULT_PAGINATE: PaginateDto = {
  offset: 0,
  limit: 10,
}

export function getTotal<TModel>(data: ApiListResponse<TModel> | undefined) {
  return data?.metadata?.total ?? Number(DEFAULT_PAGINATE.limit)
}
