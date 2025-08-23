import { createClient } from '@supabase/supabase-js';

// Verificação de variáveis obrigatórias
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development mode with fake credentials
const isDevelopment = import.meta.env.DEV;
const isFakeCredentials = supabaseUrl?.includes('temp-project') ||
  supabaseUrl === 'COLE_SUA_URL_AQUI' ||
  supabaseAnonKey === 'COLE_SUA_CHAVE_AQUI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Mock Supabase client for development
const createMockSupabaseClient = () => ({
  auth: {
    signInWithPassword: mockAuthOperations.signInWithPassword,
    signUp: mockAuthOperations.signUp,
    signOut: mockAuthOperations.signOut,
    getSession: mockAuthOperations.getSession,
    getUser: mockAuthOperations.getUser,
    resetPasswordForEmail: mockAuthOperations.resetPasswordForEmail,
    resend: mockAuthOperations.resendConfirmation,
    onAuthStateChange: (callback: any) => {
      console.log('🔧 Development mode: Mock auth state change listener');
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => {
          console.log('🔧 Development mode: Mock DB select from', table);
          return Promise.resolve({ data: null, error: null });
        }
      })
    }),
    insert: (data: any) => {
      console.log('🔧 Development mode: Mock DB insert to', table, data);
      return Promise.resolve({ data, error: null });
    },
    update: (data: any) => ({
      eq: () => {
        console.log('🔧 Development mode: Mock DB update in', table, data);
        return Promise.resolve({ data, error: null });
      }
    })
  })
});

// Cliente único do Supabase com configurações otimizadas
export const supabase = isFakeCredentials && isDevelopment ?
  createMockSupabaseClient() as any :
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      // Configure URLs for email verification and password reset
      redirectTo: `${window.location.origin}/auth/confirm`,
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

// Mock auth for development mode
const createMockUser = (email: string, name: string = 'Dev User') => ({
  id: 'dev-user-123',
  email,
  user_metadata: { name },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const mockAuthOperations = {
  async signInWithPassword(email: string, password: string) {
    console.log('🔧 Development mode: Mock login for', email);
    return {
      data: {
        user: createMockUser(email),
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          user: createMockUser(email),
        }
      },
      error: null
    };
  },

  async signUp(email: string, password: string, options?: any) {
    console.log('🔧 Development mode: Mock signup for', email);
    const user = createMockUser(email, options?.data?.name);
    return {
      data: { user, session: null },
      error: null
    };
  },

  async signOut() {
    console.log('🔧 Development mode: Mock logout');
    return { error: null };
  },

  async getSession() {
    console.log('🔧 Development mode: Mock get session');
    return {
      data: { session: null },
      error: null
    };
  },

  async getUser() {
    console.log('🔧 Development mode: Mock get user');
    return {
      data: { user: null },
      error: null
    };
  },

  async resetPasswordForEmail(email: string, redirectTo?: string) {
    console.log('🔧 Development mode: Mock password reset for', email);
    return { data: {}, error: null };
  },

  async resendConfirmation(email: string, redirectTo?: string) {
    console.log('🔧 Development mode: Mock resend confirmation for', email);
    return { data: {}, error: null };
  },
};

// Enhanced auth operations with timeout
export const authOperations = isFakeCredentials && isDevelopment ? mockAuthOperations : {
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

  async resetPasswordForEmail(email: string, redirectTo?: string) {
    const finalRedirectTo = redirectTo || `${window.location.origin}/auth/reset-password`;
    return withTimeout(
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: finalRedirectTo,
      }),
      15000,
      'Password Reset'
    );
  },

  async resendConfirmation(email: string, redirectTo?: string) {
    const finalRedirectTo = redirectTo || `${window.location.origin}/auth/confirm`;
    return withTimeout(
      supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: finalRedirectTo,
        }
      }),
      15000,
      'Resend Confirmation'
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
