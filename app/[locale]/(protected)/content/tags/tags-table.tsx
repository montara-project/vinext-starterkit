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
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))

export function TagsTable() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Models.Tag | null>(null)
  const [deleting, setDeleting] = useState<Models.Tag | null>(null)

  const columns: ColumnDef<Models.Tag>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.original.slug}</code>
      ),
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditing(row.original)
              setOpen(true)
            }}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit {row.original.name}</span>
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
                <span className="sr-only">Delete {row.original.name}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete tag</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{deleting?.name}&rdquo;? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate(deleting?.id ?? 0)}
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
    mutationFn: (data: { name: string; slug?: string }) => services.tags.store(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setOpen(false)
    },
  })

  const editMutation = useMutation({
    mutationFn: (data: { id: number; name: string; slug?: string }) =>
      services.tags.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.tags.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setDeleting(null)
    },
  })

  return (
    <>
      <DataTable
        columns={columns}
        queryKey={['tags']}
        queryFn={(params) => services.tags.list(params).then((res) => res.data)}
        emptyMessage="No tags found. Create your first tag to get started."
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
                New Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Tag' : 'New Tag'}</DialogTitle>
              </DialogHeader>
              <TagForm
                tag={editing}
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

function TagForm({
  tag,
  isPending,
  onSubmit,
}: {
  tag: Models.Tag | null
  isPending: boolean
  onSubmit: (data: { name: string; slug?: string }) => void
}) {
  const [name, setName] = useState(tag?.name ?? '')
  const [slug, setSlug] = useState(tag?.slug ?? '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim()) return
        onSubmit({ name: name.trim(), slug: slug.trim() || undefined })
      }}
    >
      <DialogBody>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. react"
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
