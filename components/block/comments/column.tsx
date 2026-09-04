'use client'

import { IconCheck, IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { throwAxiosError } from '@/lib/api/axios-error'
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'
import { BaseColumnProps } from '@/types/column'

import RowColumnAction from '../common/row-column-action'
import SimpleAlertDialog from '../common/simple-alert-dialog'

export function CommentColumn({ loading }: BaseColumnProps) {
  const columns = useMemo<ColumnDef<Models.Comment>[]>(
    () => [
      {
        accessorKey: 'content',
        header: 'Content',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? <Skeleton className="h-5 w-full" /> : <span>{value}</span>
        },
        size: 60,
      },
      {
        accessorKey: 'authorName',
        header: 'Author',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? <Skeleton className="h-5 w-full" /> : <span>{value}</span>
        },
        size: 60,
      },
      {
        accessorKey: 'authorEmail',
        header: 'Author Email',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? <Skeleton className="h-5 w-full" /> : <span>{value}</span>
        },
        size: 30,
      },
      {
        accessorKey: 'postId',
        header: 'Post ID',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? <Skeleton className="h-5 w-full" /> : <span>{value}</span>
        },
        size: 30,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? <Skeleton className="h-5 w-full" /> : <span>{value}</span>
        },
        size: 30,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: (info) => {
          const value = info.getValue() as string
          return loading ? <Skeleton className="h-5 w-full" /> : <span>{value}</span>
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
  record: Models.Comment
}

function ActionCell({ record }: ActionCellProps) {
  const [openDelete, setOpenDelete] = useState(false)

  const queryClient = useQueryClient()
  const { offset, limit } = usePaginationQuery()

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Models.Comment['status'] }) => {
      try {
        return await services.comments.update(id, { status })
      } catch (error) {
        throwAxiosError(error as Error)
      }
    },
    onSuccess: () => {
      toast.success('Comment updated successfully')
      queryClient.invalidateQueries({
        queryKey: ['comments', { offset, limit }],
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await services.comments.delete(record.id)
      } catch (error) {
        throwAxiosError(error as Error)
      }
    },
    onSuccess: () => {
      toast.success('Comment deleted successfully')
      queryClient.invalidateQueries({
        queryKey: ['comments', { offset, limit }],
      })
      setOpenDelete(false)
    },
  })

  const handleUpdateStatus = async (status: Models.Comment['status']) => {
    try {
      await updateMutation.mutateAsync({ id: record.id, status })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      toast.error(message)
    }
  }

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
      <RowColumnAction
        onDelete={() => setOpenDelete(true)}
        dropdown={
          <React.Fragment>
            {record.status !== 'approved' && (
              <DropdownMenuItem onClick={() => handleUpdateStatus('approved')}>
                <IconCheck />
                Approved
              </DropdownMenuItem>
            )}

            {record.status !== 'trashed' && (
              <DropdownMenuItem onClick={() => handleUpdateStatus('trashed')}>
                <IconTrash />
                Trashed
              </DropdownMenuItem>
            )}
          </React.Fragment>
        }
      />

      <SimpleAlertDialog
        title="Do you want to delete this comment?"
        description="This comment will be permanently deleted and cannot be undone."
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </React.Fragment>
  )
}
