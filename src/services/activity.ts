import { supabase } from "../lib/supabase";

export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'workout_completed' | 'video_watched' | 'goal_completed' | 'challenge_completed';
  timestamp: Date;
  metadata?: {
    videoId?: string;
    workoutId?: string;
    goalId?: string;
    challengeId?: string;
    duration?: number;
    extra?: any;
  };
}

export interface ActivityStats {
  totalActiveDays: number;
  longestStreak: number;
  lastActiveDate: Date | null;
  totalWorkouts: number;
  totalVideosWatched: number;
  totalTimeSpent: number; // em minutos
  weeklyActivity: number[];
  monthlyActivity: number[];
}

// Função para registrar atividade do usuário
export async function logUserActivity(
  userId: string,
  type: UserActivity['type'],
  metadata?: UserActivity['metadata']
): Promise<void> {
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const activityId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const activity: UserActivity = {
      id: activityId,
      userId,
      type,
      timestamp: new Date(),
      metadata: metadata || {}
    };

    // Save activity to Supabase
    const { error } = await supabase
      .from('user_activities')
      .insert({
        id: activityId,
        user_id: userId,
        activity_type: type,
        timestamp: activity.timestamp.toISOString(),
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Update user stats
    await updateUserStats(userId, type, metadata);

  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
    throw error;
  }
}

// Função para obter estatísticas de atividade do usuário
export async function getUserActivityStats(userId: string): Promise<ActivityStats> {
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  try {
    // Get activities from last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', ninetyDaysAgo.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const stats = calculateActivityStats(activities || []);
    return stats;

  } catch (error) {
    console.error("Erro ao obter estatísticas de atividade:", error);
    // Return empty stats on error
    return {
      totalActiveDays: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalWorkouts: 0,
      totalVideosWatched: 0,
      totalTimeSpent: 0,
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
      monthlyActivity: Array.from({ length: 30 }, () => 0)
    };
  }
}

// Função auxiliar para calcular estatísticas
function calculateActivityStats(activities: any[]): ActivityStats {
  if (!activities.length) {
    return {
      totalActiveDays: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalWorkouts: 0,
      totalVideosWatched: 0,
      totalTimeSpent: 0,
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
      monthlyActivity: Array.from({ length: 30 }, () => 0)
    };
  }

  // Group activities by day
  const dayGroups = new Map<string, any[]>();
  activities.forEach(activity => {
    const day = new Date(activity.timestamp).toDateString();
    if (!dayGroups.has(day)) {
      dayGroups.set(day, []);
    }
    dayGroups.get(day)!.push(activity);
  });

  // Calculate streaks
  const sortedDays = Array.from(dayGroups.keys()).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate: Date | null = null;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  for (let i = 0; i < sortedDays.length; i++) {
    const currentDay = sortedDays[i];
    
    if (i === 0) {
      lastDate = new Date(currentDay);
      if (currentDay === today || currentDay === yesterday) {
        currentStreak = 1;
      }
    } else {
      const prevDay = new Date(sortedDays[i - 1]);
      const curDay = new Date(currentDay);
      const diffDays = Math.floor((prevDay.getTime() - curDay.getTime()) / (24 * 60 * 60 * 1000));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  // Calculate totals
  const totalWorkouts = activities.filter(a => a.activity_type === 'workout_completed').length;
  const totalVideosWatched = activities.filter(a => a.activity_type === 'video_watched').length;
  const totalTimeSpent = activities.reduce((sum, a) => sum + (a.metadata?.duration || 0), 0);

  // Weekly activity (last 7 days)
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayKey = date.toDateString();
    return dayGroups.get(dayKey)?.length || 0;
  }).reverse();

  // Monthly activity (last 30 days)
  const monthlyActivity = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayKey = date.toDateString();
    return dayGroups.get(dayKey)?.length || 0;
  }).reverse();

  return {
    totalActiveDays: dayGroups.size,
    longestStreak,
    lastActiveDate: lastDate,
    totalWorkouts,
    totalVideosWatched,
    totalTimeSpent,
    weeklyActivity,
    monthlyActivity
  };
}

// Função para atualizar estatísticas do usuário (chamada internamente)
async function updateUserStats(
  userId: string, 
  activityType: UserActivity['type'], 
  metadata?: UserActivity['metadata']
): Promise<void> {
  try {
    // Get current stats
    const { data: currentStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Calculate new stats
    const now = new Date();
    const updates: any = {
      user_id: userId,
      last_activity_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    if (!currentStats) {
      // First time stats
      updates.total_activities = 1;
      updates.total_workouts = activityType === 'workout_completed' ? 1 : 0;
      updates.total_videos_watched = activityType === 'video_watched' ? 1 : 0;
      updates.total_time_spent = metadata?.duration || 0;
      updates.created_at = now.toISOString();
    } else {
      // Update existing stats
      updates.total_activities = (currentStats.total_activities || 0) + 1;
      updates.total_workouts = (currentStats.total_workouts || 0) + (activityType === 'workout_completed' ? 1 : 0);
      updates.total_videos_watched = (currentStats.total_videos_watched || 0) + (activityType === 'video_watched' ? 1 : 0);
      updates.total_time_spent = (currentStats.total_time_spent || 0) + (metadata?.duration || 0);
    }

    // Upsert stats
    const { error: upsertError } = await supabase
      .from('user_stats')
      .upsert(updates);

    if (upsertError) throw upsertError;

  } catch (error) {
    console.error("Erro ao atualizar estatísticas:", error);
    // Don't throw error to avoid breaking activity logging
  }
}

// Função para inicializar tracking de atividade (chamada no login)
export async function initializeActivityTracking(): Promise<void> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return;

    // Register daily login
    await logUserActivity(user.id, 'login');

  } catch (error) {
    console.error("Erro ao inicializar tracking de atividade:", error);
  }
}

// Função para obter atividades recentes
export async function getRecentActivities(userId: string, limit: number = 10): Promise<UserActivity[]> {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(activity => ({
      id: activity.id,
      userId: activity.user_id,
      type: activity.activity_type,
      timestamp: new Date(activity.timestamp),
      metadata: activity.metadata || {}
    }));

  } catch (error) {
    console.error("Erro ao obter atividades recentes:", error);
    return [];
  }
}

// Helper functions for specific activity types
export async function logGoalCompleted(userId: string, goalId: string, goalTitle: string): Promise<void> {
  return logUserActivity(userId, 'goal_completed', {
    goalId,
    extra: { title: goalTitle }
  });
}

export async function logChallengeCompleted(userId: string, challengeId: string, challengeTitle: string): Promise<void> {
  return logUserActivity(userId, 'challenge_completed', {
    challengeId,
    extra: { title: challengeTitle }
  });
}

export async function logWorkoutCompleted(userId: string, workoutId: string, duration?: number): Promise<void> {
  return logUserActivity(userId, 'workout_completed', {
    workoutId,
    duration
  });
}

export async function logVideoWatched(userId: string, videoId: string, duration?: number): Promise<void> {
  return logUserActivity(userId, 'video_watched', {
    videoId,
    duration
  });
}
