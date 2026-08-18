import { Second } from '@/types/time'

/**
 * Convert time string to milliseconds
 * Supports: ms, s, sec, m, min, h, hr, d, day, w, week, y, year
 * @param value - Time string (e.g., "7d", "2h", "30min", "1.5h")
 * @returns Milliseconds
 * @throws Error if invalid format or unsupported unit
 * @example
 * ms("2d") // 172800000
 * ms("1.5h") // 5400000
 * ms("30min") // 1800000
 */
export function ms(value: string | number): Second {
  // If already a number, assume it's milliseconds
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) {
      throw new Error('Invalid number provided')
    }
    return Math.abs(value)
  }

  // Validate input
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('Invalid input: expected non-empty string')
  }

  // Normalize input: trim and convert to lowercase
  const normalized = value.trim().toLowerCase()

  // Match number and unit using regex
  const match = normalized.match(
    /^(-?\d*\.?\d+)\s*(ms|milliseconds?|s|secs?|seconds?|m|mins?|minutes?|h|hrs?|hours?|d|days?|w|weeks?|y|years?)$/i
  )

  if (!match) {
    throw new Error(`Invalid time format: "${value}". Expected format like "2d", "1.5h", "30min"`)
  }

  const [, numStr, unit] = match
  const num = parseFloat(numStr)

  if (isNaN(num) || !isFinite(num)) {
    throw new Error(`Invalid number: "${numStr}"`)
  }

  const MS_PER_SECOND = 1000
  const MS_PER_MINUTE = 60 * MS_PER_SECOND
  const MS_PER_HOUR = 60 * MS_PER_MINUTE
  const MS_PER_DAY = 24 * MS_PER_HOUR
  const MS_PER_WEEK = 7 * MS_PER_DAY
  const MS_PER_YEAR = 365.25 * MS_PER_DAY

  // Time unit conversion factors (to milliseconds)
  const conversions: Record<string, number> = {
    // Milliseconds
    ms: 1,
    millisecond: 1,
    milliseconds: 1,

    // Seconds
    s: MS_PER_SECOND,
    sec: MS_PER_SECOND,
    secs: MS_PER_SECOND,
    second: MS_PER_SECOND,
    seconds: MS_PER_SECOND,

    // Minutes
    m: MS_PER_MINUTE,
    min: MS_PER_MINUTE,
    mins: MS_PER_MINUTE,
    minute: MS_PER_MINUTE,
    minutes: MS_PER_MINUTE,

    // Hours
    h: MS_PER_HOUR,
    hr: MS_PER_HOUR,
    hrs: MS_PER_HOUR,
    hour: MS_PER_HOUR,
    hours: MS_PER_HOUR,

    // Days
    d: MS_PER_DAY,
    day: MS_PER_DAY,
    days: MS_PER_DAY,

    // Weeks
    w: MS_PER_WEEK,
    week: MS_PER_WEEK,
    weeks: MS_PER_WEEK,

    // Years (approximate: 365.25 days)
    y: MS_PER_YEAR,
    year: MS_PER_YEAR,
    years: MS_PER_YEAR,
  }

  const factor = conversions[unit]
  if (factor === undefined) {
    throw new Error(`Unsupported time unit: "${unit}"`)
  }

  const result = Math.abs(num * factor)

  // Check for overflow
  if (!isFinite(result)) {
    throw new Error(`Result overflow: "${value}" produces infinite milliseconds`)
  }

  return Math.round(result)
}
