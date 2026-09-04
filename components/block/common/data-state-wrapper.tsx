'use client'

import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface DataStateWrapperProps {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  loadingMessage?: string
  emptyMessage?: string
  errorMessage?: string
  children: ReactNode
}

export function DataStateWrapper({
  isLoading,
  isError,
  isEmpty,
  loadingMessage = 'Loading...',
  emptyMessage = 'No data found.',
  errorMessage = 'Something went wrong. Please try again.',
  children,
}: DataStateWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-destructive">{errorMessage}</p>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}
