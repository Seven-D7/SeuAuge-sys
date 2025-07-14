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
import { auth } from "../firebase";
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
      // Development mode bypass for Firebase authentication
      if (import.meta.env.VITE_DEV_MODE === "true") {
        // Simulate a successful login in development mode
        const mockUser: User = {
          id: "dev-user-" + Date.now(),
          email: email.trim().toLowerCase(),
          name: "Dev User",
          plan: "D", // Acesso total para teste
          isPremium: true,
          isAdmin: email === ADMIN_EMAIL,
        };
        setUser(mockUser);
        if (import.meta.env.DEV) {
          console.log(
            "Usuário autenticado (modo desenvolvimento)",
            mockUser.email,
          );
        }
        return;
      }

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
    try {
      // Development mode bypass for Firebase registration
      if (import.meta.env.VITE_DEV_MODE === "true") {
        // Simulate a successful registration in development mode
        const mockUser: User = {
          id: "dev-user-" + Date.now(),
          email: email.trim().toLowerCase(),
          name: name.trim(),
          plan: "A",
          isPremium: false,
          isAdmin: email === ADMIN_EMAIL,
        };
        setUser(mockUser);
        if (import.meta.env.DEV) {
          console.log(
            "Usuário registrado (modo desenvolvimento)",
            mockUser.email,
          );
        }
        return;
      }

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
    await signOut(auth);
    setUser(null);
    if (import.meta.env.DEV) {
      console.log("Usuário desconectado");
    }
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

  const refreshPlan = async () => {
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
