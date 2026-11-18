import type { PlatformType, ProfileLink } from '../types'

/**
 * Protocol allowlist for safe hyperlinks.
 * Explicitly excludes javascript:, data:, vbscript:, file: to prevent XSS.
 */
const SAFE_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:'])

/**
 * Checks whether a given URL uses a safe, approved protocol.
 */
export function isSafeProtocol(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false
  const trimmed = rawUrl.trim().toLowerCase()

  // Catch dangerous script pseudo-protocols before URL parsing
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return false
  }

  try {
    const parsed = new URL(trimmed)
    return SAFE_PROTOCOLS.has(parsed.protocol)
  } catch {
    // If not a full URL with scheme, check if it's a mailto/tel shorthand
    if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
      const scheme = trimmed.split(':')[0] + ':'
      return SAFE_PROTOCOLS.has(scheme)
    }
    return false
  }
}

/**
 * Validates whether a string is a well-formed, safe URL.
 * Supports http(s), mailto, tel, and platform-specific formats.
 */
export function isValidUrl(rawUrl: string, platform?: PlatformType): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false
  const trimmed = rawUrl.trim()
  if (!trimmed) return false

  // Reject explicitly dangerous pseudo-protocols immediately
  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return false
  }

  // Handle email links (with or without 'mailto:' prefix)
  if (platform === 'email' || lower.startsWith('mailto:')) {
    const emailCandidate = trimmed.replace(/^mailto:/i, '').trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCandidate)
  }

  // Handle phone links (with or without 'tel:' prefix)
  if (lower.startsWith('tel:')) {
    const phoneCandidate = trimmed.replace(/^tel:/i, '').trim()
    return /^\+?[0-9\s\-()]{7,20}$/.test(phoneCandidate)
  }

  // Handle WhatsApp
  if (platform === 'whatsapp') {
    // If entered as phone number / handle shorthand
    if (/^\+?[0-9\s\-()]{7,20}$/.test(trimmed)) return true
    // If entered as a full URL
    const normalized = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`
    try {
      const parsed = new URL(normalized)
      return (
        parsed.hostname === 'wa.me' ||
        parsed.hostname === 'api.whatsapp.com' ||
        parsed.hostname === 'chat.whatsapp.com'
      )
    } catch {
      return false
    }
  }

  // Normalize by prepending https:// if missing a protocol scheme
  const normalizedUrl =
    lower.startsWith('http://') || lower.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`

  // Ensure safe scheme for general web links
  if (!isSafeProtocol(normalizedUrl)) {
    return false
  }

  // General web URL check
  try {
    const parsed = new URL(normalizedUrl)
    const hasValidHost =
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      parsed.hostname.length > 0 &&
      parsed.hostname.includes('.')

    if (!hasValidHost) return false

    // Platform-specific hostname checks when applicable
    const host = parsed.hostname.toLowerCase()
    switch (platform) {
      case 'linkedin':
        return host.includes('linkedin.com')
      case 'github':
        return host.includes('github.com')
      case 'gitlab':
        return host.includes('gitlab.com')
      case 'stackoverflow':
        return host.includes('stackoverflow.com')
      case 'youtube':
        return host.includes('youtube.com') || host.includes('youtu.be')
      case 'twitter':
        return host.includes('twitter.com') || host.includes('x.com')
      case 'facebook':
        return host.includes('facebook.com') || host.includes('fb.com')
      case 'instagram':
        return host.includes('instagram.com')
      case 'telegram':
        return host.includes('t.me') || host.includes('telegram.me')
      case 'discord':
        return host.includes('discord.gg') || host.includes('discord.com')
      default:
        return true
    }
  } catch {
    return false
  }
}

/**
 * Sanitizes and formats a URL for safe rendering in an <a href="..."> tag.
 * Automatically prepends mailto: for email links if missing.
 * Returns empty string if the URL is invalid or uses an unsafe protocol.
 */
export function sanitizeUrl(rawUrl: string, platform?: PlatformType): string {
  if (!rawUrl || typeof rawUrl !== 'string') return ''
  const trimmed = rawUrl.trim()
  if (!trimmed) return ''

  if (!isValidUrl(trimmed, platform)) return ''

  if (platform === 'email' && !trimmed.toLowerCase().startsWith('mailto:')) {
    return `mailto:${trimmed}`
  }

  if (platform === 'whatsapp') {
    if (!trimmed.toLowerCase().startsWith('http')) {
      const digitsOnly = trimmed.replace(/[^0-9]/g, '')
      return `https://wa.me/${digitsOnly}`
    }
    return trimmed
  }

  if (platform === 'telegram' && !trimmed.toLowerCase().startsWith('http')) {
    const handle = trimmed.replace(/^@/, '')
    return `https://t.me/${handle}`
  }

  // Prepend https:// if not starting with scheme
  if (!trimmed.toLowerCase().startsWith('http://') && !trimmed.toLowerCase().startsWith('https://')) {
    return `https://${trimmed}`
  }

  return trimmed
}

/**
 * Determines whether a link draft is complete and safe to render in the card.
 * Incomplete links (e.g. while being typed in the editor) return false so they
 * do not break the live preview or render broken anchors.
 */
export function isCompleteLink(link: Partial<ProfileLink>): boolean {
  if (!link) return false
  const hasTitle = Boolean(link.title && link.title.trim().length > 0)
  const hasValidUrlString = Boolean(link.url && isValidUrl(link.url, link.platform))
  return hasTitle && hasValidUrlString
}

// ==========================================
// File Validation Helpers
// ==========================================

export interface FileValidationResult {
  valid: boolean
  error?: string
}

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB
const MAX_COVER_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Validates a 3-character or 6-character hexadecimal color string.
 */
export function isValidHexColor(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim())
}

/**
 * Validates local image file selection for the avatar preview (Max 2 MB).
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Please select a JPG, PNG, or WebP image.',
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 2 MB.`,
    }
  }

  return { valid: true }
}

/**
 * Validates local image file selection for the cover banner (Max 5 MB).
 */
export function validateCoverImageFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Please select a JPG, PNG, or WebP image.',
    }
  }

  if (file.size > MAX_COVER_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 5 MB.`,
    }
  }

  return { valid: true }
}

/**
 * Verifies that the file begins with the standard PDF magic bytes (%PDF-).
 */
export async function hasPdfSignature(file: File): Promise<boolean> {
  if (!file || file.size < 5) return false
  try {
    const slice = file.slice(0, 5)
    const buffer = await slice.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    // %PDF- in ASCII is [0x25, 0x50, 0x44, 0x46, 0x2D]
    return (
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46 &&
      bytes[4] === 0x2d
    )
  } catch {
    return false
  }
}

/**
 * Validates local PDF resume selection for the CV simulation.
 */
export function validatePdfFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  const isPdfMime = file.type === 'application/pdf'
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf')

  if (!isPdfMime && !isPdfExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a PDF document (.pdf).',
    }
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 5 MB.`,
    }
  }

  return { valid: true }
}

/**
 * Converts a byte count into a readable string (e.g. 245 KB, 1.2 MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
