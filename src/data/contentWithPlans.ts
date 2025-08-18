import { VideoWithPlan, AppWithPlan, ProductWithPlan, PlanTier } from '../types/content';

// Vídeos com tags de planos
export const videosWithPlans: VideoWithPlan[] = [
  {
    id: "yoga-matinal",
    title: "Yoga Matinal Energizante",
    description: "Comece seu dia com este fluxo energizante de yoga projetado para despertar seu corpo e mente.",
    category: "Yoga",
    duration: "15:30",
    difficulty: "Iniciante",
    instructor: "Maria Silva",
    videoUrl: "#",
    thumbnail: "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["yoga", "matinal", "energia"],
    planTier: "FREE",
    isPremium: false,
    isFree: true,
    planTags: ["Conteúdo gratuito"],
    equipment: ["tapete de yoga"],
    views: 1250,
    rating: 4.8,
  },
  {
    id: "nutricao-fundamentos",
    title: "Fundamentos da Nutrição",
    description: "Aprenda os fundamentos da alimentação saudável e planejamento de refeições com nutricionistas certificados.",
    category: "Nutrição",
    duration: "22:45",
    difficulty: "Iniciante",
    instructor: "Dr. João Santos",
    videoUrl: "#",
    thumbnail: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["nutrição", "alimentação", "saúde"],
    planTier: "B",
    isPremium: true,
    isFree: false,
    planTags: ["Plano Base ou superior"],
    equipment: [],
    views: 980,
    rating: 4.9,
  },
  {
    id: "meditacao-stress",
    title: "Meditação para Alívio do Estresse",
    description: "Meditação guiada para ajudá-lo a liberar tensões e encontrar paz interior.",
    category: "Bem-estar",
    duration: "12:20",
    difficulty: "Iniciante",
    instructor: "Ana Costa",
    videoUrl: "#",
    thumbnail: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["meditação", "estresse", "relaxamento"],
    planTier: "FREE",
    isPremium: false,
    isFree: true,
    planTags: ["Conteúdo gratuito"],
    equipment: [],
    views: 2100,
    rating: 4.7,
  },
  {
    id: "hiit-cardio",
    title: "HIIT Cardio Explosivo",
    description: "Treinamento intervalado de alta intensidade para acelerar seu metabolismo e queimar calorias.",
    category: "Cardio",
    duration: "18:15",
    difficulty: "Avançado",
    instructor: "Pedro Oliveira",
    videoUrl: "#",
    thumbnail: "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["hiit", "cardio", "queima de gordura"],
    planTier: "C",
    isPremium: true,
    isFree: false,
    planTags: ["Plano Escalada ou superior"],
    equipment: ["tapete", "cronômetro"],
    views: 1850,
    rating: 4.6,
  },
  {
    id: "pilates-core",
    title: "Pilates para Core Forte",
    description: "Desenvolva força no core e melhore a flexibilidade com esta aula fundamental de Pilates.",
    category: "Pilates",
    duration: "25:30",
    difficulty: "Intermediário",
    instructor: "Carla Mendes",
    videoUrl: "#",
    thumbnail: "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["pilates", "core", "flexibilidade"],
    planTier: "D",
    isPremium: true,
    isFree: false,
    planTags: ["Plano Auge exclusivo"],
    equipment: ["tapete", "bola de pilates"],
    views: 1420,
    rating: 4.8,
  },
  {
    id: "sono-qualidade",
    title: "Hábitos para Melhor Sono",
    description: "Descubra técnicas e hábitos para melhorar a qualidade do seu sono e acordar revigorado.",
    category: "Bem-estar",
    duration: "16:45",
    difficulty: "Iniciante",
    instructor: "Dr. Roberto Lima",
    videoUrl: "#",
    thumbnail: "https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["sono", "descanso", "hábitos"],
    planTier: "FREE",
    isPremium: false,
    isFree: true,
    planTags: ["Conteúdo gratuito"],
    equipment: [],
    views: 3200,
    rating: 4.9,
  },
];

// Apps com tags de planos
export const appsWithPlans: AppWithPlan[] = [
  {
    id: 'fitness-emagrecimento',
    name: '🔥 Emagrecimento Inteligente',
    title: 'Emagrecimento Inteligente',
    description: 'Módulo avançado de perda de peso com IA que se adapta ao seu perfil único, incluindo análise genética simulada.',
    image: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/emagrecimento',
    category: 'Perda de Peso',
    difficulty: 'Iniciante',
    duration: '30-45 min',
    planTier: 'B',
    isPremium: true,
    planTags: ['Plano Base ou superior', 'Análise com IA'],
    features: [
      'Análise genética simulada',
      'Algoritmos de predição de sucesso',
      'Plano nutricional personalizado',
      'Treinos adaptáveis',
      'Monitoramento de progresso'
    ],
  },
  {
    id: 'fitness-ganho-massa',
    name: '💪 Ganho de Massa',
    title: 'Ganho de Massa Muscular',
    description: 'Sistema completo de hipertrofia com algoritmos que calculam superávit calórico ideal e periodização automática.',
    image: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/ganho-massa',
    category: 'Hipertrofia',
    difficulty: 'Intermediário',
    duration: '60-75 min',
    planTier: 'B',
    isPremium: true,
    planTags: ['Plano Base ou superior'],
    features: [
      'Análise de tipo físico',
      'Cálculo preciso de superávit calórico',
      'Periodização linear',
      'Macronutrientes otimizados',
      'Distribuição inteligente de refeições'
    ],
  },
  {
    id: 'fitness-recomposicao',
    name: '🔄 Recomposição Corporal',
    title: 'Recomposição Corporal',
    description: 'Estratégia avançada para perda de gordura e ganho muscular simultâneos usando ciclagem calórica inteligente.',
    image: 'https://images.pexels.com/photos/135588/pexels-photo-135588.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/recomposicao',
    category: 'Transformação',
    difficulty: 'Avançado',
    duration: '45-60 min',
    planTier: 'C',
    isPremium: true,
    planTags: ['Plano Escalada ou superior', 'Estratégia avançada'],
    features: [
      'Análise de composição corporal',
      'Ciclagem calórica automatizada',
      'Treino híbrido (força + cardio)',
      'Estratégias conservadora/moderada/agressiva',
      'Monitoramento de massa magra'
    ],
  },
  {
    id: 'fitness-performance',
    name: '⚡ Performance Atlética',
    title: 'Performance Atlética',
    description: 'Otimização científica da performance esportiva com periodização específica e análise de movimento.',
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/performance',
    category: 'Esporte',
    difficulty: 'Avançado',
    duration: '60-90 min',
    planTier: 'D',
    isPremium: true,
    planTags: ['Plano Auge exclusivo', 'Performance avançada'],
    features: [
      'Periodização esporte-específica',
      'Análise de perfil atlético',
      'Testes de performance',
      'Estratégias de recuperação',
      'Projeções de melhoria'
    ],
  },
  {
    id: 'fitness-flexibilidade',
    name: '🧘 Flexibilidade & Mobilidade',
    title: 'Flexibilidade & Mobilidade',
    description: 'Sistema completo de melhoria da flexibilidade com análise postural e rotinas personalizadas.',
    image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/flexibilidade',
    category: 'Mobilidade',
    difficulty: 'Iniciante',
    duration: '20-30 min',
    planTier: 'FREE',
    isPremium: false,
    planTags: ['Conteúdo gratuito'],
    features: [
      'Análise postural digital',
      'Rotinas matinais e noturnas',
      'Progressão gradual e segura',
      'Exercícios específicos por região',
      'Integração com outros treinos'
    ],
  },
];

// Produtos com desconto por plano
export const productsWithPlans: ProductWithPlan[] = [
  {
    id: "whey-protein-premium",
    name: "Whey Protein Premium",
    title: "Whey Protein Premium",
    price: 149.9,
    originalPrice: 179.9,
    category: "Suplementos",
    description: "Proteína de alta qualidade para ganho de massa muscular",
    image: "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.8,
    reviewCount: 324,
    planTier: 'FREE',
    isPremium: false,
    planTags: ['Disponível para todos'],
    discountByPlan: {
      'FREE': 0,
      'B': 5,
      'C': 10,
      'D': 25
    }
  },
  {
    id: "tapete-yoga-antiderrapante",
    name: "Tapete de Yoga Antiderrapante",
    title: "Tapete de Yoga Antiderrapante",
    price: 89.9,
    category: "Equipamentos",
    description: "Tapete premium para práticas de yoga e pilates",
    image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.6,
    reviewCount: 156,
    planTier: 'FREE',
    isPremium: false,
    planTags: ['Disponível para todos'],
    discountByPlan: {
      'FREE': 0,
      'B': 5,
      'C': 15,
      'D': 25
    }
  },
  {
    id: "creatina-monohidratada",
    name: "Creatina Monohidratada",
    title: "Creatina Monohidratada",
    price: 79.9,
    originalPrice: 99.9,
    category: "Suplementos",
    description: "Creatina pura para aumento de força e performance",
    image: "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.9,
    reviewCount: 892,
    planTier: 'FREE',
    isPremium: false,
    planTags: ['Disponível para todos'],
    discountByPlan: {
      'FREE': 0,
      'B': 5,
      'C': 15,
      'D': 25
    }
  },
];

// Função para filtrar conteúdo por plano do usuário
export const filterContentByPlan = <T extends { planTier: PlanTier }>(
  content: T[],
  userPlan: PlanTier | null
): T[] => {
  if (!userPlan) {
    return content.filter(item => item.planTier === 'FREE');
  }

  const planHierarchy: Record<PlanTier, number> = {
    'FREE': 0,
    'B': 1,
    'C': 2,
    'D': 3
  };

  return content.filter(item => {
    return planHierarchy[userPlan] >= planHierarchy[item.planTier];
  });
};

// Função para obter conteúdo premium bloqueado
export const getBlockedContent = <T extends { planTier: PlanTier }>(
  content: T[],
  userPlan: PlanTier | null
): T[] => {
  if (!userPlan) {
    return content.filter(item => item.planTier !== 'FREE');
  }

  const planHierarchy: Record<PlanTier, number> = {
    'FREE': 0,
    'B': 1,
    'C': 2,
    'D': 3
  };

  return content.filter(item => {
    return planHierarchy[userPlan] < planHierarchy[item.planTier];
  });
};
