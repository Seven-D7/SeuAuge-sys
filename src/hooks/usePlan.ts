// Hook para recuperar o plano do usuário e exibir conteúdo condicionalmente
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getPlanFromToken } from "../services/plan";
import { isDemoMode } from "../firebase";

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

      // Em modo demo, usar plano padrão
      if (isDemoMode) {
        setPlan("B"); // Plano premium em modo demo
        setLoading(false);
        return;
      }

      // Tentar obter do token Firebase
      try {
        setLoading(true);
        const currentPlan = await getPlanFromToken();
        if (!active) return;
        setPlan(currentPlan || "A"); // Default para plano A se não encontrar
        console.log("Plano obtido:", currentPlan);
      } catch (error) {
        console.warn("Erro ao obter plano, usando padrão:", error);
        if (!active) return;
        setPlan("A"); // Default em caso de erro
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
