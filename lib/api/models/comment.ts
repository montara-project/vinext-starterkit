import { ISO8601DateString } from '@/types/time'

export interface Comment {
  id: string
  content: string
  postId: string
  authorName: string
  authorEmail: string
  status: 'pending' | 'approved' | 'spam' | 'trashed'
  createdAt: ISO8601DateString
  updatedAt: ISO8601DateString
}
