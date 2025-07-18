export interface Plan {
  id: "B" | "C" | "D";
  name: string;
  fullName: string;
  period: string;
  price: string;
  monthlyPrice?: string;
  originalPrice?: string;
  savings?: string;
  description: string;
  features: string[];
  discount?: string;
  badge?: string;
  isPopular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "B",
    name: "Plano Base",
    fullName: "Plano Base - Mensal",
    period: "MENSAL",
    price: "R$ 97",
    monthlyPrice: "R$ 97 / mês",
    description:
      "Quem quer a máxima flexibilidade ou deseja testar o acesso completo antes de um compromisso maior.",
    features: [
      "Acesso Total e Contínuo à Plataforma",
      'Acesso a todos os "Aplicativos" (Emagrecimento, Ganho de Massa, Performance, etc.)',
      "Acesso a toda a biblioteca de vídeos de treinos e aulas",
      "Uso limitado do Dashboard de Progresso e do sistema de Gamificação",
      "Novos Treinos e Receitas toda semana",
      "Descontos de 5% na Loja de Produtos",
    ],
    discount: "5%",
  },
  {
    id: "C",
    name: "Plano Escalada",
    fullName: "Plano Escalada - Trimestral",
    period: "TRIMESTRAL",
    price: "R$ 249",
    monthlyPrice: "R$ 83 / mês",
    originalPrice: "R$ 291",
    savings: "Economize R$ 42",
    description:
      "Quem já está comprometido com a jornada e quer um primeiro nível de desconto, pagando de forma mais espaçada.",
    features: [
      'Acesso a todos os "Aplicativos" (Emagrecimento, Ganho de Massa, Performance, etc.)',
      "Acesso a toda a biblioteca de vídeos de treinos e aulas",
      "Uso ilimitado do Dashboard de Progresso e do sistema de Gamificação",
      "Novos Treinos e Receitas toda semana",
      "Acesso Antecipado (Beta Access)",
      "Descontos de 10% a 15% na Loja de Produtos",
    ],
    discount: "10-15%",
  },
  {
    id: "D",
    name: "Plano Auge",
    fullName: "Plano Auge - CUME - Anual",
    period: "ANUAL",
    price: "R$ 780",
    monthlyPrice: "R$ 59,90 / mês",
    originalPrice: "R$ 1.164",
    savings: "Economize R$ 384",
    description:
      "Quem está 100% comprometido com sua performance e longevidade e busca o melhor custo-benefício, economizando no longo prazo.",
    features: [
      'Acesso a todos os "Aplicativos" (Emagrecimento, Ganho de Massa, Performance, etc.)',
      "Acesso a toda a biblioteca de vídeos de treinos e aulas",
      "Uso ilimitado do Dashboard de Progresso e do sistema de Gamificação",
      "Canal de Suporte Prioritário com nutricionistas I.A e treinadores",
      "Novos Treinos e Receitas toda semana",
      "Acesso Antecipado (Beta Access)",
      "Descontos de 25% na Loja de Produtos",
    ],
    discount: "25%",
    badge: "Mais Popular",
    isPopular: true,
  },
];
