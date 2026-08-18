'use client'

import { useMemo } from 'react'

interface UseSelectOptionsProps<T> {
  records: T[] | undefined
  label: keyof T | ((item: T) => string)
  value: keyof T
}

export function useSelectOptions<T>({ records, label, value }: UseSelectOptionsProps<T>) {
  return useMemo(() => {
    if (!records || records.length === 0) {
      return []
    }

    return records.map((item) => ({
      value: String(item[value]),
      label: typeof label === 'function' ? label(item) : (item[label] as string),
      original: item,
    }))
  }, [records, label, value])
}
