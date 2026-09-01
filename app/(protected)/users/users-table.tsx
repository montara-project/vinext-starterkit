'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Models } from '@/lib/api/models'
import { services } from '@/lib/api/services'
import { cn } from '@/lib/utils'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))

type UserFormData = {
  fullname: string
  email: string
  password?: string
  role_id: string
}

export function UsersTable() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Models.User | null>(null)
  const [deleting, setDeleting] = useState<Models.User | null>(null)

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => services.roles.list({}).then((res) => res.data),
  })
  const roles = rolesData?.data ?? []

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => services.users.store(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setOpen(false)
    },
  })

  const editMutation = useMutation({
    mutationFn: (data: UserFormData & { id: string }) => {
      const { id, password, ...rest } = data
      return services.users.update(id, password ? { ...rest, password } : rest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => services.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setDeleting(null)
    },
  })

  const columns: ColumnDef<Models.User>[] = [
    {
      accessorKey: 'fullname',
      header: 'Full Name',
      cell: ({ row }) => <span className="font-medium">{row.original.fullname}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="secondary" appearance="light">
          {row.original.role?.name ?? '—'}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'success' : 'outline'} appearance="light">
          {row.original.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.created_at)}</span>
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
            <span className="sr-only">Edit {row.original.fullname}</span>
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
                <span className="sr-only">Delete {row.original.fullname}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete user</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{deleting?.fullname}&rdquo;? This action
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

  return (
    <DataTable
      columns={columns}
      queryKey={['users']}
      queryFn={(params) => services.users.list(params).then((res) => res.data)}
      emptyMessage="No users found. Create your first user to get started."
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
              New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit User' : 'New User'}</DialogTitle>
            </DialogHeader>
            <UserForm
              user={editing}
              roles={roles}
              isPending={createMutation.isPending || editMutation.isPending}
              onSubmit={(data) => {
                if (editing) {
                  editMutation.mutate({ ...data, id: editing.id })
                } else {
                  createMutation.mutate(data)
                }
              }}
            />
          </DialogContent>
        </Dialog>
      }
    />
  )
}

function UserForm({
  user,
  roles,
  isPending,
  onSubmit,
}: {
  user: Models.User | null
  roles: Models.Role[]
  isPending: boolean
  onSubmit: (data: UserFormData) => void
}) {
  const [fullname, setFullname] = useState(user?.fullname ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState(user?.role_id ?? '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!fullname.trim() || !email.trim() || !roleId) return
        onSubmit({
          fullname: fullname.trim(),
          email: email.trim(),
          ...(user ? (password ? { password } : {}) : { password }),
          role_id: roleId,
        })
      }}
    >
      <DialogBody>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
            <Input
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={user ? 'Leave blank to keep unchanged' : 'Set a password'}
              required={!user}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <select
              id="role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className={cn(
                'border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              )}
              required
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
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