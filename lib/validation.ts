import z from 'zod'

import type {
  NestedValidationMessagesKey,
  ValidationMessagesKey,
  ValidationMessagesParams,
} from '@/types/message'

import { VALIDATION_MESSAGES } from './constants/message'

/**
 * Detect validation messages type
 * @param ValidationMessages
 * @param params
 * @returns
 */
export function detectValidationMessagesType<R extends ValidationMessagesKey>(
  ValidationMessages: R,
  params: ValidationMessagesParams[R]
): NestedValidationMessagesKey<R> | undefined {
  const msg = VALIDATION_MESSAGES[ValidationMessages]
  if (typeof msg !== 'object') return undefined

  const hasMinNumber = (value: unknown): value is { min: number } =>
    typeof (value as Record<string, unknown>)?.min === 'number'
  const hasValuesArray = (value: unknown): value is { values: unknown[] } =>
    Array.isArray((value as Record<string, unknown>)?.values)
  const hasFileField = (value: unknown): value is { file: unknown } =>
    typeof value === 'object' && value !== null && 'file' in (value as Record<string, unknown>)

  if ('string' in msg && hasMinNumber(params)) {
    return 'string' as NestedValidationMessagesKey<R>
  }
  if ('numeric' in msg && hasMinNumber(params)) {
    return 'numeric' as NestedValidationMessagesKey<R>
  }
  if ('file' in msg && hasFileField(params)) {
    return 'file' as NestedValidationMessagesKey<R>
  }
  if ('array' in msg && hasValuesArray(params)) {
    return 'array' as NestedValidationMessagesKey<R>
  }

  return 'string' as NestedValidationMessagesKey<R>
}

/**
 * Get validation message
 * @param rule
 * @param params
 * @param type
 * @returns
 */
export function getValidationMessage<R extends ValidationMessagesKey>(
  rule: R,
  params: ValidationMessagesParams[R],
  type?: NestedValidationMessagesKey<R>
): string {
  const message = VALIDATION_MESSAGES[rule]
  let template: string | undefined

  if (typeof message === 'object') {
    const resolvedType = type ?? detectValidationMessagesType(rule, params)
    if (!resolvedType) {
      throw new Error(
        `Rule "${rule}" requires a type (e.g. "string" | "numeric" | "file" | "array").`
      )
    }

    if (resolvedType in message) {
      template = (message as Record<string, string>)[resolvedType as string]
    } else {
      throw new Error(`Type "${String(resolvedType)}" is not valid for rule "${rule}"`)
    }
  } else {
    template = message
  }

  if (!template) {
    throw new Error(`Template for rule "${rule}" not found`)
  }

  return template.replace(/:([a-zA-Z_]+)/g, (_, key) => {
    const templateParams = params as Record<string, unknown>
    return templateParams[key] !== undefined ? String(templateParams[key]) : `:${key}`
  })
}

/**
 * Required string validation
 * @param attribute
 * @returns
 */
export const requiredString = (attribute: string) =>
  z.string().nonempty(getValidationMessage('required', { attribute }))

/**
 * Required email validation
 * @param attribute
 * @returns
 */
export const requiredEmail = (attribute: string) =>
  z.email(getValidationMessage('email', { attribute }))

/**
 * Required number validation
 * @param attribute
 * @returns
 */
export const requiredNumber = (attribute: string) =>
  z.number().refine(Number.isInteger, getValidationMessage('numeric', { attribute }))

/**
 * Required date validation
 * @param attribute
 * @returns
 */
export const requiredDate = (attribute: string) =>
  requiredString(attribute).refine(
    (value) => !Number.isNaN(Date.parse(value)),
    getValidationMessage('date', { attribute })
  )

/**
 * Optional date validation
 * @param attribute
 * @returns
 */
export const optionalDateForm = (attribute: string) =>
  z
    .string()
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      getValidationMessage('date', { attribute })
    )
    .nullable()
    .optional()

/**
 * Optional date validation
 * @param attribute
 * @returns
 */
export const optionalDateFilter = (attribute: string) =>
  z
    .string()
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      getValidationMessage('date', { attribute })
    )
    .optional()

/**
 * Required file validation
 * @param attribute
 * @returns
 */
export const requiredFile = (attribute: string) =>
  z.custom<File>(
    (val) => {
      // If no value provided, it's valid since it's required
      if (val === undefined || val === null) return true
      // If value provided, it must be a File instance
      return val instanceof File
    },
    {
      message: getValidationMessage('file', { attribute }),
    }
  )

/**
 * Optional file validation
 * @param attribute
 * @returns
 */
export const optionalFile = (attribute: string) =>
  z
    .custom<File>(
      (val) => {
        // If no value provided, it's valid since it's optional
        if (val === undefined || val === null) return true
        // If value provided, it must be a File instance
        return val instanceof File
      },
      {
        message: getValidationMessage('file', { attribute }),
      }
    )
    .optional()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const requiredTrimmedString = (attribute: string) =>
  z.string().trim().min(1, getValidationMessage('required', { attribute }))

const optionalValidEmail = (attribute: string) =>
  z
    .string()
    .trim()
    .refine((value) => value.length === 0 || EMAIL_REGEX.test(value), {
      message: getValidationMessage('email', { attribute }),
    })

export const CustomerInformationContactSchema = z.object({
  firstName: requiredTrimmedString('first name'),
  lastName: requiredTrimmedString('last name'),
  age: requiredTrimmedString('age'),
  gender: requiredTrimmedString('gender'),
  email: requiredEmail('email'),
  countryCode: requiredTrimmedString('country code'),
  phone: requiredTrimmedString('phone'),
})

export const CustomerInformationGuestSchema = z.object({
  firstName: requiredTrimmedString('first name'),
  lastName: requiredTrimmedString('last name'),
  age: requiredTrimmedString('age'),
  gender: requiredTrimmedString('gender'),
  nationality: z.string(),
  idType: z.string(),
  idNumber: z.string(),
})

export const CustomerInformationBookingForSomeoneElseSchema = z.object({
  fullName: requiredTrimmedString('full name'),
  email: optionalValidEmail('email'),
  phone: z.string(),
  relation: requiredTrimmedString('relation'),
  notes: z.string(),
})

export function zValidation<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Partial<Record<keyof T, string>> {
  const result = schema.safeParse(data)
  if (result.success) return {}

  const fieldErrors: Partial<Record<keyof T, string>> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof T
    if (fieldErrors[field]) continue
    fieldErrors[field] = issue.message
  }
  return fieldErrors
}
