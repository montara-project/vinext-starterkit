'use client'

import { IconBarrierBlock } from '@tabler/icons-react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface EmptySectionProps {
  title: string
  message: string
  icon?: typeof IconBarrierBlock
}

export default function EmptySection({ title, message, ...props }: EmptySectionProps) {
  const router = useRouter()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{props.icon ? <props.icon /> : <IconBarrierBlock />}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="text-base">{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button className="cursor-pointer" onClick={() => router.push('/')}>
            <ArrowLeft />
            <span>Back</span>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
