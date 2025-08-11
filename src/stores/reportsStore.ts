import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FitnessReport {
  id: string;
  userId: string;
  type: 'emagrecimento' | 'ganho_massa' | 'recomposicao' | 'performance' | 'flexibilidade' | 'corrida';
  title: string;
  createdAt: Date;
  data: {
    userData: Record<string, any>;
    results: Record<string, any>;
    explanation?: {
      paragrafo: string;
      bullets: string[];
    };
  };
  summary: {
    mainMetrics: Array<{
      label: string;
      value: string;
      unit?: string;
    }>;
    recommendations: string[];
    score: number;
  };
}

interface ReportsState {
  reports: FitnessReport[];
  currentReport: FitnessReport | null;
  addReport: (report: Omit<FitnessReport, 'id' | 'createdAt'>) => void;
  getReportsByUser: (userId: string) => FitnessReport[];
  getReportById: (id: string) => FitnessReport | undefined;
  setCurrentReport: (report: FitnessReport | null) => void;
  deleteReport: (id: string) => void;
  updateReport: (id: string, updates: Partial<FitnessReport>) => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],
      currentReport: null,

      addReport: (reportData) => {
        const newReport: FitnessReport = {
          ...reportData,
          id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };

        set((state) => ({
          reports: [newReport, ...state.reports],
          currentReport: newReport,
        }));

        return newReport;
      },

      getReportsByUser: (userId: string) => {
        return get().reports.filter(report => report.userId === userId);
      },

      getReportById: (id: string) => {
        return get().reports.find(report => report.id === id);
      },

      setCurrentReport: (report) => {
        set({ currentReport: report });
      },

      deleteReport: (id: string) => {
        set((state) => ({
          reports: state.reports.filter(report => report.id !== id),
          currentReport: state.currentReport?.id === id ? null : state.currentReport,
        }));
      },

      updateReport: (id: string, updates) => {
        set((state) => ({
          reports: state.reports.map(report =>
            report.id === id ? { ...report, ...updates } : report
          ),
          currentReport: state.currentReport?.id === id 
            ? { ...state.currentReport, ...updates }
            : state.currentReport,
        }));
      },
    }),
    {
      name: 'fitness-reports-storage',
      partialize: (state) => ({ reports: state.reports }),
    }
  )
);

// Helper functions for report generation
export const generateReportSummary = (type: string, results: any): FitnessReport['summary'] => {
  switch (type) {
    case 'emagrecimento':
      return {
        mainMetrics: [
          { label: 'IMC', value: results.imc?.toFixed(1) || 'N/A', unit: 'kg/m²' },
          { label: 'Calorias Diárias', value: results.calorias_diarias?.toString() || 'N/A', unit: 'kcal' },
          { label: 'Perda Semanal', value: results.perda_semanal?.toString() || 'N/A', unit: 'kg' },
          { label: 'Probabilidade Sucesso', value: `${(results.probabilidade_sucesso * 100)?.toFixed(0) || 'N/A'}`, unit: '%' },
        ],
        recommendations: results.recomendacoes_personalizadas || [],
        score: Math.round((results.probabilidade_sucesso || 0) * 100),
      };

    case 'ganho_massa':
      return {
        mainMetrics: [
          { label: 'Calorias Diárias', value: results.calorias_diarias?.toString() || 'N/A', unit: 'kcal' },
          { label: 'Proteínas', value: results.plano_nutricional?.proteinas_g?.toString() || 'N/A', unit: 'g' },
          { label: 'Ganho Semanal', value: results.ganho_semanal?.toString() || 'N/A', unit: 'kg' },
          { label: 'Score Motivacional', value: results.score_motivacional?.toString() || 'N/A', unit: 'pts' },
        ],
        recommendations: results.recomendacoes_personalizadas || [],
        score: results.score_motivacional || 0,
      };

    case 'recomposicao':
      return {
        mainMetrics: [
          { label: 'Perda Gordura', value: results.perda_gordura_semanal?.toString() || 'N/A', unit: 'kg/sem' },
          { label: 'Ganho Músculo', value: results.ganho_musculo_semanal?.toString() || 'N/A', unit: 'kg/sem' },
          { label: 'Calorias Médias', value: results.calorias_diarias?.toString() || 'N/A', unit: 'kcal' },
          { label: 'Probabilidade Sucesso', value: `${(results.probabilidade_sucesso * 100)?.toFixed(0) || 'N/A'}`, unit: '%' },
        ],
        recommendations: results.recomendacoes_personalizadas || [],
        score: Math.round((results.probabilidade_sucesso || 0) * 100),
      };

    case 'performance':
      return {
        mainMetrics: [
          { label: 'Score Performance', value: results.score_performance?.toString() || 'N/A', unit: 'pts' },
          { label: 'Calorias Diárias', value: results.plano_nutricional?.calorias_diarias?.toString() || 'N/A', unit: 'kcal' },
          { label: 'Sono Recomendado', value: results.cronograma_recuperacao?.sono_recomendado?.toString() || 'N/A', unit: 'h' },
          { label: 'Probabilidade Sucesso', value: `${(results.probabilidade_sucesso * 100)?.toFixed(0) || 'N/A'}`, unit: '%' },
        ],
        recommendations: results.projecoes_melhoria?.curto_prazo || [],
        score: results.score_performance || 0,
      };

    case 'flexibilidade':
      return {
        mainMetrics: [
          { label: 'Score Flexibilidade', value: results.perfil_postural?.pontuacao_flexibilidade?.toString() || 'N/A', unit: 'pts' },
          { label: 'Frequência Semanal', value: results.programa_personalizado?.frequencia_semanal?.toString() || 'N/A', unit: 'x' },
          { label: 'Score Bem-estar', value: results.score_bem_estar?.toString() || 'N/A', unit: 'pts' },
        ],
        recommendations: results.recomendacoes_lifestyle || [],
        score: results.score_bem_estar || 0,
      };

    case 'corrida':
      return {
        mainMetrics: [
          { label: 'VO2 Máx', value: results.analise_tempos?.vo2_estimado?.toString() || 'N/A', unit: 'ml/kg/min' },
          { label: 'Pace 5K', value: results.analise_tempos?.pace_5k || 'N/A', unit: 'min/km' },
          { label: 'Score Performance', value: results.score_performance?.toString() || 'N/A', unit: 'pts' },
          { label: 'Chance Meta', value: `${results.probabilidade_meta || 'N/A'}`, unit: '%' },
        ],
        recommendations: results.dicas_performance?.nutricao?.slice(0, 3) || [],
        score: results.score_performance || 0,
      };

    default:
      return {
        mainMetrics: [],
        recommendations: [],
        score: 0,
      };
  }
};

export const getReportTypeLabel = (type: string): string => {
  const labels = {
    emagrecimento: 'Emagrecimento Avançado',
    ganho_massa: 'Ganho de Massa',
    recomposicao: 'Recomposição Corporal',
    performance: 'Performance Atlética',
    flexibilidade: 'Flexibilidade & Mobilidade',
    corrida: 'Corrida Avançada',
  };
  return labels[type] || type;
};
