// Contexto responsável por gerenciar a autenticação com o Firebase
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';
import { updateUserProfile, UpdateUserInput } from '../services/user';
import { getPlanFromToken } from '../services/plan';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@seuauge.com';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan?: string | null;
  isPremium: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: UpdateUserInput) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const plan = await getPlanFromToken();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      avatar: firebaseUser.photoURL || undefined,
      plan,
      isPremium: plan !== 'A',
      isAdmin: firebaseUser.email === ADMIN_EMAIL,
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const mapped = await mapFirebaseUser(firebaseUser);
        setUser(mapped);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const mapped = await mapFirebaseUser(cred.user);
      setUser(mapped);
      console.log('Usuário autenticado', mapped.email);
    } catch (err) {
      console.error(err);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const mapped = await mapFirebaseUser(cred.user);
      setUser(mapped);
      console.log('Usuário registrado', mapped.email);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    console.log('Usuário desconectado');
  };

  const updateUser = async (data: UpdateUserInput) => {
    try {
      await updateUserProfile(data);
      if (auth.currentUser) {
        const mapped = await mapFirebaseUser(auth.currentUser);
        setUser(mapped);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};