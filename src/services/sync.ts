import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
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
export async function saveToCloud(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error("Usuário não autenticado");
  }

  try {
    // Modo desenvolvimento - apenas salvar localmente
    if (import.meta.env.VITE_DEV_MODE === "true") {
      console.log("🔄 Modo desenvolvimento: dados salvos localmente");
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

    // Save to Firestore
    await setDoc(
      doc(db, "users", auth.currentUser.uid, "gamification", "current"),
      {
        ...syncData,
        lastSyncAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("✅ Dados sincronizados com sucesso na nuvem");

  } catch (error) {
    console.error("❌ Erro ao salvar na nuvem:", error);
    throw error;
  }
}

// Function to load data from cloud
export async function loadFromCloud(): Promise<boolean> {
  if (!auth.currentUser) {
    return false;
  }

  try {
    // Modo desenvolvimento - carregar do localStorage
    if (import.meta.env.VITE_DEV_MODE === "true") {
      return await loadFromLocalStorage();
    }

    const syncDoc = await getDoc(
      doc(db, "users", auth.currentUser.uid, "gamification", "current")
    );

    if (!syncDoc.exists()) {
      console.log("📄 Nenhum dado de gamificação encontrado na nuvem");
      return false;
    }

    const data = syncDoc.data() as SyncData;
    
    // Validate data integrity
    if (!data.achievements || !data.levelSystem || !data.goals) {
      console.warn("⚠️ Dados incompletos na nuvem, iniciando fresh");
      return false;
    }

    // Load into stores
    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();
    const goalsStore = useGoalsStore.getState();

    // Update achievements store
    useAchievementsStore.setState({
      achievements: data.achievements || [],
      challenges: data.challenges || [],
      userStats: data.userStats || achievementsStore.userStats,
    });

    // Update level store
    useLevelStore.setState({
      levelSystem: data.levelSystem || levelStore.levelSystem,
      xpHistory: data.xpHistory || [],
    });

    // Update goals store
    useGoalsStore.setState({
      goals: data.goals || [],
      dailyChallenges: data.dailyChallenges || goalsStore.dailyChallenges,
    });

    console.log("✅ Dados carregados da nuvem com sucesso");
    return true;

  } catch (error) {
    console.error("❌ Erro ao carregar da nuvem:", error);
    return false;
  }
}

// Function to save to localStorage (development mode)
async function saveToLocalStorage(): Promise<void> {
  try {
    const achievementsStore = useAchievementsStore.getState();
    const levelStore = useLevelStore.getState();
    const goalsStore = useGoalsStore.getState();

    const syncData = {
      achievements: achievementsStore.achievements,
      challenges: achievementsStore.challenges,
      userStats: achievementsStore.userStats,
      levelSystem: levelStore.levelSystem,
      xpHistory: levelStore.xpHistory,
      goals: goalsStore.goals,
      dailyChallenges: goalsStore.dailyChallenges,
      lastSyncAt: new Date().toISOString(),
    };

    localStorage.setItem("gamificationData", JSON.stringify(syncData));
    console.log("💾 Dados salvos no localStorage");

  } catch (error) {
    console.error("❌ Erro ao salvar no localStorage:", error);
  }
}

// Function to load from localStorage (development mode)
async function loadFromLocalStorage(): Promise<boolean> {
  try {
    const savedData = localStorage.getItem("gamificationData");
    if (!savedData) {
      return false;
    }

    const data = JSON.parse(savedData);
    
    // Load into stores
    useAchievementsStore.setState({
      achievements: data.achievements || [],
      challenges: data.challenges || [],
      userStats: data.userStats || {},
    });

    useLevelStore.setState({
      levelSystem: data.levelSystem || {},
      xpHistory: data.xpHistory || [],
    });

    useGoalsStore.setState({
      goals: data.goals || [],
      dailyChallenges: data.dailyChallenges || [],
    });

    console.log("💾 Dados carregados do localStorage");
    return true;

  } catch (error) {
    console.error("❌ Erro ao carregar do localStorage:", error);
    return false;
  }
}

// Function to start real-time sync
export function startRealtimeSync(): void {
  if (!auth.currentUser || unsubscribeSnapshot) {
    return;
  }

  // Modo desenvolvimento - usar interval simples
  if (import.meta.env.VITE_DEV_MODE === "true") {
    startAutoSave();
    return;
  }

  try {
    // Listen for real-time updates
    unsubscribeSnapshot = onSnapshot(
      doc(db, "users", auth.currentUser.uid, "gamification", "current"),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as SyncData;
          
          // Only update if data is newer than local data
          const localLastSync = localStorage.getItem("lastLocalSync");
          const cloudLastSync = data.lastSyncAt;
          
          if (!localLastSync || new Date(cloudLastSync) > new Date(localLastSync)) {
            console.log("🔄 Atualizando dados com versão da nuvem");
            // Update stores silently
            updateStoresFromCloud(data);
          }
        }
      },
      (error) => {
        console.error("❌ Erro no sync em tempo real:", error);
      }
    );

    // Also start periodic auto-save
    startAutoSave();

  } catch (error) {
    console.error("❌ Erro ao iniciar sync em tempo real:", error);
  }
}

// Function to stop real-time sync
export function stopRealtimeSync(): void {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }

  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

// Function to start auto-save (periodic backup)
function startAutoSave(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  // Auto-save every 2 minutes
  syncInterval = setInterval(async () => {
    try {
      await saveToCloud();
      localStorage.setItem("lastLocalSync", new Date().toISOString());
    } catch (error) {
      console.error("❌ Erro no auto-save:", error);
    }
  }, 2 * 60 * 1000); // 2 minutes
}

// Function to update stores from cloud data
function updateStoresFromCloud(data: SyncData): void {
  try {
    useAchievementsStore.setState({
      achievements: data.achievements || [],
      challenges: data.challenges || [],
      userStats: data.userStats || {},
    });

    useLevelStore.setState({
      levelSystem: data.levelSystem || {},
      xpHistory: data.xpHistory || [],
    });

    useGoalsStore.setState({
      goals: data.goals || [],
      dailyChallenges: data.dailyChallenges || [],
    });

  } catch (error) {
    console.error("❌ Erro ao atualizar stores:", error);
  }
}

// Function to force sync now
export async function forceSyncNow(): Promise<void> {
  try {
    await saveToCloud();
    console.log("✅ Sincronização forçada concluída");
  } catch (error) {
    console.error("❌ Erro na sincronização forçada:", error);
    throw error;
  }
}

// Function to restore from backup
export async function restoreFromBackup(): Promise<boolean> {
  try {
    const success = await loadFromCloud();
    if (success) {
      // Re-sync real stats with activity service
      const stats = await getUserActivityStats();
      
      const achievementsStore = useAchievementsStore.getState();
      useAchievementsStore.setState({
        userStats: {
          ...achievementsStore.userStats,
          totalVideosWatched: stats.totalVideosWatched,
          totalWorkoutsCompleted: stats.totalWorkouts,
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          lastActivity: stats.lastActiveDate || new Date(),
        }
      });
      
      console.log("✅ Backup restaurado e sincronizado com atividades reais");
    }
    
    return success;
    
  } catch (error) {
    console.error("❌ Erro ao restaurar backup:", error);
    return false;
  }
}

// Function to initialize sync system
export async function initializeSyncSystem(): Promise<void> {
  try {
    // Try to load existing data first
    await loadFromCloud();
    
    // Start real-time sync
    startRealtimeSync();
    
    console.log("🚀 Sistema de sincronização inicializado");
    
  } catch (error) {
    console.error("❌ Erro ao inicializar sistema de sync:", error);
  }
}

// Function to get sync status
export function getSyncStatus(): {
  isOnline: boolean;
  lastSync: string | null;
  isAutoSaving: boolean;
} {
  return {
    isOnline: navigator.onLine,
    lastSync: localStorage.getItem("lastLocalSync"),
    isAutoSaving: syncInterval !== null,
  };
}
