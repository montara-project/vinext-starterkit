'use client'

import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react'
import { ButtonHTMLAttributes } from 'react'

import { Button } from '@/components/ui/button'
import { useFormContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon?: typeof IconDeviceFloppy
  className?: string
}

export default function SubmitButton({
  label,
  icon: Icon,
  className,
  ...props
}: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          className={cn(
            'text-off-white bg-obsidian-black hover:bg-obsidian-black/80 h-10 rounded-lg px-6 transition-colors',
            className
          )}
          disabled={isSubmitting}
          {...props}
        >
          {isSubmitting ? <IconLoader2 className="size-4 animate-spin" /> : null}
          {Icon ? <Icon className="size-4" /> : null}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
