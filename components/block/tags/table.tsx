'use client'

import { IconSearch } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { Input, InputWrapper } from '@/components/ui/input'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { queries } from '@/lib/api/queries'
import { getTotal } from '@/lib/constants/paginate'

import ReactTable from '../common/react-table'
import SectionCard from '../common/section-card'
import { TagColumn } from './column'

export default function TagTable() {
  const t = useTranslations('pages')
  const { offset, limit, pageIndex } = usePaginationQuery()

  const defaultQueryParams = useMemo(() => ({ offset, limit }), [offset, limit])

  const { data, isFetching, isLoading, isError, error } = useQuery(
    queries.tags.list(defaultQueryParams)
  )
  const loading = isFetching || isLoading
  const total = getTotal(data)

  if (isError) {
    toast.error(error?.message || 'Failed to load tags')
  }

  const columns = TagColumn({ loading })
  const items = useMemo(
    () => (data?.data && data?.data?.length > 0 ? data.data : []),
    [data]
  )

  return (
    <SectionCard
      title={t('tags.title')}
      toolbar={
        <div className="flex flex-row items-center gap-2">
          <InputWrapper className="w-72">
            <IconSearch />
            <Input placeholder={t('tags.search')} />
          </InputWrapper>
        </div>
      }
    >
      <ReactTable
        total={total}
        data={items}
        pageIndex={pageIndex}
        pageSize={limit}
        columns={columns}
      />
    </SectionCard>
  )
}