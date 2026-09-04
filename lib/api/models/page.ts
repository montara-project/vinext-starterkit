import { ISO8601DateString } from '@/types/time'

export interface Page {
  id: string
  title: string
  slug: string
  content?: string
  status: 'draft' | 'published'
  createdAt: ISO8601DateString
  updatedAt: ISO8601DateString
}
