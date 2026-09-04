'use client'

import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface RowColumnActionProps {
  onShow?: () => void
  onEdit?: () => void
  onDelete?: () => void
  dropdown?: React.ReactNode
  actions?: React.ReactNode
}

export default function RowColumnAction({
  onShow,
  onEdit,
  onDelete,
  dropdown,
  actions,
}: RowColumnActionProps) {
  return (
    <div className="flex flex-row flex-wrap items-start gap-4">
      {onEdit && (
        <Button mode="link" underline="solid" className="dark:text-neutral-300" onClick={onEdit}>
          <IconEdit className="text-primary size-4 dark:text-neutral-300" />
          <span>Edit</span>
        </Button>
      )}

      {actions}

      {(onShow || onDelete || dropdown) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button mode="link" underline="solid" className="dark:text-neutral-300">
              <MoreHorizontal className="text-primary size-4 dark:text-neutral-300" />
              <span>More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40" align="end">
            <DropdownMenuGroup>
              {onShow && (
                <DropdownMenuItem onClick={onShow}>
                  <IconEye />
                  Show
                </DropdownMenuItem>
              )}

              {dropdown}

              {onDelete && (
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  <IconTrash />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
