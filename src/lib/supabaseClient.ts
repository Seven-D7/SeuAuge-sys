import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidCredentials = supabaseUrl && supabaseAnonKey && supabaseUrl.includes('.supabase.co');

export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createMockClient();

export const isSupabaseConfigured = hasValidCredentials;

// Helper function to create a mock client if credentials are not set
function createMockClient() {
  const mockError = new Error('Supabase não configurado.');
  console.warn(mockError.message);

  const mockAuth = {
    signInWithPassword: () => Promise.reject(mockError),
    signUp: () => Promise.reject(mockError),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  };

  const mockDb = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.reject(mockError),
      update: () => Promise.reject(mockError),
      delete: () => Promise.reject(mockError),
    }),
  };

  return {
    auth: mockAuth,
    from: mockDb.from,
  } as any;
}
