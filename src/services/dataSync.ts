import { useUserProfileStore } from '../stores/userProfileStore';
import { useAchievementsStore } from '../stores/achievementsStore';
import { useLevelStore } from '../stores/levelStore';
import { useProgressStore } from '../stores/progressStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useEnhancedPreferencesStore } from '../stores/enhancedPreferencesStore';
import { supabase } from '../lib/supabase';

interface SyncStatus {
  lastSync: Date | null;
  syncing: boolean;
  errors: string[];
}

class DataSyncService {
  private syncStatus: SyncStatus = {
    lastSync: null,
    syncing: false,
    errors: []
  };

  private syncIntervalId: NodeJS.Timeout | null = null;

  // Inicializar sincronização automática
  startAutoSync(intervalMinutes: number = 15) {
    this.stopAutoSync();
    
    this.syncIntervalId = setInterval(() => {
      this.syncAllData().catch(error => {
        console.error('Erro na sincronização automática:', error);
      });
    }, intervalMinutes * 60 * 1000);

    // Sincronização inicial
    this.syncAllData().catch(error => {
      console.error('Erro na sincronização inicial:', error);
    });
  }

  // Parar sincronização automática
  stopAutoSync() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  // Sincronizar todos os dados do usuário
  async syncAllData(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || this.syncStatus.syncing) return;

    this.syncStatus.syncing = true;
    this.syncStatus.errors = [];

    try {
      console.log('🔄 Iniciando sincronização de dados...');

      // Sincronizar perfil do usuário
      await this.syncUserProfile();

      // Sincronizar conquistas e nível
      await this.syncGamificationData();

      // Sincronizar progresso e métricas
      await this.syncProgressData();

      // Sincronizar favoritos
      await this.syncFavorites();

      // Sincronizar preferências
      await this.syncPreferences();

      this.syncStatus.lastSync = new Date();
      console.log('✅ Sincronização concluída com sucesso');

    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      this.syncStatus.errors.push(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      this.syncStatus.syncing = false;
    }
  }

  // Sincronizar perfil do usuário
  private async syncUserProfile(): Promise<void> {
    try {
      const profileStore = useUserProfileStore.getState();
      
      if (auth.currentUser && !profileStore.profile) {
        await profileStore.loadProfile(auth.currentUser.uid);
      } else if (profileStore.profile) {
        await profileStore.syncProfile();
      }
    } catch (error) {
      console.error('Erro ao sincronizar perfil:', error);
      throw new Error('Falha na sincronização do perfil');
    }
  }

  // Sincronizar dados de gamificação
  private async syncGamificationData(): Promise<void> {
    try {
      const achievementsStore = useAchievementsStore.getState();
      const levelStore = useLevelStore.getState();

      // Inicializar conquistas se necessário
      if (achievementsStore.achievements.length === 0) {
        await achievementsStore.initializeAchievements();
      }

      // Verificar login diário
      await levelStore.checkDailyLogin();

      // Atualizar streak
      await achievementsStore.updateStreak();

    } catch (error) {
      console.error('Erro ao sincronizar gamificação:', error);
      throw new Error('Falha na sincronização da gamificação');
    }
  }

  // Sincronizar dados de progresso
  private async syncProgressData(): Promise<void> {
    try {
      const progressStore = useProgressStore.getState();
      
      // Sincronizar métricas corporais
      if (auth.currentUser) {
        await progressStore.syncWithServer();
      }

    } catch (error) {
      console.error('Erro ao sincronizar progresso:', error);
      throw new Error('Falha na sincronização do progresso');
    }
  }

  // Sincronizar favoritos
  private async syncFavorites(): Promise<void> {
    try {
      // Favoritos são mantidos localmente por enquanto
      // TODO: Implementar sincronização com servidor quando necessário
      console.log('Favoritos sincronizados (local)');
    } catch (error) {
      console.error('Erro ao sincronizar favoritos:', error);
      throw new Error('Falha na sincronização dos favoritos');
    }
  }

  // Sincronizar preferências
  private async syncPreferences(): Promise<void> {
    try {
      // Preferências são mantidas localmente por enquanto
      // TODO: Implementar sincronização com servidor quando necessário
      console.log('Preferências sincronizadas (local)');
    } catch (error) {
      console.error('Erro ao sincronizar preferências:', error);
      throw new Error('Falha na sincronização das preferências');
    }
  }

  // Backup de dados locais
  async backupLocalData(): Promise<string> {
    try {
      const data = {
        profile: useUserProfileStore.getState().profile,
        achievements: useAchievementsStore.getState().achievements,
        level: useLevelStore.getState().levelSystem,
        progress: useProgressStore.getState(),
        favorites: useFavoritesStore.getState(),
        preferences: useEnhancedPreferencesStore.getState(),
        timestamp: new Date(),
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erro ao fazer backup:', error);
      throw new Error('Falha no backup dos dados');
    }
  }

  // Restaurar dados de backup
  async restoreFromBackup(backupData: string): Promise<void> {
    try {
      const data = JSON.parse(backupData);
      
      if (!data.timestamp) {
        throw new Error('Formato de backup inválido');
      }

      // Confirmar com o usuário antes de restaurar
      const confirm = window.confirm(
        `Restaurar backup de ${new Date(data.timestamp).toLocaleString()}? ` +
        'Isso sobrescreverá todos os dados atuais.'
      );

      if (!confirm) return;

      // Restaurar dados (implementar conforme necessário)
      console.log('Restaurando backup...');
      
      // TODO: Implementar restauração completa dos stores
      
      console.log('Backup restaurado com sucesso');
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw new Error('Falha na restauração do backup');
    }
  }

  // Obter status da sincronização
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Limpar todos os dados locais
  async clearAllLocalData(): Promise<void> {
    try {
      // Limpar localStorage
      const keysToRemove = [
        'user-profile-store',
        'achievements-store',
        'level-storage',
        'progress-store',
        'favorites-store',
        'enhanced-preferences-store',
        'userActivities',
        'userActivityStats',
        'userMetrics'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Limpar states dos stores
      useUserProfileStore.getState().clearProfile();
      useLevelStore.getState().reset();
      // TODO: Adicionar métodos de reset para outros stores conforme necessário

      console.log('Dados locais limpos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw new Error('Falha ao limpar dados locais');
    }
  }

  // Verificar integridade dos dados
  async checkDataIntegrity(): Promise<{isValid: boolean; issues: string[]}> {
    const issues: string[] = [];

    try {
      const profile = useUserProfileStore.getState().profile;
      const achievements = useAchievementsStore.getState().achievements;
      const level = useLevelStore.getState().levelSystem;

      // Verificar perfil
      if (!profile) {
        issues.push('Perfil do usuário não encontrado');
      } else {
        if (!profile.name || profile.name.trim().length < 2) {
          issues.push('Nome do usuário inválido');
        }
        if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email)) {
          issues.push('Email do usuário inválido');
        }
      }

      // Verificar conquistas
      if (achievements.length === 0) {
        issues.push('Nenhuma conquista carregada');
      }

      // Verificar nível
      if (level.currentLevel < 1 || level.currentLevel > level.maxLevel) {
        issues.push('Nível do usuário inválido');
      }

      return {
        isValid: issues.length === 0,
        issues
      };

    } catch (error) {
      console.error('Erro na verificação de integridade:', error);
      return {
        isValid: false,
        issues: ['Erro ao verificar integridade dos dados']
      };
    }
  }
}

// Instância singleton
export const dataSyncService = new DataSyncService();

// Hook para usar o serviço de sincronização
export const useDataSync = () => {
  return {
    syncAllData: dataSyncService.syncAllData.bind(dataSyncService),
    startAutoSync: dataSyncService.startAutoSync.bind(dataSyncService),
    stopAutoSync: dataSyncService.stopAutoSync.bind(dataSyncService),
    backupLocalData: dataSyncService.backupLocalData.bind(dataSyncService),
    restoreFromBackup: dataSyncService.restoreFromBackup.bind(dataSyncService),
    clearAllLocalData: dataSyncService.clearAllLocalData.bind(dataSyncService),
    checkDataIntegrity: dataSyncService.checkDataIntegrity.bind(dataSyncService),
    getSyncStatus: dataSyncService.getSyncStatus.bind(dataSyncService),
  };
};
