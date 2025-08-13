import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, isSupabaseDemoMode } from '../lib/supabase'
import { initializeActivityTracking } from '../services/activity'
import { useAchievementsStore } from '../stores/achievementsStore'
import { useLevelStore } from '../stores/levelStore'
import { useGoalsStore } from '../stores/goalsStore'
import { initializeSyncSystem, stopRealtimeSync } from '../services/sync'

// Production admin check
const isDevelopment = import.meta.env.DEV
const FALLBACK_ADMIN_EMAILS = isDevelopment ? [
  import.meta.env.VITE_ADMIN_EMAIL || "admin@seuauge.com",
].filter(Boolean) : []

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan?: string | null
  isPremium: boolean
  isAdmin: boolean
  role?: 'user' | 'admin' | 'moderator'
}

interface AuthContextType {
  user: User | null
  session: Session | null
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    name: string,
    birthdate: string,
  ) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  refreshPlan: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

// Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"']/g, '')
}

// Enhanced password validation
const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' }
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' }
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' }
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'A senha deve conter pelo menos um número' }
  }
  return { isValid: true }
}

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to initialize all gamification systems
  const initializeGamificationSystems = async (userPlan?: string) => {
    try {
      // Initialize activity tracking (handles daily login)
      await initializeActivityTracking()

      // Initialize achievements
      const achievementsStore = useAchievementsStore.getState()
      await achievementsStore.initializeAchievements()

      // Check daily login for level system
      const levelStore = useLevelStore.getState()
      await levelStore.checkDailyLogin()

      // Generate smart goals if none exist
      const goalsStore = useGoalsStore.getState()
      if (goalsStore.goals.length === 0) {
        goalsStore.generateSmartGoals({ plan: userPlan })
      }

      // Reset daily challenges if needed (new day)
      const today = new Date().toDateString()
      const lastResetDate = localStorage.getItem('lastChallengeReset')
      if (lastResetDate !== today) {
        goalsStore.resetDailyChallenges()
        localStorage.setItem('lastChallengeReset', today)
      }

      // Initialize sync system
      await initializeSyncSystem()

    } catch (error) {
      console.error('Erro ao inicializar sistemas de gamificação:', error)
    }
  }

  const mapSupabaseUser = async (supabaseUser: SupabaseUser, session: Session): Promise<User> => {
    // Get user profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    const plan = profile?.plan || null
    const role = profile?.role || 'user'
    const isAdmin = role === 'admin' || (isDevelopment && FALLBACK_ADMIN_EMAILS.includes(supabaseUser.email || ''))

    // Initialize gamification systems for authenticated user
    try {
      await initializeGamificationSystems(plan)
    } catch (error) {
      console.error('Erro ao inicializar sistemas de gamificação:', error)
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: sanitizeInput(profile?.name || supabaseUser.user_metadata?.name || ""),
      avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
      plan,
      isPremium: !!plan,
      isAdmin,
      role: role as 'user' | 'admin' | 'moderator',
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        mapSupabaseUser(session.user, session).then(setUser)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          const mapped = await mapSupabaseUser(session.user, session)
          setUser(mapped)
        } else {
          setUser(null)
          stopRealtimeSync()
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    // Input validation and sanitization
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios')
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase())
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Formato de email inválido')
    }

    // Demo mode
    if (isSupabaseDemoMode && isDevelopment) {
      const mockUser: User = {
        id: "demo-user-123",
        email: sanitizedEmail,
        name: "Usuário Demo",
        plan: "B",
        isPremium: true,
        isAdmin: FALLBACK_ADMIN_EMAILS.includes(sanitizedEmail),
        role: FALLBACK_ADMIN_EMAILS.includes(sanitizedEmail) ? 'admin' : 'user',
      }
      setUser(mockUser)
      console.log("🔧 Login demo realizado:", sanitizedEmail)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    })

    if (error) {
      console.error("Login error:", error.message)
      
      if (error.message.includes('Invalid login credentials')) {
        throw new Error("Credenciais inválidas")
      } else if (error.message.includes('Too many requests')) {
        throw new Error("Muitas tentativas de login. Tente novamente mais tarde")
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error("Email não confirmado. Verifique sua caixa de entrada")
      } else {
        throw new Error("Falha na autenticação")
      }
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    birthdate: string,
  ) => {
    // Input validation and sanitization
    if (!email || !password || !name || !birthdate) {
      throw new Error('Todos os campos são obrigatórios')
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase())
    const sanitizedName = sanitizeInput(name)
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Formato de email inválido')
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message || 'Senha inválida')
    }

    // Name validation
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      throw new Error('Nome deve ter entre 2 e 50 caracteres')
    }

    // Age validation
    const birthDate = new Date(birthdate)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 13 || age > 120) {
      throw new Error('Data de nascimento inválida')
    }

    // Demo mode
    if (isSupabaseDemoMode && isDevelopment) {
      const mockUser: User = {
        id: `demo-user-${Date.now()}`,
        email: sanitizedEmail,
        name: sanitizedName,
        plan: null,
        isPremium: false,
        isAdmin: FALLBACK_ADMIN_EMAILS.includes(sanitizedEmail),
        role: FALLBACK_ADMIN_EMAILS.includes(sanitizedEmail) ? 'admin' : 'user',
      }
      setUser(mockUser)
      console.log("🔧 Registro demo realizado:", sanitizedEmail)
      return
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          name: sanitizedName,
          birthdate,
        }
      }
    })

    if (error) {
      console.error("Registration error:", error.message)
      
      if (error.message.includes('User already registered')) {
        throw new Error("Este email já está em uso")
      } else if (error.message.includes('Password should be')) {
        throw new Error("Senha muito fraca. Use uma senha mais forte")
      } else {
        throw new Error("Falha no registro")
      }
    }

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: sanitizedName,
          email: sanitizedEmail,
          birthdate,
          role: 'user',
          created_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }

      // Give welcome bonus
      try {
        const levelStore = useLevelStore.getState()
        levelStore.addXP(50, '🎉 Bem-vindo ao Meu Auge!', 'bonus')
      } catch (error) {
        console.error('Erro ao dar bônus de boas-vindas:', error)
      }
    }
  }

  const logout = async () => {
    // Demo mode
    if (isSupabaseDemoMode && isDevelopment) {
      setUser(null)
      setSession(null)
      console.log("🔧 Logout demo realizado")
      return
    }

    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error("Logout error:", error)
    }
    
    // Always clear local state
    setUser(null)
    setSession(null)
    stopRealtimeSync()
  }

  const updateUser = async (data: Partial<User>) => {
    if (isSupabaseDemoMode) {
      setUser((prev) => (prev ? { 
        ...prev, 
        ...data,
        name: data.name ? sanitizeInput(data.name) : prev.name
      } : prev))
      console.log("🔧 Update user demo realizado")
      return
    }

    if (!user) throw new Error('Usuário não autenticado')

    // Sanitize input data
    const sanitizedData = {
      ...data,
      name: data.name ? sanitizeInput(data.name) : undefined,
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(sanitizedData)
      .eq('id', user.id)

    if (error) {
      console.error("Update user error:", error)
      throw new Error('Erro ao atualizar perfil')
    }

    setUser((prev) => prev ? { ...prev, ...sanitizedData } : prev)
  }

  const refreshPlan = async () => {
    if (isSupabaseDemoMode) {
      console.log("🔧 Refresh plan demo - mantendo plano atual")
      return
    }

    if (!user) return
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUser((prev) =>
          prev ? { ...prev, plan: profile.plan, isPremium: !!profile.plan } : prev
        )
      }
    } catch (error) {
      console.error("Refresh plan error:", error)
    }
  }

  const value = {
    user,
    session,
    login,
    register,
    logout,
    updateUser,
    refreshPlan,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
