/**
 * Storage Service — file upload, replacement, deletion, and signed URL retrieval.
 *
 * Buckets: avatars | covers | cvs  (all private)
 *
 * Path convention:
 *   avatars/{userId}/avatar.jpg       (always overwrites — upsert)
 *   covers/{userId}/cover.jpg         (always overwrites — upsert)
 *   cvs/{userId}/{sanitized-filename} (overwrites on replace)
 *
 * Signed URLs are used for private bucket access in the editor.
 * Public visitors access files only through the public RLS storage policies
 * (which check is_published on the profiles table).
 */

import { supabase } from '../lib/supabase'

// ── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 100)
}

/** Returns a signed URL valid for 1 hour for private bucket access. */
async function getSignedUrl(bucket: string, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600)

  if (error || !data?.signedUrl) {
    console.error(`[storageService] getSignedUrl ${bucket}/${path}:`, error)
    return null
  }
  return data.signedUrl
}

/** Returns the public URL for a storage path. Only usable if bucket has public policy. */
function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// ── Avatar ────────────────────────────────────────────────────────────────────

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) {
    console.error('[storageService] uploadAvatar error:', error)
    return { url: null, path: null, error: error.message }
  }

  // Use signed URL so owner can see it immediately (private bucket)
  const url = await getSignedUrl('avatars', path)
  return { url, path, error: null }
}

export async function deleteAvatar(userId: string): Promise<void> {
  // Try to delete both common extensions
  await supabase.storage.from('avatars').remove([`${userId}/avatar.jpg`])
  await supabase.storage.from('avatars').remove([`${userId}/avatar.png`])
  await supabase.storage.from('avatars').remove([`${userId}/avatar.webp`])
}

/** Refresh a signed URL for an avatar storage path */
export async function getAvatarUrl(path: string): Promise<string | null> {
  return getSignedUrl('avatars', path)
}

// ── Cover banner image ────────────────────────────────────────────────────────

export async function uploadCoverImage(
  userId: string,
  file: File
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/cover.${ext}`

  const { error } = await supabase.storage
    .from('covers')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) {
    console.error('[storageService] uploadCoverImage error:', error)
    return { url: null, path: null, error: error.message }
  }

  const url = await getSignedUrl('covers', path)
  return { url, path, error: null }
}

export async function deleteCoverImage(userId: string): Promise<void> {
  await supabase.storage.from('covers').remove([`${userId}/cover.jpg`])
  await supabase.storage.from('covers').remove([`${userId}/cover.png`])
  await supabase.storage.from('covers').remove([`${userId}/cover.webp`])
}

export async function getCoverUrl(path: string): Promise<string | null> {
  return getSignedUrl('covers', path)
}

// ── CV / PDF ──────────────────────────────────────────────────────────────────

export async function uploadCv(
  userId: string,
  file: File
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  const safeName = sanitizeFilename(file.name)
  const path = `${userId}/${safeName}`

  const { error } = await supabase.storage
    .from('cvs')
    .upload(path, file, { upsert: true, contentType: 'application/pdf' })

  if (error) {
    console.error('[storageService] uploadCv error:', error)
    return { url: null, path: null, error: error.message }
  }

  const url = await getSignedUrl('cvs', path)
  return { url, path, error: null }
}

/** Remove all CV files for a user (called when CV is removed in editor). */
export async function deleteCv(userId: string, filename?: string): Promise<void> {
  if (filename) {
    const safeName = sanitizeFilename(filename)
    await supabase.storage.from('cvs').remove([`${userId}/${safeName}`])
  }
  // Also try to list and remove any remaining files for this user
  const { data: files } = await supabase.storage.from('cvs').list(userId)
  if (files && files.length > 0) {
    const paths = files.map((f) => `${userId}/${f.name}`)
    await supabase.storage.from('cvs').remove(paths)
  }
}

export async function getCvSignedUrl(path: string): Promise<string | null> {
  return getSignedUrl('cvs', path)
}

/** Get a public URL for a storage path — only use for published profile public access. */
export { getPublicUrl }
