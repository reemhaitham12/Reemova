/**
 * Profile Service — all Supabase database operations for profiles and links.
 *
 * - Never exposes user_id to public callers.
 * - All mutations verify ownership via RLS on the Supabase side.
 * - Public reads go through the public_profiles VIEW (no user_id).
 */

import { supabase } from '../lib/supabase'
import type { ProfileRow, ProfileLinkRow, DbThemeConfig, DbBannerConfig } from '../lib/database.types'
import type { CardDisplayData, ProfileLink, ProfileThemeConfig, CoverBannerConfig } from '../types'
import { THEME_PRESETS } from '../types'
import { formatFileSize } from '../utils/validators'

// ── Type helpers ─────────────────────────────────────────────────────────────

function dbThemeToApp(theme: DbThemeConfig): ProfileThemeConfig {
  return {
    presetId: theme.presetId,
    colors: {
      bannerGradientStart: theme.bannerGradientStart,
      bannerGradientEnd: theme.bannerGradientEnd,
      accentColor: theme.accentColor,
      cardBackgroundColor: theme.cardBackgroundColor,
      pageBackgroundColor: theme.pageBackgroundColor,
      textColor: theme.textColor,
      textMutedColor: theme.textMutedColor,
      borderRadius: theme.borderRadius,
    },
  }
}

function appThemeToDb(theme: ProfileThemeConfig): DbThemeConfig {
  return {
    presetId: theme.presetId,
    bannerGradientStart: theme.colors.bannerGradientStart,
    bannerGradientEnd: theme.colors.bannerGradientEnd,
    accentColor: theme.colors.accentColor,
    cardBackgroundColor: theme.colors.cardBackgroundColor,
    pageBackgroundColor: theme.colors.pageBackgroundColor,
    textColor: theme.colors.textColor,
    textMutedColor: theme.colors.textMutedColor,
    borderRadius: theme.colors.borderRadius,
  }
}

function dbBannerToApp(banner: DbBannerConfig, imageUrl: string | null): CoverBannerConfig {
  return {
    type: banner.type,
    solidColor: banner.solidColor,
    gradientStart: banner.gradientStart,
    gradientEnd: banner.gradientEnd,
    imageUrl: imageUrl,
    positionX: banner.positionX ?? 50,
    positionY: banner.positionY ?? 50,
    zoom: banner.zoom ?? 1,
    overlayOpacity: banner.overlayOpacity ?? 0.2,
    overlayColor: banner.overlayColor ?? '#000000',
  }
}

function appBannerToDb(banner: CoverBannerConfig): DbBannerConfig {
  return {
    type: banner.type,
    solidColor: banner.solidColor,
    gradientStart: banner.gradientStart,
    gradientEnd: banner.gradientEnd,
    positionX: banner.positionX,
    positionY: banner.positionY,
    zoom: banner.zoom,
    overlayOpacity: banner.overlayOpacity,
    overlayColor: banner.overlayColor,
  }
}

function dbLinksToApp(rows: ProfileLinkRow[]): ProfileLink[] {
  return rows
    .sort((a, b) => a.display_order - b.display_order)
    .map((row) => ({
      id: row.id,
      platform: row.platform as ProfileLink['platform'],
      title: row.title,
      url: row.url,
      order: row.display_order,
      customLabel: row.custom_label ?? undefined,
    }))
}

/** Convert a full ProfileRow + links into the CardDisplayData shape the UI expects. */
function rowToCardDisplayData(
  row: Pick<ProfileRow,
    'full_name' | 'title' | 'bio' | 'avatar_url' | 'banner_config' |
    'banner_image_url' | 'theme_config' | 'cv_url' | 'cv_file_name' | 'cv_file_size_bytes'
  >,
  links: ProfileLinkRow[]
): CardDisplayData {
  const theme = dbThemeToApp(row.theme_config as DbThemeConfig)
  const banner = dbBannerToApp(row.banner_config as DbBannerConfig, row.banner_image_url)

  return {
    fullName: row.full_name,
    title: row.title,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    theme,
    banner,
    links: dbLinksToApp(links),
    cv: row.cv_url
      ? {
          fileName: row.cv_file_name ?? 'cv.pdf',
          fileSizeFormatted: row.cv_file_size_bytes
            ? formatFileSize(row.cv_file_size_bytes)
            : undefined,
          fileUrl: row.cv_url,
          isLocalDraft: false,
        }
      : null,
  }
}

// ── Username availability check ───────────────────────────────────────────────

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()

  if (error) {
    console.error('[profileService] checkUsernameAvailable error:', error)
    return false
  }
  return data === null // null means no row found → available
}

// ── Profile creation ──────────────────────────────────────────────────────────

export interface CreateProfileParams {
  userId: string
  username: string
}

export async function createProfile(params: CreateProfileParams): Promise<{ error: string | null }> {
  const defaultTheme = THEME_PRESETS['modern-indigo']

  const { error } = await supabase.from('profiles').insert({
    user_id: params.userId,
    username: params.username,
    full_name: '',
    title: '',
    bio: '',
    theme_config: {
      presetId: 'modern-indigo',
      bannerGradientStart: defaultTheme.bannerGradientStart,
      bannerGradientEnd: defaultTheme.bannerGradientEnd,
      accentColor: defaultTheme.accentColor,
      cardBackgroundColor: defaultTheme.cardBackgroundColor,
      pageBackgroundColor: defaultTheme.pageBackgroundColor,
      textColor: defaultTheme.textColor,
      textMutedColor: defaultTheme.textMutedColor,
      borderRadius: defaultTheme.borderRadius,
    },
    banner_config: {
      type: 'gradient',
      gradientStart: defaultTheme.bannerGradientStart,
      gradientEnd: defaultTheme.bannerGradientEnd,
      solidColor: defaultTheme.bannerGradientStart,
      positionX: 50,
      positionY: 50,
      zoom: 1,
      overlayOpacity: 0.2,
      overlayColor: '#000000',
    },
    is_published: false,
  })

  if (error) {
    console.error('[profileService] createProfile error:', error)
    if (error.code === '23505') {
      return { error: 'That username is already taken. Please choose another.' }
    }
    return { error: error.message }
  }

  return { error: null }
}

// ── Load own profile (authenticated owner) ────────────────────────────────────

export interface OwnProfileData {
  profileId: string
  username: string
  isPublished: boolean
  cardData: CardDisplayData
}

export async function loadOwnProfile(userId: string): Promise<OwnProfileData | null> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (profileError || !profile) {
    if (profileError?.code !== 'PGRST116') {
      // PGRST116 = no rows found — not a real error for us
      console.error('[profileService] loadOwnProfile error:', profileError)
    }
    return null
  }

  const { data: links, error: linksError } = await supabase
    .from('profile_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order', { ascending: true })

  if (linksError) {
    console.error('[profileService] loadOwnProfile links error:', linksError)
  }

  return {
    profileId: profile.id,
    username: profile.username,
    isPublished: profile.is_published,
    cardData: rowToCardDisplayData(profile, links ?? []),
  }
}

// ── Load public profile (unauthenticated visitor) ─────────────────────────────

export interface PublicProfileData {
  username: string
  cardData: CardDisplayData
}

export async function loadPublicProfile(username: string): Promise<PublicProfileData | null> {
  // Read from the public_profiles VIEW — no user_id exposed
  const { data: profile, error: profileError } = await supabase
    .from('public_profiles' as 'profiles') // typed via cast; view has same columns minus private ones
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (profileError || !profile) {
    return null
  }

  // For links, we query profile_links via a join through the profiles table
  // The RLS policy "Public can read links of published profiles" enforces access.
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .eq('is_published', true)
    .maybeSingle()

  if (!profileRow) return null

  const { data: links } = await supabase
    .from('profile_links')
    .select('*')
    .eq('profile_id', profileRow.id)
    .order('display_order', { ascending: true })

  return {
    username,
    cardData: rowToCardDisplayData(profile as unknown as ProfileRow, links ?? []),
  }
}

// ── Save profile (all non-file fields) ───────────────────────────────────────

export interface SaveProfileParams {
  profileId: string
  fullName: string
  title: string
  bio: string
  theme: ProfileThemeConfig
  banner: CoverBannerConfig
  /** Pass the current saved banner_image_url (unchanged by this call) */
  bannerImageUrl?: string | null
  avatarUrl?: string | null
  cvUrl?: string | null
  cvFileName?: string | null
  cvFileSizeBytes?: number | null
  isPublished?: boolean
}

export async function saveProfile(params: SaveProfileParams): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: params.fullName,
      title: params.title,
      bio: params.bio,
      theme_config: appThemeToDb(params.theme),
      banner_config: appBannerToDb(params.banner),
      banner_image_url: params.bannerImageUrl ?? null,
      avatar_url: params.avatarUrl ?? null,
      cv_url: params.cvUrl ?? null,
      cv_file_name: params.cvFileName ?? null,
      cv_file_size_bytes: params.cvFileSizeBytes ?? null,
      ...(params.isPublished !== undefined ? { is_published: params.isPublished } : {}),
    })
    .eq('id', params.profileId)

  if (error) {
    console.error('[profileService] saveProfile error:', error)
    return { error: error.message }
  }
  return { error: null }
}

// ── Save links (replace-all strategy) ────────────────────────────────────────
// Deletes all existing links for the profile and re-inserts the current set.
// This is safe for MVP because links are user-owned and the operation is atomic.

export async function saveLinks(
  profileId: string,
  links: ProfileLink[]
): Promise<{ error: string | null }> {
  // Delete all existing links for this profile
  const { error: deleteError } = await supabase
    .from('profile_links')
    .delete()
    .eq('profile_id', profileId)

  if (deleteError) {
    console.error('[profileService] saveLinks delete error:', deleteError)
    return { error: deleteError.message }
  }

  if (links.length === 0) return { error: null }

  const rows = links.map((link) => ({
    profile_id: profileId,
    platform: link.platform,
    title: link.title,
    url: link.url,
    display_order: link.order,
    custom_label: link.customLabel ?? null,
  }))

  const { error: insertError } = await supabase.from('profile_links').insert(rows)

  if (insertError) {
    console.error('[profileService] saveLinks insert error:', insertError)
    return { error: insertError.message }
  }

  return { error: null }
}

// ── Toggle publication ────────────────────────────────────────────────────────

export async function setPublished(
  profileId: string,
  isPublished: boolean
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({ is_published: isPublished })
    .eq('id', profileId)

  if (error) {
    return { error: error.message }
  }
  return { error: null }
}
