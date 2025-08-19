import { updateProfile, updateEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
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

    // Modo desenvolvimento - retornar URL temporária
    if (import.meta.env.VITE_DEV_MODE === "true") {
      return URL.createObjectURL(file);
    }

    // Generate secure filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const secureFilename = `${uid}_${Date.now()}.${fileExtension}`;
    
    const avatarRef = ref(storage, `avatars/${secureFilename}`);
    
    // Upload with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: uid,
        uploadedAt: new Date().toISOString(),
      }
    };
    
    await uploadBytes(avatarRef, file, metadata);
    return await getDownloadURL(avatarRef);
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
}: UpdateUserInput) {
  // Temporarily disabled during migration to Supabase
  console.log('updateUserProfile disabled during migration');
  return;

  try {
    // Modo desenvolvimento - apenas atualizar profile local
    if (import.meta.env.VITE_DEV_MODE === "true") {
      if (file) {
        console.log("Modo desenvolvimento: simulando upload de avatar");
      }
      console.log("Modo desenvolvimento: perfil atualizado localmente");
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

    let photoURL = auth.currentUser.photoURL || undefined;

    if (file) {
      photoURL = await uploadAvatar(file, auth.currentUser.uid);
    }

    // Update Firebase Auth profile
    const updateData: { displayName?: string; photoURL?: string | null } = {};
    if (name !== undefined) {
      updateData.displayName = sanitizeInput(name);
    }
    if (photoURL !== undefined) {
      updateData.photoURL = photoURL;
    }

    if (Object.keys(updateData).length > 0) {
      await updateProfile(auth.currentUser, updateData);
    }

    // Update email separately if needed
    if (email && auth.currentUser.email !== email) {
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      await updateEmail(auth.currentUser, sanitizedEmail);
    }

    // Update Firestore document
    const firestoreData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    
    if (name !== undefined) firestoreData.name = sanitizeInput(name);
    if (email !== undefined) firestoreData.email = sanitizeInput(email.toLowerCase());
    if (birthdate !== undefined) firestoreData.birthdate = birthdate;
    if (photoURL !== undefined) firestoreData.avatar = photoURL;

    await setDoc(doc(db, "users", auth.currentUser.uid), firestoreData, { merge: true });

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

    // Modo desenvolvimento - apenas log
    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.log("Modo desenvolvimento: documento de usuário criado localmente");
      return;
    }

    const userData = {
      name: sanitizedName,
      email: sanitizedEmail,
      avatar,
      plan,
      birthdate,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Security fields
      isActive: true,
      lastLogin: new Date(),
      loginCount: 1,
    };

    await setDoc(doc(db, "users", uid), userData);
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

    // Modo desenvolvimento - retornar dados mock
    if (import.meta.env.VITE_DEV_MODE === "true") {
      return {
        name: "Usuário Desenvolvimento",
        email: "dev@example.com",
        birthdate: "1990-01-01",
        plan: "A",
        role: "user",
      };
    }

    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      
      // Sanitize data before returning
      return {
        ...data,
        name: data.name ? sanitizeInput(data.name) : '',
        email: data.email ? sanitizeInput(data.email) : '',
      };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}

// Enhanced function to update user role (admin only)
export async function updateUserRole(targetUid: string, newRole: 'user' | 'admin' | 'moderator') {
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado");
    }

    // Check if current user is admin
    const currentUserDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!currentUserDoc.exists() || currentUserDoc.data()?.role !== 'admin') {
      throw new Error("Acesso negado. Apenas administradores podem alterar roles");
    }

    await setDoc(doc(db, "users", targetUid), {
      role: newRole,
      updatedAt: new Date(),
      updatedBy: auth.currentUser.uid,
    }, { merge: true });

    // Log role change for audit
    await setDoc(doc(db, "audit_logs", `${Date.now()}_${targetUid}`), {
      action: 'role_change',
      targetUser: targetUid,
      oldRole: 'unknown', // Would need to fetch previous role in production
      newRole,
      performedBy: auth.currentUser.uid,
      timestamp: new Date(),
    });

  } catch (error) {
    console.error("Erro ao atualizar role do usuário:", error);
    throw error;
  }
}

export async function saveUserMetrics(metrics: Partial<BodyMetrics>) {
  // Temporarily disabled during migration to Supabase
  console.log('saveUserMetrics disabled during migration');
  return;
}

export async function getUserMetrics(): Promise<Partial<BodyMetrics> | null> {
  // Temporarily disabled during migration to Supabase
  return null;
}

// Security function to check if user has permission
export async function checkUserPermission(uid: string, requiredRole: 'user' | 'admin' | 'moderator' = 'user'): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const userRole = userData.role || 'user';
    
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
