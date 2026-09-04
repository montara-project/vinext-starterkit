import z from 'zod'

import { requiredEmail, requiredString } from '@/lib/validation'

export const SignInSchema = z.object({
  email: requiredEmail(),
  password: requiredString('password'),
})

export const SignUpSchema = z.object({
  name: requiredString('name'),
  email: requiredEmail(),
  password: requiredString('password'),
})

export type SignInSchemaType = z.infer<typeof SignInSchema>
export type SignUpSchemaType = z.infer<typeof SignUpSchema>
