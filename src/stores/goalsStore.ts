import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SmartGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: "fitness" | "nutrition" | "wellness" | "learning";
  difficulty: "easy" | "medium" | "hard";
  timeframe: "daily" | "weekly" | "monthly";
  createdAt: Date;
  deadline: Date;
  completed: boolean;
  streak: number;
  icon: string;
  color: string;
  rewards: string[];
  tips: string[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: string;
  icon: string;
  color: string;
}

interface GoalsStore {
  goals: SmartGoal[];
  dailyChallenges: DailyChallenge[];
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  addGoal: (
    goal: Omit<SmartGoal, "id" | "createdAt" | "completed" | "streak">,
  ) => void;
  updateGoalProgress: (id: string, newValue: number) => void;
  completeChallenge: (id: string) => void;
  generateSmartGoals: (userProfile: any) => void;
  generateDailyChallenges: () => void;
  resetDailyChallenges: () => void;
}

// Metas inteligentes baseadas no perfil do usuário
const generateSmartGoalsForProfile = (
  userProfile: any,
): Omit<SmartGoal, "id" | "createdAt" | "completed" | "streak">[] => {
  const baseGoals = [
    {
      title: "Hidratação Diária",
      description:
        "Manter o corpo hidratado é essencial para performance e saúde",
      targetValue: 2.5,
      currentValue: 0,
      unit: "litros",
      category: "wellness" as const,
      difficulty: "easy" as const,
      timeframe: "daily" as const,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: "💧",
      color: "text-blue-500",
      rewards: [
        "Melhor concentração",
        "Pele mais saudável",
        "Digestão otimizada",
      ],
      tips: [
        "Beba um copo ao acordar",
        "Tenha sempre uma garrafa por perto",
        "Use apps para lembrar",
      ],
    },
    {
      title: "Exercícios Semanais",
      description: "Manter uma rotina consistente de exercícios",
      targetValue: 4,
      currentValue: 0,
      unit: "treinos",
      category: "fitness" as const,
      difficulty: "medium" as const,
      timeframe: "weekly" as const,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: "💪",
      color: "text-red-500",
      rewards: ["Aumento da força", "Melhor humor", "Mais energia"],
      tips: [
        "Escolha atividades que gosta",
        "Comece devagar",
        "Varie os tipos de exercício",
      ],
    },
    {
      title: "Aprendizado Contínuo",
      description: "Assistir vídeos educativos na plataforma",
      targetValue: 5,
      currentValue: 0,
      unit: "vídeos",
      category: "learning" as const,
      difficulty: "easy" as const,
      timeframe: "weekly" as const,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: "🎓",
      color: "text-purple-500",
      rewards: [
        "Novos conhecimentos",
        "Melhores resultados",
        "Motivação renovada",
      ],
      tips: [
        "Reserve 20 min por dia",
        "Faça anotações",
        "Aplique o que aprendeu",
      ],
    },
    {
      title: "Sono Reparador",
      description: "Dormir pelo menos 7 horas por noite",
      targetValue: 7,
      currentValue: 0,
      unit: "horas",
      category: "wellness" as const,
      difficulty: "medium" as const,
      timeframe: "daily" as const,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: "😴",
      color: "text-indigo-500",
      rewards: ["Melhor recuperação", "Mais foco", "Sistema imune forte"],
      tips: [
        "Evite telas antes de dormir",
        "Mantenha o quarto escuro",
        "Crie uma rotina relaxante",
      ],
    },
    {
      title: "Alimentação Equilibrada",
      description: "Consumir pelo menos 5 porções de frutas e vegetais",
      targetValue: 5,
      currentValue: 0,
      unit: "porções",
      category: "nutrition" as const,
      difficulty: "medium" as const,
      timeframe: "daily" as const,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: "🥗",
      color: "text-green-500",
      rewards: ["Mais energia", "Melhor digestão", "Pele radiante"],
      tips: [
        "Varie as cores no prato",
        "Prepare lanches saudáveis",
        "Inclua em todas as refeições",
      ],
    },
  ];

  // Personalizar metas baseado no perfil do usuário
  if (userProfile?.plan === "D" || userProfile?.plan === "C") {
    baseGoals.push({
      title: "Meta Avançada de Performance",
      description: "Treino intensivo para maximizar resultados",
      targetValue: 6,
      currentValue: 0,
      unit: "treinos",
      category: "fitness" as const,
      difficulty: "hard" as const,
      timeframe: "weekly" as const,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: "🏆",
      color: "text-yellow-500",
      rewards: [
        "Performance máxima",
        "Resultados acelerados",
        "Superação de limites",
      ],
      tips: [
        "Foque na forma correta",
        "Aumente a intensidade gradualmente",
        "Descanse adequadamente",
      ],
    });
  }

  return baseGoals;
};

const generateDailyChallenges = (): DailyChallenge[] => [
  {
    id: "1",
    title: "Caminhada Matinal",
    description: "Faça uma caminhada de 10 minutos ao ar livre",
    points: 10,
    completed: false,
    category: "fitness",
    icon: "🚶‍♂️",
    color: "text-green-500",
  },
  {
    id: "2",
    title: "Momento Mindful",
    description: "Pratique 5 minutos de respiração consciente",
    points: 15,
    completed: false,
    category: "wellness",
    icon: "🧘‍♀️",
    color: "text-purple-500",
  },
  {
    id: "3",
    title: "Hidratação Plus",
    description: "Beba um copo extra de água agora",
    points: 5,
    completed: false,
    category: "wellness",
    icon: "💧",
    color: "text-blue-500",
  },
  {
    id: "4",
    title: "Aprendizado Express",
    description: "Assista um vídeo curto sobre nutrição",
    points: 20,
    completed: false,
    category: "learning",
    icon: "📚",
    color: "text-orange-500",
  },
];

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      goals: [],
      dailyChallenges: generateDailyChallenges(),
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,

      addGoal: (goalData) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goalData,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date(),
              completed: false,
              streak: 0,
            },
          ],
        })),

      updateGoalProgress: (id, newValue) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id === id) {
              const updated = { ...goal, currentValue: newValue };
              if (newValue >= goal.targetValue && !goal.completed) {
                updated.completed = true;
                updated.streak = goal.streak + 1;
              }
              return updated;
            }
            return goal;
          }),
        })),

      completeChallenge: (id) =>
        set((state) => {
          const challenge = state.dailyChallenges.find((c) => c.id === id);
          if (challenge && !challenge.completed) {
            const newTotalPoints = state.totalPoints + challenge.points;
            const completedChallenges =
              state.dailyChallenges.filter((c) => c.completed).length + 1;
            const newStreak =
              completedChallenges >= 2
                ? state.currentStreak + 1
                : state.currentStreak;

            return {
              dailyChallenges: state.dailyChallenges.map((c) =>
                c.id === id ? { ...c, completed: true } : c,
              ),
              totalPoints: newTotalPoints,
              currentStreak: newStreak,
              longestStreak: Math.max(state.longestStreak, newStreak),
            };
          }
          return state;
        }),

      generateSmartGoals: (userProfile) =>
        set((state) => ({
          goals: generateSmartGoalsForProfile(userProfile).map((goalData) => ({
            ...goalData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            completed: false,
            streak: 0,
          })),
        })),

      generateDailyChallenges: () =>
        set(() => ({
          dailyChallenges: generateDailyChallenges(),
        })),

      resetDailyChallenges: () =>
        set(() => ({
          dailyChallenges: generateDailyChallenges(),
        })),
    }),
    {
      name: "goals-storage",
    },
  ),
);
