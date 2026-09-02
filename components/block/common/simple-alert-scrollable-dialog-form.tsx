'use client'

import { IconLoader2 } from '@tabler/icons-react'
import React, { useMemo } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SimpleAlertScrollableDialogFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onSubmit: React.SubmitEventHandler<HTMLFormElement> | undefined
  children: React.ReactNode
  cancelText?: string
  confirmText?: string
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function SimpleAlertScrollableDialogForm({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  children,
  cancelText = 'Cancel',
  confirmText = 'Save',
  loading = false,
  disabled = false,
  size = 'xl',
}: SimpleAlertScrollableDialogFormProps) {
  const sizeClass = useMemo(() => {
    if (size === 'sm') {
      return 'max-w-md'
    }
    if (size === 'md') {
      return 'max-w-lg'
    }
    if (size === 'lg') {
      return 'max-w-2xl'
    }

    return 'max-w-4xl'
  }, [size])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn('flex max-h-[90vh] flex-col overflow-hidden p-0', sizeClass)}
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <AlertDialogHeader className="px-6 pt-6 pb-4">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription className={cn(!description && 'sr-only')}>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Separator />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 pt-4">
            <div className="space-y-4 pr-1">{children}</div>
          </div>

          <Separator />

          <AlertDialogFooter className="p-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {cancelText}
            </Button>
            <Button type="submit" variant="primary" disabled={loading || disabled}>
              {loading && <IconLoader2 className="animate-spin" />}
              {loading ? 'Loading...' : confirmText}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
