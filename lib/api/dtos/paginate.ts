import z from 'zod'

import { requiredNumber } from '@/lib/validation'

export const PaginateSchema = z.object({
  offset: requiredNumber('offset').optional(),
  limit: requiredNumber('limit').optional(),
})

export type PaginateDto = z.infer<typeof PaginateSchema>
