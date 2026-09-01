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

export function RolesTable() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Models.Role | null>(null)
  const [deleting, setDeleting] = useState<Models.Role | null>(null)

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: { name: string }) => services.roles.store(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setOpen(false)
    },
  })

  const editMutation = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      services.roles.update(data.id, { name: data.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => services.roles.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setDeleting(null)
    },
  })

  const columns: ColumnDef<Models.Role>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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
                <AlertDialogTitle>Delete role</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{deleting?.name}&rdquo;? This action cannot
                  be undone.
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
      queryKey={['roles']}
      queryFn={(params) => services.roles.list(params).then((res) => res.data)}
      emptyMessage="No roles found. Create your first role to get started."
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
              New Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Role' : 'New Role'}</DialogTitle>
            </DialogHeader>
            <RoleForm
              role={editing}
              isPending={createMutation.isPending || editMutation.isPending}
              onSubmit={(name) => {
                if (editing) {
                  editMutation.mutate({ id: editing.id, name })
                } else {
                  createMutation.mutate({ name })
                }
              }}
            />
          </DialogContent>
        </Dialog>
      }
    />
  )
}

function RoleForm({
  role,
  isPending,
  onSubmit,
}: {
  role: Models.Role | null
  isPending: boolean
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState(role?.name ?? '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim()) return
        onSubmit(name.trim())
      }}
    >
      <DialogBody>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
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