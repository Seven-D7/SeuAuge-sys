import { supabase, isSupabaseDemoMode } from '../../lib/supabase'

export interface UpdateUserInput {
  name?: string
  avatar_url?: string
  plan?: string
  role?: 'user' | 'admin' | 'moderator'
}

export interface CreateUserInput {
  uid: string
  name: string
  email: string
  birthdate: string
  role?: 'user' | 'admin' | 'moderator'
}

// Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"']/g, '')
}

export const updateUserProfile = async (data: UpdateUserInput): Promise<void> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: updateUserProfile", data)
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  // Sanitize input data
  const sanitizedData = {
    ...data,
    name: data.name ? sanitizeInput(data.name) : undefined,
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...sanitizedData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Erro ao atualizar perfil do usuário')
  }
}

export const createUserDocument = async (userData: CreateUserInput): Promise<void> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: createUserDocument", userData)
    return
  }

  // Sanitize input data
  const sanitizedData = {
    ...userData,
    name: sanitizeInput(userData.name),
    email: sanitizeInput(userData.email.toLowerCase()),
  }

  const { error } = await supabase
    .from('profiles')
    .insert({
      id: sanitizedData.uid,
      name: sanitizedData.name,
      email: sanitizedData.email,
      birthdate: sanitizedData.birthdate,
      role: sanitizedData.role || 'user',
      created_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error creating user document:', error)
    throw new Error('Erro ao criar documento do usuário')
  }
}

export const getUserProfile = async (userId: string) => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: getUserProfile", userId)
    return {
      id: userId,
      name: "Usuário Demo",
      email: "demo@example.com",
      plan: "B",
      role: "user",
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Erro ao buscar perfil do usuário')
  }

  return data
}

export const deleteUserAccount = async (): Promise<void> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: deleteUserAccount")
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  // This will cascade delete all related data due to foreign key constraints
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)

  if (error) {
    console.error('Error deleting user account:', error)
    throw new Error('Erro ao deletar conta do usuário')
  }

  // Sign out the user
  await supabase.auth.signOut()
}
