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
import { auth, isDemoMode } from "../firebase";
import {
  updateUserProfile,
  UpdateUserInput,
  createUserDocument,
} from "../services/user";
import { getPlanFromToken } from "../services/plan";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@seuauge.com";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const planFromToken = await getPlanFromToken();
    const plan = planFromToken ?? "A";
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "",
      avatar: firebaseUser.photoURL || undefined,
      plan,
      isPremium: plan !== "A",
      isAdmin: firebaseUser.email === ADMIN_EMAIL,
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
    if (isDemoMode) {
      // Modo demo - simular login
      const sanitizedEmail = email.trim().toLowerCase();
      const mockUser: User = {
        id: "demo-user-123",
        email: sanitizedEmail,
        name: "Usuário Demo",
        plan: "B",
        isPremium: true,
        isAdmin: sanitizedEmail === ADMIN_EMAIL,
      };
      setUser(mockUser);
      console.log("🔧 Login demo realizado:", sanitizedEmail);
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedEmail = email.trim().toLowerCase();
      const cred = await signInWithEmailAndPassword(
        auth,
        sanitizedEmail,
        password,
      );
      const mapped = await mapFirebaseUser(cred.user);
      setUser(mapped);
      // Don't log sensitive information in production
      if (import.meta.env.DEV) {
        console.log("Usuário autenticado", mapped.email);
      }
    } catch (err) {
      // Log error without exposing sensitive details
      console.error(
        "Login error:",
        err instanceof Error ? err.message : "Unknown error",
      );
      throw new Error("Falha na autenticação");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    birthdate: string,
  ) => {
    if (isDemoMode) {
      // Modo demo - simular registro
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = name.trim();
      const mockUser: User = {
        id: `demo-user-${Date.now()}`,
        email: sanitizedEmail,
        name: sanitizedName,
        plan: "A",
        isPremium: false,
        isAdmin: sanitizedEmail === ADMIN_EMAIL,
      };
      setUser(mockUser);
      console.log("🔧 Registro demo realizado:", sanitizedEmail);
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = name.trim();

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
      });
      const mapped = await mapFirebaseUser(cred.user);
      setUser(mapped);
      // Don't log sensitive information in production
      if (import.meta.env.DEV) {
        console.log("Usuário registrado", mapped.email);
      }
    } catch (err) {
      // Log error without exposing sensitive details
      console.error(
        "Registration error:",
        err instanceof Error ? err.message : "Unknown error",
      );
      throw new Error("Falha no registro");
    }
  };

  const logout = async () => {
    if (isDemoMode) {
      setUser(null);
      console.log("🔧 Logout demo realizado");
      return;
    }

    await signOut(auth);
    setUser(null);
    if (import.meta.env.DEV) {
      console.log("Usuário desconectado");
    }
  };

  const updateUser = async (data: UpdateUserInput) => {
    if (isDemoMode) {
      setUser((prev) => (prev ? { ...prev, name: data.name } : prev));
      console.log("🔧 Update user demo realizado");
      return;
    }

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

  const refreshPlan = async () => {
    if (isDemoMode) {
      console.log("🔧 Refresh plan demo - mantendo plano atual");
      return;
    }

    if (!auth.currentUser) return;
    const newPlan = await getPlanFromToken(true);
    setUser((prev) =>
      prev ? { ...prev, plan: newPlan, isPremium: newPlan !== "A" } : prev,
    );
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
