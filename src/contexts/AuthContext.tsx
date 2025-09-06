import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { getUserData } from '../services/user';
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
  login: typeof supabase.auth.signInWithPassword;
  register: typeof supabase.auth.signUp;
  logout: () => Promise<void>;
  updateUser: (data: { name?: string; email?: string; avatar_url?: string; birthdate?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      if (session?.user) {
        try {
          const userData = await getUserData(session.user.id);
          const authUser: AuthUser = {
            ...session.user,
            name: userData?.name || session.user.user_metadata?.name,
            avatar: userData?.avatar_url || session.user.user_metadata?.avatar_url,
            plan: userData?.plan || null,
            role: userData?.role || 'user',
            isAdmin: userData?.role === 'admin',
            isPremium: !!(userData?.plan && ['B', 'C', 'D'].includes(userData.plan)),
            birthdate: userData?.birthdate,
          };
          setUser(authUser);
        } catch (error) {
          console.error("Error loading user data:", error);
          setUser(session.user as AuthUser); // Fallback to basic user data
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Force state update
    toast.success('Logout realizado com sucesso');
  };

  const updateUser = async (data: { name?: string; email?: string; avatar_url?: string; birthdate?: string }) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    // Update Supabase auth user
    const { data: { user: updatedUser }, error: userError } = await supabase.auth.updateUser(data);
    if (userError) throw userError;
    if (!updatedUser) throw new Error("Failed to update user.");

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);
    if (profileError) throw profileError;

    // Refresh local user state
    setUser({ ...user, ...updatedUser, ...data });
    toast.success('Perfil atualizado!');
  };

  const value = {
    user,
    loading,
    login: supabase.auth.signInWithPassword,
    register: supabase.auth.signUp,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
