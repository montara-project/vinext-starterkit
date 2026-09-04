/**
 * Format a byte size to a human-readable format
 * @param size - The size in bytes
 * @returns The formatted size string
 */
export const formatByteSize = (size?: number) => {
  if (!size) return '—'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
