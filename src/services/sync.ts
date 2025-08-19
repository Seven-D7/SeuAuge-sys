import { supabase } from "../lib/supabase";
import { useAchievementsStore } from "../stores/achievementsStore";
import { useLevelStore } from "../stores/levelStore";
import { useGoalsStore } from "../stores/goalsStore";
import { getUserActivityStats } from "./activity";

interface SyncData {
  achievements: any[];
  challenges: any[];
  userStats: any;
  levelSystem: any;
  xpHistory: any[];
  goals: any[];
  dailyChallenges: any[];
  lastSyncAt: Date;
  version: number;
}

let syncInterval: NodeJS.Timeout | null = null;
let unsubscribeSnapshot: (() => void) | null = null;

// Function to save data to cloud
export async function saveToCloud(userId?: string): Promise<void> {
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  try {
    // Demo mode - only save locally
    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.log("🔄 Demo mode: dados salvos localmente");
      await saveToLocalStorage();
      return;
    }

    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();
    const goalsStore = useGoalsStore.getState();

    const syncData: SyncData = {
      achievements: achievementsStore.achievements,
      challenges: achievementsStore.challenges,
      userStats: achievementsStore.userStats,
      levelSystem: levelStore.levelSystem,
      xpHistory: levelStore.xpHistory,
      goals: goalsStore.goals,
      dailyChallenges: goalsStore.dailyChallenges,
      lastSyncAt: new Date(),
      version: 1,
    };

    // Save to Supabase
    const { error } = await supabase
      .from('user_gamification_data')
      .upsert({
        user_id: userId,
        data: syncData,
        last_sync_at: new Date().toISOString(),
        version: syncData.version,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    console.log("✅ Dados sincronizados com sucesso na nuvem");

  } catch (error) {
    console.error("❌ Erro ao salvar na nuvem:", error);
    throw error;
  }
}

// Function to load data from cloud
export async function loadFromCloud(userId?: string): Promise<boolean> {
  if (!userId) {
    return false;
  }

  try {
    // Demo mode - load from localStorage
    if (import.meta.env.VITE_DEV_MODE === "true") {
      return await loadFromLocalStorage();
    }

    const { data, error } = await supabase
      .from('user_gamification_data')
      .select('*')
      .eq('user_id', userId)
      .order('last_sync_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("📄 Nenhum dado de gamificação encontrado na nuvem");
        return false;
      }
      throw error;
    }

    if (!data?.data) {
      console.log("📄 Nenhum dado de gamificação encontrado na nuvem");
      return false;
    }

    const syncData = data.data as SyncData;
    
    // Validate data integrity
    if (!syncData.achievements || !syncData.levelSystem || !syncData.goals) {
      console.warn("⚠️ Dados incompletos na nuvem, iniciando fresh");
      return false;
    }

    // Load into stores
    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();
    const goalsStore = useGoalsStore.getState();

    // Update achievements store
    achievementsStore.achievements = syncData.achievements;
    achievementsStore.challenges = syncData.challenges;
    achievementsStore.userStats = syncData.userStats;

    // Update level store
    levelStore.levelSystem = syncData.levelSystem;
    levelStore.xpHistory = syncData.xpHistory;

    // Update goals store
    goalsStore.goals = syncData.goals;
    goalsStore.dailyChallenges = syncData.dailyChallenges;

    console.log("✅ Dados carregados com sucesso da nuvem");
    return true;

  } catch (error) {
    console.error("❌ Erro ao carregar da nuvem:", error);
    return false;
  }
}

// Function to save data locally
async function saveToLocalStorage(): Promise<void> {
  try {
    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();
    const goalsStore = useGoalsStore.getState();

    const syncData: SyncData = {
      achievements: achievementsStore.achievements,
      challenges: achievementsStore.challenges,
      userStats: achievementsStore.userStats,
      levelSystem: levelStore.levelSystem,
      xpHistory: levelStore.xpHistory,
      goals: goalsStore.goals,
      dailyChallenges: goalsStore.dailyChallenges,
      lastSyncAt: new Date(),
      version: 1,
    };

    localStorage.setItem("gamificationData", JSON.stringify(syncData));
    console.log("✅ Dados salvos localmente");

  } catch (error) {
    console.error("❌ Erro ao salvar localmente:", error);
  }
}

// Function to load data from localStorage
async function loadFromLocalStorage(): Promise<boolean> {
  try {
    const saved = localStorage.getItem("gamificationData");
    if (!saved) {
      console.log("📄 Nenhum dado local encontrado");
      return false;
    }

    const data = JSON.parse(saved) as SyncData;
    
    if (!data.achievements || !data.levelSystem || !data.goals) {
      console.warn("⚠️ Dados locais incompletos");
      return false;
    }

    // Load into stores
    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();
    const goalsStore = useGoalsStore.getState();

    achievementsStore.achievements = data.achievements;
    achievementsStore.challenges = data.challenges;
    achievementsStore.userStats = data.userStats;

    levelStore.levelSystem = data.levelSystem;
    levelStore.xpHistory = data.xpHistory;

    goalsStore.goals = data.goals;
    goalsStore.dailyChallenges = data.dailyChallenges;

    console.log("✅ Dados carregados localmente");
    return true;

  } catch (error) {
    console.error("❌ Erro ao carregar dados locais:", error);
    return false;
  }
}

// Function to initialize sync system
export async function initializeSyncSystem(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Try to load from cloud first
    const loadedFromCloud = await loadFromCloud(user.id);
    
    if (!loadedFromCloud) {
      // Try to load from local storage
      await loadFromLocalStorage();
    }

    // Set up periodic sync
    startRealtimeSync(user.id);

    console.log("🚀 Sistema de sincronização inicializado");

  } catch (error) {
    console.error("❌ Erro ao inicializar sistema de sincronização:", error);
  }
}

// Function to start real-time sync
export function startRealtimeSync(userId: string): void {
  stopRealtimeSync();

  // Auto-save every 5 minutes
  syncInterval = setInterval(async () => {
    try {
      await saveToCloud(userId);
    } catch (error) {
      console.error("Erro na sincronização automática:", error);
    }
  }, 5 * 60 * 1000);

  console.log("🔄 Sincronização em tempo real iniciada");
}

// Function to stop real-time sync
export function stopRealtimeSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }

  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }

  console.log("⏹️ Sincronização em tempo real parada");
}

// Function to manually sync data
export async function manualSync(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    await saveToCloud(user.id);
    console.log("🔄 Sincronização manual concluída");

  } catch (error) {
    console.error("❌ Erro na sincronização manual:", error);
    throw error;
  }
}

// Function to get sync status
export function getSyncStatus(): { lastSync: Date | null; isConnected: boolean } {
  const lastSyncStr = localStorage.getItem("lastSyncAt");
  return {
    lastSync: lastSyncStr ? new Date(lastSyncStr) : null,
    isConnected: navigator.onLine,
  };
}

// Function to force sync now
export async function forceSyncNow(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    await saveToCloud(user.id);
    await loadFromCloud(user.id);

    localStorage.setItem("lastSyncAt", new Date().toISOString());
    console.log("🔄 Sincronização forçada concluída");

  } catch (error) {
    console.error("❌ Erro na sincronização forçada:", error);
    throw error;
  }
}

// Function to restore from backup
export async function restoreFromBackup(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Get the latest backup from cloud
    const loaded = await loadFromCloud(user.id);

    if (!loaded) {
      // Fallback to local backup
      const backup = localStorage.getItem("gamificationBackup");
      if (backup) {
        const data = JSON.parse(backup);

        // Load into stores
        const achievementsStore = useAchievementsStore.getState();
        const levelStore = useLevelStore.getState();
        const goalsStore = useGoalsStore.getState();

        if (data.achievements) achievementsStore.achievements = data.achievements;
        if (data.levelSystem) levelStore.levelSystem = data.levelSystem;
        if (data.goals) goalsStore.goals = data.goals;

        console.log("✅ Backup local restaurado");
      } else {
        throw new Error("Nenhum backup encontrado");
      }
    } else {
      console.log("✅ Backup da nuvem restaurado");
    }

  } catch (error) {
    console.error("❌ Erro ao restaurar backup:", error);
    throw error;
  }
}

// Function to create backup
export async function createBackup(): Promise<void> {
  try {
    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();
    const goalsStore = useGoalsStore.getState();

    const backup = {
      achievements: achievementsStore.achievements,
      challenges: achievementsStore.challenges,
      userStats: achievementsStore.userStats,
      levelSystem: levelStore.levelSystem,
      xpHistory: levelStore.xpHistory,
      goals: goalsStore.goals,
      dailyChallenges: goalsStore.dailyChallenges,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("gamificationBackup", JSON.stringify(backup));
    console.log("💾 Backup criado com sucesso");

  } catch (error) {
    console.error("❌ Erro ao criar backup:", error);
    throw error;
  }
}
