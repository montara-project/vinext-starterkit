'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Skeleton } from '@/components/ui/skeleton'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { throwAxiosError } from '@/lib/api/axios-error'
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'
import { BaseColumnProps } from '@/types/column'

import RowColumnAction from '../common/row-column-action'
import SimpleAlertDialog from '../common/simple-alert-dialog'

export function RoleColumn({ loading }: BaseColumnProps) {
  const columns = useMemo<ColumnDef<Models.Role>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
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
  record: Models.Role
}

function ActionCell({ record }: ActionCellProps) {
  const [openDelete, setOpenDelete] = useState(false)

  const queryClient = useQueryClient()
  const { offset, limit } = usePaginationQuery()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await services.roles.delete(record.id)
      } catch (error) {
        throwAxiosError(error as Error)
      }
    },
    onSuccess: () => {
      toast.success('Role deleted successfully')
      queryClient.invalidateQueries({
        queryKey: ['roles', { offset, limit }],
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
        title="Do you want to delete this role?"
        description="This role will be permanently deleted and cannot be undone."
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </React.Fragment>
  )
}
