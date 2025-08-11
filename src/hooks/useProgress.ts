import { useCallback } from 'react';
import { useAchievementsStore } from '../stores/achievementsStore';
import { useLevelStore } from '../stores/levelStore';
import { useGoalsStore } from '../stores/goalsStore';
import {
  logVideoWatched,
  logWorkoutCompleted,
  logGoalCompleted,
  logChallengeCompleted,
  getUserActivityStats
} from '../services/activity';
import {
  saveToCloud,
  loadFromCloud,
  forceSyncNow,
  restoreFromBackup,
  getSyncStatus
} from '../services/sync';

export const useProgress = () => {
  const achievementsStore = useAchievementsStore();
  const levelStore = useLevelStore();
  const goalsStore = useGoalsStore();

  // Function to track video watching
  const trackVideoWatched = useCallback(async (
    videoId: string, 
    duration?: number, 
    category?: string
  ) => {
    try {
      // Log activity
      await logVideoWatched(videoId, duration);
      
      // Update achievements
      await achievementsStore.updateProgress('video_watched', 1, {
        videoId,
        duration,
        category
      });
      
      // Add XP
      let xpAmount = 10; // Base XP for watching video
      if (duration) {
        // Bonus XP based on duration (1 XP per minute)
        xpAmount += Math.floor(duration / 60);
      }
      
      levelStore.addXP(xpAmount, `📺 Vídeo assistido${duration ? ` (${Math.floor(duration / 60)}min)` : ''}`, 'bonus');
      
    } catch (error) {
      console.error('Erro ao rastrear vídeo assistido:', error);
    }
  }, [achievementsStore, levelStore]);

  // Function to track workout completion
  const trackWorkoutCompleted = useCallback(async (
    workoutId: string, 
    duration?: number, 
    category?: string
  ) => {
    try {
      // Log activity
      await logWorkoutCompleted(workoutId, duration);
      
      // Update achievements
      await achievementsStore.updateProgress('workout_completed', 1, {
        workoutId,
        duration,
        category
      });
      
      // Add XP
      let xpAmount = 25; // Base XP for completing workout
      if (duration) {
        // Bonus XP based on duration (2 XP per minute)
        xpAmount += Math.floor(duration / 60) * 2;
      }
      
      levelStore.addXP(xpAmount, `💪 Treino concluído${duration ? ` (${Math.floor(duration / 60)}min)` : ''}`, 'bonus');
      
      // Update streak
      await achievementsStore.updateStreak();
      
    } catch (error) {
      console.error('Erro ao rastrear treino concluído:', error);
    }
  }, [achievementsStore, levelStore]);

  // Function to track goal progress
  const trackGoalProgress = useCallback((goalId: string, newValue: number) => {
    try {
      goalsStore.updateGoalProgress(goalId, newValue);
    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error);
    }
  }, [goalsStore]);

  // Function to complete challenge
  const completeChallenge = useCallback((challengeId: string) => {
    try {
      goalsStore.completeChallenge(challengeId);
    } catch (error) {
      console.error('Erro ao completar desafio:', error);
    }
  }, [goalsStore]);

  // Function to get current user stats
  const getCurrentStats = useCallback(async () => {
    try {
      const stats = await getUserActivityStats();
      return {
        ...stats,
        level: levelStore.levelSystem.currentLevel,
        totalXP: levelStore.levelSystem.totalXP,
        xpToNext: levelStore.levelSystem.xpToNextLevel,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }, [levelStore]);

  // Function to add custom XP
  const addXP = useCallback((amount: number, reason: string, type?: 'goal' | 'challenge' | 'boost' | 'bonus') => {
    levelStore.addXP(amount, reason, type);
  }, [levelStore]);

  // Function to get achievements by category
  const getAchievementsByCategory = useCallback((category: string) => {
    return achievementsStore.getAchievementsByCategory(category);
  }, [achievementsStore]);

  // Function to get active challenges
  const getActiveChallenges = useCallback(() => {
    return achievementsStore.getActiveChallenges();
  }, [achievementsStore]);

  // Function to get level progress
  const getLevelProgress = useCallback(() => {
    return levelStore.getLevelProgress();
  }, [levelStore]);

  // Function to get level info
  const getLevelInfo = useCallback((level: number) => {
    return levelStore.getLevelInfo(level);
  }, [levelStore]);

  // Function to track time spent (for any activity)
  const trackTimeSpent = useCallback(async (minutes: number, activity: string) => {
    try {
      await achievementsStore.updateProgress('time_spent', minutes);
      
      // Small XP bonus for time spent
      const xpAmount = Math.floor(minutes / 5); // 1 XP per 5 minutes
      if (xpAmount > 0) {
        levelStore.addXP(xpAmount, `⏱️ ${minutes}min em ${activity}`, 'bonus');
      }
    } catch (error) {
      console.error('Erro ao rastrear tempo gasto:', error);
    }
  }, [achievementsStore, levelStore]);

  // Function to refresh all gamification data
  const refreshGamificationData = useCallback(async () => {
    try {
      await achievementsStore.initializeAchievements();
      await achievementsStore.updateStreak();
      await levelStore.checkDailyLogin();
    } catch (error) {
      console.error('Erro ao atualizar dados de gamificação:', error);
    }
  }, [achievementsStore, levelStore]);

  // Sync functions
  const saveProgress = useCallback(async () => {
    try {
      await saveToCloud();
      return true;
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      return false;
    }
  }, []);

  const loadProgress = useCallback(async () => {
    try {
      return await loadFromCloud();
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      return false;
    }
  }, []);

  const forceSync = useCallback(async () => {
    try {
      await forceSyncNow();
      return true;
    } catch (error) {
      console.error('Erro ao forçar sincronização:', error);
      return false;
    }
  }, []);

  const restoreProgress = useCallback(async () => {
    try {
      return await restoreFromBackup();
    } catch (error) {
      console.error('Erro ao restaurar progresso:', error);
      return false;
    }
  }, []);

  const getSyncInfo = useCallback(() => {
    return getSyncStatus();
  }, []);

  return {
    // Tracking functions
    trackVideoWatched,
    trackWorkoutCompleted,
    trackGoalProgress,
    completeChallenge,
    trackTimeSpent,
    addXP,

    // Data functions
    getCurrentStats,
    getAchievementsByCategory,
    getActiveChallenges,
    getLevelProgress,
    getLevelInfo,
    refreshGamificationData,

    // Sync functions
    saveProgress,
    loadProgress,
    forceSync,
    restoreProgress,
    getSyncInfo,
    
    // Store data
    achievements: achievementsStore.achievements,
    challenges: achievementsStore.challenges,
    userStats: achievementsStore.userStats,
    levelSystem: levelStore.levelSystem,
    xpHistory: levelStore.xpHistory,
    goals: goalsStore.goals,
    dailyChallenges: goalsStore.dailyChallenges,
    
    // Store actions
    achievementsActions: {
      initializeAchievements: achievementsStore.initializeAchievements,
      updateProgress: achievementsStore.updateProgress,
      unlockAchievement: achievementsStore.unlockAchievement,
      addXP: achievementsStore.addXP,
      updateStreak: achievementsStore.updateStreak,
    },
    
    levelActions: {
      addXP: levelStore.addXP,
      checkDailyLogin: levelStore.checkDailyLogin,
      reset: levelStore.reset,
    },
    
    goalsActions: {
      addGoal: goalsStore.addGoal,
      updateGoalProgress: goalsStore.updateGoalProgress,
      completeChallenge: goalsStore.completeChallenge,
      generateSmartGoals: goalsStore.generateSmartGoals,
      resetDailyChallenges: goalsStore.resetDailyChallenges,
    }
  };
};

export default useProgress;
