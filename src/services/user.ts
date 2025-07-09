import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import type { BodyMetrics } from '../stores/progressStore';

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
  birthdate?: string | null;
}

export async function updateUserProfile({ name, email, birthdate, file }: UpdateUserInput) {
  if (!auth.currentUser) return;

  let photoURL = auth.currentUser.photoURL || undefined;

  if (file) {
    const fileRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    await uploadBytes(fileRef, file);
    photoURL = await getDownloadURL(fileRef);
  }

  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: photoURL ?? null,
  });

  if (email && auth.currentUser.email !== email) {
    await updateEmail(auth.currentUser, email);
  }

  const data: Record<string, unknown> = { name };
  if (email) data.email = email;
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
  birthdate = null,
}: CreateUserInput) {
  await setDoc(doc(db, 'users', uid), { name, email, avatar, birthdate });
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
