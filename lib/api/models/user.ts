import { ISO8601DateString } from '@/types/time'

import { Role } from './role'

export interface User {
  id: string
  created_at: ISO8601DateString
  updated_at: ISO8601DateString
  deleted_at: ISO8601DateString | null
  fullname: string
  email: string
  phone: string | null
  token_verify: string | null
  address: string | null
  is_active: boolean
  is_blocked: boolean
  role_id: string
  role: Role
}
