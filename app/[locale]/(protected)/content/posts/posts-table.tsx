'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'
import { cn } from '@/lib/utils'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))

const statusBadge: Record<Models.Post['status'], { label: string; variant: string }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'success' },
  archived: { label: 'Archived', variant: 'outline' },
}

const statusOptions = ['draft', 'published', 'archived'] as const

export function PostsTable() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Models.Post | null>(null)
  const [deleting, setDeleting] = useState<Models.Post | null>(null)

  const columns: ColumnDef<Models.Post>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.title}</span>
          {row.original.slug && (
            <code className="text-muted-foreground text-xs">{row.original.slug}</code>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const badge = statusBadge[row.original.status]
        return (
          <Badge variant={badge.variant as never} appearance="light" shape="circle">
            {badge.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'publishedAt',
      header: 'Published',
      cell: ({ row }) =>
        row.original.publishedAt ? (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.original.publishedAt)}
          </span>
        ) : (
          <span className="text-muted-foreground/60 text-sm">—</span>
        ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.updatedAt)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditing(row.original)
              setOpen(true)
            }}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit {row.original.title}</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleting(row.original)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete {row.original.title}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{deleting?.title}&rdquo;? This action
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
      ),
    },
  ]

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: { title: string; slug?: string; status?: Models.Post['status'] }) =>
      services.posts.store(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setOpen(false)
    },
  })

  const editMutation = useMutation({
    mutationFn: (data: {
      id: string
      title: string
      slug?: string
      status?: Models.Post['status']
    }) => services.posts.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => services.posts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setDeleting(null)
    },
  })

  return (
    <>
      <DataTable
        columns={columns}
        queryKey={['posts']}
        queryFn={(params) => services.posts.list(params).then((res) => res.data)}
        emptyMessage="No posts found. Create your first post to get started."
        toolbar={
          <Dialog
            open={open}
            onOpenChange={(next) => {
              setOpen(next)
              if (!next) setEditing(null)
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Post' : 'New Post'}</DialogTitle>
              </DialogHeader>
              <PostForm
                post={editing}
                isPending={createMutation.isPending || editMutation.isPending}
                onSubmit={(data) => {
                  if (editing) {
                    editMutation.mutate({ id: editing.id, ...data })
                  } else {
                    createMutation.mutate(data)
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />
    </>
  )
}

function PostForm({
  post,
  isPending,
  onSubmit,
}: {
  post: Models.Post | null
  isPending: boolean
  onSubmit: (data: { title: string; slug?: string; status?: Models.Post['status'] }) => void
}) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [status, setStatus] = useState<Models.Post['status']>(post?.status ?? 'draft')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim()) return
        onSubmit({ title: title.trim(), slug: slug.trim() || undefined, status })
      }}
    >
      <DialogBody>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Getting started with vinext"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. getting-started-with-vinext"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Models.Post['status'])}
              className={cn(
                'border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {statusBadge[option].label}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
            <Textarea
              id="excerpt"
              value={post?.excerpt ?? ''}
              onChange={() => {}}
              placeholder="Optional short summary"
              rows={3}
            />
          </Field>
        </FieldGroup>
      </DialogBody>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}
