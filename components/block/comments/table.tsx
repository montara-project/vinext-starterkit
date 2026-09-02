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
import { CommentColumn } from './column'

export default function CommentTable() {
  const t = useTranslations('pages')

  const { offset, limit, pageIndex } = usePaginationQuery()

  const defaultQueryParams = useMemo(() => ({ offset, limit }), [offset, limit])

  const {
    data: commentsData,
    isFetching,
    isLoading,
    isError,
    error,
  } = useQuery(queries.comments.list(defaultQueryParams))
  const loading = isFetching || isLoading
  const total = getTotal(commentsData)

  if (isError) {
    toast.error(error?.message || 'Failed to load comments')
  }

  const columns = CommentColumn({ loading })
  const comments = useMemo(
    () => (commentsData?.data && commentsData?.data?.length > 0 ? commentsData.data : []),
    [commentsData]
  )

  return (
    <SectionCard
      title={t('comments.title')}
      toolbar={
        <div className="flex flex-row items-center gap-2">
          <InputWrapper className="w-72">
            <IconSearch />
            <Input placeholder={t('comments.search')} />
          </InputWrapper>
        </div>
      }
    >
      <ReactTable
        total={total}
        data={comments}
        pageIndex={pageIndex}
        pageSize={limit}
        columns={columns}
      />
    </SectionCard>
  )
}
