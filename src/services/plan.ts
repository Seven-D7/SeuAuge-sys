import { auth } from '../firebase';
import api from './api';

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
}
