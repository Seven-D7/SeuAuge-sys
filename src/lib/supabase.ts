import { createClient } from '@supabase/supabase-js'

// Validate required environment variables for production
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

// Check for missing environment variables in production
if (import.meta.env.PROD) {
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables for production: ${missingVars.join(', ')}`);
  }
}

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Demo mode detection
const isDemoMode = !import.meta.env.PROD && supabaseUrl === 'https://your-project-ref.supabase.co'

if (isDemoMode) {
  console.warn(
    "🔧 Supabase em modo DEMO - Para produção, configure as variáveis de ambiente reais"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export { isDemoMode as isSupabaseDemoMode }
