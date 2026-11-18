-- =============================================================================
-- Reemova — Initial Database Schema
-- Migration: 001_initial_schema.sql
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).
-- Do NOT run this more than once against the same database.
--
-- What this creates:
--   1. set_updated_at()       — trigger function for auto-updating updated_at
--   2. profiles               — one row per registered user
--   3. profile_links          — ordered social/professional links per profile
--   4. public_profiles (VIEW) — safe read-only public projection (no user_id)
--   5. Storage buckets policy helpers (see Section 5)
--   6. RLS policies on profiles and profile_links
-- =============================================================================


-- =============================================================================
-- SECTION 1: Shared trigger function
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================================
-- SECTION 2: profiles table
-- =============================================================================

CREATE TABLE public.profiles (

  -- ── Identity ──────────────────────────────────────────────────────────────
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to Supabase Auth. CASCADE deletes the profile when the auth
  -- account is deleted. UNIQUE enforces the 1:1 relationship.
  user_id         UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Permanent public URL slug (e.g. "alex" → /u/alex).
  -- Immutability is enforced below via a trigger.
  username        TEXT        NOT NULL UNIQUE,

  -- ── Basic profile information ─────────────────────────────────────────────
  full_name       TEXT        NOT NULL DEFAULT '',
  title           TEXT        NOT NULL DEFAULT '',
  bio             TEXT        NOT NULL DEFAULT '',

  -- ── Avatar (Supabase Storage path after upload; NULL until uploaded) ──────
  -- Example: "avatars/uuid/avatar.jpg"
  avatar_url      TEXT,

  -- ── Cover banner ─────────────────────────────────────────────────────────
  -- Visual settings stored as JSONB (mirrors CoverBannerConfig, minus imageUrl).
  -- Keys: type, solidColor, gradientStart, gradientEnd,
  --       positionX, positionY, zoom, overlayOpacity, overlayColor
  banner_config   JSONB       NOT NULL DEFAULT '{
    "type": "gradient",
    "gradientStart": "#4f46e5",
    "gradientEnd": "#7c3aed",
    "solidColor": "#4f46e5",
    "positionX": 50,
    "positionY": 50,
    "zoom": 1,
    "overlayOpacity": 0.2,
    "overlayColor": "#000000"
  }'::jsonb,

  -- Storage path for banner image. NULL when banner type is gradient or solid.
  -- Example: "covers/uuid/cover.jpg"
  banner_image_url TEXT,

  -- ── Theme configuration ───────────────────────────────────────────────────
  -- Mirrors ProfileThemeConfig: presetId + all ThemeColors fields.
  -- Keys: presetId, bannerGradientStart, bannerGradientEnd, accentColor,
  --       cardBackgroundColor, pageBackgroundColor, textColor,
  --       textMutedColor, borderRadius
  theme_config    JSONB       NOT NULL DEFAULT '{
    "presetId": "modern-indigo",
    "bannerGradientStart": "#4f46e5",
    "bannerGradientEnd": "#7c3aed",
    "accentColor": "#4f46e5",
    "cardBackgroundColor": "#ffffff",
    "pageBackgroundColor": "#f8fafc",
    "textColor": "#0f172a",
    "textMutedColor": "#64748b",
    "borderRadius": "lg"
  }'::jsonb,

  -- ── CV / Resume ───────────────────────────────────────────────────────────
  -- Storage path after upload. NULL until a CV is uploaded.
  -- Example: "cvs/uuid/my_resume.pdf"
  cv_url              TEXT,
  -- Original filename preserved for display (e.g. "alex_morgan_cv.pdf")
  cv_file_name        TEXT,
  -- Raw byte count. Client formats this via formatFileSize() — not stored formatted.
  cv_file_size_bytes  INTEGER     CHECK (cv_file_size_bytes IS NULL OR cv_file_size_bytes > 0),

  -- ── Publication control ───────────────────────────────────────────────────
  -- false = draft (only the owner can see it via RLS)
  -- true  = published (public_profiles view exposes it)
  is_published    BOOLEAN     NOT NULL DEFAULT false,

  -- ── Timestamps ────────────────────────────────────────────────────────────
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()

);

-- Username format: lowercase letters, digits, hyphens.
-- Min 3 chars, max 30 chars. Must start and end with a letter or digit.
ALTER TABLE public.profiles
  ADD CONSTRAINT username_format
  CHECK (username ~ '^[a-z0-9][a-z0-9\-]{1,28}[a-z0-9]$');

-- Fast public profile lookup by username (used by /u/:username route)
CREATE INDEX idx_profiles_username ON public.profiles (username);
-- Owner lookup by user_id
CREATE INDEX idx_profiles_user_id  ON public.profiles (user_id);

-- Auto-update updated_at on every change
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Username immutability trigger ─────────────────────────────────────────
-- Prevents any UPDATE from changing the username column after initial creation.
CREATE OR REPLACE FUNCTION public.prevent_username_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.username <> OLD.username THEN
    RAISE EXCEPTION
      'Username cannot be changed after account creation. '
      'Current username: %. Attempted new username: %.',
      OLD.username, NEW.username
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_username_immutability
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_username_change();


-- =============================================================================
-- SECTION 3: profile_links table
-- =============================================================================

CREATE TABLE public.profile_links (

  -- ── Identity ──────────────────────────────────────────────────────────────
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Cascading delete: removing a profile removes all its links automatically.
  profile_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- One of the 31 PlatformType values defined in src/types/index.ts
  platform        TEXT        NOT NULL,

  -- Display label shown on the card (e.g. "GitHub", "My Portfolio")
  title           TEXT        NOT NULL DEFAULT '',

  -- Validated destination URL (https://, mailto:, tel:, wa.me/, t.me/, etc.)
  url             TEXT        NOT NULL DEFAULT '',

  -- Sort position (1-indexed). Mirrors ProfileLink.order.
  -- Named display_order to avoid conflict with the SQL reserved keyword ORDER.
  display_order   INTEGER     NOT NULL DEFAULT 1 CHECK (display_order >= 1),

  -- Free-form label for platform = 'custom' or personal links.
  -- NULL for standard platforms.
  custom_label    TEXT,

  -- ── Timestamps ────────────────────────────────────────────────────────────
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()

);

-- Enforce only the 31 known platform values from PlatformType
ALTER TABLE public.profile_links
  ADD CONSTRAINT valid_platform CHECK (
    platform IN (
      'linkedin', 'indeed', 'wuzzuf',
      'github', 'gitlab', 'bitbucket', 'stackoverflow', 'codepen',
      'behance', 'dribbble', 'adobe-portfolio',
      'youtube', 'medium', 'devto', 'hashnode',
      'google-scholar', 'researchgate', 'orcid', 'kaggle',
      'facebook', 'instagram', 'twitter', 'threads', 'tiktok',
      'whatsapp', 'telegram', 'discord', 'email',
      'portfolio', 'personal-website', 'custom'
    )
  );

-- Fast per-profile link queries, pre-sorted by display_order
CREATE INDEX idx_profile_links_profile_id
  ON public.profile_links (profile_id, display_order ASC);

-- Auto-update updated_at
CREATE TRIGGER profile_links_updated_at
  BEFORE UPDATE ON public.profile_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =============================================================================
-- SECTION 4: public_profiles VIEW
--
-- This view is what public visitors (and the /u/:username page) read.
-- It deliberately excludes: user_id, is_published, created_at, updated_at.
-- RLS on the underlying tables still applies — but as an extra safety measure,
-- this view only surfaces rows where is_published = true.
-- =============================================================================

CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT
    p.username,
    p.full_name,
    p.title,
    p.bio,
    p.avatar_url,
    p.banner_image_url,
    p.banner_config,
    p.theme_config,
    p.cv_url,
    p.cv_file_name,
    p.cv_file_size_bytes
  FROM public.profiles p
  WHERE p.is_published = true;

-- Grant SELECT on the view to the anon role (unauthenticated visitors)
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Also grant SELECT on profiles/profile_links to authenticated (RLS controls actual rows)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_links TO authenticated;

-- Allow anon to SELECT from profile_links (RLS policy restricts to published profiles)
GRANT SELECT ON public.profile_links TO anon;


-- =============================================================================
-- SECTION 5: Row Level Security — profiles
-- =============================================================================

ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_links ENABLE ROW LEVEL SECURITY;

-- ── profiles policies ────────────────────────────────────────────────────────

-- Public read: any visitor can read a published profile row.
-- user_id is not in the public_profiles view, but this policy allows the
-- underlying table to be used by the view through its security context.
CREATE POLICY "Public can read published profiles"
  ON public.profiles
  FOR SELECT
  USING (is_published = true);

-- Owner read: the authenticated owner can always read their own row,
-- even when is_published = false (draft mode).
CREATE POLICY "Owners can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Owner insert: a logged-in user can create exactly one profile row
-- (enforced by the UNIQUE constraint on user_id) for themselves only.
CREATE POLICY "Owners can create own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Owner update: the owner can update their own profile.
-- username changes are separately blocked by the trigger.
CREATE POLICY "Owners can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner delete: the owner can delete their own profile.
-- Cascade deletes all their links, storage references remain (cleaned up by app).
CREATE POLICY "Owners can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- =============================================================================
-- SECTION 6: Row Level Security — profile_links
-- =============================================================================

-- Public read: any visitor can read links belonging to a published profile.
CREATE POLICY "Public can read links of published profiles"
  ON public.profile_links
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_links.profile_id
        AND p.is_published = true
    )
  );

-- Owner read: the authenticated owner can always read their own links.
CREATE POLICY "Owners can read own links"
  ON public.profile_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_links.profile_id
        AND p.user_id = auth.uid()
    )
  );

-- Owner insert: the owner can add links only to their own profile.
CREATE POLICY "Owners can insert own links"
  ON public.profile_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_links.profile_id
        AND p.user_id = auth.uid()
    )
  );

-- Owner update: the owner can update only their own links.
CREATE POLICY "Owners can update own links"
  ON public.profile_links
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_links.profile_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_links.profile_id
        AND p.user_id = auth.uid()
    )
  );

-- Owner delete: the owner can delete only their own links.
CREATE POLICY "Owners can delete own links"
  ON public.profile_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_links.profile_id
        AND p.user_id = auth.uid()
    )
  );


-- =============================================================================
-- SECTION 7: Storage bucket policies
--
-- Storage buckets must be created manually in the Supabase dashboard first
-- (Storage → New bucket). The SQL below sets up the access policies.
--
-- Buckets to create (all PRIVATE — not public):
--   - avatars   (max 2 MB, image/jpeg, image/png, image/webp)
--   - covers    (max 5 MB, image/jpeg, image/png, image/webp)
--   - cvs       (max 5 MB, application/pdf)
--
-- Path convention:
--   avatars/{user_id}/avatar.jpg
--   covers/{user_id}/cover.jpg
--   cvs/{user_id}/{filename}.pdf
-- =============================================================================

-- ── avatars bucket ───────────────────────────────────────────────────────────

-- Owners can upload and replace their own avatar
CREATE POLICY "Owners can upload own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can delete own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public can download avatars only for published profiles
CREATE POLICY "Public can download avatars of published profiles"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id::text = (storage.foldername(name))[1]
        AND p.is_published = true
    )
  );

-- Owners can always download their own avatar (even unpublished)
CREATE POLICY "Owners can download own avatar"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── covers bucket ─────────────────────────────────────────────────────────────

CREATE POLICY "Owners can upload own cover"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can update own cover"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can delete own cover"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can download covers of published profiles"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'covers'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id::text = (storage.foldername(name))[1]
        AND p.is_published = true
    )
  );

CREATE POLICY "Owners can download own cover"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── cvs bucket ────────────────────────────────────────────────────────────────

CREATE POLICY "Owners can upload own cv"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can update own cv"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can delete own cv"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can download cvs of published profiles"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'cvs'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id::text = (storage.foldername(name))[1]
        AND p.is_published = true
    )
  );

CREATE POLICY "Owners can download own cv"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
