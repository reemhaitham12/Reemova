// ==========================================
// 1. Social & Professional Links
// ==========================================

export type PlatformType =
  // Professional & Career (3)
  | 'linkedin'
  | 'indeed'
  | 'wuzzuf'
  // Developer & Programming (5)
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'stackoverflow'
  | 'codepen'
  // Design & Creative (3)
  | 'behance'
  | 'dribbble'
  | 'adobe-portfolio'
  // Content & Publishing (4)
  | 'youtube'
  | 'medium'
  | 'devto'
  | 'hashnode'
  // Academic & Research (4)
  | 'google-scholar'
  | 'researchgate'
  | 'orcid'
  | 'kaggle'
  // Social Media (5)
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'threads'
  | 'tiktok'
  // Communication (4)
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'email'
  // Personal (3)
  | 'portfolio'
  | 'personal-website'
  | 'custom'

export interface ProfileLink {
  id: string              // Unique identifier (client UUID)
  platform: PlatformType  // Platform identifier
  title: string           // Display label (e.g., "GitHub", "Personal Blog")
  url: string             // Validated destination URL
  order: number           // Display sort index
  customLabel?: string    // Optional user-specified label for custom/personal links
}

// ==========================================
// 2. Structured Theme Configuration
// ==========================================

export type ThemePresetId =
  | 'modern-indigo'
  | 'emerald-tech'
  | 'minimal-dark'
  | 'sunset-coral'
  | 'custom'

export interface ThemeColors {
  bannerGradientStart: string  // Hex color (e.g., "#4f46e5")
  bannerGradientEnd: string    // Hex color (e.g., "#7c3aed")
  accentColor: string          // Highlight & button color (e.g., "#4f46e5")
  cardBackgroundColor: string  // Card surface background (e.g., "#ffffff")
  pageBackgroundColor: string  // Surrounding page canvas (e.g., "#f8fafc")
  textColor: string            // Main text color (e.g., "#0f172a")
  textMutedColor: string       // Secondary/bio text color (e.g., "#64748b")
  borderRadius: 'sm' | 'md' | 'lg' | 'xl' // '0.375rem' | '0.5rem' | '0.75rem' | '1rem'
}

export interface ProfileThemeConfig {
  presetId: ThemePresetId      // Active preset or 'custom'
  colors: ThemeColors          // Concrete color values (never dynamic Tailwind class strings)
  // Backward compatibility fields for Phase 1 code
  cardBackgroundColor?: string
  pageBackgroundColor?: string
  accentColor?: string
  cardBorderRadius?: 'sm' | 'md' | 'lg' | 'xl'
}

// Static preset definitions for reliable client-side and public card rendering
export const THEME_PRESETS: Record<Exclude<ThemePresetId, 'custom'>, ThemeColors> = {
  'modern-indigo': {
    bannerGradientStart: '#4f46e5',
    bannerGradientEnd: '#7c3aed',
    accentColor: '#4f46e5',
    cardBackgroundColor: '#ffffff',
    pageBackgroundColor: '#f8fafc',
    textColor: '#0f172a',
    textMutedColor: '#64748b',
    borderRadius: 'lg',
  },
  'emerald-tech': {
    bannerGradientStart: '#059669',
    bannerGradientEnd: '#0d9488',
    accentColor: '#059669',
    cardBackgroundColor: '#ffffff',
    pageBackgroundColor: '#f0fdf4',
    textColor: '#0f172a',
    textMutedColor: '#64748b',
    borderRadius: 'lg',
  },
  'minimal-dark': {
    bannerGradientStart: '#1e293b',
    bannerGradientEnd: '#0f172a',
    accentColor: '#0f172a',
    cardBackgroundColor: '#ffffff',
    pageBackgroundColor: '#0f172a',
    textColor: '#0f172a',
    textMutedColor: '#64748b',
    borderRadius: 'lg',
  },
  'sunset-coral': {
    bannerGradientStart: '#f59e0b',
    bannerGradientEnd: '#e11d48',
    accentColor: '#e11d48',
    cardBackgroundColor: '#ffffff',
    pageBackgroundColor: '#fff1f2',
    textColor: '#0f172a',
    textMutedColor: '#64748b',
    borderRadius: 'lg',
  },
}

// ==========================================
// 3. Card CV Display Metadata (No File Objects)
// ==========================================

export interface CardCvDisplay {
  fileName: string             // e.g. "alex_morgan_resume.pdf"
  fileSizeFormatted?: string   // e.g. "240 KB"
  isLocalDraft?: boolean       // Whether this was loaded from local editor state
  fileUrl?: string             // Persistent remote URL only (e.g. Supabase Storage). Never a local blob URL.
}

// ==========================================
// 4. Cover Banner Configuration
// ==========================================

export type CoverBannerType = 'gradient' | 'solid' | 'image'

export interface CoverBannerConfig {
  type: CoverBannerType
  solidColor?: string          // Hex color for solid banner
  gradientStart?: string       // Hex start color for gradient banner
  gradientEnd?: string         // Hex end color for gradient banner
  imageUrl?: string | null     // Blob or remote URL for image banner
  positionX?: number           // Horizontal focal point (0% - 100%)
  positionY?: number           // Vertical focal point (0% - 100%)
  zoom?: number                // Zoom scale (1.0x - 2.5x)
  overlayOpacity?: number      // Text readability overlay opacity (0 - 1)
  overlayColor?: string        // Overlay tint color (hex)
}

// ==========================================
// 5. Core Visual Card Presentation Model
// ==========================================

/**
 * Pure visual data consumed by DigitalPersonalCard.
 * - avatarInitials is derived at runtime via getInitials(fullName).
 * - No File objects or upload assumptions.
 * - No publication status or account credentials.
 */
export interface CardDisplayData {
  fullName: string
  title: string
  bio: string
  avatarUrl?: string | null
  theme: ProfileThemeConfig
  banner?: CoverBannerConfig
  links: ProfileLink[]
  cv?: CardCvDisplay | null
}

// ==========================================
// 6. Database Entity Contract (For Future Supabase Mapping)
// ==========================================

export interface UserProfile {
  id: string
  userId: string
  username: string
  fullName: string
  title: string
  bio?: string
  avatarUrl?: string
  cvUrl?: string
  isPublished: boolean
  themeConfig: ProfileThemeConfig
  links: ProfileLink[]
  createdAt?: string
  updatedAt?: string
}
