import { ISO8601DateString } from '@/types/time'

export interface Role {
  id: string
  created_at: ISO8601DateString
  updated_at: ISO8601DateString
  deleted_at: ISO8601DateString | null
  name: string
}
