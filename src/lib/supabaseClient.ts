import { createClient } from '@supabase/supabase-js';

// Verificação de variáveis obrigatórias
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Cliente único do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Demo mode detection
export const isSupabaseDemoMode = !supabaseUrl || !supabaseAnonKey;

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
