// Re-export do cliente único do Supabase
export { supabase, isSupabaseDemoMode, type UserProfile, type Database } from './supabaseClient';

if (isSupabaseDemoMode && import.meta.env.DEV) {
  console.warn(
    "🔧 Supabase em modo DEMO - Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para produção"
  );
}

export default supabase;
