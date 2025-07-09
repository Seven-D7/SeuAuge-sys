import { auth, db } from '../firebase';
import api from './api';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export interface PlanData {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export async function getPlans(): Promise<PlanData[]> {
  const snapshot = await getDocs(collection(db, 'plans'));
  return snapshot.docs.map((d) => d.data() as PlanData);
}

export async function getPlanFromToken(forceRefresh = false): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  const token = await currentUser.getIdTokenResult(forceRefresh);
  const plan = token.claims.plan as string | undefined;
  return plan ?? null;
}

export async function updateUserPlan(plan: string): Promise<void> {
  await api('/plan', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
  if (auth.currentUser) {
    await setDoc(doc(db, 'users', auth.currentUser.uid), { plan }, { merge: true });
  }
}
