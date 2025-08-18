import { useAchievementsStore } from '../stores/achievementsStore';
import { useLevelStore } from '../stores/levelStore';
import { logUserActivity, logWorkoutCompleted, logVideoWatched } from './activity';

export interface GamificationEvent {
  type: 'video_watched' | 'workout_completed' | 'goal_achieved' | 'login' | 'streak_milestone';
  data?: {
    videoId?: string;
    workoutId?: string;
    goalId?: string;
    duration?: number;
    category?: string;
    streak?: number;
  };
}

class GamificationService {
  private achievementsStore = useAchievementsStore.getState();
  private levelStore = useLevelStore.getState();

  // Processar evento de gamificação
  async processEvent(event: GamificationEvent): Promise<void> {
    try {
      switch (event.type) {
        case 'video_watched':
          await this.handleVideoWatched(event.data);
          break;
        case 'workout_completed':
          await this.handleWorkoutCompleted(event.data);
          break;
        case 'goal_achieved':
          await this.handleGoalAchieved(event.data);
          break;
        case 'login':
          await this.handleDailyLogin();
          break;
        case 'streak_milestone':
          await this.handleStreakMilestone(event.data);
          break;
      }
    } catch (error) {
      console.error('Erro ao processar evento de gamificação:', error);
    }
  }

  private async handleVideoWatched(data?: GamificationEvent['data']): Promise<void> {
    if (!data?.videoId) return;

    // Registrar atividade
    await logVideoWatched(data.videoId, data.duration);

    // Atualizar progresso de conquistas
    await this.achievementsStore.updateProgress('video_watched', 1, {
      videoId: data.videoId,
      duration: data.duration,
      category: data.category
    });

    // XP baseado na duração do vídeo
    let xpReward = 10; // XP base
    if (data.duration) {
      xpReward += Math.floor(data.duration / 60) * 2; // +2 XP por minuto
    }

    this.levelStore.addXP(xpReward, '📹 Vídeo assistido', 'bonus');
  }

  private async handleWorkoutCompleted(data?: GamificationEvent['data']): Promise<void> {
    if (!data?.workoutId) return;

    // Registrar atividade
    await logWorkoutCompleted(data.workoutId, data.duration);

    // Atualizar progresso de conquistas
    await this.achievementsStore.updateProgress('workout_completed', 1, {
      workoutId: data.workoutId,
      duration: data.duration,
      category: data.category
    });

    // XP baseado na duração e intensidade do treino
    let xpReward = 25; // XP base para treinos
    if (data.duration) {
      xpReward += Math.floor(data.duration / 60) * 5; // +5 XP por minuto
    }

    // Bonus por categoria
    if (data.category === 'high_intensity') {
      xpReward += 15;
    }

    this.levelStore.addXP(xpReward, '💪 Treino concluído', 'goal');
  }

  private async handleGoalAchieved(data?: GamificationEvent['data']): Promise<void> {
    if (!data?.goalId) return;

    // XP por meta alcançada
    this.levelStore.addXP(50, '🎯 Meta alcançada', 'goal');
  }

  private async handleDailyLogin(): Promise<void> {
    // Check daily login (handled in levelStore)
    await this.levelStore.checkDailyLogin();
    
    // Update achievements
    await this.achievementsStore.updateStreak();
  }

  private async handleStreakMilestone(data?: GamificationEvent['data']): Promise<void> {
    if (!data?.streak) return;

    const streakRewards = {
      7: 100,   // 1 semana
      30: 300,  // 1 mês
      60: 600,  // 2 meses
      100: 1000, // 100 dias
      365: 2500  // 1 ano
    };

    const reward = streakRewards[data.streak as keyof typeof streakRewards];
    if (reward) {
      this.levelStore.addXP(reward, `🔥 ${data.streak} dias consecutivos!`, 'bonus');
    }
  }

  // Métodos de conveniência
  async trackVideoWatched(videoId: string, duration?: number, category?: string): Promise<void> {
    await this.processEvent({
      type: 'video_watched',
      data: { videoId, duration, category }
    });
  }

  async trackWorkoutCompleted(workoutId: string, duration?: number, category?: string): Promise<void> {
    await this.processEvent({
      type: 'workout_completed',
      data: { workoutId, duration, category }
    });
  }

  async trackGoalAchieved(goalId: string): Promise<void> {
    await this.processEvent({
      type: 'goal_achieved',
      data: { goalId }
    });
  }

  async trackDailyLogin(): Promise<void> {
    await this.processEvent({ type: 'login' });
  }

  async trackStreakMilestone(streak: number): Promise<void> {
    await this.processEvent({
      type: 'streak_milestone',
      data: { streak }
    });
  }

  // Obter estatísticas de gamificação
  getGamificationStats() {
    const achievements = this.achievementsStore.achievements;
    const level = this.levelStore.levelSystem;

    return {
      level: level.currentLevel,
      totalXP: level.totalXP,
      currentStreak: level.consecutiveDays,
      unlockedAchievements: achievements.filter(a => a.isUnlocked).length,
      totalAchievements: achievements.length,
      progressToNextLevel: this.levelStore.getProgressPercentage()
    };
  }
}

// Instância singleton
export const gamificationService = new GamificationService();

// Hook para usar o serviço de gamificação
export const useGamification = () => {
  return {
    trackVideoWatched: gamificationService.trackVideoWatched.bind(gamificationService),
    trackWorkoutCompleted: gamificationService.trackWorkoutCompleted.bind(gamificationService),
    trackGoalAchieved: gamificationService.trackGoalAchieved.bind(gamificationService),
    trackDailyLogin: gamificationService.trackDailyLogin.bind(gamificationService),
    trackStreakMilestone: gamificationService.trackStreakMilestone.bind(gamificationService),
    getStats: gamificationService.getGamificationStats.bind(gamificationService)
  };
};
