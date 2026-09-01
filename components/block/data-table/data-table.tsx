'use client'

import { useQuery } from '@tanstack/react-query'
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { ApiListResponse } from '@/types/api'

interface DataTableProps<TData extends object> {
  columns: ColumnDef<TData>[]
  queryKey: string[]
  queryFn: (params: Record<string, unknown>) => Promise<ApiListResponse<TData>>
  emptyMessage?: ReactNode | string
  toolbar?: ReactNode
}

export function DataTable<TData extends object>({
  columns,
  queryKey,
  queryFn,
  emptyMessage,
  toolbar,
}: DataTableProps<TData>) {
  const { offset, limit, pageIndex } = usePaginationQuery()

  const { data, isPending } = useQuery({
    queryKey: [...queryKey, { offset, limit }],
    queryFn: () => queryFn({ offset, limit }),
  })

  const rows = data?.data ?? []
  const total = data?.meta.total ?? 0

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / limit),
    state: { pagination: { pageIndex, pageSize: limit } },
  })

  return (
    <DataGrid table={table} recordCount={total} isLoading={isPending} emptyMessage={emptyMessage}>
      <DataGridContainer>
        {toolbar && <div className="flex items-center justify-between p-4">{toolbar}</div>}
        <DataGridTable />
        <DataGridPagination pageIndex={pageIndex} pageSize={limit} total={total} />
      </DataGridContainer>
    </DataGrid>
  )
}