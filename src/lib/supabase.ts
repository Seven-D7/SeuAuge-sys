import { createClient } from '@supabase/supabase-js';

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

// Production Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Development fallback configuration
const developmentUrl = "https://demo-project.supabase.co";
const developmentKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo";

// Use production config if available, otherwise development config
const finalUrl = import.meta.env.PROD || supabaseUrl ? supabaseUrl : developmentUrl;
const finalKey = import.meta.env.PROD || supabaseAnonKey ? supabaseAnonKey : developmentKey;

// Demo mode detection
export const isSupabaseDemoMode = !import.meta.env.PROD && finalUrl === developmentUrl;

if (isSupabaseDemoMode) {
  console.warn(
    "🔧 Supabase em modo DEMO - Para produção, configure as variáveis de ambiente reais",
  );
}

// Create Supabase client
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types for better type safety
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan?: string | null;
  role?: 'user' | 'admin' | 'moderator';
  birthdate?: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export default supabase;
