import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Get environment variables with proper validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://brrxycurclfueamhiico.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycnh5Y3VyY2xmdWVhbWhpaWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTM4MzUsImV4cCI6MjA3NDkyOTgzNX0.z1HgDrMgAajdwWSQtbov6MEB6fbwOtEAJt6OFom_r_I'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycnh5Y3VyY2xmdWVhbWhpaWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM1MzgzNSwiZXhwIjoyMDc0OTI5ODM1fQ.H1np_swN6MIertdy42tfqPw4-n_hPNXPO833CpkcAwQ'

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables. Please check your .env.local file.')
}

if (!supabaseUrl.startsWith('http')) {
  throw new Error('Invalid Supabase URL format. Must start with http:// or https://')
}

// Client-side Supabase client with extended session settings
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)

// Server-side Supabase client
export const createServerClient = () => {
  return createClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

// Admin client with service role key
export const createAdminClient = () => {
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

