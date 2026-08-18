'use client'

import { useEffect, useState } from 'react'

interface UseDebounceProps<T> {
  value: T
  delay?: number
}

export function useDebounce<T>({ value, delay = 500 }: UseDebounceProps<T>) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
