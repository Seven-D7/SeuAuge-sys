// Hook para recuperar o plano do usuário e exibir conteúdo condicionalmente
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { getPlanFromToken } from "../services/plan";

interface UsePlan {
  plan: string | null;
  loading: boolean;
}

export default function usePlan(): UsePlan {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string | null>(user?.plan ?? null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    async function fetchPlan() {
      if (!user) {
        setPlan(null);
        setLoading(false);
        return;
      }

      // Se já temos o plano do usuário, usar ele
      if (user.plan) {
        setPlan(user.plan);
        setLoading(false);
        return;
      }

      // Tentar obter do Supabase
      try {
        setLoading(true);
        const currentPlan = await getPlanFromToken();
        if (!active) return;
        setPlan(currentPlan || null); // Sem plano se não encontrar
        console.log("Plano obtido:", currentPlan);
      } catch (error) {
        console.warn("Erro ao obter plano:", error);
        if (!active) return;
        setPlan(null); // Sem plano em caso de erro
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchPlan();
    return () => {
      active = false;
    };
  }, [user]);

  return { plan, loading };
}
