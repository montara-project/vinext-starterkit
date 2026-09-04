'use client'

import React, { useMemo } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SimpleReviewSectionProps {
  title: string
  rows?: (readonly [string, string])[]
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children?: React.ReactNode
}

export default function SimpleReviewSection({
  title,
  rows,
  size = 'md',
  loading = false,
  children,
}: SimpleReviewSectionProps) {
  const gridSize = useMemo(() => {
    if (size === 'sm') {
      return 'sm:grid-cols-3'
    }
    if (size === 'md') {
      return 'sm:grid-cols-2'
    }
    return 'sm:grid-cols-1'
  }, [size])

  const renderContent = () => {
    if (loading) {
      return (
        <dl className={`grid grid-cols-1 gap-x-4 gap-y-1 text-xs md:text-sm ${gridSize}`}>
          {rows?.map(([k], i) => (
            <div key={i} className="flex items-start gap-2">
              <dt className="text-muted-foreground w-32 shrink-0">{k}</dt>
              <dd className="min-w-0 flex-1">
                <Skeleton className="h-3 w-full" />
              </dd>
            </div>
          ))}
        </dl>
      )
    }

    if (rows && rows.length > 0) {
      return (
        <dl className={`grid grid-cols-1 gap-2 text-xs md:text-sm ${gridSize}`}>
          {rows.map(([k, v], i) => (
            <div key={i} className="flex items-start gap-2">
              <dt className="text-muted-foreground w-32 shrink-0">{k}</dt>
              <dd className={cn('min-w-0 flex-1 wrap-break-word', !v && 'text-muted-foreground')}>
                {v || '—'}
              </dd>
            </div>
          ))}
        </dl>
      )
    }

    return null
  }

  return (
    <div className="border-border rounded-lg border p-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold md:text-lg">{title}</h3>
        </div>
      </div>

      {renderContent()}

      {children}
    </div>
  )
}
