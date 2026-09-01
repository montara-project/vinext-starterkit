'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function PasswordInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input {...props} type={show ? 'text' : 'password'} className={cn('pr-10', className)} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
