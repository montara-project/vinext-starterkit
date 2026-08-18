import { ISO8601DateString } from '@/types/time'

export interface Category {
  id: number
  name: string
  description?: string
  createdAt: ISO8601DateString
  updatedAt: ISO8601DateString
}
