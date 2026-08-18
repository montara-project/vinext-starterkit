/**
 *
 * @param str
 * @returns
 */
export function capitalizeFirstLetter(str: string): string {
  const specialCharsRegex = /[-`~!@#$%^&*_|=?;:'",<>]/gi

  return str
    .replace(specialCharsRegex, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 *
 * @param value
 * @returns
 */
export function getInitialName(value: string): string {
  const names = value.trim().split(/\s+/)

  if (names.length === 0) return ''

  const firstInitial = names[0].charAt(0).toUpperCase()

  if (names.length === 1) {
    const secondChar = names[0].charAt(1).toUpperCase()
    return `${firstInitial}${secondChar}`
  }

  const lastInitial = names[names.length - 1].charAt(0).toUpperCase()
  return `${firstInitial}${lastInitial}`
}

/**
 * Constructs an absolute URL for media assets.
 *
 * @param path - The relative path to the media asset (e.g., "/media/avatars/1.png").
 * @returns A string representing the absolute URL to the media asset.
 */
export function toAbsoluteUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `/${cleanPath}`
}
