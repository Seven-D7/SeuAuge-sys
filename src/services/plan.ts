import { auth } from '../firebase';

export async function getPlanFromToken(forceRefresh = false): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  const token = await currentUser.getIdTokenResult(forceRefresh);
  const plan = token.claims.plan as string | undefined;
  return plan ?? null;
}

