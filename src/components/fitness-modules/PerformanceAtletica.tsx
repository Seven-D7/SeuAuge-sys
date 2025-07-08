import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Trophy, 
  Target, 
  Brain, 
  Activity, 
  Calendar,
  Timer,
  Heart,
  Scale,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Gauge
} from 'lucide-react';

// Importar algoritmos avançados
import {
  GeneticFitnessProfile,
  HypertrophyAlgorithm,
  AdaptivePersonalizationEngine,
  AdaptiveNutritionAlgorithm
} from '@/lib/fitness/advanced_fitness_algorithms';

interface UserData {
  // Dados básicos
  nome: string;
  idade: number;
  sexo: 'masculino' | 'feminino';
  altura: number;
  peso_atual: number;
  
  // Modalidade esportiva
  modalidade_principal: string;
  nivel_competitivo: 'recreativo' | 'amador' | 'semi_profissional' | 'profissional';
  anos_experiencia: number;
  posicao_funcao?: string;
  
  // Objetivos específicos
  objetivo_principal: 'forca_maxima' | 'potencia' | 'resistencia' | 'velocidade' | 'agilidade' | 'hipertrofia_funcional';
  objetivo_secundario?: string;
  competicao_proxima?: string;
  data_competicao?: string;
  
  // Dados de performance atual
  teste_velocidade_40m?: number; // segundos
  salto_vertical?: number; // cm
  teste_agilidade?: number; // segundos
  vo2_max?: number; // ml/kg/min
  frequencia_cardiaca_repouso?: number;
  
  // Dados de força (1RM ou estimativas)
  supino_1rm?: number;
  agachamento_1rm?: number;
  levantamento_terra_1rm?: number;
  desenvolvimento_1rm?: number;
  
  // Treino atual
  dias_treino_semana: number;
  horas_treino_dia: number;
  periodizacao_atual: string;
  
  // Dados de composição corporal
  massa_gorda?: number;
  massa_magra?: number;
  massa_muscular?: number;
  
  // Histórico e limitações
  lesoes_historico: string;
  limitacoes_fisicas: string;
  suplementacao_atual: string;
}

interface PerformanceResults {
  // Análise atual
  imc: number;
  classificacao_atletica: string;
  perfil_atletico: string;
  pontos_fortes: string[];
  areas_melhoria: string[];
  
  // Análise de performance
  nivel_forca_relativa: string;
  nivel_potencia: string;
  nivel_resistencia: string;
  indice_performance_geral: number;
  
  // Predições e potencial
  perfil_genetico: any;
  potencial_modalidade: number;
  tempo_melhoria_estimado: number;
  ganhos_esperados: any;
  
  // Planos especializados
  plano_treino_periodizado: any;
  plano_nutricional_performance: any;
  cronograma_competitivo: any;
  protocolo_recuperacao: any;
  
  // Monitoramento
  metricas_acompanhamento: string[];
  testes_performance: any[];
  indicadores_overtraining: string[];
  recomendacoes_otimizacao: string[];
}

const PerformanceAtletica: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<PerformanceResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Algoritmos especializados
  const [adaptiveEngine] = useState(new AdaptivePersonalizationEngine());

  const calculatePerformanceMetrics = (data: UserData): PerformanceResults => {
    // 1. Análise antropométrica
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_atletica = '';
    if (imc < 20) classificacao_atletica = 'Atleta de resistência';
    else if (imc < 25) classificacao_atletica = 'Atleta equilibrado';
    else if (imc < 28) classificacao_atletica = 'Atleta de força/potência';
    else classificacao_atletica = 'Acima do ideal atlético';

    // 2. Perfil genético
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: 'intenso'
    });

    // 3. Análise de performance baseada em testes
    const performance_analysis = analyzeCurrentPerformance(data, geneticProfile);
    
    // 4. Determinação do perfil atlético
    const perfil_atletico = determineAthleticProfile(data, performance_analysis, geneticProfile);
    
    // 5. Identificação de pontos fortes e fracos
    const strengths_weaknesses = identifyStrengthsWeaknesses(data, performance_analysis);
    
    // 6. Cálculo do potencial para a modalidade
    const potencial_modalidade = calculateSportPotential(data, geneticProfile, performance_analysis);
    
    // 7. Estimativa de tempo para melhorias
    const tempo_melhoria = estimateImprovementTime(data, performance_analysis);
    
    // 8. Predição de ganhos esperados
    const ganhos_esperados = predictPerformanceGains(data, geneticProfile, performance_analysis);
    
    // 9. Plano de treino periodizado
    const plano_treino = generatePeriodizedTrainingPlan(data, performance_analysis, geneticProfile);
    
    // 10. Plano nutricional para performance
    const nutritionAlgorithm = new AdaptiveNutritionAlgorithm(data, 'performance');
    const plano_nutricional = generatePerformanceNutrition(data, plano_treino);
    
    // 11. Cronograma competitivo
    const cronograma = generateCompetitiveSchedule(data, plano_treino);
    
    // 12. Protocolo de recuperação
    const protocolo_recuperacao = generateRecoveryProtocol(data, plano_treino);
    
    // 13. Métricas de acompanhamento
    const metricas = generateTrackingMetrics(data, performance_analysis);
    
    // 14. Testes de performance
    const testes = generatePerformanceTests(data, performance_analysis);
    
    // 15. Indicadores de overtraining
    const indicadores_overtraining = [
      'Frequência cardíaca de repouso elevada',
      'Diminuição na qualidade do sono',
      'Redução na motivação para treinar',
      'Queda na performance nos testes',
      'Aumento da fadiga percebida',
      'Alterações no humor/irritabilidade',
      'Aumento da susceptibilidade a lesões'
    ];
    
    // 16. Recomendações de otimização
    const recomendacoes = generateOptimizationRecommendations(data, performance_analysis, geneticProfile);

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_atletica,
      perfil_atletico,
      pontos_fortes: strengths_weaknesses.strengths,
      areas_melhoria: strengths_weaknesses.weaknesses,
      nivel_forca_relativa: performance_analysis.strength_level,
      nivel_potencia: performance_analysis.power_level,
      nivel_resistencia: performance_analysis.endurance_level,
      indice_performance_geral: performance_analysis.overall_index,
      perfil_genetico: geneticProfile.geneticProfile,
      potencial_modalidade: Math.round(potencial_modalidade * 100) / 100,
      tempo_melhoria_estimado: tempo_melhoria,
      ganhos_esperados,
      plano_treino_periodizado: plano_treino,
      plano_nutricional_performance: plano_nutricional,
      cronograma_competitivo: cronograma,
      protocolo_recuperacao,
      metricas_acompanhamento: metricas,
      testes_performance: testes,
      indicadores_overtraining,
      recomendacoes_otimizacao: recomendacoes
    };
  };

  const analyzeCurrentPerformance = (data: UserData, geneticProfile: any) => {
    // Análise baseada em testes de performance
    let strength_score = 5; // Base 1-10
    let power_score = 5;
    let endurance_score = 5;
    
    // Análise de força relativa
    if (data.agachamento_1rm && data.peso_atual) {
      const squat_ratio = data.agachamento_1rm / data.peso_atual;
      if (squat_ratio > 2.0) strength_score += 2;
      else if (squat_ratio > 1.5) strength_score += 1;
      else if (squat_ratio < 1.0) strength_score -= 1;
    }
    
    // Análise de potência (salto vertical)
    if (data.salto_vertical) {
      if (data.salto_vertical > 60) power_score += 2;
      else if (data.salto_vertical > 45) power_score += 1;
      else if (data.salto_vertical < 30) power_score -= 1;
    }
    
    // Análise de resistência (VO2 max)
    if (data.vo2_max) {
      if (data.vo2_max > 55) endurance_score += 2;
      else if (data.vo2_max > 45) endurance_score += 1;
      else if (data.vo2_max < 35) endurance_score -= 1;
    }
    
    // Ajustar baseado na idade
    if (data.idade > 30) {
      strength_score -= 0.5;
      power_score -= 0.5;
    }
    if (data.idade > 40) {
      endurance_score -= 0.5;
    }
    
    // Normalizar scores
    strength_score = Math.max(1, Math.min(10, strength_score));
    power_score = Math.max(1, Math.min(10, power_score));
    endurance_score = Math.max(1, Math.min(10, endurance_score));
    
    const overall_index = (strength_score + power_score + endurance_score) / 3;
    
    return {
      strength_level: strength_score > 7 ? 'Excelente' : strength_score > 5 ? 'Bom' : 'Precisa melhorar',
      power_level: power_score > 7 ? 'Excelente' : power_score > 5 ? 'Bom' : 'Precisa melhorar',
      endurance_level: endurance_score > 7 ? 'Excelente' : endurance_score > 5 ? 'Bom' : 'Precisa melhorar',
      overall_index: Math.round(overall_index * 10) / 10,
      strength_score,
      power_score,
      endurance_score
    };
  };

  const determineAthleticProfile = (data: UserData, performance: any, geneticProfile: any) => {
    const { strength_score, power_score, endurance_score } = performance;
    
    if (strength_score > power_score && strength_score > endurance_score) {
      return 'Atleta de Força';
    } else if (power_score > strength_score && power_score > endurance_score) {
      return 'Atleta de Potência';
    } else if (endurance_score > strength_score && endurance_score > power_score) {
      return 'Atleta de Resistência';
    } else {
      return 'Atleta Equilibrado';
    }
  };

  const identifyStrengthsWeaknesses = (data: UserData, performance: any) => {
    const strengths = [];
    const weaknesses = [];
    
    if (performance.strength_score >= 7) strengths.push('Força muscular');
    else if (performance.strength_score <= 4) weaknesses.push('Força muscular');
    
    if (performance.power_score >= 7) strengths.push('Potência explosiva');
    else if (performance.power_score <= 4) weaknesses.push('Potência explosiva');
    
    if (performance.endurance_score >= 7) strengths.push('Resistência cardiovascular');
    else if (performance.endurance_score <= 4) weaknesses.push('Resistência cardiovascular');
    
    // Análises específicas baseadas em testes
    if (data.teste_velocidade_40m && data.teste_velocidade_40m < 5.0) {
      strengths.push('Velocidade de sprint');
    } else if (data.teste_velocidade_40m && data.teste_velocidade_40m > 6.0) {
      weaknesses.push('Velocidade de sprint');
    }
    
    if (data.teste_agilidade && data.teste_agilidade < 10.0) {
      strengths.push('Agilidade');
    } else if (data.teste_agilidade && data.teste_agilidade > 12.0) {
      weaknesses.push('Agilidade');
    }
    
    // Se não há pontos fortes identificados
    if (strengths.length === 0) {
      strengths.push('Potencial de desenvolvimento');
    }
    
    // Se não há fraquezas identificadas
    if (weaknesses.length === 0) {
      weaknesses.push('Manutenção do nível atual');
    }
    
    return { strengths, weaknesses };
  };

  const calculateSportPotential = (data: UserData, geneticProfile: any, performance: any) => {
    let potential = 0.5; // Base
    
    // Fatores que aumentam o potencial
    if (data.idade < 25) potential += 0.2;
    else if (data.idade < 30) potential += 0.1;
    
    if (data.anos_experiencia < 5) potential += 0.1; // Margem para melhoria
    else if (data.anos_experiencia > 10) potential -= 0.1; // Próximo do pico
    
    if (geneticProfile.geneticProfile.dominantType === 'power' && 
        ['forca_maxima', 'potencia', 'velocidade'].includes(data.objetivo_principal)) {
      potential += 0.2;
    }
    
    if (geneticProfile.geneticProfile.dominantType === 'endurance' && 
        ['resistencia'].includes(data.objetivo_principal)) {
      potential += 0.2;
    }
    
    if (performance.overall_index < 6) potential += 0.1; // Muito espaço para melhoria
    
    return Math.min(1.0, potential);
  };

  const estimateImprovementTime = (data: UserData, performance: any) => {
    // Tempo base em semanas
    let base_time = 12;
    
    // Ajustar baseado no nível atual
    if (performance.overall_index < 5) base_time = 8; // Iniciantes melhoram mais rápido
    else if (performance.overall_index > 7) base_time = 20; // Avançados levam mais tempo
    
    // Ajustar baseado na idade
    if (data.idade > 35) base_time += 4;
    if (data.idade > 45) base_time += 8;
    
    // Ajustar baseado na experiência
    if (data.anos_experiencia > 10) base_time += 6;
    
    return base_time;
  };

  const predictPerformanceGains = (data: UserData, geneticProfile: any, performance: any) => {
    const gains = {
      forca: '5-15%',
      potencia: '8-20%',
      resistencia: '10-25%',
      velocidade: '3-8%',
      agilidade: '5-12%'
    };
    
    // Ajustar baseado no nível atual e potencial
    if (performance.overall_index < 5) {
      // Iniciantes - ganhos maiores
      gains.forca = '15-30%';
      gains.potencia = '20-35%';
      gains.resistencia = '25-40%';
    } else if (performance.overall_index > 7) {
      // Avançados - ganhos menores
      gains.forca = '2-8%';
      gains.potencia = '3-10%';
      gains.resistencia = '5-15%';
    }
    
    return gains;
  };

  const generatePeriodizedTrainingPlan = (data: UserData, performance: any, geneticProfile: any) => {
    const plan = {
      tipo_periodizacao: 'Linear',
      duracao_ciclo: '12-16 semanas',
      fases: {}
    };
    
    // Determinar tipo de periodização baseado no objetivo
    if (data.data_competicao) {
      plan.tipo_periodizacao = 'Reversa (Peaking)';
    } else if (data.objetivo_principal === 'hipertrofia_funcional') {
      plan.tipo_periodizacao = 'Ondulatória';
    }
    
    // Fases da periodização
    plan.fases = {
      preparacao_geral: {
        duracao: '4-6 semanas',
        foco: 'Base aeróbia e força geral',
        volume: 'Alto',
        intensidade: 'Baixa-Moderada',
        exercicios: 'Movimentos básicos e condicionamento'
      },
      preparacao_especifica: {
        duracao: '4-6 semanas',
        foco: 'Força específica e técnica',
        volume: 'Moderado-Alto',
        intensidade: 'Moderada-Alta',
        exercicios: 'Movimentos específicos da modalidade'
      },
      pre_competitiva: {
        duracao: '2-4 semanas',
        foco: 'Potência e velocidade',
        volume: 'Baixo-Moderado',
        intensidade: 'Alta',
        exercicios: 'Exercícios explosivos e específicos'
      },
      competitiva: {
        duracao: 'Variável',
        foco: 'Manutenção e pico de performance',
        volume: 'Baixo',
        intensidade: 'Muito Alta',
        exercicios: 'Manutenção e ajustes finos'
      }
    };
    
    // Distribuição semanal baseada no objetivo principal
    const weekly_distribution = generateWeeklyDistribution(data, performance);
    plan.distribuicao_semanal = weekly_distribution;
    
    return plan;
  };

  const generateWeeklyDistribution = (data: UserData, performance: any) => {
    const distribution = {
      forca: 0,
      potencia: 0,
      resistencia: 0,
      velocidade: 0,
      tecnica: 0,
      recuperacao: 0
    };
    
    // Distribuição baseada no objetivo principal
    switch (data.objetivo_principal) {
      case 'forca_maxima':
        distribution.forca = 40;
        distribution.potencia = 20;
        distribution.tecnica = 20;
        distribution.recuperacao = 20;
        break;
      case 'potencia':
        distribution.potencia = 35;
        distribution.forca = 25;
        distribution.velocidade = 20;
        distribution.recuperacao = 20;
        break;
      case 'resistencia':
        distribution.resistencia = 50;
        distribution.forca = 15;
        distribution.tecnica = 15;
        distribution.recuperacao = 20;
        break;
      case 'velocidade':
        distribution.velocidade = 35;
        distribution.potencia = 25;
        distribution.forca = 20;
        distribution.recuperacao = 20;
        break;
      default:
        distribution.forca = 25;
        distribution.potencia = 25;
        distribution.resistencia = 20;
        distribution.tecnica = 15;
        distribution.recuperacao = 15;
    }
    
    return distribution;
  };

  const generatePerformanceNutrition = (data: UserData, plano_treino: any) => {
    // Cálculo calórico para atletas
    const tmb = data.sexo === 'masculino' 
      ? (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5
      : (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    
    // Fator de atividade para atletas (1.8-2.2)
    const activity_factor = data.horas_treino_dia > 3 ? 2.2 : 
                           data.horas_treino_dia > 2 ? 2.0 : 1.8;
    
    const total_calories = tmb * activity_factor;
    
    // Distribuição de macronutrientes para performance
    const macros = {
      proteina: Math.round((total_calories * 0.20) / 4), // 20% - 2g/kg
      carboidratos: Math.round((total_calories * 0.55) / 4), // 55% - 6-8g/kg
      gorduras: Math.round((total_calories * 0.25) / 9) // 25%
    };
    
    return {
      calorias_diarias: Math.round(total_calories),
      macronutrientes: macros,
      hidratacao: '40-50ml/kg + 500-750ml/hora de treino',
      timing_nutricional: {
        pre_treino: {
          timing: '2-3h antes',
          composicao: 'Carboidratos (1-4g/kg) + Proteína moderada',
          exemplo: 'Aveia com banana e whey protein'
        },
        durante_treino: {
          timing: 'Treinos >60min',
          composicao: 'Carboidratos (30-60g/h) + Eletrólitos',
          exemplo: 'Bebida esportiva ou gel energético'
        },
        pos_treino: {
          timing: '30-60min após',
          composicao: 'Carboidratos (1-1.5g/kg) + Proteína (20-25g)',
          exemplo: 'Batata doce + frango ou shake recovery'
        }
      },
      suplementacao_performance: [
        'Creatina (3-5g/dia)',
        'Cafeína (3-6mg/kg pré-treino)',
        'Beta-alanina (3-5g/dia)',
        'Whey protein (pós-treino)',
        'Multivitamínico',
        'Ômega 3',
        'Vitamina D'
      ]
    };
  };

  const generateCompetitiveSchedule = (data: UserData, plano_treino: any) => {
    return {
      macrociclo: '12 meses',
      mesociclos: [
        {
          nome: 'Preparação Geral',
          duracao: '8-12 semanas',
          objetivo: 'Construir base física e técnica',
          competicoes: 'Amistosos ou competições menores'
        },
        {
          nome: 'Preparação Específica',
          duracao: '6-8 semanas',
          objetivo: 'Desenvolver qualidades específicas',
          competicoes: 'Competições regionais'
        },
        {
          nome: 'Pré-Competitivo',
          duracao: '4-6 semanas',
          objetivo: 'Afinar performance',
          competicoes: 'Competições importantes'
        },
        {
          nome: 'Competitivo',
          duracao: '4-8 semanas',
          objetivo: 'Pico de performance',
          competicoes: 'Competições principais'
        },
        {
          nome: 'Transição',
          duracao: '2-4 semanas',
          objetivo: 'Recuperação ativa',
          competicoes: 'Descanso ou atividades recreativas'
        }
      ],
      taper_protocol: {
        duracao: '2-3 semanas antes da competição',
        reducao_volume: '40-60%',
        manutencao_intensidade: '90-100%',
        foco: 'Qualidade sobre quantidade'
      }
    };
  };

  const generateRecoveryProtocol = (data: UserData, plano_treino: any) => {
    return {
      sono: {
        duracao: '8-9 horas por noite',
        qualidade: 'Ambiente escuro, fresco e silencioso',
        rotina: 'Horários regulares de dormir e acordar',
        monitoramento: 'Tracker de sono ou diário'
      },
      recuperacao_ativa: {
        frequencia: '2-3x por semana',
        atividades: ['Caminhada leve', 'Yoga', 'Natação recreativa', 'Mobilidade'],
        duracao: '20-45 minutos',
        intensidade: 'Muito baixa (50-60% FCmax)'
      },
      terapias: {
        massagem: '1-2x por semana',
        crioterapia: 'Pós-treinos intensos',
        sauna: '2-3x por semana (15-20min)',
        alongamento: 'Diário (15-30min)'
      },
      monitoramento: {
        frequencia_cardiaca: 'Diária (repouso)',
        variabilidade_fc: 'Diária (HRV)',
        percepcao_esforco: 'Pós-treino (RPE)',
        qualidade_sono: 'Diária',
        humor_energia: 'Diária'
      },
      sinais_alerta: [
        'FC repouso >10bpm acima da média',
        'HRV reduzida por 2+ dias',
        'Qualidade do sono ruim por 3+ dias',
        'RPE elevada em cargas normais',
        'Redução na motivação'
      ]
    };
  };

  const generateTrackingMetrics = (data: UserData, performance: any) => {
    const base_metrics = [
      'Peso corporal (diário)',
      'Frequência cardíaca de repouso (diário)',
      'Qualidade do sono (diário)',
      'Percepção de esforço (pós-treino)',
      'Humor e energia (diário)'
    ];
    
    // Métricas específicas baseadas no objetivo
    const specific_metrics = [];
    
    switch (data.objetivo_principal) {
      case 'forca_maxima':
        specific_metrics.push('Cargas de treino (1RM estimado)', 'Volume total levantado');
        break;
      case 'potencia':
        specific_metrics.push('Altura do salto vertical', 'Velocidade de sprint');
        break;
      case 'resistencia':
        specific_metrics.push('Tempo em distâncias padrão', 'Frequência cardíaca de treino');
        break;
      case 'velocidade':
        specific_metrics.push('Tempos de sprint (10m, 40m)', 'Tempo de reação');
        break;
      case 'agilidade':
        specific_metrics.push('Teste de agilidade T', 'Teste de mudança de direção');
        break;
    }
    
    return [...base_metrics, ...specific_metrics];
  };

  const generatePerformanceTests = (data: UserData, performance: any) => {
    const tests = [
      {
        nome: 'Teste de Força Máxima',
        frequencia: 'A cada 4-6 semanas',
        protocolo: '1RM ou 3RM nos exercícios principais',
        objetivo: 'Monitorar ganhos de força'
      },
      {
        nome: 'Teste de Salto Vertical',
        frequencia: 'Semanal',
        protocolo: 'Countermovement jump - melhor de 3 tentativas',
        objetivo: 'Avaliar potência de membros inferiores'
      },
      {
        nome: 'Teste de Sprint 40m',
        frequencia: 'Quinzenal',
        protocolo: 'Tempo eletrônico - melhor de 2 tentativas',
        objetivo: 'Avaliar velocidade máxima'
      },
      {
        nome: 'Teste de Agilidade T',
        frequencia: 'Quinzenal',
        protocolo: 'Percurso em T - melhor de 2 tentativas',
        objetivo: 'Avaliar agilidade e mudança de direção'
      }
    ];
    
    // Adicionar testes específicos baseados na modalidade
    if (data.modalidade_principal.toLowerCase().includes('corrida') || 
        data.modalidade_principal.toLowerCase().includes('ciclismo')) {
      tests.push({
        nome: 'Teste de Limiar Anaeróbio',
        frequencia: 'A cada 6-8 semanas',
        protocolo: 'Teste progressivo até exaustão',
        objetivo: 'Avaliar capacidade aeróbia'
      });
    }
    
    return tests;
  };

  const generateOptimizationRecommendations = (data: UserData, performance: any, geneticProfile: any) => {
    const recommendations = [];
    
    // Recomendações baseadas no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      recommendations.push('Priorize exercícios explosivos e pliométricos');
      recommendations.push('Use cargas de 70-85% 1RM para desenvolvimento de força');
    } else {
      recommendations.push('Inclua mais volume de treino aeróbio');
      recommendations.push('Foque em exercícios de resistência muscular');
    }
    
    // Recomendações baseadas na performance atual
    if (performance.strength_score < 6) {
      recommendations.push('Aumente o volume de treino de força');
      recommendations.push('Inclua exercícios básicos (agachamento, terra, supino)');
    }
    
    if (performance.power_score < 6) {
      recommendations.push('Adicione treinos pliométricos 2-3x/semana');
      recommendations.push('Trabalhe velocidade de execução nos exercícios');
    }
    
    if (performance.endurance_score < 6) {
      recommendations.push('Aumente o volume de treino cardiovascular');
      recommendations.push('Inclua treinos intervalados de alta intensidade');
    }
    
    // Recomendações baseadas na idade
    if (data.idade > 35) {
      recommendations.push('Priorize recuperação e mobilidade');
      recommendations.push('Monitore sinais de overtraining mais rigorosamente');
    }
    
    // Recomendações gerais
    recommendations.push('Mantenha consistência no treino e nutrição');
    recommendations.push('Monitore métricas de performance regularmente');
    recommendations.push('Ajuste o plano baseado nos resultados dos testes');
    
    return recommendations;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleCalculate();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simular processamento complexo
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    const calculatedResults = calculatePerformanceMetrics(userData as UserData);
    setResults(calculatedResults);
    setIsCalculating(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Dados Pessoais e Modalidade
              </CardTitle>
              <CardDescription>
                Informações básicas e modalidade esportiva
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={userData.nome || ''}
                    onChange={(e) => setUserData({...userData, nome: e.target.value})}
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <Label htmlFor="idade">Idade</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={userData.idade || ''}
                    onChange={(e) => setUserData({...userData, idade: parseInt(e.target.value)})}
                    placeholder="Anos"
                  />
                </div>
                <div>
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select onValueChange={(value) => setUserData({...userData, sexo: value as 'masculino' | 'feminino'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={userData.altura || ''}
                    onChange={(e) => setUserData({...userData, altura: parseInt(e.target.value)})}
                    placeholder="175"
                  />
                </div>
                <div>
                  <Label htmlFor="peso_atual">Peso Atual (kg)</Label>
                  <Input
                    id="peso_atual"
                    type="number"
                    step="0.1"
                    value={userData.peso_atual || ''}
                    onChange={(e) => setUserData({...userData, peso_atual: parseFloat(e.target.value)})}
                    placeholder="75.5"
                  />
                </div>
                <div>
                  <Label htmlFor="anos_experiencia">Anos de Experiência</Label>
                  <Input
                    id="anos_experiencia"
                    type="number"
                    value={userData.anos_experiencia || ''}
                    onChange={(e) => setUserData({...userData, anos_experiencia: parseInt(e.target.value)})}
                    placeholder="5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="modalidade">Modalidade Principal</Label>
                <Input
                  id="modalidade"
                  value={userData.modalidade_principal || ''}
                  onChange={(e) => setUserData({...userData, modalidade_principal: e.target.value})}
                  placeholder="Ex: Futebol, Corrida, Natação, Basquete..."
                />
              </div>

              <div>
                <Label htmlFor="nivel_competitivo">Nível Competitivo</Label>
                <Select onValueChange={(value) => setUserData({...userData, nivel_competitivo: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recreativo">Recreativo</SelectItem>
                    <SelectItem value="amador">Amador</SelectItem>
                    <SelectItem value="semi_profissional">Semi-profissional</SelectItem>
                    <SelectItem value="profissional">Profissional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos de Performance
              </CardTitle>
              <CardDescription>
                Defina seus objetivos específicos de performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="objetivo_principal">Objetivo Principal</Label>
                <Select onValueChange={(value) => setUserData({...userData, objetivo_principal: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu objetivo principal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forca_maxima">Força Máxima</SelectItem>
                    <SelectItem value="potencia">Potência Explosiva</SelectItem>
                    <SelectItem value="resistencia">Resistência</SelectItem>
                    <SelectItem value="velocidade">Velocidade</SelectItem>
                    <SelectItem value="agilidade">Agilidade</SelectItem>
                    <SelectItem value="hipertrofia_funcional">Hipertrofia Funcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="objetivo_secundario">Objetivo Secundário (Opcional)</Label>
                <Input
                  id="objetivo_secundario"
                  value={userData.objetivo_secundario || ''}
                  onChange={(e) => setUserData({...userData, objetivo_secundario: e.target.value})}
                  placeholder="Ex: Melhora da técnica, prevenção de lesões..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="competicao_proxima">Próxima Competição (Opcional)</Label>
                  <Input
                    id="competicao_proxima"
                    value={userData.competicao_proxima || ''}
                    onChange={(e) => setUserData({...userData, competicao_proxima: e.target.value})}
                    placeholder="Nome da competição"
                  />
                </div>
                <div>
                  <Label htmlFor="data_competicao">Data da Competição</Label>
                  <Input
                    id="data_competicao"
                    type="date"
                    value={userData.data_competicao || ''}
                    onChange={(e) => setUserData({...userData, data_competicao: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="posicao_funcao">Posição/Função (Opcional)</Label>
                <Input
                  id="posicao_funcao"
                  value={userData.posicao_funcao || ''}
                  onChange={(e) => setUserData({...userData, posicao_funcao: e.target.value})}
                  placeholder="Ex: Atacante, Meio-campista, Velocista..."
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Testes de Performance Atual
              </CardTitle>
              <CardDescription>
                Dados de testes físicos (preencha os que souber)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Preencha apenas os testes que você conhece. Dados mais precisos resultam em planos mais personalizados.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teste_velocidade">Sprint 40m (segundos)</Label>
                  <Input
                    id="teste_velocidade"
                    type="number"
                    step="0.01"
                    value={userData.teste_velocidade_40m || ''}
                    onChange={(e) => setUserData({...userData, teste_velocidade_40m: parseFloat(e.target.value)})}
                    placeholder="5.50"
                  />
                </div>
                <div>
                  <Label htmlFor="salto_vertical">Salto Vertical (cm)</Label>
                  <Input
                    id="salto_vertical"
                    type="number"
                    value={userData.salto_vertical || ''}
                    onChange={(e) => setUserData({...userData, salto_vertical: parseInt(e.target.value)})}
                    placeholder="45"
                  />
                </div>
                <div>
                  <Label htmlFor="teste_agilidade">Teste Agilidade T (segundos)</Label>
                  <Input
                    id="teste_agilidade"
                    type="number"
                    step="0.01"
                    value={userData.teste_agilidade || ''}
                    onChange={(e) => setUserData({...userData, teste_agilidade: parseFloat(e.target.value)})}
                    placeholder="10.50"
                  />
                </div>
                <div>
                  <Label htmlFor="vo2_max">VO2 Max (ml/kg/min)</Label>
                  <Input
                    id="vo2_max"
                    type="number"
                    value={userData.vo2_max || ''}
                    onChange={(e) => setUserData({...userData, vo2_max: parseInt(e.target.value)})}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="fc_repouso">FC Repouso (bpm)</Label>
                  <Input
                    id="fc_repouso"
                    type="number"
                    value={userData.frequencia_cardiaca_repouso || ''}
                    onChange={(e) => setUserData({...userData, frequencia_cardiaca_repouso: parseInt(e.target.value)})}
                    placeholder="60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Dados de Força e Treino Atual
              </CardTitle>
              <CardDescription>
                Informações sobre força máxima e rotina atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supino_1rm">Supino 1RM (kg)</Label>
                  <Input
                    id="supino_1rm"
                    type="number"
                    step="2.5"
                    value={userData.supino_1rm || ''}
                    onChange={(e) => setUserData({...userData, supino_1rm: parseFloat(e.target.value)})}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="agachamento_1rm">Agachamento 1RM (kg)</Label>
                  <Input
                    id="agachamento_1rm"
                    type="number"
                    step="2.5"
                    value={userData.agachamento_1rm || ''}
                    onChange={(e) => setUserData({...userData, agachamento_1rm: parseFloat(e.target.value)})}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="terra_1rm">Levantamento Terra 1RM (kg)</Label>
                  <Input
                    id="terra_1rm"
                    type="number"
                    step="2.5"
                    value={userData.levantamento_terra_1rm || ''}
                    onChange={(e) => setUserData({...userData, levantamento_terra_1rm: parseFloat(e.target.value)})}
                    placeholder="120"
                  />
                </div>
                <div>
                  <Label htmlFor="desenvolvimento_1rm">Desenvolvimento 1RM (kg)</Label>
                  <Input
                    id="desenvolvimento_1rm"
                    type="number"
                    step="2.5"
                    value={userData.desenvolvimento_1rm || ''}
                    onChange={(e) => setUserData({...userData, desenvolvimento_1rm: parseFloat(e.target.value)})}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dias_treino">Dias de Treino/Semana</Label>
                  <Select onValueChange={(value) => setUserData({...userData, dias_treino_semana: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="6">6 dias</SelectItem>
                      <SelectItem value="7">7 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="horas_treino">Horas de Treino/Dia</Label>
                  <Select onValueChange={(value) => setUserData({...userData, horas_treino_dia: parseFloat(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="1.5">1.5 horas</SelectItem>
                      <SelectItem value="2">2 horas</SelectItem>
                      <SelectItem value="3">3 horas</SelectItem>
                      <SelectItem value="4">4+ horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="periodizacao_atual">Periodização Atual</Label>
                <Input
                  id="periodizacao_atual"
                  value={userData.periodizacao_atual || ''}
                  onChange={(e) => setUserData({...userData, periodizacao_atual: e.target.value})}
                  placeholder="Ex: Linear, Ondulatória, Block, Nenhuma..."
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Histórico e Limitações
              </CardTitle>
              <CardDescription>
                Informações sobre lesões, limitações e suplementação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lesoes_historico">Histórico de Lesões</Label>
                <Textarea
                  id="lesoes_historico"
                  value={userData.lesoes_historico || ''}
                  onChange={(e) => setUserData({...userData, lesoes_historico: e.target.value})}
                  placeholder="Descreva lesões anteriores, cirurgias ou problemas recorrentes..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="limitacoes_fisicas">Limitações Físicas Atuais</Label>
                <Textarea
                  id="limitacoes_fisicas"
                  value={userData.limitacoes_fisicas || ''}
                  onChange={(e) => setUserData({...userData, limitacoes_fisicas: e.target.value})}
                  placeholder="Dores, limitações de mobilidade, restrições médicas..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="suplementacao_atual">Suplementação Atual</Label>
                <Textarea
                  id="suplementacao_atual"
                  value={userData.suplementacao_atual || ''}
                  onChange={(e) => setUserData({...userData, suplementacao_atual: e.target.value})}
                  placeholder="Liste os suplementos que você usa atualmente..."
                  rows={2}
                />
              </div>

              {/* Dados de composição corporal opcionais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="massa_gorda">Massa Gorda (kg)</Label>
                  <Input
                    id="massa_gorda"
                    type="number"
                    step="0.1"
                    value={userData.massa_gorda || ''}
                    onChange={(e) => setUserData({...userData, massa_gorda: parseFloat(e.target.value)})}
                    placeholder="10.5"
                  />
                </div>
                <div>
                  <Label htmlFor="massa_magra">Massa Magra (kg)</Label>
                  <Input
                    id="massa_magra"
                    type="number"
                    step="0.1"
                    value={userData.massa_magra || ''}
                    onChange={(e) => setUserData({...userData, massa_magra: parseFloat(e.target.value)})}
                    placeholder="65.0"
                  />
                </div>
                <div>
                  <Label htmlFor="massa_muscular">Massa Muscular (kg)</Label>
                  <Input
                    id="massa_muscular"
                    type="number"
                    step="0.1"
                    value={userData.massa_muscular || ''}
                    onChange={(e) => setUserData({...userData, massa_muscular: parseFloat(e.target.value)})}
                    placeholder="55.2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-800">Analisando Performance Atlética</h2>
          <p className="text-gray-600">Aplicando algoritmos de otimização esportiva...</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">✓ Analisando testes de performance</p>
            <p className="text-sm text-gray-500">✓ Calculando potencial atlético</p>
            <p className="text-sm text-gray-500">✓ Gerando periodização personalizada</p>
            <p className="text-sm text-gray-500">✓ Otimizando protocolo de recuperação</p>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Análise de Performance Atlética</h1>
            <p className="text-gray-600">Otimização científica para máximo desempenho esportivo</p>
          </div>

          {/* Perfil Atlético */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Perfil Atlético
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Classificação</p>
                  <Badge variant="outline" className="mt-1">{results.classificacao_atletica}</Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Perfil</p>
                  <Badge variant="default" className="mt-1">{results.perfil_atletico}</Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Potencial</p>
                  <p className="text-lg font-bold">{(results.potencial_modalidade * 100).toFixed(0)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Índice Performance</p>
                  <p className="text-lg font-bold">{results.indice_performance_geral}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análise de Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Níveis Atuais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Força:</span>
                    <Badge variant={results.nivel_forca_relativa === 'Excelente' ? "default" : 
                                  results.nivel_forca_relativa === 'Bom' ? "secondary" : "outline"}>
                      {results.nivel_forca_relativa}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Potência:</span>
                    <Badge variant={results.nivel_potencia === 'Excelente' ? "default" : 
                                  results.nivel_potencia === 'Bom' ? "secondary" : "outline"}>
                      {results.nivel_potencia}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Resistência:</span>
                    <Badge variant={results.nivel_resistencia === 'Excelente' ? "default" : 
                                  results.nivel_resistencia === 'Bom' ? "secondary" : "outline"}>
                      {results.nivel_resistencia}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.pontos_fortes.map((ponto, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{ponto}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Áreas de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.areas_melhoria.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ganhos Esperados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Ganhos Esperados ({results.tempo_melhoria_estimado} semanas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(results.ganhos_esperados).map(([qualidade, ganho]) => (
                  <div key={qualidade} className="text-center p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 capitalize">{qualidade}</p>
                    <p className="text-lg font-bold text-orange-600">{ganho}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plano de Treino Periodizado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Plano de Treino Periodizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Estrutura Geral</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Tipo:</strong> {results.plano_treino_periodizado.tipo_periodizacao}</li>
                    <li>• <strong>Duração do Ciclo:</strong> {results.plano_treino_periodizado.duracao_ciclo}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Distribuição Semanal (%)</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(results.plano_treino_periodizado.distribuicao_semanal).map(([qualidade, porcentagem]) => (
                      <div key={qualidade} className="flex justify-between">
                        <span className="capitalize">{qualidade}:</span>
                        <span className="font-medium">{porcentagem}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Fases da Periodização</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(results.plano_treino_periodizado.fases).map(([fase, dados]: [string, any]) => (
                    <div key={fase} className="p-3 border rounded-lg">
                      <h5 className="font-medium capitalize text-sm">{fase.replace('_', ' ')}</h5>
                      <p className="text-xs text-gray-600 mt-1">{dados.duracao}</p>
                      <p className="text-xs text-gray-700 mt-1">{dados.foco}</p>
                      <div className="mt-2 text-xs">
                        <span className="text-blue-600">Vol: {dados.volume}</span> | 
                        <span className="text-red-600 ml-1">Int: {dados.intensidade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano Nutricional para Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Nutrição para Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Necessidades Diárias</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calorias:</span>
                      <span className="font-medium">{results.plano_nutricional_performance.calorias_diarias} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proteínas:</span>
                      <span className="font-medium">{results.plano_nutricional_performance.macronutrientes.proteina}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carboidratos:</span>
                      <span className="font-medium">{results.plano_nutricional_performance.macronutrientes.carboidratos}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gorduras:</span>
                      <span className="font-medium">{results.plano_nutricional_performance.macronutrientes.gorduras}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hidratação:</span>
                      <span className="font-medium text-xs">{results.plano_nutricional_performance.hidratacao}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Timing Nutricional</h4>
                  <div className="space-y-3">
                    {Object.entries(results.plano_nutricional_performance.timing_nutricional).map(([momento, dados]: [string, any]) => (
                      <div key={momento} className="border-l-2 border-orange-200 pl-3">
                        <p className="font-medium text-sm capitalize">{momento.replace('_', ' ')} ({dados.timing})</p>
                        <p className="text-xs text-gray-600">{dados.exemplo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Suplementação para Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {results.plano_nutricional_performance.suplementacao_performance.map((suplemento: string, index: number) => (
                    <Badge key={index} variant="outline" className="justify-center p-2 text-xs">
                      {suplemento}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocolo de Recuperação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Protocolo de Recuperação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Sono e Descanso</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Duração:</strong> {results.protocolo_recuperacao.sono.duracao}</li>
                    <li>• <strong>Ambiente:</strong> {results.protocolo_recuperacao.sono.qualidade}</li>
                    <li>• <strong>Rotina:</strong> {results.protocolo_recuperacao.sono.rotina}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Recuperação Ativa</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Frequência:</strong> {results.protocolo_recuperacao.recuperacao_ativa.frequencia}</li>
                    <li>• <strong>Duração:</strong> {results.protocolo_recuperacao.recuperacao_ativa.duracao}</li>
                    <li>• <strong>Atividades:</strong> {results.protocolo_recuperacao.recuperacao_ativa.atividades.join(', ')}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Terapias de Recuperação</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(results.protocolo_recuperacao.terapias).map(([terapia, frequencia]) => (
                    <div key={terapia} className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium capitalize">{terapia.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-600">{frequencia}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoramento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Métricas de Acompanhamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.metricas_acompanhamento.map((metrica, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">{metrica}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Sinais de Overtraining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.indicadores_overtraining.slice(0, 5).map((indicador, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{indicador}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testes de Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Protocolo de Testes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.testes_performance.map((teste, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h5 className="font-semibold text-sm">{teste.nome}</h5>
                    <p className="text-xs text-gray-600 mt-1">Frequência: {teste.frequencia}</p>
                    <p className="text-xs text-gray-700 mt-1">{teste.protocolo}</p>
                    <p className="text-xs text-orange-600 mt-2">{teste.objetivo}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendações de Otimização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recomendações de Otimização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recomendacoes_otimizacao.map((recomendacao, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recomendacao}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.print()} variant="outline">
              Imprimir Plano
            </Button>
            <Button onClick={() => navigate('/progress')}>
              Iniciar Acompanhamento
            </Button>
            <Button onClick={() => {setResults(null); setStep(1);}} variant="outline">
              Nova Análise
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Performance Atlética Inteligente</h1>
          <p className="text-gray-600">Otimização científica para máximo desempenho esportivo</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Passo {step} de {totalSteps}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="flex justify-center">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          {step > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              Anterior
            </Button>
          )}
          <Button onClick={handleNext}>
            {step === totalSteps ? 'Analisar Performance' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAtletica;

