'use client'

import { useDirection } from '@radix-ui/react-direction'
import React, { useMemo } from 'react'

import DialogContent, {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface SimpleDialogProps {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function SimpleDialog({
  title,
  description,
  open,
  onOpenChange,
  children,
  size = 'md',
}: SimpleDialogProps) {
  const direction = useDirection()

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('p-0', sizeClass)} dir={direction}>
        <DialogHeader className="border-border m-0 border-b pt-5 pb-3">
          <DialogTitle className="px-6 text-base">{title}</DialogTitle>
          <DialogDescription className={cn('px-6', !description && 'sr-only')}>
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="px-6 py-4 text-sm">{children}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
