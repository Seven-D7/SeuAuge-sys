import { createClient } from '@supabase/supabase-js';

// Verificação de variáveis obrigatórias
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Cliente único do Supabase com configurações otimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-application-name': 'healthflix',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 10000),
  },
  db: {
    schema: 'public',
  },
});

// Helper function to add timeout to Supabase operations
export const withTimeout = <T>(
  promise: Promise<T>, 
  timeoutMs: number = 30000, 
  operation: string = 'Operation'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operation} timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};

// Enhanced auth operations with timeout
export const authOperations = {
  async signInWithPassword(email: string, password: string) {
    return withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      15000,
      'Login'
    );
  },

  async signUp(email: string, password: string, options?: any) {
    return withTimeout(
      supabase.auth.signUp({ email, password, options }),
      20000,
      'Registration'
    );
  },

  async signOut() {
    return withTimeout(
      supabase.auth.signOut(),
      10000,
      'Logout'
    );
  },

  async getSession() {
    return withTimeout(
      supabase.auth.getSession(),
      10000,
      'Get Session'
    );
  },

  async getUser() {
    return withTimeout(
      supabase.auth.getUser(),
      10000,
      'Get User'
    );
  },

  async resetPasswordForEmail(email: string) {
    return withTimeout(
      supabase.auth.resetPasswordForEmail(email),
      15000,
      'Password Reset'
    );
  },
};

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
