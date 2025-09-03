import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, authOperations } from '../lib/supabase';
import { createUserDocument, getUserData } from '../services/user';
import { initializeActivityTracking } from '../services/activity';
import { initializeSyncSystem } from '../services/sync';
import { validateEmail, validatePassword, validateName, validateBirthdate, sanitizeInput } from '../lib/validation';
import toast from 'react-hot-toast';

export interface AuthUser extends User {
  name?: string;
  avatar?: string;
  plan?: string | null;
  role?: 'user' | 'admin' | 'moderator';
  isAdmin?: boolean;
  isPremium?: boolean;
  birthdate?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, birthdate?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { name?: string; email?: string; avatar_url?: string; birthdate?: string }) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced error handling
  const handleAuthError = (error: any): string => {
    console.error('Auth error:', error);
    
    const message = error?.message || '';
    
    // Network and connection errors
    if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('fetch')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente';
    }
    
    if (message.includes('timeout') || message.includes('Timeout')) {
      return 'Conexão lenta. Tente novamente';
    }

    // Supabase specific errors
    if (message.includes('Invalid login credentials')) {
      return 'Email ou senha incorretos';
    }
    
    if (message.includes('Email not confirmed')) {
      return 'Email não confirmado. Verifique sua caixa de entrada';
    }
    
    if (message.includes('User already registered')) {
      return 'Este email já está em uso';
    }
    
    if (message.includes('Password should be at least')) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (message.includes('Email rate limit')) {
      return 'Muitas tentativas. Aguarde alguns minutos';
    }
    
    if (message.includes('Invalid email')) {
      return 'Formato de email inválido';
    }

    if (message.includes('Supabase not configured')) {
      return 'Sistema de autenticação não configurado';
    }

    // Generic fallback
    return 'Erro de autenticação. Tente novamente';
  };

  // Enhanced user data loading
  const loadUserData = async (supabaseUser: User): Promise<AuthUser> => {
    try {
      const userData = await getUserData(supabaseUser.id);
      
      const authUser: AuthUser = {
        ...supabaseUser,
        name: userData?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
        avatar: userData?.avatar_url || supabaseUser.user_metadata?.avatar_url,
        plan: userData?.plan || null,
        role: userData?.role || 'user',
        isAdmin: userData?.role === 'admin',
        isPremium: !!(userData?.plan && ['B', 'C', 'D'].includes(userData.plan)),
        birthdate: userData?.birthdate,
      };

      return authUser;
    } catch (error) {
      console.warn('Erro ao carregar dados do usuário:', error);
      // Return basic user data if profile loading fails
      return {
        ...supabaseUser,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
        avatar: supabaseUser.user_metadata?.avatar_url,
        plan: null,
        role: 'user',
        isAdmin: false,
        isPremium: false,
      };
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await authOperations.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setError(handleAuthError(error));
            setUser(null);
          }
          return;
        }

        if (session?.user && mounted) {
          const authUser = await loadUserData(session.user);
          setUser(authUser);
          
          // Initialize background services
          try {
            await initializeActivityTracking();
            await initializeSyncSystem();
          } catch (serviceError) {
            console.warn('Erro ao inicializar serviços:', serviceError);
          }
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError(handleAuthError(error));
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event);

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser = await loadUserData(session.user);
          setUser(authUser);
          setError(null);
          
          // Initialize services for new session
          try {
            await initializeActivityTracking();
            await initializeSyncSystem();
          } catch (serviceError) {
            console.warn('Erro ao inicializar serviços:', serviceError);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
          // Clear any cached data
          localStorage.removeItem('user-preferences');
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Update user data on token refresh
          const authUser = await loadUserData(session.user);
          setUser(authUser);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(handleAuthError(error));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || 'Email inválido');
    }

    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authOperations.signInWithPassword(
        email.trim().toLowerCase(),
        password
      );

      if (error) throw error;

      if (data.user) {
        const authUser = await loadUserData(data.user);
        setUser(authUser);
        
        // Initialize services
        try {
          await initializeActivityTracking();
          await initializeSyncSystem();
        } catch (serviceError) {
          console.warn('Erro ao inicializar serviços:', serviceError);
        }

        toast.success('Login realizado com sucesso!', { duration: 3000 });
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, birthdate?: string): Promise<void> => {
    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || 'Email inválido');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0] || 'Senha inválida');
    }

    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.error || 'Nome inválido');
    }

    if (birthdate) {
      const birthdateValidation = validateBirthdate(birthdate);
      if (!birthdateValidation.isValid) {
        throw new Error(birthdateValidation.error || 'Data de nascimento inválida');
      }
    }

    setLoading(true);
    setError(null);

    try {
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = email.trim().toLowerCase();

      const { data, error } = await authOperations.signUp(sanitizedEmail, password, {
        data: {
          name: sanitizedName,
          birthdate: birthdate || null,
          role: 'user',
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile document
        try {
          await createUserDocument({
            uid: data.user.id,
            name: sanitizedName,
            email: sanitizedEmail,
            birthdate: birthdate || null,
            role: 'user',
          });
        } catch (profileError) {
          console.warn('Erro ao criar perfil:', profileError);
          // Continue even if profile creation fails
        }

        // Don't set user immediately - wait for email confirmation
        toast.success('Conta criada! Verifique seu email para confirmar', { duration: 5000 });
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await authOperations.signOut();
      
      if (error) throw error;

      setUser(null);
      
      // Clear local storage
      localStorage.removeItem('user-preferences');
      localStorage.removeItem('achievements-store');
      localStorage.removeItem('level-storage');
      localStorage.removeItem('goals-storage');
      
      toast.success('Logout realizado com sucesso', { duration: 2000 });
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      console.error('Logout error:', error);
      
      // Force logout even if there's an error
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: { 
    name?: string; 
    email?: string; 
    avatar_url?: string; 
    birthdate?: string;
  }): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');

    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (data.name !== undefined) {
        const nameValidation = validateName(data.name);
        if (!nameValidation.isValid) {
          throw new Error(nameValidation.error || 'Nome inválido');
        }
      }

      if (data.email !== undefined) {
        const emailValidation = validateEmail(data.email);
        if (!emailValidation.isValid) {
          throw new Error(emailValidation.error || 'Email inválido');
        }
      }

      if (data.birthdate !== undefined) {
        const birthdateValidation = validateBirthdate(data.birthdate);
        if (!birthdateValidation.isValid) {
          throw new Error(birthdateValidation.error || 'Data de nascimento inválida');
        }
      }

      // Update auth user metadata
      const updateData: any = { data: {} };
      if (data.name !== undefined) updateData.data.name = sanitizeInput(data.name);
      if (data.avatar_url !== undefined) updateData.data.avatar_url = data.avatar_url;

      if (Object.keys(updateData.data).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(updateData);
        if (authError) throw authError;
      }

      // Update email separately if needed
      if (data.email !== undefined && data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ 
          email: sanitizeInput(data.email.toLowerCase()) 
        });
        if (emailError) throw emailError;
      }

      // Update profile in database
      const profileData: any = { updated_at: new Date().toISOString() };
      if (data.name !== undefined) profileData.name = sanitizeInput(data.name);
      if (data.email !== undefined) profileData.email = sanitizeInput(data.email.toLowerCase());
      if (data.birthdate !== undefined) profileData.birthdate = data.birthdate;
      if (data.avatar_url !== undefined) profileData.avatar_url = data.avatar_url;

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update local user state
      const updatedUser: AuthUser = {
        ...user,
        name: data.name !== undefined ? sanitizeInput(data.name) : user.name,
        email: data.email !== undefined ? sanitizeInput(data.email.toLowerCase()) : user.email,
        avatar: data.avatar_url !== undefined ? data.avatar_url : user.avatar,
        user_metadata: {
          ...user.user_metadata,
          name: data.name !== undefined ? sanitizeInput(data.name) : user.user_metadata?.name,
          avatar_url: data.avatar_url !== undefined ? data.avatar_url : user.user_metadata?.avatar_url,
        }
      };

      setUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!', { duration: 3000 });
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};