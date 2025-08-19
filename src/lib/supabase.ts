// Supabase stub - projeto usa Firebase como principal
// Este arquivo é mantido para compatibilidade com código existente

console.warn('⚠️ Modo Firebase ativo - Supabase desabilitado temporariamente');

// Mock do cliente Supabase para evitar erros
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase não configurado') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase não configurado') }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null })
  })
};

// Demo mode sempre ativo quando Supabase não está configurado
export const isSupabaseDemoMode = true;
