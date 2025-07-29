import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecommendationEngine, createRecommendationEngine, getContextualRecommendations } from '../lib/recommendations';
import { UserPreferences, DietaryRestriction, FoodPreference } from './preferencesStore';

// Enhanced preferences interface with recommendation settings
export interface EnhancedUserPreferences extends UserPreferences {
  // Recommendation settings
  recommendationFrequency: 'real-time' | 'daily' | 'weekly';
  allowDataCollection: boolean;
  shareAnonymousData: boolean;
  
  // Learning preferences
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  contentDifficulty: 'adaptive' | 'easy' | 'moderate' | 'challenging';
  
  // Notification preferences
  reminderTimes: string[];
  enableProgressNotifications: boolean;
  enableGoalMilestones: boolean;
  enableWeeklyReports: boolean;
  
  // Context preferences
  preferredWorkoutTimes: string[];
  restDays: string[];
  adaptToSchedule: boolean;
  
  // Social preferences
  shareProgress: boolean;
  joinCommunityEvents: boolean;
  competitiveMode: boolean;
}

export interface PersonalizedContent {
  videos: any[];
  products: any[];
  apps: any[];
  challenges: any[];
  tips: string[];
  lastUpdated: Date;
}

export interface UserContext {
  currentTime: Date;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  lastActivityType?: string;
  lastActivityTime?: Date;
  currentMood?: 'energetic' | 'tired' | 'motivated' | 'stressed' | 'neutral';
  weatherCondition?: 'sunny' | 'rainy' | 'cloudy' | 'snowy';
  location?: 'home' | 'gym' | 'outdoor' | 'office';
  upcomingEvents?: string[];
}

interface EnhancedPreferencesState {
  preferences: EnhancedUserPreferences;
  personalizedContent: PersonalizedContent;
  userContext: UserContext;
  recommendationEngine: RecommendationEngine | null;
  
  // Actions
  updatePreferences: (newPreferences: Partial<EnhancedUserPreferences>) => void;
  updateUserContext: (context: Partial<UserContext>) => void;
  refreshRecommendations: () => Promise<void>;
  getSmartRecommendations: (type?: 'videos' | 'products' | 'apps' | 'all') => any;
  trackUserInteraction: (type: 'view' | 'like' | 'complete' | 'skip', itemId: string, category: string) => void;
  adaptPreferences: (interactionData: any) => void;
  getContextualSuggestions: () => string[];
  scheduleReminders: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
  getRecommendationInsights: () => any;
  reset: () => void;
}

// Default enhanced preferences
const DEFAULT_ENHANCED_PREFERENCES: EnhancedUserPreferences = {
  // Base preferences
  age: 25,
  gender: "other",
  activityLevel: "moderate",
  fitnessGoal: "maintenance",
  dietaryRestrictions: [],
  allergies: [],
  foodPreferences: [],
  medicalConditions: [],
  medications: [],
  workoutPreferences: [],
  availableEquipment: [],
  timeAvailable: 60,
  experienceLevel: "intermediate",
  preferredMealTimes: [],
  budgetLevel: "medium",
  cookingSkill: "intermediate",
  enableSmartRecommendations: true,
  enableNutritionalAlerts: true,
  preferMetricUnits: true,
  
  // Enhanced preferences
  recommendationFrequency: 'daily',
  allowDataCollection: true,
  shareAnonymousData: false,
  learningStyle: 'mixed',
  contentDifficulty: 'adaptive',
  reminderTimes: ['09:00', '18:00'],
  enableProgressNotifications: true,
  enableGoalMilestones: true,
  enableWeeklyReports: true,
  preferredWorkoutTimes: ['morning'],
  restDays: ['sunday'],
  adaptToSchedule: true,
  shareProgress: false,
  joinCommunityEvents: true,
  competitiveMode: false,
};

const getTimeOfDay = (hour: number): 'morning' | 'afternoon' | 'evening' | 'night' => {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

const getDayOfWeek = (date: Date): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const useEnhancedPreferencesStore = create<EnhancedPreferencesState>()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_ENHANCED_PREFERENCES,
      personalizedContent: {
        videos: [],
        products: [],
        apps: [],
        challenges: [],
        tips: [],
        lastUpdated: new Date(),
      },
      userContext: {
        currentTime: new Date(),
        timeOfDay: getTimeOfDay(new Date().getHours()),
        dayOfWeek: getDayOfWeek(new Date()),
      },
      recommendationEngine: null,

      updatePreferences: (newPreferences: Partial<EnhancedUserPreferences>) => {
        const state = get();
        const updatedPreferences = { ...state.preferences, ...newPreferences };
        
        // Create new recommendation engine with updated preferences
        const engine = createRecommendationEngine(updatedPreferences);
        
        set({
          preferences: updatedPreferences,
          recommendationEngine: engine,
        });

        // Refresh recommendations if smart recommendations are enabled
        if (updatedPreferences.enableSmartRecommendations) {
          get().refreshRecommendations();
        }
      },

      updateUserContext: (context: Partial<UserContext>) => {
        const state = get();
        const now = new Date();
        
        const updatedContext: UserContext = {
          ...state.userContext,
          ...context,
          currentTime: now,
          timeOfDay: getTimeOfDay(now.getHours()),
          dayOfWeek: getDayOfWeek(now),
        };

        set({ userContext: updatedContext });

        // Refresh recommendations if context significantly changed
        if (context.currentMood || context.location || context.timeOfDay) {
          get().refreshRecommendations();
        }
      },

      refreshRecommendations: async () => {
        const state = get();
        if (!state.preferences.enableSmartRecommendations) return;

        try {
          // Get contextual recommendations
          const recommendations = getContextualRecommendations(
            state.preferences,
            {
              timeOfDay: state.userContext.timeOfDay,
              dayOfWeek: state.userContext.dayOfWeek,
              lastActivity: state.userContext.lastActivityType,
              currentMood: state.userContext.currentMood,
            }
          );

          // Generate contextual tips
          const tips = get().getContextualSuggestions();

          set({
            personalizedContent: {
              ...recommendations,
              tips,
              lastUpdated: new Date(),
            },
          });
        } catch (error) {
          console.error('Failed to refresh recommendations:', error);
        }
      },

      getSmartRecommendations: (type = 'all') => {
        const state = get();
        const content = state.personalizedContent;

        switch (type) {
          case 'videos': return content.videos;
          case 'products': return content.products;
          case 'apps': return content.apps;
          default: return content;
        }
      },

      trackUserInteraction: (type, itemId, category) => {
        const state = get();
        
        // Update user context based on interaction
        const updates: Partial<UserContext> = {
          lastActivityType: category,
          lastActivityTime: new Date(),
        };

        // Infer mood from interaction patterns
        if (type === 'complete') {
          updates.currentMood = 'motivated';
        } else if (type === 'skip') {
          updates.currentMood = 'neutral';
        }

        get().updateUserContext(updates);

        // Store interaction for learning (in a real app, this would go to analytics)
        const interactionData = {
          type,
          itemId,
          category,
          timestamp: new Date(),
          context: state.userContext,
        };

        // Adapt preferences based on interactions
        get().adaptPreferences(interactionData);
      },

      adaptPreferences: (interactionData) => {
        const state = get();
        const { type, category } = interactionData;

        // Simple adaptive learning based on user behavior
        const updates: Partial<EnhancedUserPreferences> = {};

        // If user consistently completes content of a certain difficulty
        if (type === 'complete') {
          if (category.includes('avançado') && state.preferences.contentDifficulty === 'moderate') {
            updates.contentDifficulty = 'challenging';
          } else if (category.includes('iniciante') && state.preferences.contentDifficulty === 'challenging') {
            updates.contentDifficulty = 'moderate';
          }
        }

        // If user consistently skips certain types of content
        if (type === 'skip') {
          // This would require more sophisticated logic in a real implementation
        }

        if (Object.keys(updates).length > 0) {
          get().updatePreferences(updates);
        }
      },

      getContextualSuggestions: (): string[] => {
        const state = get();
        const { timeOfDay, dayOfWeek, currentMood } = state.userContext;
        const { fitnessGoal, activityLevel } = state.preferences;

        const suggestions: string[] = [];

        // Time-based suggestions
        if (timeOfDay === 'morning') {
          suggestions.push('Comece o dia com uma sessão de alongamento energizante');
          suggestions.push('Hidrate-se bem antes do treino matinal');
        } else if (timeOfDay === 'evening') {
          suggestions.push('Considere um treino mais leve ou relaxante');
          suggestions.push('Pratique mindfulness antes de dormir');
        }

        // Day-based suggestions
        if (dayOfWeek === 'monday') {
          suggestions.push('Nova semana, novos objetivos! Defina suas metas semanais');
        } else if (dayOfWeek === 'friday') {
          suggestions.push('Que tal um treino divertido para celebrar o fim de semana?');
        }

        // Mood-based suggestions
        if (currentMood === 'tired') {
          suggestions.push('Você parece cansado. Que tal uma caminhada leve ou yoga?');
        } else if (currentMood === 'energetic') {
          suggestions.push('Você está com energia! Aproveite para um treino mais intenso');
        } else if (currentMood === 'stressed') {
          suggestions.push('Respire fundo. Uma sessão de meditação pode ajudar');
        }

        // Goal-based suggestions
        if (fitnessGoal === 'weight_loss') {
          suggestions.push('Lembre-se: consistência é chave para o emagrecimento saudável');
        } else if (fitnessGoal === 'muscle_gain') {
          suggestions.push('Não esqueça da importância do descanso para o crescimento muscular');
        }

        // Activity level suggestions
        if (activityLevel === 'sedentary') {
          suggestions.push('Pequenos passos fazem grande diferença. Comece devagar!');
        } else if (activityLevel === 'very_active') {
          suggestions.push('Cuidado com o overtraining. O descanso também é importante');
        }

        return suggestions.slice(0, 3); // Return top 3 suggestions
      },

      scheduleReminders: () => {
        const state = get();
        if (!state.preferences.enableProgressNotifications) return;

        // In a real app, this would integrate with push notifications
        console.log('Scheduling reminders for:', state.preferences.reminderTimes);
      },

      exportPreferences: (): string => {
        const state = get();
        return JSON.stringify({
          preferences: state.preferences,
          version: '1.0',
          exportedAt: new Date().toISOString(),
        });
      },

      importPreferences: (data: string): boolean => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.preferences && parsed.version) {
            get().updatePreferences(parsed.preferences);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to import preferences:', error);
          return false;
        }
      },

      getRecommendationInsights: () => {
        const state = get();
        const { preferences, personalizedContent, userContext } = state;

        return {
          totalRecommendations: 
            personalizedContent.videos.length + 
            personalizedContent.products.length + 
            personalizedContent.apps.length,
          lastUpdated: personalizedContent.lastUpdated,
          userProfile: {
            goal: preferences.fitnessGoal,
            level: preferences.experienceLevel,
            activityLevel: preferences.activityLevel,
          },
          currentContext: {
            timeOfDay: userContext.timeOfDay,
            mood: userContext.currentMood || 'neutral',
            location: userContext.location || 'unknown',
          },
          adaptiveFeatures: {
            smartRecommendationsEnabled: preferences.enableSmartRecommendations,
            contentDifficulty: preferences.contentDifficulty,
            learningStyle: preferences.learningStyle,
          },
        };
      },

      reset: () => {
        set({
          preferences: DEFAULT_ENHANCED_PREFERENCES,
          personalizedContent: {
            videos: [],
            products: [],
            apps: [],
            challenges: [],
            tips: [],
            lastUpdated: new Date(),
          },
          userContext: {
            currentTime: new Date(),
            timeOfDay: getTimeOfDay(new Date().getHours()),
            dayOfWeek: getDayOfWeek(new Date()),
          },
          recommendationEngine: null,
        });
      },
    }),
    {
      name: 'enhanced-preferences-store',
      version: 1,
      // Only persist preferences and some context, not the recommendation engine
      partialize: (state) => ({
        preferences: state.preferences,
        userContext: {
          ...state.userContext,
          currentMood: state.userContext.currentMood,
          location: state.userContext.location,
        },
      }),
    }
  )
);

// Hook for easy access to recommendation features
export const useSmartRecommendations = () => {
  const {
    getSmartRecommendations,
    refreshRecommendations,
    trackUserInteraction,
    getContextualSuggestions,
    updateUserContext,
  } = useEnhancedPreferencesStore();

  return {
    getRecommendations: getSmartRecommendations,
    refresh: refreshRecommendations,
    trackInteraction: trackUserInteraction,
    getSuggestions: getContextualSuggestions,
    updateContext: updateUserContext,
  };
};

export default useEnhancedPreferencesStore;
