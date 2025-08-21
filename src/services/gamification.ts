import { supabase } from '../lib/supabase';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'nutrition' | 'streak' | 'social' | 'challenge' | 'milestone';
  condition_type: 'count' | 'streak' | 'total' | 'percentage' | 'specific';
  condition_value: number;
  xp_reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  is_active: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  category: string;
  target_value: number;
  xp_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
}

export interface UserChallengeProgress {
  id: string;
  user_id: string;
  challenge_id: string;
  current_value: number;
  target_value: number;
  completed: boolean;
  date: string;
  completed_at?: string;
  challenge?: DailyChallenge;
}

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPForLevel: number;
  nextLevelXP: number;
  progress: number; // Percentage to next level
}

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  total_workouts: number;
  achievements_count: number;
  position: number;
}

export interface GamificationSummary {
  level: LevelInfo;
  achievements: {
    total: number;
    recent: UserAchievement[];
    categories: Record<string, number>;
  };
  challenges: {
    daily: UserChallengeProgress[];
    completed_today: number;
    total_completed: number;
  };
  streaks: {
    current: number;
    longest: number;
    today_active: boolean;
  };
  leaderboard_position?: number;
}

class GamificationService {
  // Get all available achievements
  async getAchievements(): Promise<{ data: Achievement[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching achievements:', error);
        return { data: null, error: 'Erro ao buscar conquistas' };
      }

      return { data: data || [], error: null };

    } catch (error: any) {
      console.error('Get achievements error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get user achievements
  async getUserAchievements(): Promise<{ data: UserAchievement[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching user achievements:', error);
        return { data: null, error: 'Erro ao buscar conquistas do usuário' };
      }

      return { data: data || [], error: null };

    } catch (error: any) {
      console.error('Get user achievements error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Award achievement to user
  async awardAchievement(achievementId: string): Promise<{ success: boolean; error?: string; achievement?: Achievement }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Check if achievement exists
      const { data: achievement, error: achievementError } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .eq('is_active', true)
        .single();

      if (achievementError || !achievement) {
        return { success: false, error: 'Conquista não encontrada' };
      }

      // Check if already awarded
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_id', achievementId)
        .single();

      if (existing) {
        return { success: false, error: 'Conquista já desbloqueada' };
      }

      // Award achievement
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
        });

      if (insertError) {
        console.error('Error awarding achievement:', insertError);
        return { success: false, error: 'Erro ao conceder conquista' };
      }

      // Update user stats with XP reward
      await this.addXP(user.id, achievement.xp_reward);

      // Update achievements count
      const { error: statsError } = await supabase
        .from('user_stats')
        .update({
          achievements_count: supabase.sql`achievements_count + 1`,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (statsError) {
        console.error('Error updating achievement count:', statsError);
      }

      return { success: true, achievement };

    } catch (error: any) {
      console.error('Award achievement error:', error);
      return { success: false, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Check and award automatic achievements
  async checkAchievements(): Promise<UserAchievement[]> {
    const newAchievements: UserAchievement[] = [];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return newAchievements;

      // Get user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userStats) return newAchievements;

      // Get all achievements
      const { data: achievements } = await this.getAchievements();
      if (!achievements) return newAchievements;

      // Get user's existing achievements
      const { data: userAchievements } = await this.getUserAchievements();
      const unlockedIds = new Set((userAchievements || []).map(ua => ua.achievement_id));

      // Check each achievement
      for (const achievement of achievements) {
        if (unlockedIds.has(achievement.id)) continue;

        const shouldAward = await this.checkAchievementCondition(achievement, userStats);
        
        if (shouldAward) {
          const result = await this.awardAchievement(achievement.id);
          if (result.success && result.achievement) {
            newAchievements.push({
              id: '',
              user_id: user.id,
              achievement_id: achievement.id,
              unlocked_at: new Date().toISOString(),
              achievement: result.achievement,
            });
          }
        }
      }

    } catch (error) {
      console.error('Error checking achievements:', error);
    }

    return newAchievements;
  }

  // Get daily challenges
  async getDailyChallenges(): Promise<{ data: DailyChallenge[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('is_active', true)
        .order('difficulty', { ascending: true });

      if (error) {
        console.error('Error fetching daily challenges:', error);
        return { data: null, error: 'Erro ao buscar desafios diários' };
      }

      return { data: data || [], error: null };

    } catch (error: any) {
      console.error('Get daily challenges error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get user's daily challenge progress
  async getUserChallengeProgress(date?: string): Promise<{ data: UserChallengeProgress[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const targetDate = date || new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('user_challenge_progress')
        .select(`
          *,
          challenge:daily_challenges(*)
        `)
        .eq('user_id', user.id)
        .eq('date', targetDate);

      if (error) {
        console.error('Error fetching challenge progress:', error);
        return { data: null, error: 'Erro ao buscar progresso dos desafios' };
      }

      return { data: data || [], error: null };

    } catch (error: any) {
      console.error('Get challenge progress error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Update challenge progress
  async updateChallengeProgress(challengeId: string, value: number): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      const today = new Date().toISOString().split('T')[0];

      // Get challenge details
      const { data: challenge } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (!challenge) {
        return { error: 'Desafio não encontrado' };
      }

      // Get existing progress
      const { data: existingProgress } = await supabase
        .from('user_challenge_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)
        .eq('date', today)
        .single();

      const newValue = Math.min(value, challenge.target_value);
      const completed = newValue >= challenge.target_value;

      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('user_challenge_progress')
          .update({
            current_value: newValue,
            completed,
            completed_at: completed && !existingProgress.completed ? new Date().toISOString() : existingProgress.completed_at,
          })
          .eq('id', existingProgress.id);

        if (error) {
          console.error('Error updating challenge progress:', error);
          return { error: 'Erro ao atualizar progresso do desafio' };
        }

        // Award XP if newly completed
        if (completed && !existingProgress.completed) {
          await this.addXP(user.id, challenge.xp_reward);
        }
      } else {
        // Create new progress
        const { error } = await supabase
          .from('user_challenge_progress')
          .insert({
            user_id: user.id,
            challenge_id: challengeId,
            current_value: newValue,
            target_value: challenge.target_value,
            completed,
            date: today,
            completed_at: completed ? new Date().toISOString() : null,
          });

        if (error) {
          console.error('Error creating challenge progress:', error);
          return { error: 'Erro ao criar progresso do desafio' };
        }

        // Award XP if completed
        if (completed) {
          await this.addXP(user.id, challenge.xp_reward);
        }
      }

      return { error: null };

    } catch (error: any) {
      console.error('Update challenge progress error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Calculate level from XP
  calculateLevel(xp: number): LevelInfo {
    // XP formula: level 1 = 0-99, level 2 = 100-249, level 3 = 250-449, etc.
    // Each level requires: 100 + (level - 1) * 150 additional XP
    
    let level = 1;
    let totalXPForLevel = 0;
    let xpNeeded = 100; // XP needed for level 2

    while (xp >= totalXPForLevel + xpNeeded) {
      totalXPForLevel += xpNeeded;
      level++;
      xpNeeded = 100 + (level - 1) * 150;
    }

    const currentXP = xp - totalXPForLevel;
    const nextLevelXP = totalXPForLevel + xpNeeded;
    const xpToNextLevel = xpNeeded - currentXP;
    const progress = (currentXP / xpNeeded) * 100;

    return {
      level,
      currentXP,
      xpToNextLevel,
      totalXPForLevel,
      nextLevelXP,
      progress: Math.min(progress, 100),
    };
  }

  // Add XP to user
  async addXP(userId: string, xp: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          total_xp: supabase.sql`total_xp + ${xp}`,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error adding XP:', error);
      }

      // Update level if needed
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('total_xp, level')
        .eq('user_id', userId)
        .single();

      if (userStats) {
        const levelInfo = this.calculateLevel(userStats.total_xp);
        
        if (levelInfo.level > userStats.level) {
          await supabase
            .from('user_stats')
            .update({
              level: levelInfo.level,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);
        }
      }

    } catch (error) {
      console.error('Error in addXP:', error);
    }
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 50): Promise<{ data: LeaderboardEntry[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select(`
          user_id,
          total_xp,
          level,
          total_workouts,
          achievements_count,
          user_profiles!inner(name, avatar_url)
        `)
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return { data: null, error: 'Erro ao buscar ranking' };
      }

      const leaderboard: LeaderboardEntry[] = (data || []).map((entry, index) => ({
        user_id: entry.user_id,
        user_name: (entry.user_profiles as any)?.name || 'Usuário',
        avatar_url: (entry.user_profiles as any)?.avatar_url,
        total_xp: entry.total_xp,
        level: entry.level,
        total_workouts: entry.total_workouts,
        achievements_count: entry.achievements_count,
        position: index + 1,
      }));

      return { data: leaderboard, error: null };

    } catch (error: any) {
      console.error('Get leaderboard error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get gamification summary for dashboard
  async getGamificationSummary(): Promise<{ data: GamificationSummary | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      // Get user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userStats) {
        return { data: null, error: 'Dados do usuário não encontrados' };
      }

      // Get user achievements
      const { data: userAchievements } = await this.getUserAchievements();
      
      // Get today's challenge progress
      const { data: todaysChallenges } = await this.getUserChallengeProgress();

      // Calculate level info
      const levelInfo = this.calculateLevel(userStats.total_xp);

      // Group achievements by category
      const achievementsByCategory: Record<string, number> = {};
      (userAchievements || []).forEach(ua => {
        if (ua.achievement) {
          const category = ua.achievement.category;
          achievementsByCategory[category] = (achievementsByCategory[category] || 0) + 1;
        }
      });

      // Check if user was active today
      const today = new Date().toISOString().split('T')[0];
      const todayActive = userStats.last_activity_date === today;

      const summary: GamificationSummary = {
        level: levelInfo,
        achievements: {
          total: userAchievements?.length || 0,
          recent: (userAchievements || []).slice(0, 5),
          categories: achievementsByCategory,
        },
        challenges: {
          daily: todaysChallenges || [],
          completed_today: (todaysChallenges || []).filter(c => c.completed).length,
          total_completed: userStats.challenges_completed || 0,
        },
        streaks: {
          current: userStats.current_streak,
          longest: userStats.longest_streak,
          today_active: todayActive,
        },
      };

      return { data: summary, error: null };

    } catch (error: any) {
      console.error('Get gamification summary error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Private methods
  private async checkAchievementCondition(achievement: Achievement, userStats: any): Promise<boolean> {
    switch (achievement.condition_type) {
      case 'count':
        return this.checkCountCondition(achievement, userStats);
      case 'streak':
        return userStats.current_streak >= achievement.condition_value;
      case 'total':
        return this.checkTotalCondition(achievement, userStats);
      default:
        return false;
    }
  }

  private checkCountCondition(achievement: Achievement, userStats: any): boolean {
    switch (achievement.category) {
      case 'workout':
        return userStats.total_workouts >= achievement.condition_value;
      case 'challenge':
        return (userStats.challenges_completed || 0) >= achievement.condition_value;
      default:
        return false;
    }
  }

  private checkTotalCondition(achievement: Achievement, userStats: any): boolean {
    switch (achievement.category) {
      case 'workout':
        return userStats.total_minutes_exercised >= achievement.condition_value;
      default:
        return false;
    }
  }
}

// Export singleton instance
export const gamificationService = new GamificationService();
export default gamificationService;
