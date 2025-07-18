import { auth, db, isDemoMode } from "../firebase";
import api from "./api";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export interface PlanData {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export async function getPlans(): Promise<PlanData[]> {
  if (isDemoMode) {
    // Retornar planos mock em modo demo
    return [
      { id: "A", name: "Gratuito", price: "R$ 0", features: ["Acesso básico"] },
      { id: "B", name: "Base", price: "R$ 97", features: ["Acesso completo"] },
      {
        id: "C",
        name: "Escalada",
        price: "R$ 249",
        features: ["Acesso premium"],
      },
      { id: "D", name: "Auge", price: "R$ 780", features: ["Acesso total"] },
    ];
  }

  const snapshot = await getDocs(collection(db, "plans"));
  return snapshot.docs.map((d) => d.data() as PlanData);
}

export async function getPlanFromToken(
  forceRefresh = false,
): Promise<string | null> {
  if (isDemoMode) {
    console.log("🔧 Mode demo - retornando plano B");
    return "B";
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const token = await currentUser.getIdTokenResult(forceRefresh);
    const plan = token.claims.plan as string | undefined;
    return plan ?? null;
  } catch (error) {
    console.warn("Erro ao obter token do plano:", error);
    return null;
  }
}

export async function updateUserPlan(plan: string): Promise<void> {
  if (isDemoMode) {
    console.log("🔧 Mode demo - simulando update do plano:", plan);
    return;
  }

  await api("/plan", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
  if (auth.currentUser) {
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { plan },
      { merge: true },
    );
  }
}
