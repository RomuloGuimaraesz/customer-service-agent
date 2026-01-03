import { createClient } from '@supabase/supabase-js'

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

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)
