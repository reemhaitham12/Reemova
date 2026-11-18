/**
 * Derives avatar initials from a full name string.
 *
 * Examples:
 * - "Alex Morgan" -> "AM"
 * - "Alex" -> "AL"
 * - "A" -> "A"
 * - "John Ronald Reuel Tolkien" -> "JT"
 * - "  Jane   Doe  " -> "JD"
 * - "" / null / undefined -> "?"
 */
export function getInitials(name?: string | null): string {
  if (!name) return '?'

  const trimmed = name.trim()
  if (!trimmed) return '?'

  const parts = trimmed.split(/\s+/).filter(Boolean)

  if (parts.length === 0) return '?'

  if (parts.length === 1) {
    const single = parts[0]
    return single.length >= 2
      ? single.slice(0, 2).toUpperCase()
      : single.toUpperCase()
  }

  const firstInitial = parts[0][0] || ''
  const lastInitial = parts[parts.length - 1][0] || ''

  return (firstInitial + lastInitial).toUpperCase()
}
