'use client'

import React, { useMemo } from 'react'

import { AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SimpleAlertScrollableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  cancelText?: string
  confirmText?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function SimpleAlertScrollableDialog({
  open,
  onOpenChange,
  title,
  description = 'No Description',
  children,
  cancelText = 'Cancel',
  confirmText = 'Okay',
  disabled = false,
  size = 'xl',
}: SimpleAlertScrollableDialogProps) {
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
        <div className="flex min-h-0 flex-1 flex-col">
          <AlertDialogHeader className="px-6 pt-6 pb-4">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDescription className={cn('text-muted-foreground', !description && 'sr-only')}>
              {description}
            </AlertDescription>
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
            <Button
              type="button"
              variant="primary"
              disabled={disabled}
              onClick={() => onOpenChange(false)}
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
