import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { ReactNode, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { useDataGrid } from '@/components/ui/data-grid'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface DataGridPaginationProps {
  sizes?: number[]
  sizesInfo?: string
  sizesLabel?: string
  sizesDescription?: string
  sizesSkeleton?: ReactNode
  more?: boolean
  moreLimit?: number
  info?: string
  infoSkeleton?: ReactNode
  className?: string
  pageIndex?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

function DataGridPagination({
  pageIndex = 0,
  pageSize = 10,
  total = 10,
  onPageChange,
  onPageSizeChange,
  ...props
}: DataGridPaginationProps) {
  const { recordCount, isLoading } = useDataGrid()

  const [queryPage, setQueryPage] = useQueryState('page')
  const [queryPageSize, setQueryPageSize] = useQueryState('pageSize')

  const newPageIndex = useMemo(() => {
    if (queryPage) return Number(queryPage)
    return pageIndex
  }, [queryPage, pageIndex])

  const newPageSize = useMemo(() => {
    if (queryPageSize) return Number(queryPageSize)
    return pageSize
  }, [queryPageSize, pageSize])

  const defaultProps: Partial<DataGridPaginationProps> = {
    sizes: [5, 10, 25, 50, 100],
    sizesLabel: 'Show',
    sizesDescription: 'per page',
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    moreLimit: 5,
    more: false,
    info: '{from} - {to} of {count}',
    infoSkeleton: <Skeleton className="h-8 w-60" />,
  }

  const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props }

  const btnBaseClasses = 'size-7 p-0 text-sm'
  const btnArrowClasses = btnBaseClasses + ' rtl:transform rtl:rotate-180'

  const from = newPageIndex * newPageSize + 1
  const to = Math.min((newPageIndex + 1) * newPageSize, recordCount)

  // Use consistent page count calculation based on total and pageSize
  const currentPage = newPageIndex + 1
  const pageCount = Math.ceil(total / newPageSize)

  // Replace placeholders in paginationInfo
  const paginationInfo = mergedProps?.info
    ? mergedProps.info
        .replace('{from}', from.toString())
        .replace('{to}', to.toString())
        .replace('{count}', recordCount.toString())
    : `${from} - ${to} of ${recordCount}`

  // Pagination limit logic
  const paginationMoreLimit = mergedProps?.moreLimit || 5

  // Determine the start and end of the pagination group
  const currentGroupStart = Math.floor(newPageIndex / paginationMoreLimit) * paginationMoreLimit
  const currentGroupEnd = Math.min(currentGroupStart + paginationMoreLimit, pageCount)

  // Render page buttons based on the current group
  const renderPageButtons = () => {
    const buttons = []
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      buttons.push(
        <Button
          key={i}
          size="sm"
          mode="icon"
          variant="ghost"
          className={cn(btnBaseClasses, 'text-muted-foreground', {
            'bg-accent text-accent-foreground': newPageIndex === i,
          })}
          onClick={() => {
            if (newPageIndex !== i) {
              onPageChange?.(i)
              setQueryPage(i.toString())
            }
          }}
        >
          {i + 1}
        </Button>
      )
    }
    return buttons
  }

  // Render a "previous" ellipsis button if there are previous pages to show
  const renderEllipsisPrevButton = () => {
    if (currentGroupStart > 0) {
      return (
        <Button
          size="sm"
          mode="icon"
          className={btnBaseClasses}
          variant="ghost"
          onClick={() => {
            const result = currentGroupStart - 1
            onPageChange?.(result)
            setQueryPage(result.toString())
          }}
        >
          ...
        </Button>
      )
    }
    return null
  }

  // Render a "next" ellipsis button if there are more pages to show after the current group
  const renderEllipsisNextButton = () => {
    if (currentGroupEnd < pageCount) {
      return (
        <Button
          className={btnBaseClasses}
          variant="ghost"
          size="sm"
          mode="icon"
          onClick={() => {
            onPageChange?.(currentGroupEnd)
            setQueryPage(currentGroupEnd.toString())
          }}
        >
          ...
        </Button>
      )
    }
    return null
  }

  return (
    <div
      data-slot="data-grid-pagination"
      className={cn(
        'flex grow flex-col flex-wrap items-center justify-between gap-2.5 py-2.5 sm:flex-row sm:py-0',
        mergedProps?.className
      )}
    >
      <div className="order-2 flex flex-wrap items-center space-x-2.5 pb-2.5 sm:order-1 sm:pb-0">
        {isLoading ? (
          mergedProps?.sizesSkeleton
        ) : (
          <>
            <div className="text-muted-foreground text-sm">Rows per page</div>
            <Select
              value={`${newPageSize}`}
              indicatorPosition="right"
              onValueChange={(value) => {
                const result = Number(value)
                onPageSizeChange?.(result)
                setQueryPageSize(result.toString())
              }}
            >
              <SelectTrigger className="w-fit" size="sm">
                <SelectValue placeholder={`${newPageSize}`} />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-[50px]">
                {mergedProps?.sizes?.map((size: number) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className="order-1 flex flex-col items-center justify-center gap-2.5 pt-2.5 sm:order-2 sm:flex-row sm:justify-end sm:pt-0">
        {isLoading ? (
          mergedProps?.infoSkeleton
        ) : (
          <>
            <div className="text-muted-foreground order-2 text-sm text-nowrap sm:order-1">
              {paginationInfo}
            </div>
            {pageCount > 1 && (
              <div className="order-1 flex items-center space-x-1 sm:order-2">
                <Button
                  size="sm"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => {
                    const result = newPageIndex - 1
                    onPageChange?.(result)
                    setQueryPage(result.toString())
                  }}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="size-4" />
                </Button>

                {renderEllipsisPrevButton()}

                {renderPageButtons()}

                {renderEllipsisNextButton()}

                <Button
                  size="sm"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => {
                    const result = newPageIndex + 1
                    onPageChange?.(result)
                    setQueryPage(result.toString())
                  }}
                  disabled={currentPage >= pageCount}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { DataGridPagination, type DataGridPaginationProps }
