import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  restrictedIngredients: string[];
  alternativeIngredients: string[];
}

export interface FoodPreference {
  id: string;
  name: string;
  type: "dietary" | "allergy" | "preference" | "medical";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface UserPreferences {
  // Informações básicas
  age: number;
  gender: "male" | "female" | "other";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  fitnessGoal:
    | "weight_loss"
    | "muscle_gain"
    | "maintenance"
    | "endurance"
    | "strength";

  // Restrições alimentares
  dietaryRestrictions: string[];
  allergies: string[];
  foodPreferences: string[];

  // Restrições médicas
  medicalConditions: string[];
  medications: string[];

  // Preferências de treino
  workoutPreferences: string[];
  availableEquipment: string[];
  timeAvailable: number; // minutos por dia
  experienceLevel: "beginner" | "intermediate" | "advanced";

  // Objetivos específicos
  targetWeight?: number;
  currentWeight?: number;
  targetBodyFat?: number;
  currentBodyFat?: number;

  // Preferências pessoais
  preferredMealTimes: string[];
  budgetLevel: "low" | "medium" | "high";
  cookingSkill: "beginner" | "intermediate" | "advanced";

  // Configurações de personalização
  enableSmartRecommendations: boolean;
  enableNutritionalAlerts: boolean;
  preferMetricUnits: boolean;
}

interface PreferencesStore {
  preferences: UserPreferences;
  dietaryRestrictions: DietaryRestriction[];
  foodPreferences: FoodPreference[];
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  addDietaryRestriction: (restriction: string) => void;
  removeDietaryRestriction: (restriction: string) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  getPersonalizedRecommendations: (
    type: "nutrition" | "workout" | "general",
  ) => any[];
  isIngredientAllowed: (ingredient: string) => boolean;
  getAlternativeIngredients: (restrictedIngredient: string) => string[];
  reset: () => void;
}

// Restrições alimentares predefinidas
const DIETARY_RESTRICTIONS: DietaryRestriction[] = [
  {
    id: "vegetarian",
    name: "Vegetariano",
    description: "Não consome carne, peixe ou aves",
    restrictedIngredients: [
      "carne bovina",
      "carne suína",
      "frango",
      "peixe",
      "camarão",
      "carne",
      "bacon",
      "presunto",
    ],
    alternativeIngredients: [
      "tofu",
      "tempeh",
      "seitan",
      "leguminosas",
      "quinoa",
      "proteína de ervilha",
    ],
  },
  {
    id: "vegan",
    name: "Vegano",
    description: "Não consome produtos de origem animal",
    restrictedIngredients: [
      "carne",
      "peixe",
      "frango",
      "leite",
      "queijo",
      "ovos",
      "mel",
      "manteiga",
      "iogurte",
      "whey protein",
    ],
    alternativeIngredients: [
      "leite de amêndoas",
      "leite de aveia",
      "proteína vegetal",
      "nutritional yeast",
      "tofu",
      "tempeh",
    ],
  },
  {
    id: "lactose_intolerant",
    name: "Intolerante à Lactose",
    description: "Não pode consumir lactose",
    restrictedIngredients: [
      "leite",
      "queijo",
      "iogurte",
      "manteiga",
      "creme de leite",
      "whey protein",
      "caseína",
    ],
    alternativeIngredients: [
      "leite sem lactose",
      "leite de amêndoas",
      "leite de aveia",
      "proteína vegetal",
      "queijo vegano",
    ],
  },
  {
    id: "gluten_free",
    name: "Sem Glúten",
    description: "Não pode consumir glúten",
    restrictedIngredients: [
      "trigo",
      "cevada",
      "centeio",
      "aveia comum",
      "farinha de trigo",
      "pão comum",
    ],
    alternativeIngredients: [
      "arroz",
      "quinoa",
      "farinha de arroz",
      "farinha de amêndoas",
      "aveia sem glúten",
      "pão sem glúten",
    ],
  },
  {
    id: "diabetic",
    name: "Diabético",
    description: "Controle rigoroso de açúcar e carboidratos",
    restrictedIngredients: [
      "açúcar refinado",
      "mel",
      "refrigerante",
      "doces",
      "massas refinadas",
    ],
    alternativeIngredients: [
      "stevia",
      "eritritol",
      "frutas com baixo IG",
      "aveia",
      "quinoa",
      "batata doce",
    ],
  },
  {
    id: "low_sodium",
    name: "Baixo Sódio",
    description: "Restrição de sódio para hipertensão",
    restrictedIngredients: [
      "sal refinado",
      "temperos prontos",
      "embutidos",
      "enlatados com sal",
    ],
    alternativeIngredients: [
      "ervas frescas",
      "temperos naturais",
      "sal rosa",
      "limão",
      "alho",
      "cebola",
    ],
  },
];

// Preferências alimentares
const FOOD_PREFERENCES: FoodPreference[] = [
  {
    id: "low_carb",
    name: "Low Carb",
    type: "dietary",
    severity: "medium",
    description: "Prefere baixo consumo de carboidratos",
  },
  {
    id: "keto",
    name: "Cetogênica",
    type: "dietary",
    severity: "high",
    description: "Dieta cetogênica com muito baixo carbo",
  },
  {
    id: "paleo",
    name: "Paleo",
    type: "dietary",
    severity: "medium",
    description: "Baseada em alimentos não processados",
  },
  {
    id: "mediterranean",
    name: "Mediterrânea",
    type: "preference",
    severity: "low",
    description: "Rica em peixes, azeite e vegetais",
  },
];

const defaultPreferences: UserPreferences = {
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
  experienceLevel: "beginner",
  preferredMealTimes: ["08:00", "12:00", "19:00"],
  budgetLevel: "medium",
  cookingSkill: "intermediate",
  enableSmartRecommendations: true,
  enableNutritionalAlerts: true,
  preferMetricUnits: true,
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      dietaryRestrictions: DIETARY_RESTRICTIONS,
      foodPreferences: FOOD_PREFERENCES,

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      addDietaryRestriction: (restriction) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            dietaryRestrictions: [
              ...state.preferences.dietaryRestrictions,
              restriction,
            ],
          },
        })),

      removeDietaryRestriction: (restriction) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            dietaryRestrictions: state.preferences.dietaryRestrictions.filter(
              (r) => r !== restriction,
            ),
          },
        })),

      addAllergy: (allergy) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            allergies: [...state.preferences.allergies, allergy],
          },
        })),

      removeAllergy: (allergy) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            allergies: state.preferences.allergies.filter((a) => a !== allergy),
          },
        })),

      isIngredientAllowed: (ingredient) => {
        const state = get();
        const lowerIngredient = ingredient.toLowerCase();

        // Verificar restrições dietárias
        for (const restrictionId of state.preferences.dietaryRestrictions) {
          const restriction = state.dietaryRestrictions.find(
            (r) => r.id === restrictionId,
          );
          if (restriction) {
            const isRestricted = restriction.restrictedIngredients.some(
              (ri) =>
                lowerIngredient.includes(ri.toLowerCase()) ||
                ri.toLowerCase().includes(lowerIngredient),
            );
            if (isRestricted) return false;
          }
        }

        // Verificar alergias
        const hasAllergy = state.preferences.allergies.some(
          (allergy) =>
            lowerIngredient.includes(allergy.toLowerCase()) ||
            allergy.toLowerCase().includes(lowerIngredient),
        );

        return !hasAllergy;
      },

      getAlternativeIngredients: (restrictedIngredient) => {
        const state = get();
        const alternatives: string[] = [];

        for (const restrictionId of state.preferences.dietaryRestrictions) {
          const restriction = state.dietaryRestrictions.find(
            (r) => r.id === restrictionId,
          );
          if (restriction) {
            const isRestricted = restriction.restrictedIngredients.some((ri) =>
              restrictedIngredient.toLowerCase().includes(ri.toLowerCase()),
            );
            if (isRestricted) {
              alternatives.push(...restriction.alternativeIngredients);
            }
          }
        }

        return [...new Set(alternatives)]; // Remove duplicatas
      },

      getPersonalizedRecommendations: (type) => {
        const state = get();
        const { preferences } = state;

        if (type === "nutrition") {
          return getNutritionalRecommendations(
            preferences,
            state.dietaryRestrictions,
          );
        } else if (type === "workout") {
          return getWorkoutRecommendations(preferences);
        }

        return [];
      },

      reset: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: "preferences-storage",
    },
  ),
);

// Funções auxiliares para recomendações
const getNutritionalRecommendations = (
  preferences: UserPreferences,
  restrictions: DietaryRestriction[],
) => {
  const recommendations = [];

  // Recomendações baseadas no objetivo
  if (preferences.fitnessGoal === "weight_loss") {
    recommendations.push({
      type: "caloric_deficit",
      title: "Déficit Calórico",
      description: "Consuma 300-500 calorias abaixo da sua necessidade diária",
      priority: "high",
    });
  } else if (preferences.fitnessGoal === "muscle_gain") {
    recommendations.push({
      type: "protein_intake",
      title: "Aumento de Proteína",
      description: "Consuma 1.6-2.2g de proteína por kg de peso corporal",
      priority: "high",
    });
  }

  // Recomendações baseadas em restrições
  if (preferences.dietaryRestrictions.includes("vegan")) {
    recommendations.push({
      type: "b12_supplement",
      title: "Suplemento B12",
      description: "Considere suplementação de vitamina B12",
      priority: "medium",
    });
  }

  return recommendations;
};

const getWorkoutRecommendations = (preferences: UserPreferences) => {
  const recommendations = [];

  if (preferences.experienceLevel === "beginner") {
    recommendations.push({
      type: "basic_routine",
      title: "Rotina Básica",
      description: "Comece com 3x por semana, foco em movimentos básicos",
      priority: "high",
    });
  }

  if (preferences.timeAvailable < 30) {
    recommendations.push({
      type: "hiit_workout",
      title: "HIIT Rápido",
      description: "Treinos de alta intensidade de 15-20 minutos",
      priority: "medium",
    });
  }

  return recommendations;
};

// Funções utilitárias exportadas
export const getDietaryRestrictionsOptions = () => DIETARY_RESTRICTIONS;
export const getFoodPreferencesOptions = () => FOOD_PREFERENCES;

export const getPersonalizedNutrition = (
  preferences: UserPreferences,
  mealType: string,
) => {
  // Lógica para personalizar receitas baseada nas preferências
  const personalizedMeal = {
    ingredients: [],
    alternatives: [],
    warnings: [],
    recommendations: [],
  };

  return personalizedMeal;
};
