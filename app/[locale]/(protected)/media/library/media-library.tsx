'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImageIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { DataStateWrapper } from '@/components/block/common/data-state-wrapper'
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
import { Button } from '@/components/ui/button'
import { usePaginationQuery } from '@/hooks/use-pagination-query'
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'
import { formatDate } from '@/lib/date'
import { formatByteSize } from '@/lib/number'

export function MediaLibrary() {
  const { offset, limit } = usePaginationQuery()
  const [deleting, setDeleting] = useState<Models.Media | null>(null)

  const { data, isPending } = useQuery({
    queryKey: ['media', { offset, limit }],
    queryFn: () => services.media.list({ offset, limit }).then((res) => res.data),
  })

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => services.media.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      setDeleting(null)
    },
  })

  const items = data?.data ?? []

  return (
    <DataStateWrapper
      isLoading={isPending}
      isError={false}
      isEmpty={items.length === 0}
      loadingMessage="Loading media..."
      emptyMessage="No media found. Upload your first file."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex h-32 items-center justify-center rounded-md bg-muted">
              {item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="text-muted-foreground size-8" />
              )}
            </div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-muted-foreground text-xs">{item.type}</p>
                <p className="text-muted-foreground text-xs">
                  {formatByteSize(item.size)} &middot; {formatDate(item.createdAt)}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleting(item)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete {item.name}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete media</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &ldquo;{deleting?.name}&rdquo;? This action
                      cannot be undone.
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
          </div>
        ))}
      </div>
    </DataStateWrapper>
  )
}
