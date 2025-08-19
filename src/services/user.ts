import { supabase, isSupabaseDemoMode } from "../lib/supabase";
import type { BodyMetrics } from "../stores/progressStore";

// Sanitization helper
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

// Image validation helper
const validateImageFile = (file: File): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Apenas imagens JPEG, PNG e WebP são permitidas");
  }

  if (file.size > maxSize) {
    throw new Error("Arquivo muito grande. Máximo 5MB");
  }
};

export async function uploadAvatar(file: File, uid: string): Promise<string> {
  try {
    // Validate file
    validateImageFile(file);

    // Demo mode - return temporary URL
    if (isSupabaseDemoMode) {
      return URL.createObjectURL(file);
    }

    // Generate secure filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const secureFilename = `${uid}_${Date.now()}.${fileExtension}`;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(secureFilename, file, {
        contentType: file.type,
        metadata: {
          uploadedBy: uid,
          uploadedAt: new Date().toISOString(),
        }
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(secureFilename);

    return publicUrl;
  } catch (error) {
    console.warn("Erro ao fazer upload do avatar:", error);
    throw error;
  }
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  birthdate?: string;
  file?: File | null;
  avatar_url?: string;
}

export interface CreateUserInput {
  uid: string;
  name: string;
  email: string;
  avatar?: string | null;
  plan?: string;
  birthdate?: string | null;
  role?: 'user' | 'admin' | 'moderator';
}

export async function updateUserProfile({
  name,
  email,
  birthdate,
  file,
  avatar_url,
}: UpdateUserInput) {
  try {
    // Demo mode - only log updates
    if (isSupabaseDemoMode) {
      if (file) {
        console.log("Demo mode: simulando upload de avatar");
      }
      console.log("Demo mode: perfil atualizado localmente");
      return;
    }

    // Input validation and sanitization
    if (name !== undefined) {
      const sanitizedName = sanitizeInput(name);
      if (sanitizedName.length < 2 || sanitizedName.length > 50) {
        throw new Error("Nome deve ter entre 2 e 50 caracteres");
      }
    }

    if (email !== undefined) {
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        throw new Error("Email inválido");
      }
    }

    if (birthdate !== undefined) {
      const birthDate = new Date(birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120 || isNaN(birthDate.getTime())) {
        throw new Error("Data de nascimento inválida");
      }
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Usuário não autenticado");

    let photoURL = avatar_url;

    // Upload new avatar if file provided
    if (file) {
      photoURL = await uploadAvatar(file, user.id);
    }

    // Update user metadata in Supabase Auth
    const updateData: { data: Record<string, any> } = { data: {} };
    if (name !== undefined) {
      updateData.data.name = sanitizeInput(name);
    }
    if (photoURL !== undefined) {
      updateData.data.avatar_url = photoURL;
    }

    if (Object.keys(updateData.data).length > 0) {
      const { error } = await supabase.auth.updateUser(updateData);
      if (error) throw error;
    }

    // Update email separately if needed
    if (email && user.email !== email) {
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      const { error } = await supabase.auth.updateUser({ email: sanitizedEmail });
      if (error) throw error;
    }

    // Update user profile in database
    const profileData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    
    if (name !== undefined) profileData.name = sanitizeInput(name);
    if (email !== undefined) profileData.email = sanitizeInput(email.toLowerCase());
    if (birthdate !== undefined) profileData.birthdate = birthdate;
    if (photoURL !== undefined) profileData.avatar_url = photoURL;

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('id', user.id);

    if (profileError) throw profileError;

    return photoURL;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}

export async function createUserDocument({
  uid,
  name,
  email,
  avatar = null,
  plan = null,
  birthdate = null,
  role = 'user',
}: CreateUserInput) {
  try {
    // Input validation
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      throw new Error("Nome deve ter entre 2 e 50 caracteres");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error("Email inválido");
    }

    // Demo mode - only log
    if (isSupabaseDemoMode) {
      console.log("Demo mode: documento de usuário criado localmente");
      return;
    }

    const userData = {
      id: uid,
      name: sanitizedName,
      email: sanitizedEmail,
      avatar_url: avatar,
      plan,
      birthdate,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('user_profiles')
      .insert(userData);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao criar documento do usuário:", error);
    throw error;
  }
}

export async function getUserData(uid: string) {
  try {
    if (!uid) {
      throw new Error("UID é obrigatório");
    }

    // Demo mode - return mock data
    if (isSupabaseDemoMode) {
      return {
        name: "Usuário Desenvolvimento",
        email: "dev@example.com",
        birthdate: "1990-01-01",
        plan: "A",
        role: "user",
      };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
    
    // Sanitize data before returning
    return {
      ...data,
      name: data.name ? sanitizeInput(data.name) : '',
      email: data.email ? sanitizeInput(data.email) : '',
    };
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}

// Enhanced function to update user role (admin only)
export async function updateUserRole(targetUid: string, newRole: 'user' | 'admin' | 'moderator') {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Usuário não autenticado");
    }

    // Check if current user is admin
    const { data: currentUserData, error: currentUserError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUserData || currentUserData.role !== 'admin') {
      throw new Error("Acesso negado. Apenas administradores podem alterar roles");
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUid);

    if (error) throw error;

    // Log role change for audit
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'role_change',
        target_user: targetUid,
        new_role: newRole,
        performed_by: user.id,
        created_at: new Date().toISOString(),
      });

    if (auditError) {
      console.warn("Erro ao criar log de auditoria:", auditError);
    }

  } catch (error) {
    console.error("Erro ao atualizar role do usuário:", error);
    throw error;
  }
}

export async function saveUserMetrics(metrics: Partial<BodyMetrics>) {
  try {
    if (isSupabaseDemoMode) {
      console.log("Demo mode: métricas salvas localmente");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Usuário não autenticado");

    const { error } = await supabase
      .from('user_metrics')
      .upsert({
        user_id: user.id,
        ...metrics,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao salvar métricas:", error);
    throw error;
  }
}

export async function getUserMetrics(): Promise<Partial<BodyMetrics> | null> {
  try {
    if (isSupabaseDemoMode) {
      return {
        weight: 70,
        height: 175,
        bodyFat: 15,
        muscleMass: 60,
      };
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data, error } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Erro ao buscar métricas:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return null;
  }
}

// Security function to check if user has permission
export async function checkUserPermission(uid: string, requiredRole: 'user' | 'admin' | 'moderator' = 'user'): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', uid)
      .single();

    if (error || !data) {
      return false;
    }

    const userRole = data.role || 'user';
    
    // Admin has access to everything
    if (userRole === 'admin') return true;
    
    // Moderator has access to user and moderator functions
    if (userRole === 'moderator' && (requiredRole === 'user' || requiredRole === 'moderator')) {
      return true;
    }
    
    // User only has access to user functions
    return userRole === requiredRole;
    
  } catch (error) {
    console.error("Error checking user permission:", error);
    return false;
  }
}

// Alias for backward compatibility
export const updateUserMetrics = saveUserMetrics;
