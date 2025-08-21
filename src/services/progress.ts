import { supabase } from '../lib/supabase';
import { metricsService } from './metrics';

export interface UserProgress {
  user_id: string;
  total_workouts: number;
  total_minutes_exercised: number;
  total_calories_burned: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_xp: number;
  level: number;
  achievements_count: number;
  videos_watched: number;
  challenges_completed: number;
}

export interface WeeklyProgress {
  week: string;
  workouts: number;
  minutes: number;
  calories: number;
  videos: number;
}

export interface MonthlyProgress {
  month: string;
  workouts: number;
  minutes: number;
  calories: number;
  videos: number;
  achievements: number;
}

export interface ProgressGoal {
  id: string;
  user_id: string;
  type: 'weight_loss' | 'muscle_gain' | 'fitness' | 'nutrition' | 'habits';
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string;
  created_at: string;
  completed: boolean;
  completed_at?: string;
}

export interface DashboardSummary {
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  level: number;
  totalXP: number;
  achievementsCount: number;
  recentActivities: Array<{
    type: string;
    title: string;
    date: string;
    xp?: number;
  }>;
  weeklyStats: {
    workouts: number[];
    minutes: number[];
    days: string[];
  };
}

class ProgressService {
  // Get user progress stats
  async getUserProgress(): Promise<{ data: UserProgress | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user progress:', error);
        return { data: null, error: 'Erro ao buscar progresso do usuário' };
      }

      // If no stats exist, create initial stats
      if (!data) {
        const initialStats = await this.createInitialStats(user.id);
        return { data: initialStats, error: null };
      }

      return { data: data as UserProgress, error: null };

    } catch (error: any) {
      console.error('Get user progress error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Update user progress
  async updateProgress(updates: Partial<UserProgress>): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating progress:', error);
        return { error: 'Erro ao atualizar progresso' };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Update progress error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Log workout completion
  async logWorkout(duration: number, calories: number, workoutType: string): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      // Log activity
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'workout',
          title: `Treino de ${workoutType}`,
          description: `Treino concluído em ${duration} minutos`,
          duration_minutes: duration,
          calories_burned: calories,
          metadata: { workout_type: workoutType },
        });

      if (activityError) {
        console.error('Error logging workout activity:', activityError);
        return { error: 'Erro ao registrar treino' };
      }

      // Update user stats
      const { data: currentStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const today = new Date().toISOString().split('T')[0];
      const lastActivityDate = currentStats?.last_activity_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Calculate streak
      let newStreak = 1;
      if (lastActivityDate === yesterdayStr) {
        newStreak = (currentStats?.current_streak || 0) + 1;
      } else if (lastActivityDate === today) {
        newStreak = currentStats?.current_streak || 1;
      }

      const updates = {
        total_workouts: (currentStats?.total_workouts || 0) + 1,
        total_minutes_exercised: (currentStats?.total_minutes_exercised || 0) + duration,
        total_calories_burned: (currentStats?.total_calories_burned || 0) + calories,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, currentStats?.longest_streak || 0),
        last_activity_date: today,
        total_xp: (currentStats?.total_xp || 0) + this.calculateWorkoutXP(duration, calories),
      };

      await this.updateProgress(updates);

      // Check for achievements
      await this.checkWorkoutAchievements(user.id, updates);

      return { error: null };

    } catch (error: any) {
      console.error('Log workout error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Log video completion
  async logVideoWatched(videoId: string, duration: number): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      // Log activity
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'video_watched',
          title: 'Vídeo assistido',
          description: `Vídeo assistido por ${duration} minutos`,
          duration_minutes: duration,
          metadata: { video_id: videoId },
        });

      if (activityError) {
        console.error('Error logging video activity:', activityError);
        return { error: 'Erro ao registrar vídeo assistido' };
      }

      // Update user stats
      const { data: currentStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const updates = {
        videos_watched: (currentStats?.videos_watched || 0) + 1,
        total_xp: (currentStats?.total_xp || 0) + this.calculateVideoXP(duration),
      };

      await this.updateProgress(updates);

      return { error: null };

    } catch (error: any) {
      console.error('Log video watched error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get weekly progress
  async getWeeklyProgress(weeks: number = 4): Promise<{ data: WeeklyProgress[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (weeks * 7));

      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly progress:', error);
        return { data: null, error: 'Erro ao buscar progresso semanal' };
      }

      const weeklyData = this.groupActivitiesByWeek(activities || []);
      return { data: weeklyData, error: null };

    } catch (error: any) {
      console.error('Get weekly progress error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get dashboard summary
  async getDashboardSummary(): Promise<{ data: DashboardSummary | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      // Get user stats
      const { data: userProgress } = await this.getUserProgress();
      if (!userProgress) {
        return { data: null, error: 'Erro ao buscar dados do usuário' };
      }

      // Get recent activities (last 10)
      const { data: recentActivities } = await supabase
        .from('user_activities')
        .select('activity_type, title, completed_at, metadata')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      // Get last 7 days activities for weekly chart
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const { data: weekActivities } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', last7Days.toISOString())
        .order('completed_at', { ascending: true });

      const weeklyStats = this.calculateWeeklyStats(weekActivities || []);

      const summary: DashboardSummary = {
        totalWorkouts: userProgress.total_workouts,
        totalMinutes: userProgress.total_minutes_exercised,
        currentStreak: userProgress.current_streak,
        level: userProgress.level,
        totalXP: userProgress.total_xp,
        achievementsCount: userProgress.achievements_count,
        recentActivities: (recentActivities || []).map(activity => ({
          type: activity.activity_type,
          title: activity.title,
          date: activity.completed_at,
          xp: activity.metadata?.xp,
        })),
        weeklyStats,
      };

      return { data: summary, error: null };

    } catch (error: any) {
      console.error('Get dashboard summary error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Create or update goal
  async saveGoal(goal: Omit<ProgressGoal, 'id' | 'user_id' | 'created_at'>): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('user_goals')
        .insert({
          ...goal,
          user_id: user.id,
        });

      if (error) {
        console.error('Error saving goal:', error);
        return { error: 'Erro ao salvar meta' };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Save goal error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get user goals
  async getUserGoals(): Promise<{ data: ProgressGoal[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user goals:', error);
        return { data: null, error: 'Erro ao buscar metas' };
      }

      return { data: data || [], error: null };

    } catch (error: any) {
      console.error('Get user goals error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Private methods
  private async createInitialStats(userId: string): Promise<UserProgress> {
    const initialStats: UserProgress = {
      user_id: userId,
      total_workouts: 0,
      total_minutes_exercised: 0,
      total_calories_burned: 0,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      total_xp: 50, // Welcome bonus
      level: 1,
      achievements_count: 0,
      videos_watched: 0,
      challenges_completed: 0,
    };

    await supabase
      .from('user_stats')
      .insert(initialStats);

    return initialStats;
  }

  private calculateWorkoutXP(duration: number, calories: number): number {
    // Base XP: 10 points
    // Duration bonus: 1 point per minute (up to 60 minutes)
    // Calorie bonus: 1 point per 10 calories (up to 50 points)
    const baseXP = 10;
    const durationXP = Math.min(duration, 60);
    const calorieXP = Math.min(Math.floor(calories / 10), 50);
    
    return baseXP + durationXP + calorieXP;
  }

  private calculateVideoXP(duration: number): number {
    // Video XP: 5 base points + 1 point per 5 minutes
    return 5 + Math.floor(duration / 5);
  }

  private groupActivitiesByWeek(activities: any[]): WeeklyProgress[] {
    const weeks: { [key: string]: WeeklyProgress } = {};

    activities.forEach(activity => {
      const date = new Date(activity.completed_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: weekKey,
          workouts: 0,
          minutes: 0,
          calories: 0,
          videos: 0,
        };
      }

      if (activity.activity_type === 'workout') {
        weeks[weekKey].workouts++;
        weeks[weekKey].minutes += activity.duration_minutes || 0;
        weeks[weekKey].calories += activity.calories_burned || 0;
      } else if (activity.activity_type === 'video_watched') {
        weeks[weekKey].videos++;
      }
    });

    return Object.values(weeks).sort((a, b) => a.week.localeCompare(b.week));
  }

  private calculateWeeklyStats(activities: any[]): { workouts: number[]; minutes: number[]; days: string[] } {
    const days = [];
    const workouts = [];
    const minutes = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      
      days.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
      
      const dayActivities = activities.filter(activity => 
        activity.completed_at.startsWith(dayStr)
      );
      
      const dayWorkouts = dayActivities.filter(a => a.activity_type === 'workout').length;
      const dayMinutes = dayActivities
        .filter(a => a.activity_type === 'workout')
        .reduce((sum, a) => sum + (a.duration_minutes || 0), 0);
      
      workouts.push(dayWorkouts);
      minutes.push(dayMinutes);
    }

    return { workouts, minutes, days };
  }

  private async checkWorkoutAchievements(userId: string, stats: any): Promise<void> {
    try {
      const achievements = [
        { id: 'first_workout', condition: stats.total_workouts === 1 },
        { id: 'weekly_warrior', condition: stats.current_streak === 7 },
        { id: 'monthly_hero', condition: stats.total_workouts === 30 },
        { id: 'iron_streak', condition: stats.current_streak === 30 },
      ];

      for (const achievement of achievements) {
        if (achievement.condition) {
          // Check if already awarded
          const { data: existing } = await supabase
            .from('user_achievements')
            .select('id')
            .eq('user_id', userId)
            .eq('achievement_id', achievement.id)
            .single();

          if (!existing) {
            // Award achievement
            await supabase
              .from('user_achievements')
              .insert({
                user_id: userId,
                achievement_id: achievement.id,
              });
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }
}

// Export singleton instance
export const progressService = new ProgressService();
export default progressService;
