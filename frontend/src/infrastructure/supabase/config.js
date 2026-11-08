import { createClient } from '@supabase/supabase-js'
import { CONFIG } from '../../config/constants'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please create a .env file in the frontend directory with VITE_SUPABASE_URL and VITE_SUPABASE_KEY.'
  )
}

if (!supabaseKey) {
  throw new Error(
    'Missing VITE_SUPABASE_KEY environment variable. ' +
    'Please create a .env file in the frontend directory with VITE_SUPABASE_URL and VITE_SUPABASE_KEY.'
  )
}

function removeSupabaseAuthKeys(storage) {
  if (!storage) return

  const keys = []
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i)
    if (key && key.startsWith('sb-') && key.includes('auth-token')) {
      keys.push(key)
    }
  }
  keys.forEach((key) => storage.removeItem(key))
}

/**
 * Drop the tab session and any leftover localStorage token.
 * Logout must call this before navigating: signOut talks to the network first
 * and the login page restores whatever token is still stored.
 */
export function clearStoredAuthSession() {
  removeSupabaseAuthKeys(window.sessionStorage)
  removeSupabaseAuthKeys(window.localStorage)
  window.sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY)
}

// Supabase defaults to localStorage, which keeps a session after the tab closes.
// Only the legacy localStorage copy is removed here; the tab session stays.
// Accessing localStorage throws when the browser blocks site storage.
try {
  removeSupabaseAuthKeys(window.localStorage)
} catch {
  // nothing to clean up
}

// Create a single supabase client for interacting with your database.
// The session lasts for this tab only (including refresh), same as the previous login gate.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
