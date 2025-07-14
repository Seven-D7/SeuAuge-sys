import { updateProfile, updateEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import type { BodyMetrics } from "../stores/progressStore";

export async function uploadAvatar(file: File, uid: string): Promise<string> {
  try {
    // Modo desenvolvimento - retornar URL temporária
    if (import.meta.env.VITE_DEV_MODE === "true") {
      return URL.createObjectURL(file);
    }

    const avatarRef = ref(storage, `avatars/${uid}`);
    await uploadBytes(avatarRef, file);
    return await getDownloadURL(avatarRef);
  } catch (error) {
    console.warn("Erro ao fazer upload do avatar:", error);
    // Retornar URL temporária como fallback
    return URL.createObjectURL(file);
  }
}

export interface UpdateUserInput {
  name: string;
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
}

export async function updateUserProfile({
  name,
  email,
  birthdate,
  file,
}: UpdateUserInput) {
  if (!auth.currentUser) return;

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
    if (name && (name.trim().length < 2 || name.trim().length > 50)) {
      throw new Error("Nome deve ter entre 2 e 50 caracteres");
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Email inválido");
      }
    }

    if (file && file.size > 5 * 1024 * 1024) {
      // 5MB limit
      throw new Error("Arquivo muito grande. Máximo 5MB");
    }

    if (file && !file.type.startsWith("image/")) {
      throw new Error("Apenas imagens são permitidas");
    }

    let photoURL = auth.currentUser.photoURL || undefined;

    if (file) {
      photoURL = await uploadAvatar(file, auth.currentUser.uid);
    }

    await updateProfile(auth.currentUser, {
      displayName: name?.trim(),
      photoURL: photoURL ?? null,
    });

    if (email && auth.currentUser.email !== email) {
      await updateEmail(auth.currentUser, email.trim().toLowerCase());
    }

    const data: Record<string, unknown> = { name: name?.trim() };
    if (email) data.email = email.trim().toLowerCase();
    if (birthdate) data.birthdate = birthdate;
    if (photoURL !== undefined) {
      data.avatar = photoURL;
    }

    await setDoc(doc(db, "users", auth.currentUser.uid), data, { merge: true });

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
  plan = "A",
  birthdate = null,
}: CreateUserInput) {
  try {
    // Modo desenvolvimento - apenas log
    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.log(
        "Modo desenvolvimento: documento de usuário criado localmente",
      );
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar,
      plan,
      birthdate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", uid), userData);
  } catch (error) {
    console.warn("Erro ao criar documento do usuário:", error);
    // Não thrower error para não quebrar o fluxo de registro
  }
}

export async function getUserData(uid: string) {
  try {
    // Modo desenvolvimento - retornar dados mock
    if (import.meta.env.VITE_DEV_MODE === "true") {
      return {
        name: "Usuário Desenvolvimento",
        email: "dev@example.com",
        birthdate: "1990-01-01",
        plan: "A",
      };
    }

    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.warn("Erro ao buscar dados do usuário:", error);
    return null;
  }
}

export async function saveUserMetrics(metrics: Partial<BodyMetrics>) {
  try {
    if (!auth.currentUser) return;

    // Modo desenvolvimento - apenas salvar localmente
    if (import.meta.env.VITE_DEV_MODE === "true") {
      localStorage.setItem("userMetrics", JSON.stringify(metrics));
      console.log("Modo desenvolvimento: métricas salvas localmente");
      return;
    }

    const metricsData = {
      ...metrics,
      updatedAt: new Date(),
    };

    await setDoc(
      doc(db, "users", auth.currentUser.uid, "metrics", "current"),
      metricsData,
      { merge: true },
    );
  } catch (error) {
    console.warn("Erro ao salvar métricas:", error);
    // Salvar localmente como fallback
    localStorage.setItem("userMetrics", JSON.stringify(metrics));
  }
}

export async function getUserMetrics(): Promise<Partial<BodyMetrics> | null> {
  try {
    if (!auth.currentUser) return null;

    // Modo desenvolvimento - buscar dados locais
    if (import.meta.env.VITE_DEV_MODE === "true") {
      const localMetrics = localStorage.getItem("userMetrics");
      return localMetrics ? JSON.parse(localMetrics) : null;
    }

    const metricsDoc = await getDoc(
      doc(db, "users", auth.currentUser.uid, "metrics", "current"),
    );

    if (metricsDoc.exists()) {
      return metricsDoc.data() as Partial<BodyMetrics>;
    }

    return null;
  } catch (error) {
    console.warn("Erro ao buscar métricas:", error);
    // Tentar buscar dados locais como fallback
    const localMetrics = localStorage.getItem("userMetrics");
    return localMetrics ? JSON.parse(localMetrics) : null;
  }
}
