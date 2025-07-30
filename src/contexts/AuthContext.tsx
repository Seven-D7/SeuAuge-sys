// Contexto responsável por gerenciar a autenticação com o Firebase
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isDemoMode } from "../firebase";
import {
  updateUserProfile,
  UpdateUserInput,
  createUserDocument,
} from "../services/user";
import { getPlanFromToken } from "../services/plan";

// Production admin check using Firebase custom claims
// Admin emails should NEVER be hardcoded in frontend for production
const isDevelopment = import.meta.env.DEV;
const FALLBACK_ADMIN_EMAILS = isDevelopment ? [
  import.meta.env.VITE_ADMIN_EMAIL || "admin@seuauge.com",
].filter(Boolean) : [];

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan?: string | null;
  isPremium: boolean;
  isAdmin: boolean;
  role?: 'user' | 'admin' | 'moderator';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    birthdate: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (data: UpdateUserInput) => Promise<void>;
  refreshPlan: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

// Enhanced password validation
const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um número' };
  }
  return { isValid: true };
};

// Check user role from Firestore
const getUserRole = async (uid: string): Promise<'user' | 'admin' | 'moderator'> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data();
    return userData?.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const planFromToken = await getPlanFromToken();
    const plan = planFromToken;
    
    // Production admin check using custom claims and Firestore
    let isAdmin = false;
    let role: 'user' | 'admin' | 'moderator' = 'user';

    if (!isDemoMode) {
      // First check custom claims (production approach)
      const idTokenResult = await firebaseUser.getIdTokenResult();
      if (idTokenResult.claims.admin) {
        isAdmin = true;
        role = 'admin';
      } else if (idTokenResult.claims.moderator) {
        role = 'moderator';
      } else {
        // Fallback to Firestore role check
        role = await getUserRole(firebaseUser.uid);
        isAdmin = role === 'admin';

        // Development fallback only
        if (isDevelopment && !isAdmin) {
          isAdmin = FALLBACK_ADMIN_EMAILS.includes(firebaseUser.email || '');
          if (isAdmin) role = 'admin';
        }
      }
    }
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: sanitizeInput(firebaseUser.displayName || ""),
      avatar: firebaseUser.photoURL || undefined,
      plan,
      isPremium: !!plan, // Tem plano = é premium
      isAdmin,
      role,
    };
  };

  useEffect(() => {
    if (isDemoMode) {
      // Modo demo - autenticação simulada
      console.log("🔧 Modo demo ativo - autenticação simulada");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const mapped = await mapFirebaseUser(firebaseUser);
          setUser(mapped);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error mapping Firebase user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Input validation and sanitization
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Formato de email inválido');
    }

    if (isDemoMode) {
      // Modo demo - simular login
      const mockUser: User = {
        id: "demo-user-123",
        email: sanitizedEmail,
        name: "Usuário Demo",
        plan: "B",
        isPremium: true,
        isAdmin: isDevelopment && FALLBACK_ADMIN_EMAILS.includes(sanitizedEmail),
        role: (isDevelopment && FALLBACK_ADMIN_EMAILS.includes(sanitizedEmail)) ? 'admin' : 'user',
      };
      setUser(mockUser);
      console.log("🔧 Login demo realizado:", sanitizedEmail);
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        sanitizedEmail,
        password,
      );
      const mapped = await mapFirebaseUser(cred.user);
      setUser(mapped);
      
      // Audit log (in production, send to secure logging service)
      if (import.meta.env.DEV) {
        console.log("Usuario autenticado:", mapped.email, "Role:", mapped.role);
      }
    } catch (err: any) {
      // Enhanced error handling without exposing sensitive information
      console.error("Login error:", err.code);
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error("Credenciais inválidas");
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error("Muitas tentativas de login. Tente novamente mais tarde");
      } else if (err.code === 'auth/user-disabled') {
        throw new Error("Conta desabilitada. Entre em contato com o suporte");
      } else {
        throw new Error("Falha na autenticação");
      }
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    birthdate: string,
  ) => {
    // Input validation and sanitization
    if (!email || !password || !name || !birthdate) {
      throw new Error('Todos os campos são obrigatórios');
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedName = sanitizeInput(name);
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Formato de email inválido');
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message || 'Senha inválida');
    }

    // Name validation
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      throw new Error('Nome deve ter entre 2 e 50 caracteres');
    }

    // Age validation (basic check for reasonable birth date)
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      throw new Error('Data de nascimento inválida');
    }

    if (isDemoMode) {
      // Modo demo - simular registro
      const mockUser: User = {
        id: `demo-user-${Date.now()}`,
        email: sanitizedEmail,
        name: sanitizedName,
        plan: null,
        isPremium: false,
        isAdmin: ADMIN_EMAILS.includes(sanitizedEmail),
        role: ADMIN_EMAILS.includes(sanitizedEmail) ? 'admin' : 'user',
      };
      setUser(mockUser);
      console.log("🔧 Registro demo realizado:", sanitizedEmail);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        sanitizedEmail,
        password,
      );
      
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: sanitizedName });
      }
      
      await createUserDocument({
        uid: cred.user.uid,
        name: sanitizedName,
        email: sanitizedEmail,
        birthdate,
        role: 'user', // Default role
      });
      
      const mapped = await mapFirebaseUser(cred.user);
      setUser(mapped);
      
      // Audit log
      if (import.meta.env.DEV) {
        console.log("Usuario registrado:", mapped.email);
      }
    } catch (err: any) {
      console.error("Registration error:", err.code);
      
      if (err.code === 'auth/email-already-in-use') {
        throw new Error("Este email já está em uso");
      } else if (err.code === 'auth/weak-password') {
        throw new Error("Senha muito fraca. Use uma senha mais forte");
      } else if (err.code === 'auth/operation-not-allowed') {
        throw new Error("Registro não permitido. Entre em contato com o suporte");
      } else {
        throw new Error("Falha no registro");
      }
    }
  };

  const logout = async () => {
    if (isDemoMode) {
      setUser(null);
      console.log("🔧 Logout demo realizado");
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
      
      if (import.meta.env.DEV) {
        console.log("Usuario desconectado");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if signOut fails
      setUser(null);
    }
  };

  const updateUser = async (data: UpdateUserInput) => {
    if (isDemoMode) {
      setUser((prev) => (prev ? { 
        ...prev, 
        name: sanitizeInput(data.name || prev.name)
      } : prev));
      console.log("🔧 Update user demo realizado");
      return;
    }

    try {
      // Sanitize input data
      const sanitizedData = {
        ...data,
        name: data.name ? sanitizeInput(data.name) : undefined,
      };
      
      await updateUserProfile(sanitizedData);
      if (auth.currentUser) {
        const mapped = await mapFirebaseUser(auth.currentUser);
        setUser(mapped);
      }
    } catch (err) {
      console.error("Update user error:", err);
      throw err;
    }
  };

  const refreshPlan = async () => {
    if (isDemoMode) {
      console.log("🔧 Refresh plan demo - mantendo plano atual");
      return;
    }

    if (!auth.currentUser) return;
    
    try {
      const newPlan = await getPlanFromToken(true);
      setUser((prev) =>
        prev ? { ...prev, plan: newPlan, isPremium: !!newPlan } : prev,
      );
    } catch (error) {
      console.error("Refresh plan error:", error);
      // Don't throw error to avoid breaking the app
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    refreshPlan,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
