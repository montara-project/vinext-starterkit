import type { VALIDATION_MESSAGES } from '../lib/constants/message'

export type ValidationMessagesParams = {
  accepted: { attribute: string }
  active_url: { attribute: string }
  after: { attribute: string; date: string }
  after_or_equal: { attribute: string; date: string }
  alpha: { attribute: string }
  alpha_dash: { attribute: string }
  alpha_num: { attribute: string }
  array: { attribute: string }
  before: { attribute: string; date: string }
  before_or_equal: { attribute: string; date: string }
  between: { attribute: string; min: number; max: number }
  boolean: { attribute: string }
  confirmed: { attribute: string }
  current_password: object
  date: { attribute: string }
  date_equals: { attribute: string; date: string }
  date_format: { attribute: string; format: string }
  declined: { attribute: string }
  declined_if: { attribute: string; other: string; value: string | number }
  different: { attribute: string; other: string }
  digits: { attribute: string; digits: number }
  digits_between: { attribute: string; min: number; max: number }
  dimensions: { attribute: string }
  distinct: { attribute: string }
  email: { attribute: string }
  ends_with: { attribute: string; values: string }
  enum: { attribute: string }
  exists: { attribute: string }
  file: { attribute: string }
  filled: { attribute: string }
  gt: { attribute: string; value: number }
  gte: { attribute: string; value: number }
  image: { attribute: string }
  in: { attribute: string }
  in_array: { attribute: string; other: string }
  integer: { attribute: string }
  ip: { attribute: string }
  ipv4: { attribute: string }
  ipv6: { attribute: string }
  json: { attribute: string }
  lt: { attribute: string; value: number }
  lte: { attribute: string; value: number }
  mac_address: { attribute: string }
  max: { attribute: string; max: number }
  mimes: { attribute: string; values: string }
  mimetypes: { attribute: string; values: string }
  min: { attribute: string; min: number }
  multiple_of: { attribute: string; value: number }
  not_in: { attribute: string }
  not_regex: { attribute: string }
  numeric: { attribute: string }
  password: object
  present: { attribute: string }
  prohibited: { attribute: string }
  prohibited_if: { attribute: string; other: string; value: string | number }
  prohibited_unless: { attribute: string; other: string; values: string }
  prohibits: { attribute: string; other: string }
  regex: { attribute: string }
  required: { attribute: string }
  required_array_keys: { attribute: string; values: string }
  required_if: { attribute: string; other: string; value: string | number }
  required_unless: { attribute: string; other: string; values: string }
  required_with: { attribute: string; values: string }
  required_with_all: { attribute: string; values: string }
  required_without: { attribute: string; values: string }
  required_without_all: { attribute: string; values: string }
  same: { attribute: string; other: string }
  size: { attribute: string; size: number }
  starts_with: { attribute: string; values: string }
  string: { attribute: string }
  timezone: { attribute: string }
  unique: { attribute: string }
  uploaded: { attribute: string }
  url: { attribute: string }
  uuid: { attribute: string }
}

export type ValidationMessagesKey = keyof ValidationMessagesParams

export type NestedValidationMessagesKey<R extends ValidationMessagesKey> =
  (typeof VALIDATION_MESSAGES)[R] extends string ? never : keyof (typeof VALIDATION_MESSAGES)[R]
