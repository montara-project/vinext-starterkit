import { ISO8601DateString } from '@/types/time'

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  status: 'draft' | 'published' | 'archived'
  categoryId?: number
  authorId?: string
  createdAt: ISO8601DateString
  updatedAt: ISO8601DateString
  publishedAt?: ISO8601DateString
}
