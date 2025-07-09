import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

export async function uploadAvatar(file: File, uid: string): Promise<string> {
  const avatarRef = ref(storage, `avatars/${uid}`);
  await uploadBytes(avatarRef, file);
  return await getDownloadURL(avatarRef);
}

export interface UpdateUserInput {
  name: string;
  email: string;
  file?: File | null;
}

export interface CreateUserInput {
  uid: string;
  name: string;
  email: string;
  avatar?: string | null;
  plan?: string;
}

export async function updateUserProfile({ name, email, file }: UpdateUserInput) {
  if (!auth.currentUser) return;

  let photoURL = auth.currentUser.photoURL || undefined;

  if (file) {
    photoURL = await uploadAvatar(file, auth.currentUser.uid);
  }

  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: photoURL ?? null,
  });

  if (auth.currentUser.email !== email) {
    await updateEmail(auth.currentUser, email);
  }

  const data: Record<string, unknown> = { name, email };
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
}: CreateUserInput) {
  await setDoc(doc(db, 'users', uid), { name, email, avatar, plan });
}
