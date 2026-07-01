import { createClient } from '@supabase/supabase-js'

// Safe environment variable access for both Next.js and Vite
const supabaseUrl = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 
  'https://placeholder.supabase.co';

const supabaseAnonKey = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
  'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
