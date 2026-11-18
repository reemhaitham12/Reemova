/**
 * Supabase Database TypeScript types.
 *
 * These types mirror the SQL schema exactly and are used to provide
 * type-safe queries via the Supabase client.
 *
 * Generated from the proposed migration in supabase/migrations/001_initial_schema.sql
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ── ThemeConfig stored as JSONB ─────────────────────────────────────────────
export interface DbThemeConfig {
  presetId: 'modern-indigo' | 'emerald-tech' | 'minimal-dark' | 'sunset-coral' | 'custom'
  bannerGradientStart: string
  bannerGradientEnd: string
  accentColor: string
  cardBackgroundColor: string
  pageBackgroundColor: string
  textColor: string
  textMutedColor: string
  borderRadius: 'sm' | 'md' | 'lg' | 'xl'
}

// ── BannerConfig stored as JSONB (imageUrl excluded — stored in banner_image_url column) ──
export interface DbBannerConfig {
  type: 'gradient' | 'solid' | 'image'
  solidColor?: string
  gradientStart?: string
  gradientEnd?: string
  positionX?: number
  positionY?: number
  zoom?: number
  overlayOpacity?: number
  overlayColor?: string
}

// ── Database row types ──────────────────────────────────────────────────────

export interface ProfileRow {
  id: string
  user_id: string
  username: string
  full_name: string
  title: string
  bio: string
  avatar_url: string | null
  banner_image_url: string | null
  banner_config: DbBannerConfig
  theme_config: DbThemeConfig
  cv_url: string | null
  cv_file_name: string | null
  cv_file_size_bytes: number | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ProfileLinkRow {
  id: string
  profile_id: string
  platform: string
  title: string
  url: string
  display_order: number
  custom_label: string | null
  created_at: string
  updated_at: string
}

// ── Database interface for the Supabase typed client ───────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<ProfileRow, 'id' | 'user_id' | 'username' | 'created_at'>>
      }
      profile_links: {
        Row: ProfileLinkRow
        Insert: Omit<ProfileLinkRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<ProfileLinkRow, 'id' | 'profile_id' | 'created_at'>>
      }
    }
    Views: {
      public_profiles: {
        Row: {
          username: string
          full_name: string
          title: string
          bio: string
          avatar_url: string | null
          banner_image_url: string | null
          banner_config: DbBannerConfig
          theme_config: DbThemeConfig
          cv_url: string | null
          cv_file_name: string | null
          cv_file_size_bytes: number | null
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
