export type PlanTier = 'FREE' | 'B' | 'C' | 'D';

export interface ContentWithPlan {
  id: string;
  title: string;
  planTier: PlanTier;
  isPremium: boolean;
  planTags: string[];
}

export interface VideoWithPlan extends ContentWithPlan {
  duration: string | number;
  thumbnail: string;
  category: string;
  instructor: string;
  description: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  tags: string[];
  isFree: boolean;
  videoUrl: string;
  equipment?: string[];
  views?: number;
  rating?: number;
}

export interface AppWithPlan extends ContentWithPlan {
  name: string;
  description: string;
  image: string;
  route: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  features: string[];
}

export interface ProductWithPlan extends ContentWithPlan {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  discountByPlan: Record<PlanTier, number>;
}

// Função para verificar acesso baseado no plano
export const hasAccessToContent = (contentPlan: PlanTier, userPlan: PlanTier | null): boolean => {
  if (contentPlan === 'FREE') return true;
  if (!userPlan) return false;
  
  const planHierarchy: Record<PlanTier, number> = {
    'FREE': 0,
    'B': 1,
    'C': 2,
    'D': 3
  };
  
  return planHierarchy[userPlan] >= planHierarchy[contentPlan];
};

// Função para obter o desconto baseado no plano
export const getDiscountByPlan = (discounts: Record<PlanTier, number>, userPlan: PlanTier | null): number => {
  if (!userPlan) return 0;
  return discounts[userPlan] || 0;
};

// Função para obter label do plano
export const getPlanLabel = (planTier: PlanTier): string => {
  const labels: Record<PlanTier, string> = {
    'FREE': 'Gratuito',
    'B': 'Base',
    'C': 'Escalada',
    'D': 'Auge'
  };
  return labels[planTier];
};

// Função para obter cor do plano
export const getPlanColor = (planTier: PlanTier): string => {
  const colors: Record<PlanTier, string> = {
    'FREE': 'bg-gray-500 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-emerald-500 text-white',
    'D': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
  };
  return colors[planTier];
};
