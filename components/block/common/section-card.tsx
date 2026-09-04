'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card'

interface SectionCardProps {
  title: string
  toolbar?: React.ReactNode
  children: React.ReactNode
}

export default function SectionCard({ title, toolbar, children }: SectionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex h-15 items-center">
        <CardHeading>
          <CardTitle className="text-xl leading-relaxed tracking-normal">{title}</CardTitle>
        </CardHeading>

        {toolbar && <CardToolbar>{toolbar}</CardToolbar>}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
