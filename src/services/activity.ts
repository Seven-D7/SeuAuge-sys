import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "../firebase";

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
  currentStreak: number;
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

    // Modo desenvolvimento - apenas log
    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.log("🏃‍♂️ Atividade registrada (dev):", activity);
      
      // Salvar localmente para desenvolvimento
      const localActivities = JSON.parse(localStorage.getItem("userActivities") || "[]");
      localActivities.unshift(activity);
      localStorage.setItem("userActivities", JSON.stringify(localActivities.slice(0, 100)));
      return;
    }

    // Salvar atividade no Firestore
    await setDoc(
      doc(db, "users", userId, "activities", activityId),
      activity
    );

    // Atualizar estatísticas do usuário
    await updateUserStats(userId, type, metadata);

  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}

// Função para atualizar estatísticas do usuário
async function updateUserStats(
  userId: string,
  type: UserActivity['type'],
  metadata?: UserActivity['metadata']
): Promise<void> {
  if (!userId) return;

  try {
    const statsDoc = await getDoc(doc(db, "users", userId, "stats", "current"));
    const currentStats: Partial<ActivityStats> = statsDoc.exists() ? statsDoc.data() : {};

    const today = new Date();
    const todayStr = today.toDateString();
    const lastActiveStr = currentStats.lastActiveDate ? new Date(currentStats.lastActiveDate).toDateString() : null;

    let updatedStats = { ...currentStats };

    // Atualizar contadores específicos por tipo
    switch (type) {
      case 'workout_completed':
        updatedStats.totalWorkouts = (updatedStats.totalWorkouts || 0) + 1;
        break;
      case 'video_watched':
        updatedStats.totalVideosWatched = (updatedStats.totalVideosWatched || 0) + 1;
        if (metadata?.duration) {
          updatedStats.totalTimeSpent = (updatedStats.totalTimeSpent || 0) + metadata.duration;
        }
        break;
    }

    // Atualizar streak e dias ativos apenas uma vez por dia
    if (lastActiveStr !== todayStr) {
      updatedStats.lastActiveDate = today;
      updatedStats.totalActiveDays = (updatedStats.totalActiveDays || 0) + 1;

      // Calcular streak
      if (!lastActiveStr) {
        // Primeira atividade
        updatedStats.currentStreak = 1;
        updatedStats.longestStreak = 1;
      } else {
        const lastActive = new Date(currentStats.lastActiveDate!);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActive.toDateString() === yesterday.toDateString()) {
          // Continuação do streak
          updatedStats.currentStreak = (updatedStats.currentStreak || 0) + 1;
          updatedStats.longestStreak = Math.max(
            updatedStats.longestStreak || 0, 
            updatedStats.currentStreak
          );
        } else {
          // Streak quebrado
          updatedStats.currentStreak = 1;
        }
      }

      // Atualizar atividade semanal e mensal
      updatedStats.weeklyActivity = updateWeeklyActivity(updatedStats.weeklyActivity || []);
      updatedStats.monthlyActivity = updateMonthlyActivity(updatedStats.monthlyActivity || []);
    }

    // Salvar estatísticas atualizadas
    await setDoc(
      doc(db, "users", auth.currentUser.uid, "stats", "current"),
      {
        ...updatedStats,
        updatedAt: new Date()
      },
      { merge: true }
    );

  } catch (error) {
    console.error("Erro ao atualizar estatísticas:", error);
  }
}

// Função para obter estatísticas do usuário
export async function getUserActivityStats(): Promise<ActivityStats> {
  const defaultStats: ActivityStats = {
    totalActiveDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalWorkouts: 0,
    totalVideosWatched: 0,
    totalTimeSpent: 0,
    weeklyActivity: new Array(7).fill(0),
    monthlyActivity: new Array(30).fill(0)
  };

  if (!auth.currentUser) {
    return defaultStats;
  }

  try {
    // Modo desenvolvimento - dados locais
    if (import.meta.env.VITE_DEV_MODE === "true") {
      const localStats = localStorage.getItem("userActivityStats");
      if (localStats) {
        const parsed = JSON.parse(localStats);
        return {
          ...defaultStats,
          ...parsed,
          lastActiveDate: parsed.lastActiveDate ? new Date(parsed.lastActiveDate) : null
        };
      }
      return defaultStats;
    }

    const statsDoc = await getDoc(doc(db, "users", auth.currentUser.uid, "stats", "current"));
    
    if (statsDoc.exists()) {
      const data = statsDoc.data();
      return {
        ...defaultStats,
        ...data,
        lastActiveDate: data.lastActiveDate ? data.lastActiveDate.toDate() : null
      };
    }

    return defaultStats;

  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return defaultStats;
  }
}

// Função para obter atividades recentes
export async function getRecentActivities(limitCount: number = 10): Promise<UserActivity[]> {
  if (!auth.currentUser) {
    return [];
  }

  try {
    // Modo desenvolvimento - dados locais
    if (import.meta.env.VITE_DEV_MODE === "true") {
      const localActivities = JSON.parse(localStorage.getItem("userActivities") || "[]");
      return localActivities.slice(0, limitCount).map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    }

    const activitiesRef = collection(db, "users", auth.currentUser.uid, "activities");
    const q = query(activitiesRef, orderBy("timestamp", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: data.timestamp.toDate()
      } as UserActivity;
    });

  } catch (error) {
    console.error("Erro ao buscar atividades recentes:", error);
    return [];
  }
}

// Função para verificar login diário
export async function checkDailyLogin(): Promise<void> {
  if (!auth.currentUser) return;

  try {
    const stats = await getUserActivityStats();
    const today = new Date().toDateString();
    const lastLogin = stats.lastActiveDate ? stats.lastActiveDate.toDateString() : null;

    // Se já fez login hoje, não registrar novamente
    if (lastLogin === today) {
      return;
    }

    // Registrar login diário
    await logUserActivity('login');

  } catch (error) {
    console.error("Erro ao verificar login diário:", error);
  }
}

// Função auxiliar para atualizar atividade semanal
function updateWeeklyActivity(weeklyActivity: number[]): number[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = domingo, 6 = sábado
  
  const updated = [...weeklyActivity];
  while (updated.length < 7) updated.push(0);
  
  updated[dayOfWeek] = (updated[dayOfWeek] || 0) + 1;
  
  return updated.slice(0, 7);
}

// Função auxiliar para atualizar atividade mensal
function updateMonthlyActivity(monthlyActivity: number[]): number[] {
  const today = new Date();
  const dayOfMonth = today.getDate() - 1; // 0-based index
  
  const updated = [...monthlyActivity];
  while (updated.length < 30) updated.push(0);
  
  updated[dayOfMonth] = (updated[dayOfMonth] || 0) + 1;
  
  return updated.slice(0, 30);
}

// Função para registrar conclusão de treino
export async function logWorkoutCompleted(workoutId: string, duration?: number): Promise<void> {
  await logUserActivity('workout_completed', {
    workoutId,
    duration
  });
}

// Função para registrar vídeo assistido
export async function logVideoWatched(videoId: string, duration?: number): Promise<void> {
  await logUserActivity('video_watched', {
    videoId,
    duration
  });
}

// Função para registrar meta concluída
export async function logGoalCompleted(goalId: string): Promise<void> {
  await logUserActivity('goal_completed', {
    goalId
  });
}

// Função para registrar desafio concluído
export async function logChallengeCompleted(challengeId: string): Promise<void> {
  await logUserActivity('challenge_completed', {
    challengeId
  });
}

// Função para inicializar tracking de atividades (chamar no login)
export async function initializeActivityTracking(): Promise<void> {
  try {
    await checkDailyLogin();
  } catch (error) {
    console.error("Erro ao inicializar tracking de atividades:", error);
  }
}
