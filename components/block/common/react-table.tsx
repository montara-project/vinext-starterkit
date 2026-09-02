/* eslint-disable react-hooks/incompatible-library */

'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  FilterFnOption,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface ReactTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  pageSize?: number
  pageIndex?: number
  total: number
  columnSort?: ColumnSort[]
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  globalFilterFn?: FilterFnOption<T>
  getRowId?: (row: T | any) => string
}

export default function ReactTable<T>({
  columns,
  data,
  pageSize = 10,
  pageIndex = 0,
  total,
  columnSort = [],
  globalFilterFn,
  getRowId,
  onPageChange,
  onPageSizeChange,
}: ReactTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(columnSort)
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  })

  // Sync pagination state with props
  useEffect(() => {
    setPagination({
      pageIndex,
      pageSize,
    })
  }, [pageIndex, pageSize])

  const table = useReactTable({
    columns,
    data,
    pageCount: Math.ceil(total / pagination.pageSize),
    getRowId: getRowId ? getRowId : (row: T | any) => String(row.id),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    globalFilterFn,
    columnResizeMode: 'onChange',
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  })

  return (
    <DataGrid
      table={table}
      recordCount={total}
      tableLayout={{
        columnsVisibility: true,
        columnsResizable: true,
        columnsPinnable: true,
        columnsMovable: true,
      }}
      tableClassNames={{
        edgeCell: 'px-5',
      }}
    >
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
        <DataGridPagination
          total={total}
          pageSize={pagination.pageSize}
          pageIndex={pagination.pageIndex}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </DataGrid>
  )
}
