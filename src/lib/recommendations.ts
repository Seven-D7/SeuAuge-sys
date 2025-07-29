// Intelligent Recommendation System

import { UserPreferences } from '../stores/preferencesStore';
import { Video } from '../stores/favoritesStore';
import { Product } from '../stores/cartStore';
import { apps } from '../data/apps';

export interface RecommendationScore {
  score: number;
  reasons: string[];
  category: 'high' | 'medium' | 'low';
}

export interface RecommendedItem<T> {
  item: T;
  score: RecommendationScore;
  personalizedReason: string;
}

export interface RecommendationFilters {
  maxItems?: number;
  minScore?: number;
  categories?: string[];
  excludeCompleted?: boolean;
}

// Weight constants for different factors
const WEIGHTS = {
  GOAL_MATCH: 0.3,
  ACTIVITY_LEVEL: 0.25,
  EXPERIENCE_LEVEL: 0.2,
  DIETARY_MATCH: 0.15,
  TIME_AVAILABLE: 0.1,
} as const;

export class RecommendationEngine {
  private preferences: UserPreferences;

  constructor(preferences: UserPreferences) {
    this.preferences = preferences;
  }

  // Main recommendation method for videos
  public recommendVideos(
    videos: Video[],
    filters: RecommendationFilters = {}
  ): RecommendedItem<Video>[] {
    const scoredVideos = videos.map(video => ({
      item: video,
      score: this.calculateVideoScore(video),
      personalizedReason: this.generateVideoReason(video),
    }));

    return this.filterAndSort(scoredVideos, filters);
  }

  // Main recommendation method for products
  public recommendProducts(
    products: Product[],
    filters: RecommendationFilters = {}
  ): RecommendedItem<Product>[] {
    const scoredProducts = products.map(product => ({
      item: product,
      score: this.calculateProductScore(product),
      personalizedReason: this.generateProductReason(product),
    }));

    return this.filterAndSort(scoredProducts, filters);
  }

  // Main recommendation method for apps
  public recommendApps(
    filters: RecommendationFilters = {}
  ): RecommendedItem<any>[] {
    const scoredApps = apps.map(app => ({
      item: app,
      score: this.calculateAppScore(app),
      personalizedReason: this.generateAppReason(app),
    }));

    return this.filterAndSort(scoredApps, filters);
  }

  // Calculate video recommendation score
  private calculateVideoScore(video: Video): RecommendationScore {
    let totalScore = 0;
    const reasons: string[] = [];

    // Goal alignment
    const goalScore = this.getGoalAlignmentScore(video.category, video.tags);
    totalScore += goalScore * WEIGHTS.GOAL_MATCH;
    if (goalScore > 0.7) {
      reasons.push(`Alinhado com seu objetivo de ${this.getGoalDescription()}`);
    }

    // Activity level match
    const activityScore = this.getActivityLevelScore(video.category, video.tags);
    totalScore += activityScore * WEIGHTS.ACTIVITY_LEVEL;
    if (activityScore > 0.7) {
      reasons.push(`Adequado para seu nível de atividade`);
    }

    // Experience level
    const experienceScore = this.getExperienceLevelScore(video.tags);
    totalScore += experienceScore * WEIGHTS.EXPERIENCE_LEVEL;
    if (experienceScore > 0.7) {
      reasons.push(`Ideal para seu nível de experiência`);
    }

    // Time consideration
    const timeScore = this.getTimeScore(video.duration);
    totalScore += timeScore * WEIGHTS.TIME_AVAILABLE;
    if (timeScore > 0.8) {
      reasons.push(`Encaixa no seu tempo disponível`);
    }

    // Dietary alignment (for nutrition videos)
    if (video.category.toLowerCase().includes('nutrição')) {
      const dietaryScore = this.getDietaryAlignmentScore(video.tags);
      totalScore += dietaryScore * WEIGHTS.DIETARY_MATCH;
      if (dietaryScore > 0.7) {
        reasons.push(`Compatível com suas restrições alimentares`);
      }
    }

    return {
      score: Math.min(1, totalScore),
      reasons,
      category: this.getScoreCategory(totalScore),
    };
  }

  // Calculate product recommendation score
  private calculateProductScore(product: Product): RecommendationScore {
    let totalScore = 0;
    const reasons: string[] = [];

    // Goal alignment
    const goalScore = this.getGoalAlignmentScore(product.category, product.tags || []);
    totalScore += goalScore * WEIGHTS.GOAL_MATCH;
    if (goalScore > 0.7) {
      reasons.push(`Ajuda com seu objetivo de ${this.getGoalDescription()}`);
    }

    // Budget consideration
    const budgetScore = this.getBudgetScore(product.price);
    totalScore += budgetScore * 0.2;
    if (budgetScore > 0.7) {
      reasons.push(`Dentro do seu orçamento`);
    }

    // Dietary restrictions (for supplements/food products)
    if (this.isNutritionProduct(product)) {
      const dietaryScore = this.getDietaryAlignmentScore(product.tags || []);
      totalScore += dietaryScore * WEIGHTS.DIETARY_MATCH;
      if (dietaryScore > 0.7) {
        reasons.push(`Compatível com suas restrições alimentares`);
      }
    }

    // Activity level match
    const activityScore = this.getActivityLevelScore(product.category, product.tags || []);
    totalScore += activityScore * WEIGHTS.ACTIVITY_LEVEL;

    return {
      score: Math.min(1, totalScore),
      reasons,
      category: this.getScoreCategory(totalScore),
    };
  }

  // Calculate app recommendation score
  private calculateAppScore(app: any): RecommendationScore {
    let totalScore = 0;
    const reasons: string[] = [];

    // Goal alignment
    const goalScore = this.getGoalAlignmentScore(app.category, app.tags || []);
    totalScore += goalScore * WEIGHTS.GOAL_MATCH;
    if (goalScore > 0.7) {
      reasons.push(`Focado no seu objetivo principal`);
    }

    // Experience level
    const experienceScore = this.getExperienceLevelScore(app.tags || []);
    totalScore += experienceScore * WEIGHTS.EXPERIENCE_LEVEL;

    // Feature alignment
    const featureScore = this.getFeatureAlignmentScore(app);
    totalScore += featureScore * 0.3;
    if (featureScore > 0.7) {
      reasons.push(`Recursos alinhados com suas necessidades`);
    }

    return {
      score: Math.min(1, totalScore),
      reasons,
      category: this.getScoreCategory(totalScore),
    };
  }

  // Helper methods for scoring
  private getGoalAlignmentScore(category: string, tags: string[]): number {
    const goal = this.preferences.fitnessGoal;
    const categoryLower = category.toLowerCase();
    const tagsLower = tags.map(tag => tag.toLowerCase());

    const goalKeywords = {
      weight_loss: ['emagrecimento', 'perda', 'queima', 'cardio', 'aeróbico', 'hiit'],
      muscle_gain: ['ganho', 'massa', 'musculação', 'força', 'hipertrofia', 'proteína'],
      maintenance: ['manutenção', 'equilibrio', 'saúde', 'bem-estar', 'lifestyle'],
      endurance: ['resistência', 'cardio', 'corrida', 'ciclismo', 'aeróbico', 'endurance'],
      strength: ['força', 'potência', 'powerlifting', 'strongman', 'levantamento'],
    };

    const keywords = goalKeywords[goal] || [];
    
    let score = 0;
    keywords.forEach(keyword => {
      if (categoryLower.includes(keyword)) score += 0.4;
      tagsLower.forEach(tag => {
        if (tag.includes(keyword)) score += 0.2;
      });
    });

    return Math.min(1, score);
  }

  private getActivityLevelScore(category: string, tags: string[]): number {
    const level = this.preferences.activityLevel;
    const categoryLower = category.toLowerCase();
    const tagsLower = tags.map(tag => tag.toLowerCase());

    const levelKeywords = {
      sedentary: ['iniciante', 'básico', 'leve', 'caminhada', 'alongamento'],
      light: ['iniciante', 'básico', 'moderado', 'yoga', 'pilates'],
      moderate: ['intermediário', 'moderado', 'treino', 'fitness'],
      active: ['avançado', 'intenso', 'crossfit', 'hiit', 'funcional'],
      very_active: ['extremo', 'atleta', 'competição', 'performance', 'elite'],
    };

    const keywords = levelKeywords[level] || [];
    
    let score = 0;
    keywords.forEach(keyword => {
      if (categoryLower.includes(keyword)) score += 0.3;
      tagsLower.forEach(tag => {
        if (tag.includes(keyword)) score += 0.15;
      });
    });

    return Math.min(1, score || 0.5); // Default score if no match
  }

  private getExperienceLevelScore(tags: string[]): number {
    const experience = this.preferences.experienceLevel;
    const tagsLower = tags.map(tag => tag.toLowerCase());

    const experienceKeywords = {
      beginner: ['iniciante', 'básico', 'começo', 'primeiro'],
      intermediate: ['intermediário', 'moderado', 'progressão'],
      advanced: ['avançado', 'expert', 'profissional', 'elite'],
    };

    const keywords = experienceKeywords[experience] || [];
    
    let score = 0;
    keywords.forEach(keyword => {
      tagsLower.forEach(tag => {
        if (tag.includes(keyword)) score += 0.3;
      });
    });

    return Math.min(1, score || 0.6); // Default score
  }

  private getTimeScore(duration: string): number {
    const availableTime = this.preferences.timeAvailable;
    
    // Extract minutes from duration string (e.g., "30:00" or "45 min")
    const match = duration.match(/(\d+)/);
    const videoDuration = match ? parseInt(match[1]) : 30;

    if (videoDuration <= availableTime) return 1;
    if (videoDuration <= availableTime * 1.2) return 0.8;
    if (videoDuration <= availableTime * 1.5) return 0.6;
    return 0.3;
  }

  private getDietaryAlignmentScore(tags: string[]): number {
    const restrictions = this.preferences.dietaryRestrictions;
    const tagsLower = tags.map(tag => tag.toLowerCase());

    if (restrictions.length === 0) return 0.8; // Default score if no restrictions

    let alignmentScore = 0;
    restrictions.forEach(restriction => {
      const restrictionLower = restriction.toLowerCase();
      if (tagsLower.some(tag => tag.includes(restrictionLower))) {
        alignmentScore += 0.3;
      }
    });

    return Math.min(1, alignmentScore || 0.5);
  }

  private getBudgetScore(price: number): number {
    const budget = this.preferences.budgetLevel;
    
    const budgetRanges = {
      low: { max: 50, optimal: 25 },
      medium: { max: 150, optimal: 75 },
      high: { max: 500, optimal: 200 },
    };

    const range = budgetRanges[budget];
    if (price <= range.optimal) return 1;
    if (price <= range.max) return 0.7;
    return 0.3;
  }

  private getFeatureAlignmentScore(app: any): number {
    let score = 0;
    const preferences = this.preferences;

    // Check for smart recommendations preference
    if (preferences.enableSmartRecommendations && app.features?.includes('ai')) {
      score += 0.3;
    }

    // Check for nutritional alerts preference
    if (preferences.enableNutritionalAlerts && app.category === 'nutrition') {
      score += 0.3;
    }

    // Check for equipment alignment
    if (app.category === 'fitness' && preferences.availableEquipment.length > 0) {
      const hasEquipmentMatch = preferences.availableEquipment.some(equipment =>
        app.description?.toLowerCase().includes(equipment.toLowerCase())
      );
      if (hasEquipmentMatch) score += 0.4;
    }

    return Math.min(1, score);
  }

  // Helper methods
  private getGoalDescription(): string {
    const descriptions = {
      weight_loss: 'emagrecimento',
      muscle_gain: 'ganho de massa muscular',
      maintenance: 'manutenção do peso',
      endurance: 'melhoria da resistência',
      strength: 'ganho de força',
    };
    return descriptions[this.preferences.fitnessGoal] || 'bem-estar geral';
  }

  private getScoreCategory(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  private isNutritionProduct(product: Product): boolean {
    const nutritionCategories = ['suplementos', 'vitaminas', 'proteínas', 'nutrição'];
    return nutritionCategories.some(cat => 
      product.category.toLowerCase().includes(cat.toLowerCase())
    );
  }

  // Filter and sort results
  private filterAndSort<T>(
    items: RecommendedItem<T>[],
    filters: RecommendationFilters
  ): RecommendedItem<T>[] {
    let filtered = items;

    // Apply filters
    if (filters.minScore) {
      filtered = filtered.filter(item => item.score.score >= filters.minScore!);
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(item => {
        const category = (item.item as any).category?.toLowerCase() || '';
        return filters.categories!.some(cat => 
          category.includes(cat.toLowerCase())
        );
      });
    }

    // Sort by score (descending)
    filtered.sort((a, b) => b.score.score - a.score.score);

    // Limit results
    if (filters.maxItems) {
      filtered = filtered.slice(0, filters.maxItems);
    }

    return filtered;
  }

  // Generate personalized reasons
  private generateVideoReason(video: Video): string {
    const score = this.calculateVideoScore(video);
    
    if (score.category === 'high') {
      return `Altamente recomendado para você com base no seu perfil de ${this.getGoalDescription()}`;
    } else if (score.category === 'medium') {
      return `Pode ser interessante com base nas suas preferências`;
    } else {
      return `Conteúdo adicional que pode complementar sua jornada`;
    }
  }

  private generateProductReason(product: Product): string {
    const score = this.calculateProductScore(product);
    
    if (score.category === 'high') {
      return `Produto ideal para seu objetivo de ${this.getGoalDescription()}`;
    } else if (score.category === 'medium') {
      return `Produto que pode auxiliar em sua jornada`;
    } else {
      return `Opção adicional disponível`;
    }
  }

  private generateAppReason(app: any): string {
    const score = this.calculateAppScore(app);
    
    if (score.category === 'high') {
      return `App perfeito para suas necessidades de ${this.getGoalDescription()}`;
    } else if (score.category === 'medium') {
      return `App útil que pode complementar sua rotina`;
    } else {
      return `Ferramenta adicional disponível`;
    }
  }
}

// Utility function to create recommendation engine
export const createRecommendationEngine = (preferences: UserPreferences): RecommendationEngine => {
  return new RecommendationEngine(preferences);
};

// Context-aware recommendations
export const getContextualRecommendations = (
  preferences: UserPreferences,
  context: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    dayOfWeek?: string;
    lastActivity?: string;
    currentMood?: 'energetic' | 'tired' | 'motivated' | 'stressed';
  }
) => {
  const engine = new RecommendationEngine(preferences);
  
  // Adjust recommendations based on context
  const contextFilters: RecommendationFilters = {
    maxItems: 10,
    minScore: 0.3,
  };

  // Time-based filtering
  if (context.timeOfDay === 'morning') {
    contextFilters.categories = ['energia', 'cardio', 'yoga'];
  } else if (context.timeOfDay === 'evening') {
    contextFilters.categories = ['relaxamento', 'alongamento', 'mindfulness'];
  }

  return {
    videos: engine.recommendVideos([], contextFilters),
    products: engine.recommendProducts([], contextFilters),
    apps: engine.recommendApps(contextFilters),
  };
};

export default RecommendationEngine;
