import { ISO8601DateString } from '@/types/time'

export interface Media {
  id: string
  name: string
  url: string
  type: string
  size?: number
  mimeType?: string
  createdAt: ISO8601DateString
  updatedAt: ISO8601DateString
}
