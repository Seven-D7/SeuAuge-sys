import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'mindfulness' | 'consistency' | 'social' | 'learning';
  type: 'milestone' | 'streak' | 'total' | 'special';
  icon: string;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  reward: {
    xp: number;
    badge?: string;
    title?: string;
    unlocks?: string[];
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  requirements: {
    type: 'watch_videos' | 'complete_workouts' | 'streak_days' | 'points_earned' | 'custom';
    target: number;
    current: number;
    description: string;
  }[];
  rewards: {
    xp: number;
    points?: number;
    badge?: string;
    unlocks?: string[];
  };
  participants: number;
  maxParticipants?: number;
}

export interface UserStats {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalVideosWatched: number;
  totalWorkoutsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // in minutes
  favoriteCategory: string;
  joinDate: Date;
  lastActivity: Date;
}

interface AchievementsState {
  achievements: Achievement[];
  challenges: Challenge[];
  userStats: UserStats;
  unlockedTitles: string[];
  currentTitle: string | null;
  
  // Actions
  initializeAchievements: () => void;
  updateProgress: (type: string, amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeChallenge: (challengeId: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  setCurrentTitle: (title: string) => void;
  getAchievementsByCategory: (category: string) => Achievement[];
  getActiveChallengess: () => Challenge[];
  getCompletedChallenges: () => Challenge[];
  getLevelProgress: () => { current: number; next: number; progress: number };
}

// Calculate level from XP
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// Calculate XP needed for next level
const xpForLevel = (level: number): number => {
  return Math.pow(level - 1, 2) * 100;
};

// Default achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Fitness Achievements
  {
    id: 'first_workout',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro treino',
    category: 'fitness',
    type: 'milestone',
    icon: '🏃‍♀️',
    requirement: 1,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 50, badge: 'starter', title: 'Iniciante' },
    rarity: 'common',
  },
  {
    id: 'workout_streak_7',
    title: 'Semana Dedicada',
    description: 'Mantenha uma sequência de 7 dias treinando',
    category: 'fitness',
    type: 'streak',
    icon: '🔥',
    requirement: 7,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 200, badge: 'dedicated', title: 'Dedicado' },
    rarity: 'rare',
  },
  {
    id: 'total_workouts_50',
    title: 'Guerreiro Fitness',
    description: 'Complete 50 treinos no total',
    category: 'fitness',
    type: 'total',
    icon: '💪',
    requirement: 50,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 500, badge: 'warrior', title: 'Guerreiro' },
    rarity: 'epic',
  },
  
  // Learning Achievements
  {
    id: 'first_video',
    title: 'Estudante Curioso',
    description: 'Assista ao seu primeiro vídeo',
    category: 'learning',
    type: 'milestone',
    icon: '📚',
    requirement: 1,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 25, badge: 'student' },
    rarity: 'common',
  },
  {
    id: 'videos_watched_100',
    title: 'Enciclopédia Viva',
    description: 'Assista a 100 vídeos',
    category: 'learning',
    type: 'total',
    icon: '🧠',
    requirement: 100,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 750, badge: 'scholar', title: 'Estudioso' },
    rarity: 'epic',
  },
  
  // Consistency Achievements
  {
    id: 'login_streak_30',
    title: 'Presença Constante',
    description: 'Faça login por 30 dias consecutivos',
    category: 'consistency',
    type: 'streak',
    icon: '📅',
    requirement: 30,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 300, badge: 'consistent', title: 'Consistente' },
    rarity: 'rare',
  },
  
  // Nutrition Achievements
  {
    id: 'nutrition_videos_10',
    title: 'Nutri Consciente',
    description: 'Assista a 10 vídeos de nutrição',
    category: 'nutrition',
    type: 'total',
    icon: '🥗',
    requirement: 10,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 150, badge: 'nutritionist', title: 'Nutri' },
    rarity: 'common',
  },
  
  // Mindfulness Achievements
  {
    id: 'mindfulness_sessions_20',
    title: 'Mente Zen',
    description: 'Complete 20 sessões de mindfulness',
    category: 'mindfulness',
    type: 'total',
    icon: '🧘‍♀️',
    requirement: 20,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 400, badge: 'zen', title: 'Zen Master' },
    rarity: 'rare',
  },
  
  // Special Achievements
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Complete treinos antes das 7h da manhã',
    category: 'special',
    type: 'special',
    icon: '🌅',
    requirement: 1,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 100, badge: 'early_bird', title: 'Madrugador' },
    rarity: 'rare',
  },
  {
    id: 'night_owl',
    title: 'Coruja Noturna',
    description: 'Complete treinos depois das 22h',
    category: 'special',
    type: 'special',
    icon: '🦉',
    requirement: 1,
    currentProgress: 0,
    isUnlocked: false,
    reward: { xp: 100, badge: 'night_owl', title: 'Coruja' },
    rarity: 'rare',
  },
];

// Default challenges
const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'daily_workout',
    title: 'Treino Diário',
    description: 'Complete pelo menos um treino hoje',
    category: 'daily',
    difficulty: 'easy',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isActive: true,
    isCompleted: false,
    requirements: [
      {
        type: 'complete_workouts',
        target: 1,
        current: 0,
        description: 'Complete 1 treino',
      },
    ],
    rewards: { xp: 50, points: 10 },
    participants: 1247,
  },
  {
    id: 'weekly_consistency',
    title: 'Semana Consistente',
    description: 'Treine pelo menos 5 dias nesta semana',
    category: 'weekly',
    difficulty: 'medium',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
    isCompleted: false,
    requirements: [
      {
        type: 'streak_days',
        target: 5,
        current: 0,
        description: 'Treine em 5 dias diferentes',
      },
    ],
    rewards: { xp: 200, points: 50, badge: 'weekly_warrior' },
    participants: 856,
  },
  {
    id: 'monthly_marathon',
    title: 'Maratona Mensal',
    description: 'Assista a 30 vídeos educativos este mês',
    category: 'monthly',
    difficulty: 'hard',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    isCompleted: false,
    requirements: [
      {
        type: 'watch_videos',
        target: 30,
        current: 0,
        description: 'Assista a 30 vídeos',
      },
    ],
    rewards: { xp: 500, points: 150, badge: 'knowledge_seeker' },
    participants: 423,
  },
];

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: [],
      challenges: [],
      userStats: {
        totalXP: 0,
        currentLevel: 1,
        xpToNextLevel: 100,
        totalVideosWatched: 0,
        totalWorkoutsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalTimeSpent: 0,
        favoriteCategory: '',
        joinDate: new Date(),
        lastActivity: new Date(),
      },
      unlockedTitles: [],
      currentTitle: null,

      initializeAchievements: () => {
        const state = get();
        if (state.achievements.length === 0) {
          set({
            achievements: DEFAULT_ACHIEVEMENTS,
            challenges: DEFAULT_CHALLENGES,
          });
        }
      },

      updateProgress: (type: string, amount: number = 1) => {
        const state = get();
        const now = new Date();
        
        // Update user stats
        const updatedStats = { ...state.userStats, lastActivity: now };
        
        switch (type) {
          case 'video_watched':
            updatedStats.totalVideosWatched += amount;
            break;
          case 'workout_completed':
            updatedStats.totalWorkoutsCompleted += amount;
            break;
          case 'time_spent':
            updatedStats.totalTimeSpent += amount;
            break;
        }

        // Update achievements progress
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.isUnlocked) return achievement;

          let shouldUpdate = false;
          let newProgress = achievement.currentProgress;

          // Check if this achievement should be updated based on the type
          switch (achievement.id) {
            case 'first_video':
            case 'videos_watched_100':
              if (type === 'video_watched') {
                newProgress = updatedStats.totalVideosWatched;
                shouldUpdate = true;
              }
              break;
            case 'first_workout':
            case 'total_workouts_50':
              if (type === 'workout_completed') {
                newProgress = updatedStats.totalWorkoutsCompleted;
                shouldUpdate = true;
              }
              break;
            case 'workout_streak_7':
            case 'login_streak_30':
              if (type === 'streak_updated') {
                newProgress = updatedStats.currentStreak;
                shouldUpdate = true;
              }
              break;
          }

          if (shouldUpdate) {
            const updated = { ...achievement, currentProgress: newProgress };
            
            // Check if achievement should be unlocked
            if (newProgress >= achievement.requirement && !achievement.isUnlocked) {
              get().unlockAchievement(achievement.id);
            }
            
            return updated;
          }

          return achievement;
        });

        // Update challenges progress
        const updatedChallenges = state.challenges.map(challenge => {
          if (challenge.isCompleted || !challenge.isActive) return challenge;

          const updatedRequirements = challenge.requirements.map(req => {
            let shouldUpdate = false;
            let newCurrent = req.current;

            switch (req.type) {
              case 'watch_videos':
                if (type === 'video_watched') {
                  newCurrent += amount;
                  shouldUpdate = true;
                }
                break;
              case 'complete_workouts':
                if (type === 'workout_completed') {
                  newCurrent += amount;
                  shouldUpdate = true;
                }
                break;
            }

            return shouldUpdate ? { ...req, current: newCurrent } : req;
          });

          const updated = { ...challenge, requirements: updatedRequirements };

          // Check if challenge is completed
          const isCompleted = updatedRequirements.every(req => req.current >= req.target);
          if (isCompleted && !challenge.isCompleted) {
            get().completeChallenge(challenge.id);
          }

          return updated;
        });

        set({
          userStats: updatedStats,
          achievements: updatedAchievements,
          challenges: updatedChallenges,
        });
      },

      unlockAchievement: (achievementId: string) => {
        const state = get();
        const achievement = state.achievements.find(a => a.id === achievementId);
        
        if (!achievement || achievement.isUnlocked) return;

        const updatedAchievements = state.achievements.map(a =>
          a.id === achievementId
            ? { ...a, isUnlocked: true, unlockedAt: new Date() }
            : a
        );

        // Add XP reward
        get().addXP(achievement.reward.xp);

        // Add title if available
        if (achievement.reward.title) {
          const updatedTitles = [...state.unlockedTitles, achievement.reward.title];
          set({ unlockedTitles: updatedTitles });
        }

        set({ achievements: updatedAchievements });

        // Show notification (you can integrate with toast notifications)
        console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
      },

      completeChallenge: (challengeId: string) => {
        const state = get();
        const challenge = state.challenges.find(c => c.id === challengeId);
        
        if (!challenge || challenge.isCompleted) return;

        const updatedChallenges = state.challenges.map(c =>
          c.id === challengeId
            ? { ...c, isCompleted: true, completedAt: new Date() }
            : c
        );

        // Add XP reward
        get().addXP(challenge.rewards.xp);

        set({ challenges: updatedChallenges });

        // Show notification
        console.log(`✅ Challenge Completed: ${challenge.title}`);
      },

      addXP: (amount: number) => {
        const state = get();
        const newTotalXP = state.userStats.totalXP + amount;
        const newLevel = calculateLevel(newTotalXP);
        const xpForNextLevel = xpForLevel(newLevel + 1);
        const xpToNextLevel = xpForNextLevel - newTotalXP;

        set({
          userStats: {
            ...state.userStats,
            totalXP: newTotalXP,
            currentLevel: newLevel,
            xpToNextLevel: xpToNextLevel,
          },
        });

        // Check for level up
        if (newLevel > state.userStats.currentLevel) {
          console.log(`🎉 Level Up! You are now level ${newLevel}`);
        }
      },

      updateStreak: () => {
        const state = get();
        const now = new Date();
        const lastActivity = new Date(state.userStats.lastActivity);
        const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak = state.userStats.currentStreak;

        if (daysDiff === 1) {
          // Continue streak
          newStreak += 1;
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = 1;
        }
        // If daysDiff === 0, same day, don't change streak

        const newLongestStreak = Math.max(state.userStats.longestStreak, newStreak);

        set({
          userStats: {
            ...state.userStats,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActivity: now,
          },
        });

        // Update streak-based achievements
        get().updateProgress('streak_updated');
      },

      setCurrentTitle: (title: string) => {
        const state = get();
        if (state.unlockedTitles.includes(title)) {
          set({ currentTitle: title });
        }
      },

      getAchievementsByCategory: (category: string) => {
        return get().achievements.filter(a => a.category === category);
      },

      getActiveChallengess: () => {
        const now = new Date();
        return get().challenges.filter(c => 
          c.isActive && 
          !c.isCompleted && 
          c.endDate > now
        );
      },

      getCompletedChallenges: () => {
        return get().challenges.filter(c => c.isCompleted);
      },

      getLevelProgress: () => {
        const state = get();
        const currentLevelXP = xpForLevel(state.userStats.currentLevel);
        const nextLevelXP = xpForLevel(state.userStats.currentLevel + 1);
        const progress = ((state.userStats.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

        return {
          current: state.userStats.currentLevel,
          next: state.userStats.currentLevel + 1,
          progress: Math.min(100, Math.max(0, progress)),
        };
      },
    }),
    {
      name: 'achievements-store',
      version: 1,
    }
  )
);
