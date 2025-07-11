import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import type { BodyMetrics } from '../stores/progressStore';

export async function uploadAvatar(file: File, uid: string): Promise<string> {
  const avatarRef = ref(storage, `avatars/${uid}`);
  await uploadBytes(avatarRef, file);
  return await getDownloadURL(avatarRef);
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

export async function updateUserProfile({ name, email, birthdate, file }: UpdateUserInput) {
  if (!auth.currentUser) return;

  // Input validation and sanitization
  if (name && (name.trim().length < 2 || name.trim().length > 50)) {
    throw new Error('Nome deve ter entre 2 e 50 caracteres');
  }
  
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }
  
  if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('Arquivo muito grande. Máximo 5MB');
  }
  
  if (file && !file.type.startsWith('image/')) {
    throw new Error('Apenas imagens são permitidas');
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

  await setDoc(doc(db, 'users', auth.currentUser.uid), data, { merge: true });

  return photoURL;
}

export async function createUserDocument({
  uid,
  name,
  email,
  avatar = null,
  plan = 'A',
  birthdate = null,
}: CreateUserInput) {
  await setDoc(doc(db, 'users', uid), { name, email, avatar, plan, birthdate });
}

export async function updateUserMetrics(metrics: BodyMetrics) {
  if (!auth.currentUser) return;
  await setDoc(
    doc(db, 'users', auth.currentUser.uid),
    { metrics },
    { merge: true }
  );
}

export async function getUserMetrics(uid?: string): Promise<BodyMetrics | null> {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return null;
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return (data.metrics as BodyMetrics) ?? null;
}

export interface UserData {
  name?: string;
  email?: string;
  avatar?: string;
  birthdate?: string;
}

export async function getUserData(uid?: string): Promise<UserData | null> {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return null;
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  return snap.data() as UserData;
}
