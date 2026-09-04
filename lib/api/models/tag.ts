import { ISO8601DateString } from '@/types/time'

export interface Tag {
  id: number
  name: string
  slug: string
  createdAt: ISO8601DateString
  updatedAt: ISO8601DateString
}
