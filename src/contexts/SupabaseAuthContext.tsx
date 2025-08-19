// Alias para compatibilidade - redireciona para AuthContext principal
import { useAuth as useFirebaseAuth, AuthProvider as FirebaseAuthProvider } from './AuthContext';

// Re-exporta o hook de auth do Firebase como se fosse Supabase
export const useAuth = useFirebaseAuth;

// Re-exporta o provider do Firebase como se fosse Supabase
export const SupabaseAuthProvider = FirebaseAuthProvider;

// Re-exporta para compatibilidade com código existente
export default SupabaseAuthProvider;
