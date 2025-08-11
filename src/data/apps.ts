export interface AppInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  route: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  features: string[];
}

export const apps: AppInfo[] = [
  {
    id: 'fitness-emagrecimento',
    name: '🔥 Emagrecimento Inteligente',
    description: 'Módulo avançado de perda de peso com IA que se adapta ao seu perfil único, incluindo análise genética simulada e algoritmos de predição de sucesso.',
    image: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/emagrecimento',
    category: 'Perda de Peso',
    difficulty: 'Iniciante',
    duration: '30-45 min',
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
    description: 'Sistema completo de hipertrofia com algoritmos que calculam superávit calórico ideal, periodização automática e planos específicos por tipo físico.',
    image: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/ganho-massa',
    category: 'Hipertrofia',
    difficulty: 'Intermediário',
    duration: '60-75 min',
    features: [
      'Análise de tipo físico (ectomorfo/mesomorfo/endomorfo)',
      'Cálculo preciso de superávit calórico',
      'Periodização linear com incremento progressivo',
      'Macronutrientes otimizados para ganho',
      'Distribuição inteligente de refeições'
    ],
  },
  {
    id: 'fitness-recomposicao',
    name: '🔄 Recomposição Corporal',
    description: 'Estratégia avançada para perda de gordura e ganho muscular simultâneos usando ciclagem calórica inteligente e treino híbrido.',
    image: 'https://images.pexels.com/photos/135588/pexels-photo-135588.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/recomposicao',
    category: 'Transformação',
    difficulty: 'Avançado',
    duration: '45-60 min',
    features: [
      'Análise de composição corporal detalhada',
      'Ciclagem calórica automatizada (alto/baixo/moderado)',
      'Treino híbrido (força + cardio)',
      'Estratégias conservadora/moderada/agressiva',
      'Monitoramento de massa magra vs. gordura'
    ],
  },
  {
    id: 'fitness-performance',
    name: '⚡ Performance Atlética',
    description: 'Otimização científica da performance esportiva com periodização específica, análise de movimento e estratégias de recuperação avançadas.',
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/performance',
    category: 'Esporte',
    difficulty: 'Avançado',
    duration: '60-90 min',
    features: [
      'Periodização esporte-específica em 3 fases',
      'Análise de perfil atlético personalizado',
      'Testes de performance (VO2, salto, velocidade)',
      'Estratégias de recuperação otimizadas',
      'Projeções de melhoria a curto/médio/longo prazo'
    ],
  },
  {
    id: 'fitness-flexibilidade',
    name: '🧘 Flexibilidade & Mobilidade',
    description: 'Sistema completo de melhoria da flexibilidade com análise postural, rotinas personalizadas e progressão científica.',
    image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/flexibilidade',
    category: 'Mobilidade',
    difficulty: 'Iniciante',
    duration: '20-30 min',
    features: [
      'Análise postural digital',
      'Rotinas matinais e noturnas',
      'Progressão gradual e segura',
      'Exercícios específicos por região',
      'Integração com outros treinos'
    ],
  },
  {
    id: 'fitness-idosos',
    name: '👴 Fitness Sênior',
    description: 'Programa especializado para adultos 60+ com foco em funcionalidade, prevenção de quedas e manutenção da independência.',
    image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/senior',
    category: 'Longevidade',
    difficulty: 'Iniciante',
    duration: '30-40 min',
    features: [
      'Avaliação de capacidade funcional',
      'Exercícios de prevenção de quedas',
      'Fortalecimento de ossos e articulações',
      'Adaptações para limitações físicas',
      'Progressão respeitosa e segura'
    ],
  },
  {
    id: 'fitness-reabilitacao',
    name: '🏥 Reabilitação Funcional',
    description: 'Protocolo de retorno gradual ao exercício pós-lesão com monitoramento de dor e progressão conservadora.',
    image: 'https://images.pexels.com/photos/7289719/pexels-photo-7289719.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/reabilitacao',
    category: 'Saúde',
    difficulty: 'Iniciante',
    duration: '25-35 min',
    features: [
      'Protocolos de retorno pós-lesão',
      'Monitoramento de dor e inflamação',
      'Exercícios de baixo impacto',
      'Progressão conservadora e segura',
      'Integração com fisioterapia'
    ],
  },
  {
    id: 'fitness-funcional',
    name: '🏃 Condicionamento Funcional',
    description: 'Treinos funcionais que melhoram movimentos do dia a dia com exercícios compostos e padrões naturais de movimento.',
    image: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/funcional',
    category: 'Funcional',
    difficulty: 'Intermediário',
    duration: '40-50 min',
    features: [
      'Padrões fundamentais de movimento',
      'Exercícios multiarticulares',
      'Treinamento de estabilidade',
      'Progressões funcionais',
      'Aplicação no dia a dia'
    ],
  },
  {
    id: 'fitness-corrida',
    name: '🏃‍♂️ Corrida Avançada',
    description: 'Programa científico completo para corredores de todos os níveis com análise de performance, planos personalizados e estratégias de prova.',
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/corrida',
    category: 'Corrida',
    difficulty: 'Intermediário',
    duration: '45-90 min',
    features: [
      'Análise de VO2 máx e performance',
      'Planos de treino periodizados',
      'Projeções de tempo científicas',
      'Estratégias de prova completas',
      'Programa de força complementar',
      'Dicas de nutrição e hidratação'
    ],
  },
];

// Categorizar apps por tipo
export const appsByCategory = {
  'Perda de Peso': apps.filter(app => app.category === 'Perda de Peso'),
  'Hipertrofia': apps.filter(app => app.category === 'Hipertrofia'),
  'Transformação': apps.filter(app => app.category === 'Transformação'),
  'Esporte': apps.filter(app => app.category === 'Esporte'),
  'Corrida': apps.filter(app => app.category === 'Corrida'),
  'Mobilidade': apps.filter(app => app.category === 'Mobilidade'),
  'Longevidade': apps.filter(app => app.category === 'Longevidade'),
  'Saúde': apps.filter(app => app.category === 'Saúde'),
  'Funcional': apps.filter(app => app.category === 'Funcional'),
};

// Filtros por dificuldade
export const appsByDifficulty = {
  'Iniciante': apps.filter(app => app.difficulty === 'Iniciante'),
  'Intermediário': apps.filter(app => app.difficulty === 'Intermediário'),
  'Avançado': apps.filter(app => app.difficulty === 'Avançado'),
};

// Apps recomendados baseados em perfil
export const getRecommendedApps = (userProfile: {
  goal?: string;
  experience?: string;
  age?: number;
  hasInjuries?: boolean;
}) => {
  let recommended = [...apps];

  // Filtrar por objetivo
  if (userProfile.goal === 'perda_peso') {
    recommended = recommended.filter(app => 
      ['Perda de Peso', 'Transformação', 'Funcional'].includes(app.category)
    );
  } else if (userProfile.goal === 'ganho_massa') {
    recommended = recommended.filter(app => 
      ['Hipertrofia', 'Transformação', 'Esporte'].includes(app.category)
    );
  } else if (userProfile.goal === 'performance') {
    recommended = recommended.filter(app => 
      ['Esporte', 'Funcional', 'Transformação'].includes(app.category)
    );
  }

  // Filtrar por experiência
  if (userProfile.experience === 'iniciante') {
    recommended = recommended.filter(app => 
      ['Iniciante', 'Intermediário'].includes(app.difficulty)
    );
  }

  // Filtrar por idade
  if (userProfile.age && userProfile.age >= 60) {
    recommended = recommended.filter(app => 
      ['Longevidade', 'Mobilidade', 'Saúde'].includes(app.category)
    );
  }

  // Filtrar por lesões
  if (userProfile.hasInjuries) {
    recommended = recommended.filter(app => 
      ['Saúde', 'Mobilidade', 'Longevidade'].includes(app.category)
    );
  }

  return recommended.slice(0, 4); // Retornar top 4 recomendações
};
