import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please add it to your .env.local file.');
}

// if (!supabaseAnonKey) {
//   throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please add it to your .env.local file.');
// }

if (!supabaseServiceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY environment variable. Please add it to your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey) ;