// Hook para recuperar o plano do usuário e exibir conteúdo condicionalmente
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPlanFromToken } from '../services/plan';

interface UsePlan {
  plan: string | null;
  loading: boolean;
}

export default function usePlan(): UsePlan {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string | null>(user?.plan ?? null);
  const [loading, setLoading] = useState<boolean>(!!user && !user?.plan);

  useEffect(() => {
    let active = true;
    async function fetchPlan() {
      if (!user) {
        setPlan(null);
        setLoading(false);
        return;
      }
      const currentPlan = user.plan ?? (await getPlanFromToken());
      if (!active) return;
      setPlan(currentPlan);
      console.log('Plano obtido:', currentPlan);
      setLoading(false);
    }
    fetchPlan();
    return () => {
      active = false;
    };
  }, [user]);

  return { plan, loading };
}

