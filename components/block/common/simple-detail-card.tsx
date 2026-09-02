'use client'

import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SimpleDetailCardProps {
  title: string
  description?: string
  children: React.ReactNode
  toolbar?: React.ReactNode
  badge?: React.ReactNode
}

export default function SimpleDetailCard({
  title,
  description,
  children,
  toolbar,
  badge,
}: SimpleDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardHeading className={cn('flex flex-col justify-center', description ? 'h-20' : 'h-10')}>
          <CardTitle className="flex items-center gap-2 text-xl">
            {title}
            {badge}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground text-sm">
              {description}
            </CardDescription>
          )}
        </CardHeading>
        {toolbar && <CardToolbar>{toolbar}</CardToolbar>}
      </CardHeader>
      <CardContent className="space-y-4 p-4 md:space-y-4">{children}</CardContent>
    </Card>
  )
}
