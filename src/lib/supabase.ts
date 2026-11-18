/**
 * Supabase client — browser-safe, anon key only.
 *
 * The service-role key is NEVER used here. All security is enforced by
 * Row Level Security policies on the Supabase side.
 *
 * Environment variables are read from .env.local (Vite prefix: VITE_).
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Reemova] Missing Supabase environment variables. ' +
      'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage so users remain logged in after refresh
    persistSession: true,
    // Automatically refresh the access token before it expires
    autoRefreshToken: true,
    // Detect and restore session from URL hash after email confirmation redirects
    detectSessionInUrl: true,
  },
})
