'use client'

import { LoaderCircleIcon } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

import { Button } from '@/components/ui/button'
import { useFormContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  className?: string
}

export default function SubmitButton({ label, className, ...props }: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          className={cn('h-10 w-full', className)}
          disabled={isSubmitting}
          {...props}
        >
          {isSubmitting ? <LoaderCircleIcon className="size-4 animate-spin" /> : null}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
