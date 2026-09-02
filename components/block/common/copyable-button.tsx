'use client'

import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

interface CopyableButtonProps {
  value: string
  sorted?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CopyableButton({ value, sorted = true, size = 'md' }: CopyableButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [value])

  const sortedValue = useMemo(() => {
    if (sorted) {
      return `${value.slice(0, 8)}…${value.slice(-8)}`
    }
    return value
  }, [value, sorted])

  const textSizes = useMemo(() => {
    if (size === 'sm') {
      return 'text-xs'
    } else if (size === 'md') {
      return 'text-sm'
    } else {
      return 'text-base'
    }
  }, [size])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group flex items-center gap-1 font-mono transition-colors ${textSizes}`}
      title={value}
    >
      <span className="group-hover:cursor-pointer group-hover:underline">{sortedValue}</span>
      <span className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors group-hover:cursor-pointer group-hover:underline">
        {copied ? (
          <IconCheck className="h-3 w-3 text-green-500" />
        ) : (
          <IconCopy className="h-3 w-3" />
        )}
      </span>
    </button>
  )
}
