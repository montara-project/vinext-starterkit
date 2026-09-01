'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Check, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { DataTable } from '@/components/block/data-table/data-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))

const statusBadge: Record<
  Models.Comment['status'],
  { label: string; variant: 'warning' | 'success' | 'destructive' | 'outline' }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  spam: { label: 'Spam', variant: 'destructive' },
  trashed: { label: 'Trashed', variant: 'outline' },
}

export function CommentsTable() {
  const [deleting, setDeleting] = useState<Models.Comment | null>(null)

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Models.Comment['status'] }) =>
      services.comments.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => services.comments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      setDeleting(null)
    },
  })

  const columns: ColumnDef<Models.Comment>[] = [
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-64 text-sm">{row.original.content}</span>
      ),
    },
    {
      accessorKey: 'authorName',
      header: 'Author',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.authorName}</span>
      ),
    },
    {
      accessorKey: 'authorEmail',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.authorEmail}</span>
      ),
    },
    {
      accessorKey: 'postId',
      header: 'Post ID',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.postId}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { label, variant } = statusBadge[row.original.status]
        return (
          <Badge variant={variant} appearance="light">
            {label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {row.original.status !== 'approved' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateMutation.mutate({ id: row.original.id, status: 'approved' })
              }
            >
              <Check className="size-4" />
              <span className="sr-only">Approve {row.original.id}</span>
            </Button>
          )}
          {row.original.status !== 'trashed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateMutation.mutate({ id: row.original.id, status: 'trashed' })}
            >
              <X className="size-4" />
              <span className="sr-only">Trash {row.original.id}</span>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleting(row.original)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete {row.original.id}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete comment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete this comment? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate(deleting?.id ?? '')}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      queryKey={['comments']}
      queryFn={(params) => services.comments.list(params).then((res) => res.data)}
      emptyMessage="No comments found."
    />
  )
}