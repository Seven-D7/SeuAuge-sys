import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserActivityStats, initializeActivityTracking } from '../services/activity';
import { toast } from 'react-hot-toast';

export interface LevelSystem {
  currentLevel: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  maxLevel: number;
  lastLoginDate: string;
  consecutiveDays: number;
  lastBoostDate: string;
  totalBoostsReceived: number;
}

export interface XPGainLog {
  id: string;
  amount: number;
  reason: string;
  timestamp: Date;
  type: "goal" | "challenge" | "boost" | "bonus";
}

interface LevelStore {
  levelSystem: LevelSystem;
  xpHistory: XPGainLog[];
  addXP: (
    amount: number,
    reason: string,
    type?: "goal" | "challenge" | "boost" | "bonus",
  ) => void;
  checkDailyLogin: () => void;
  getLevelInfo: (level: number) => {
    xpRequired: number;
    title: string;
    color: string;
  };
  getProgressPercentage: () => number;
  getTotalXPForLevel: (level: number) => number;
  reset: () => void;
}

// Fórmula para calcular XP necessário por nível
const calculateXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  // Fórmula progressiva: cada nível requer mais XP
  // Nivel 2: 100 XP, Nivel 3: 150 XP, Nivel 4: 225 XP, etc.
  const baseXP = 100;
  const multiplier = Math.pow(1.15, level - 2); // Aumenta 15% a cada nível
  return Math.floor(baseXP * multiplier);
};

// Calcular XP total necessário até um nível específico
const calculateTotalXPForLevel = (targetLevel: number): number => {
  let totalXP = 0;
  for (let level = 2; level <= targetLevel; level++) {
    totalXP += calculateXPForLevel(level);
  }
  return totalXP;
};

// Títulos e cores por nível
const getLevelData = (level: number) => {
  if (level >= 45)
    return { title: "Mestre Supremo", color: "from-purple-600 to-pink-600" };
  if (level >= 40)
    return { title: "Lenda Viva", color: "from-yellow-500 to-orange-600" };
  if (level >= 35)
    return { title: "Campeão Elite", color: "from-red-500 to-red-700" };
  if (level >= 30)
    return { title: "Guerreiro Épico", color: "from-indigo-500 to-purple-600" };
  if (level >= 25)
    return {
      title: "Veterano Experiente",
      color: "from-green-600 to-emerald-700",
    };
  if (level >= 20)
    return {
      title: "Especialista Avançado",
      color: "from-blue-500 to-cyan-600",
    };
  if (level >= 15)
    return {
      title: "Praticante Dedicado",
      color: "from-teal-500 to-green-600",
    };
  if (level >= 10)
    return {
      title: "Estudante Comprometido",
      color: "from-emerald-500 to-teal-600",
    };
  if (level >= 5)
    return {
      title: "Iniciante Determinado",
      color: "from-lime-500 to-emerald-500",
    };
  return { title: "Novato Entusiasmado", color: "from-gray-400 to-gray-600" };
};

// XP por diferentes ações
const XP_REWARDS = {
  GOAL_COMPLETED: 50, // Meta diária concluída
  CHALLENGE_COMPLETED: 25, // Desafio concluído
  WEEKLY_GOAL: 100, // Meta semanal concluída
  MONTHLY_GOAL: 200, // Meta mensal concluída
  PERFECT_DAY: 75, // Todas as metas do dia concluídas
  STREAK_BONUS: 30, // Bonus por streak
  LOGIN_BONUS: 10, // Bonus por login diário
  FIVE_DAY_BOOST: 150, // Boost especial a cada 5 dias
};

const defaultLevelSystem: LevelSystem = {
  currentLevel: 1,
  currentXP: 0,
  totalXP: 0,
  xpToNextLevel: calculateXPForLevel(2),
  maxLevel: 50,
  lastLoginDate: "",
  consecutiveDays: 0,
  lastBoostDate: "",
  totalBoostsReceived: 0,
};

export const useLevelStore = create<LevelStore>()(
  persist(
    (set, get) => ({
      levelSystem: defaultLevelSystem,
      xpHistory: [],

      addXP: (amount, reason, type = "bonus") => {
        set((state) => {
          const newTotalXP = state.levelSystem.totalXP + amount;
          let newCurrentXP = state.levelSystem.currentXP + amount;
          let newLevel = state.levelSystem.currentLevel;
          const previousLevel = newLevel;

          // Verificar se subiu de nível
          while (
            newLevel < state.levelSystem.maxLevel &&
            newCurrentXP >= calculateXPForLevel(newLevel + 1)
          ) {
            newCurrentXP -= calculateXPForLevel(newLevel + 1);
            newLevel++;
          }

          const xpToNext =
            newLevel >= state.levelSystem.maxLevel
              ? 0
              : calculateXPForLevel(newLevel + 1) - newCurrentXP;

          // Criar log de XP
          const xpLog: XPGainLog = {
            id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            amount,
            reason,
            timestamp: new Date(),
            type,
          };

          // Show XP gain notification
          if (amount > 0) {
            toast.success(`+${amount} XP - ${reason}`, {
              duration: 3000,
              icon: '✨',
            });
          }

          // Check for level up and show special notification
          if (newLevel > previousLevel) {
            const { title } = getLevelData(newLevel);
            setTimeout(() => {
              toast.success(
                `🎉 Nível ${newLevel}! ${title}`,
                {
                  duration: 8000,
                  icon: '⬆️',
                }
              );
            }, 1000);
          }

          return {
            levelSystem: {
              ...state.levelSystem,
              currentLevel: newLevel,
              currentXP: newCurrentXP,
              totalXP: newTotalXP,
              xpToNextLevel: xpToNext,
            },
            xpHistory: [xpLog, ...state.xpHistory.slice(0, 49)], // Manter últimos 50 logs
          };
        });
      },

      checkDailyLogin: async () => {
        try {
          // Initialize activity tracking which handles daily login
          await initializeActivityTracking();

          // Get real activity stats
          const stats = await getUserActivityStats();

          set((state) => {
            const today = new Date().toDateString();
            const lastLogin = state.levelSystem.lastLoginDate;

            if (lastLogin === today) {
              return state; // Já fez login hoje
            }

            const newConsecutiveDays = stats.currentStreak;

            const updatedState = {
              ...state,
              levelSystem: {
                ...state.levelSystem,
                lastLoginDate: today,
                consecutiveDays: newConsecutiveDays,
              },
            };

            // Adicionar XP de login diário
            const { addXP } = get();
            setTimeout(() => {
              addXP(
                XP_REWARDS.LOGIN_BONUS,
                `🔑 Login diário (+${newConsecutiveDays} dias seguidos)`,
                "bonus",
              );

              // Verificar boost a cada 5 dias
              if (newConsecutiveDays > 0 && newConsecutiveDays % 5 === 0) {
                const lastBoost = state.levelSystem.lastBoostDate;
                const todayStr = today;

                if (lastBoost !== todayStr) {
                  addXP(
                    XP_REWARDS.FIVE_DAY_BOOST,
                    `🚀 Boost de 5 dias consecutivos! (${newConsecutiveDays} dias)`,
                    "boost",
                  );

                  toast.success(`🚀 Boost especial! ${newConsecutiveDays} dias consecutivos!`, {
                    duration: 5000,
                    icon: '🎉',
                  });

                  set((currentState) => ({
                    ...currentState,
                    levelSystem: {
                      ...currentState.levelSystem,
                      lastBoostDate: todayStr,
                      totalBoostsReceived:
                        currentState.levelSystem.totalBoostsReceived + 1,
                    },
                  }));
                }
              }

              // Special milestone notifications
              if (newConsecutiveDays === 1) {
                toast.success('🎆 Bem-vindo de volta!', { duration: 3000 });
              } else if (newConsecutiveDays === 30) {
                toast.success('🏆 30 dias consecutivos! Você é incrível!', { duration: 6000 });
              } else if (newConsecutiveDays === 100) {
                toast.success('🔥 100 dias! Você é uma lenda!', { duration: 8000 });
              }
            }, 100);

            return updatedState;
          });
        } catch (error) {
          console.error('Erro ao verificar login diário:', error);
        }
      },

      getLevelInfo: (level) => {
        const xpRequired = calculateXPForLevel(level);
        const { title, color } = getLevelData(level);
        return { xpRequired, title, color };
      },

      getProgressPercentage: () => {
        const state = get();
        const { currentXP, currentLevel, maxLevel } = state.levelSystem;

        if (currentLevel >= maxLevel) return 100;

        const xpForNextLevel = calculateXPForLevel(currentLevel + 1);
        return Math.round((currentXP / xpForNextLevel) * 100);
      },

      getTotalXPForLevel: calculateTotalXPForLevel,

      reset: () => {
        set({
          levelSystem: defaultLevelSystem,
          xpHistory: [],
        });
      },
    }),
    {
      name: "level-storage",
    },
  ),
);

// Funções utilitárias exportadas
export const XP_VALUES = XP_REWARDS;

export const calculateLevelFromTotalXP = (totalXP: number): number => {
  let level = 1;
  let accumulatedXP = 0;

  while (level < 50) {
    const xpForNextLevel = calculateXPForLevel(level + 1);
    if (accumulatedXP + xpForNextLevel > totalXP) break;
    accumulatedXP += xpForNextLevel;
    level++;
  }

  return level;
};

export const getLevelProgress = (currentXP: number, level: number) => {
  if (level >= 50)
    return { percentage: 100, xpCurrent: currentXP, xpRequired: 0 };

  const xpRequired = calculateXPForLevel(level + 1);
  const percentage = Math.min(Math.round((currentXP / xpRequired) * 100), 100);

  return {
    percentage,
    xpCurrent: currentXP,
    xpRequired,
  };
};
