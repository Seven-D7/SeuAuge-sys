import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getUserData, 
  updateUserProfile, 
  getUserMetrics, 
  saveUserMetrics,
  UpdateUserInput 
} from '../services/user';
import { auth } from '../firebase';
import type { BodyMetrics } from './progressStore';

export interface UserProfile {
  // Basic Info
  uid: string;
  name: string;
  email: string;
  avatar?: string | null;
  birthdate?: string | null;
  
  // Subscription Info
  plan?: string | null;
  planStartDate?: Date | null;
  planEndDate?: Date | null;
  
  // Role and Permissions
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  
  // Preferences
  preferences: {
    language: 'pt' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      shareProgress: boolean;
      showInLeaderboard: boolean;
    };
  };
  
  // Health & Fitness Data
  healthData: {
    metrics: Partial<BodyMetrics>;
    goals: {
      targetWeight?: number;
      targetBodyFat?: number;
      fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance';
      activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    };
    restrictions: {
      allergies: string[];
      medicalConditions: string[];
      dietaryRestrictions: string[];
    };
  };
  
  // App Usage Data
  appData: {
    firstLoginDate: Date;
    lastLoginDate: Date;
    totalLogins: number;
    favoriteCategories: string[];
    completedOnboarding: boolean;
    lastSyncDate: Date;
  };
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadProfile: (uid: string) => Promise<void>;
  updateProfile: (data: UpdateUserInput) => Promise<void>;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>;
  updateHealthData: (healthData: Partial<UserProfile['healthData']>) => Promise<void>;
  updateMetrics: (metrics: Partial<BodyMetrics>) => Promise<void>;
  syncProfile: () => Promise<void>;
  clearProfile: () => void;
  
  // Getters
  getAge: () => number | null;
  getBMI: () => number | null;
  isProfileComplete: () => boolean;
}

const defaultPreferences: UserProfile['preferences'] = {
  language: 'pt',
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  privacy: {
    shareProgress: true,
    showInLeaderboard: true,
  },
};

const defaultHealthData: UserProfile['healthData'] = {
  metrics: {},
  goals: {
    fitnessGoal: 'maintenance',
    activityLevel: 'moderate',
  },
  restrictions: {
    allergies: [],
    medicalConditions: [],
    dietaryRestrictions: [],
  },
};

const defaultAppData: UserProfile['appData'] = {
  firstLoginDate: new Date(),
  lastLoginDate: new Date(),
  totalLogins: 1,
  favoriteCategories: [],
  completedOnboarding: false,
  lastSyncDate: new Date(),
};

const createDefaultProfile = (uid: string, email: string, name: string): UserProfile => ({
  uid,
  name,
  email,
  role: 'user',
  isActive: true,
  preferences: defaultPreferences,
  healthData: defaultHealthData,
  appData: defaultAppData,
});

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,

      loadProfile: async (uid: string) => {
        set({ loading: true, error: null });
        
        try {
          // Buscar dados básicos do usuário
          const userData = await getUserData(uid);
          
          // Buscar métricas de saúde
          const metrics = await getUserMetrics();
          
          if (userData) {
            const profile: UserProfile = {
              uid,
              name: userData.name || '',
              email: userData.email || '',
              avatar: userData.avatar,
              birthdate: userData.birthdate,
              plan: userData.plan,
              planStartDate: userData.planStartDate ? new Date(userData.planStartDate) : null,
              planEndDate: userData.planEndDate ? new Date(userData.planEndDate) : null,
              role: userData.role || 'user',
              isActive: userData.isActive ?? true,
              preferences: {
                ...defaultPreferences,
                ...userData.preferences,
              },
              healthData: {
                ...defaultHealthData,
                ...userData.healthData,
                metrics: metrics || {},
              },
              appData: {
                ...defaultAppData,
                ...userData.appData,
                firstLoginDate: userData.createdAt ? new Date(userData.createdAt) : new Date(),
                lastLoginDate: userData.lastLogin ? new Date(userData.lastLogin) : new Date(),
                totalLogins: userData.loginCount || 1,
                lastSyncDate: new Date(),
              },
            };
            
            set({ profile, loading: false });
          } else {
            // Criar perfil padrão se não encontrar dados
            const currentUser = auth.currentUser;
            if (currentUser) {
              const profile = createDefaultProfile(
                uid,
                currentUser.email || '',
                currentUser.displayName || 'Usuário'
              );
              set({ profile, loading: false });
            } else {
              set({ error: 'Usuário não encontrado', loading: false });
            }
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          set({ error: 'Erro ao carregar perfil', loading: false });
        }
      },

      updateProfile: async (data: UpdateUserInput) => {
        const { profile } = get();
        if (!profile) return;

        set({ loading: true, error: null });

        try {
          await updateUserProfile(data);
          
          // Atualizar estado local
          const updatedProfile = {
            ...profile,
            name: data.name || profile.name,
            email: data.email || profile.email,
            birthdate: data.birthdate || profile.birthdate,
            appData: {
              ...profile.appData,
              lastSyncDate: new Date(),
            },
          };

          set({ profile: updatedProfile, loading: false });
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error);
          set({ error: 'Erro ao atualizar perfil', loading: false });
        }
      },

      updatePreferences: async (newPreferences: Partial<UserProfile['preferences']>) => {
        const { profile } = get();
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          preferences: {
            ...profile.preferences,
            ...newPreferences,
          },
          appData: {
            ...profile.appData,
            lastSyncDate: new Date(),
          },
        };

        set({ profile: updatedProfile });

        // Sincronizar com servidor em background
        try {
          // TODO: Implementar endpoint para salvar preferências
          console.log('Preferências atualizadas:', newPreferences);
        } catch (error) {
          console.error('Erro ao sincronizar preferências:', error);
        }
      },

      updateHealthData: async (newHealthData: Partial<UserProfile['healthData']>) => {
        const { profile } = get();
        if (!profile) return;

        const updatedProfile = {
          ...profile,
          healthData: {
            ...profile.healthData,
            ...newHealthData,
          },
          appData: {
            ...profile.appData,
            lastSyncDate: new Date(),
          },
        };

        set({ profile: updatedProfile });

        // Sincronizar com servidor em background
        try {
          // TODO: Implementar endpoint para salvar dados de saúde
          console.log('Dados de saúde atualizados:', newHealthData);
        } catch (error) {
          console.error('Erro ao sincronizar dados de saúde:', error);
        }
      },

      updateMetrics: async (metrics: Partial<BodyMetrics>) => {
        const { profile } = get();
        if (!profile) return;

        set({ loading: true, error: null });

        try {
          await saveUserMetrics(metrics);
          
          const updatedProfile = {
            ...profile,
            healthData: {
              ...profile.healthData,
              metrics: {
                ...profile.healthData.metrics,
                ...metrics,
              },
            },
            appData: {
              ...profile.appData,
              lastSyncDate: new Date(),
            },
          };

          set({ profile: updatedProfile, loading: false });
        } catch (error) {
          console.error('Erro ao atualizar métricas:', error);
          set({ error: 'Erro ao salvar métricas', loading: false });
        }
      },

      syncProfile: async () => {
        const { profile } = get();
        if (!profile) return;

        try {
          await get().loadProfile(profile.uid);
        } catch (error) {
          console.error('Erro ao sincronizar perfil:', error);
          set({ error: 'Erro ao sincronizar perfil', loading: false });
        }
      },

      clearProfile: () => {
        set({ profile: null, loading: false, error: null });
      },

      // Getters
      getAge: () => {
        const { profile } = get();
        if (!profile?.birthdate) return null;

        const birthDate = new Date(profile.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return age;
      },

      getBMI: () => {
        const { profile } = get();
        if (!profile?.healthData.metrics.weight || !profile?.healthData.metrics.height) {
          return null;
        }

        const weightKg = profile.healthData.metrics.weight;
        const heightM = profile.healthData.metrics.height / 100;
        
        return Number((weightKg / (heightM * heightM)).toFixed(1));
      },

      isProfileComplete: () => {
        const { profile } = get();
        if (!profile) return false;

        return !!(
          profile.name &&
          profile.email &&
          profile.birthdate &&
          profile.healthData.metrics.weight &&
          profile.healthData.metrics.height &&
          profile.healthData.goals.fitnessGoal &&
          profile.healthData.goals.activityLevel
        );
      },
    }),
    {
      name: 'user-profile-store',
      version: 1,
      partialize: (state) => ({
        profile: state.profile,
        // Não persistir loading e error
      }),
    }
  )
);

// Hook de conveniência para acessar dados do perfil
export const useUserProfile = () => {
  const store = useUserProfileStore();
  return {
    ...store,
    isComplete: store.isProfileComplete(),
    age: store.getAge(),
    bmi: store.getBMI(),
  };
};
