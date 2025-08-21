import { supabase } from '../lib/supabase';

export interface UserMetrics {
  id?: string;
  user_id: string;
  weight: number;
  height: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  bmi: number;
  waist_circumference?: number;
  hip_circumference?: number;
  neck_circumference?: number;
  chest_circumference?: number;
  arm_circumference?: number;
  thigh_circumference?: number;
  measured_at: string;
}

export interface MetricsHistory {
  date: string;
  weight: number;
  bmi: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
}

export interface ProgressSummary {
  weightChange: number;
  bmiChange: number;
  bodyFatChange?: number;
  muscleMassChange?: number;
  timespan: string;
  trends: {
    weight: 'improving' | 'stable' | 'declining';
    bmi: 'improving' | 'stable' | 'declining';
    bodyFat: 'improving' | 'stable' | 'declining';
    muscleMass: 'improving' | 'stable' | 'declining';
  };
}

class MetricsService {
  // Save user metrics
  async saveMetrics(metrics: Omit<UserMetrics, 'id'>): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      // Calculate BMI if not provided
      if (!metrics.bmi && metrics.weight && metrics.height) {
        const heightInMeters = metrics.height / 100;
        metrics.bmi = parseFloat((metrics.weight / (heightInMeters * heightInMeters)).toFixed(2));
      }

      // Validate metrics
      const validation = this.validateMetrics(metrics);
      if (!validation.isValid) {
        return { error: validation.error };
      }

      // Insert metrics
      const { error } = await supabase
        .from('user_metrics')
        .insert({
          ...metrics,
          user_id: user.id,
          measured_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving metrics:', error);
        return { error: 'Erro ao salvar métricas. Tente novamente.' };
      }

      // Update user stats with latest metrics
      await this.updateUserStatsWithMetrics(user.id, metrics);

      return { error: null };

    } catch (error: any) {
      console.error('Metrics service error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get user metrics history
  async getMetricsHistory(limit: number = 30): Promise<{ data: MetricsHistory[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('user_metrics')
        .select('weight, height, bmi, body_fat_percentage, muscle_mass, measured_at')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching metrics history:', error);
        return { data: null, error: 'Erro ao buscar histórico de métricas' };
      }

      const history: MetricsHistory[] = (data || []).map(item => ({
        date: item.measured_at,
        weight: item.weight,
        bmi: item.bmi,
        body_fat_percentage: item.body_fat_percentage,
        muscle_mass: item.muscle_mass,
      }));

      return { data: history, error: null };

    } catch (error: any) {
      console.error('Get metrics history error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Get latest metrics
  async getLatestMetrics(): Promise<{ data: UserMetrics | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching latest metrics:', error);
        return { data: null, error: 'Erro ao buscar métricas mais recentes' };
      }

      return { data: data || null, error: null };

    } catch (error: any) {
      console.error('Get latest metrics error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Calculate progress summary
  async getProgressSummary(timespan: '7d' | '30d' | '90d' = '30d'): Promise<{ data: ProgressSummary | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timespan) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Get metrics for the period
      const { data, error } = await supabase
        .from('user_metrics')
        .select('weight, bmi, body_fat_percentage, muscle_mass, measured_at')
        .eq('user_id', user.id)
        .gte('measured_at', startDate.toISOString())
        .order('measured_at', { ascending: true });

      if (error) {
        console.error('Error fetching progress data:', error);
        return { data: null, error: 'Erro ao calcular progresso' };
      }

      if (!data || data.length < 2) {
        return { data: null, error: 'Dados insuficientes para calcular progresso' };
      }

      // Calculate changes
      const firstMetrics = data[0];
      const lastMetrics = data[data.length - 1];

      const summary: ProgressSummary = {
        weightChange: parseFloat((lastMetrics.weight - firstMetrics.weight).toFixed(2)),
        bmiChange: parseFloat((lastMetrics.bmi - firstMetrics.bmi).toFixed(2)),
        bodyFatChange: firstMetrics.body_fat_percentage && lastMetrics.body_fat_percentage 
          ? parseFloat((lastMetrics.body_fat_percentage - firstMetrics.body_fat_percentage).toFixed(2))
          : undefined,
        muscleMassChange: firstMetrics.muscle_mass && lastMetrics.muscle_mass
          ? parseFloat((lastMetrics.muscle_mass - firstMetrics.muscle_mass).toFixed(2))
          : undefined,
        timespan,
        trends: {
          weight: this.calculateTrend(data.map(d => d.weight)),
          bmi: this.calculateTrend(data.map(d => d.bmi)),
          bodyFat: firstMetrics.body_fat_percentage && lastMetrics.body_fat_percentage
            ? this.calculateTrend(data.map(d => d.body_fat_percentage).filter(Boolean))
            : 'stable',
          muscleMass: firstMetrics.muscle_mass && lastMetrics.muscle_mass
            ? this.calculateTrend(data.map(d => d.muscle_mass).filter(Boolean))
            : 'stable',
        },
      };

      return { data: summary, error: null };

    } catch (error: any) {
      console.error('Get progress summary error:', error);
      return { data: null, error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Delete metrics entry
  async deleteMetrics(metricsId: string): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Usuário não autenticado' };
      }

      // Verify ownership and delete
      const { error } = await supabase
        .from('user_metrics')
        .delete()
        .eq('id', metricsId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting metrics:', error);
        return { error: 'Erro ao deletar métricas' };
      }

      return { error: null };

    } catch (error: any) {
      console.error('Delete metrics error:', error);
      return { error: 'Erro interno. Tente novamente mais tarde.' };
    }
  }

  // Calculate BMI classification
  getBMIClassification(bmi: number): { classification: string; color: string; description: string } {
    if (bmi < 18.5) {
      return {
        classification: 'Abaixo do peso',
        color: '#3b82f6',
        description: 'Consulte um profissional para avaliação nutricional'
      };
    } else if (bmi < 25) {
      return {
        classification: 'Peso normal',
        color: '#10b981',
        description: 'Mantenha hábitos saudáveis'
      };
    } else if (bmi < 30) {
      return {
        classification: 'Sobrepeso',
        color: '#f59e0b',
        description: 'Considere ajustes na alimentação e exercícios'
      };
    } else if (bmi < 35) {
      return {
        classification: 'Obesidade Grau I',
        color: '#ef4444',
        description: 'Procure orientação profissional'
      };
    } else if (bmi < 40) {
      return {
        classification: 'Obesidade Grau II',
        color: '#dc2626',
        description: 'Acompanhamento médico recomendado'
      };
    } else {
      return {
        classification: 'Obesidade Grau III',
        color: '#991b1b',
        description: 'Acompanhamento médico urgente'
      };
    }
  }

  // Calculate ideal weight range
  getIdealWeightRange(height: number): { min: number; max: number } {
    const heightInMeters = height / 100;
    const minBMI = 18.5;
    const maxBMI = 24.9;
    
    return {
      min: parseFloat((minBMI * heightInMeters * heightInMeters).toFixed(1)),
      max: parseFloat((maxBMI * heightInMeters * heightInMeters).toFixed(1)),
    };
  }

  // Calculate body fat percentage classification
  getBodyFatClassification(bodyFat: number, gender: 'male' | 'female'): { classification: string; color: string } {
    const ranges = gender === 'male' 
      ? {
          essential: [2, 5],
          athletes: [6, 13],
          fitness: [14, 17],
          average: [18, 24],
          obese: [25, 100]
        }
      : {
          essential: [10, 13],
          athletes: [14, 20],
          fitness: [21, 24],
          average: [25, 31],
          obese: [32, 100]
        };

    if (bodyFat >= ranges.essential[0] && bodyFat <= ranges.essential[1]) {
      return { classification: 'Essencial', color: '#3b82f6' };
    } else if (bodyFat >= ranges.athletes[0] && bodyFat <= ranges.athletes[1]) {
      return { classification: 'Atleta', color: '#10b981' };
    } else if (bodyFat >= ranges.fitness[0] && bodyFat <= ranges.fitness[1]) {
      return { classification: 'Fitness', color: '#059669' };
    } else if (bodyFat >= ranges.average[0] && bodyFat <= ranges.average[1]) {
      return { classification: 'Média', color: '#f59e0b' };
    } else {
      return { classification: 'Acima da média', color: '#ef4444' };
    }
  }

  // Private methods
  private validateMetrics(metrics: Omit<UserMetrics, 'id'>): { isValid: boolean; error?: string } {
    if (!metrics.weight || metrics.weight < 20 || metrics.weight > 500) {
      return { isValid: false, error: 'Peso deve estar entre 20kg e 500kg' };
    }

    if (!metrics.height || metrics.height < 100 || metrics.height > 250) {
      return { isValid: false, error: 'Altura deve estar entre 100cm e 250cm' };
    }

    if (metrics.body_fat_percentage && (metrics.body_fat_percentage < 2 || metrics.body_fat_percentage > 50)) {
      return { isValid: false, error: 'Percentual de gordura deve estar entre 2% e 50%' };
    }

    if (metrics.muscle_mass && (metrics.muscle_mass < 10 || metrics.muscle_mass > 200)) {
      return { isValid: false, error: 'Massa muscular deve estar entre 10kg e 200kg' };
    }

    return { isValid: true };
  }

  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (Math.abs(change) < 2) return 'stable';
    return change < 0 ? 'improving' : 'declining';
  }

  private async updateUserStatsWithMetrics(userId: string, metrics: Omit<UserMetrics, 'id'>): Promise<void> {
    try {
      // This could update user_stats table with latest metrics info
      // For now, we'll just log the action
      console.log('Updating user stats with latest metrics for user:', userId);
    } catch (error) {
      console.error('Error updating user stats with metrics:', error);
    }
  }
}

// Export singleton instance
export const metricsService = new MetricsService();
export default metricsService;
