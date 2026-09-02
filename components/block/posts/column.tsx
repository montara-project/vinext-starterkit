'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { throwAxiosError } from '@/lib/api/axios-error'
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'
import { BaseColumnProps } from '@/types/column'

import RowColumnAction from '../common/row-column-action'
import SimpleAlertDialog from '../common/simple-alert-dialog'

const formatDate = (date: string | null | undefined) => {
  if (!date) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))
  } catch {
    return '—'
  }
}

const statusBadge: Record<Models.Post['status'], { label: string; variant: string }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'success' },
  archived: { label: 'Archived', variant: 'outline' },
}

export function PostColumn({ loading }: BaseColumnProps) {
  const columns = useMemo<ColumnDef<Models.Post>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            <span className="font-medium">{value}</span>
          )
        },
        size: 60,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const value = info.getValue() as Models.Post['status']
          const badge = statusBadge[value]
          return loading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            <Badge variant={badge.variant as never} appearance="light" shape="circle">
              {badge.label}
            </Badge>
          )
        },
        size: 30,
      },
      {
        accessorKey: 'publishedAt',
        header: 'Published',
        cell: (info) => {
          const value = info.getValue() as string | null | undefined
          return loading ? (
            <Skeleton className="h-5 w-full" />
          ) : value ? (
            <span className="text-muted-foreground text-sm">{formatDate(value)}</span>
          ) : (
            <span className="text-muted-foreground/60 text-sm">—</span>
          )
        },
        size: 30,
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            <span className="text-muted-foreground text-sm">{formatDate(value)}</span>
          )
        },
        size: 30,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return loading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            <ActionCell record={row.original} />
          )
        },
        size: 40,
      },
    ],
    [loading]
  )
  return columns
}

interface ActionCellProps {
  record: Models.Post
}

function ActionCell({ record }: ActionCellProps) {
  const [openDelete, setOpenDelete] = useState(false)

  const queryClient = useQueryClient()
  const { offset, limit } = usePaginationQuery()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await services.posts.delete(record.id)
      } catch (error) {
        throwAxiosError(error as Error)
      }
    },
    onSuccess: () => {
      toast.success('Post deleted successfully')
      queryClient.invalidateQueries({
        queryKey: ['posts', { offset, limit }],
      })
      setOpenDelete(false)
    },
  })

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      toast.error(message)
    }
  }

  return (
    <React.Fragment>
      <RowColumnAction onDelete={() => setOpenDelete(true)} />

      <SimpleAlertDialog
        title="Do you want to delete this post?"
        description="This post will be permanently deleted and cannot be undone."
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </React.Fragment>
  )
}
