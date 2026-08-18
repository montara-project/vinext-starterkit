import { useQueryState } from 'nuqs'

export function usePaginationQuery() {
  const [queryPage] = useQueryState('page')
  const [queryPageSize] = useQueryState('pageSize')

  const pageIndex = queryPage ? parseInt(queryPage) : 0
  const pageSize = queryPageSize ? parseInt(queryPageSize) : 10

  const offset = pageIndex * pageSize

  return { offset, limit: pageSize, pageIndex }
}
