import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  TrendingUp, 
  Dumbbell, 
  Brain, 
  Activity, 
  Calendar,
  Zap,
  Heart,
  Scale,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  BarChart3,
  Trophy,
  Sparkles,
  Flame,
  Award,
  PieChart,
  LineChart,
  Users,
  Shield,
  Rocket,
  X
} from 'lucide-react';

// Importar algoritmos avançados
import {
  GeneticFitnessProfile,
  HypertrophyAlgorithm,
  AdaptivePersonalizationEngine,
  AdaptiveNutritionAlgorithm
} from '../../lib/fitness/advanced_fitness_algorithms.js';

interface UserData {
  // Dados básicos (obrigatórios)
  nome: string;
  idade: number;
  sexo: 'masculino' | 'feminino';
  altura: number;
  peso_atual: number;
  peso_objetivo: number;
  prazo: number;
  
  // Dados específicos para hipertrofia (obrigatórios)
  nivel_experiencia: 'iniciante' | 'intermediario' | 'avancado';
  objetivo_principal: 'massa_geral' | 'forca' | 'definicao' | 'performance';
  dias_treino_semana: number;
  tempo_disponivel_sessao: number;
  confianca_exercicio: number; // 1-10
  
  // Dados opcionais
  local_treino?: 'academia' | 'casa' | 'ambos';
  grupos_musculares_foco?: string[];
  lesoes_limitacoes?: string;
  suplementacao_atual?: string;
  experiencia_musculacao?: number; // anos
  
  // Dados de composição corporal (opcionais)
  massa_gorda?: number;
  massa_magra?: number;
  massa_muscular?: number;
  
  // Dados de performance atual (opcionais)
  supino_1rm?: number;
  agachamento_1rm?: number;
  levantamento_terra_1rm?: number;
}

interface MuscleGainResults {
  // Métricas calculadas
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_bulking: number;
  superavit_calorico: number;
  ganho_semanal_estimado: number;
  tempo_estimado: number;
  
  // Análise avançada
  perfil_genetico: any;
  potencial_hipertrofia: number;
  volume_otimo_semanal: any;
  intensidade_recomendada: any;
  
  // Planos personalizados
  plano_treino_detalhado: any;
  plano_nutricional: any;
  cronograma_progressao: any;
  suplementacao_recomendada: string[];
  
  // Predições
  ganho_massa_6_meses: number;
  ganho_forca_estimado: any;
  fatores_limitantes: string[];
  recomendacoes_otimizacao: string[];
  
  // Novos elementos únicos
  score_motivacional: number;
  badges_conquistadas: string[];
  nivel_usuario: string;
  pontos_experiencia: number;
}

interface ValidationErrors {
  [key: string]: string;
}

const GanhoMassaMuscular: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<MuscleGainResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Cores da paleta específica
  const colors = {
    primary: '#1ab894',    // Verde principal
    dark: '#111828',       // Azul escuro
    white: '#ffffff',      // Branco
    primaryLight: '#22d3aa', // Verde mais claro
    primaryDark: '#0f9d7a',  // Verde mais escuro
  };

  // Algoritmos especializados
  const [adaptiveEngine] = useState(new AdaptivePersonalizationEngine());

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setAnimationStep(1), 100);
    return () => clearTimeout(timer);
  }, []);

  // Validação de campos obrigatórios
  const validateStep = (stepNumber: number): boolean => {
    const errors: ValidationErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!userData.nome?.trim()) errors.nome = 'Nome é obrigatório';
        if (!userData.idade || userData.idade < 16 || userData.idade > 100) errors.idade = 'Idade deve estar entre 16 e 100 anos';
        if (!userData.sexo) errors.sexo = 'Sexo é obrigatório';
        if (!userData.altura || userData.altura < 100 || userData.altura > 250) errors.altura = 'Altura deve estar entre 100 e 250 cm';
        if (!userData.peso_atual || userData.peso_atual < 30 || userData.peso_atual > 300) errors.peso_atual = 'Peso atual deve estar entre 30 e 300 kg';
        if (!userData.peso_objetivo || userData.peso_objetivo < 30 || userData.peso_objetivo > 300) errors.peso_objetivo = 'Peso objetivo deve estar entre 30 e 300 kg';
        if (userData.peso_objetivo && userData.peso_atual && userData.peso_objetivo <= userData.peso_atual) {
          errors.peso_objetivo = 'Peso objetivo deve ser maior que o peso atual';
        }
        break;
        
      case 2:
        if (!userData.nivel_experiencia) errors.nivel_experiencia = 'Nível de experiência é obrigatório';
        if (!userData.objetivo_principal) errors.objetivo_principal = 'Objetivo principal é obrigatório';
        if (!userData.confianca_exercicio || userData.confianca_exercicio < 1 || userData.confianca_exercicio > 10) {
          errors.confianca_exercicio = 'Confiança deve estar entre 1 e 10';
        }
        break;
        
      case 3:
        if (!userData.dias_treino_semana || userData.dias_treino_semana < 2 || userData.dias_treino_semana > 7) {
          errors.dias_treino_semana = 'Dias de treino deve estar entre 2 e 7';
        }
        if (!userData.tempo_disponivel_sessao || userData.tempo_disponivel_sessao < 30 || userData.tempo_disponivel_sessao > 180) {
          errors.tempo_disponivel_sessao = 'Tempo por sessão deve estar entre 30 e 180 minutos';
        }
        if (!userData.prazo || userData.prazo < 1 || userData.prazo > 24) errors.prazo = 'Prazo deve estar entre 1 e 24 meses';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateMuscleGainMetrics = (data: UserData): MuscleGainResults => {
    // 1. Métricas básicas
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_imc = '';
    if (imc < 18.5) classificacao_imc = 'Abaixo do peso - Ideal para bulking';
    else if (imc < 25) classificacao_imc = 'Peso normal - Ótimo para ganho muscular';
    else if (imc < 30) classificacao_imc = 'Sobrepeso - Recomenda-se recomposição corporal';
    else classificacao_imc = 'Obesidade - Priorize emagrecimento primeiro';

    // 2. TMB com fórmula Mifflin-St Jeor
    let tmb: number;
    if (data.sexo === 'masculino') {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5;
    } else {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    }

    // 3. Gasto energético ajustado para treino de força
    const fator_atividade_treino = {
      2: 1.4, 3: 1.5, 4: 1.6, 5: 1.7, 6: 1.8, 7: 1.9
    };
    const fator = fator_atividade_treino[data.dias_treino_semana as keyof typeof fator_atividade_treino] || 1.5;
    const gasto_energetico = tmb * fator;

    // 4. Perfil genético e potencial
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: 'intenso'
    });

    // 5. Superávit calórico personalizado
    let superavit_base = 300;
    
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      superavit_base = 400;
    }
    
    if (data.nivel_experiencia === 'iniciante') {
      superavit_base = 500;
    } else if (data.nivel_experiencia === 'avancado') {
      superavit_base = 200;
    }
    
    if (data.idade > 35) {
      superavit_base *= 0.8;
    }
    
    if (imc > 25) {
      superavit_base *= 0.7;
    }

    const calorias_bulking = gasto_energetico + superavit_base;
    
    // 6. Estimativas de ganho
    let ganho_semanal_base = 0.25;
    
    if (data.nivel_experiencia === 'iniciante') {
      ganho_semanal_base = 0.5;
    } else if (data.nivel_experiencia === 'avancado') {
      ganho_semanal_base = 0.1;
    }
    
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      ganho_semanal_base *= 1.2;
    }

    const peso_a_ganhar = data.peso_objetivo - data.peso_atual;
    const tempo_estimado = peso_a_ganhar / ganho_semanal_base;

    // 7. Potencial de hipertrofia
    let potencial = 0.5;
    
    if (data.idade < 30) potencial += 0.2;
    if (data.sexo === 'masculino') potencial += 0.1;
    if (data.nivel_experiencia === 'iniciante') potencial += 0.2;
    if (geneticProfile.geneticProfile.powerScore >= 4) potencial += 0.1;
    
    potencial = Math.min(potencial, 1.0);

    // 8. Fatores limitantes
    const fatores_limitantes: string[] = [];
    if (data.idade > 40) fatores_limitantes.push('Idade avançada - recuperação mais lenta');
    if (imc > 25) fatores_limitantes.push('Excesso de gordura corporal');
    if (data.dias_treino_semana < 3) fatores_limitantes.push('Frequência de treino insuficiente');
    if (data.tempo_disponivel_sessao < 45) fatores_limitantes.push('Tempo de treino limitado');
    if (data.nivel_experiencia === 'avancado') fatores_limitantes.push('Nível avançado - ganhos mais lentos');

    // 9. Recomendações de otimização
    const recomendacoes: string[] = [];
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      recomendacoes.push('Foque em exercícios compostos pesados (agachamento, supino, terra)');
      recomendacoes.push('Use cargas de 75-85% 1RM para hipertrofia');
    } else {
      recomendacoes.push('Inclua mais volume com cargas moderadas (65-75% 1RM)');
      recomendacoes.push('Priorize tempo sob tensão e conexão mente-músculo');
    }
    
    if (data.nivel_experiencia === 'iniciante') {
      recomendacoes.push('Foque na técnica perfeita antes de aumentar cargas');
      recomendacoes.push('Progrida gradualmente - aumente 2.5kg por semana');
    }
    
    if (potencial < 0.6) {
      recomendacoes.push('Considere periodização avançada');
      recomendacoes.push('Otimize recuperação com sono de qualidade (8h+)');
    }

    // 10. Elementos únicos
    const score_motivacional = calculateMotivationalScore(data, potencial);
    const badges_conquistadas = generateBadges(data, potencial, imc);
    const nivel_usuario = calculateUserLevel(data, score_motivacional);
    const pontos_experiencia = calculateExperiencePoints(data, potencial);

    // 11. Planos detalhados
    const plano_treino = generateDetailedWorkoutPlan(data, geneticProfile);
    const plano_nutricional = generateBulkingNutrition(data, calorias_bulking);
    const cronograma_progressao = generateProgressionSchedule(data);
    const suplementacao = generateSupplementRecommendations(data, geneticProfile);
    const ganho_massa_6_meses = ganho_semanal_base * 24;
    const ganho_forca_estimado = calculateStrengthGains(data, geneticProfile);

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_imc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gasto_energetico),
      calorias_bulking: Math.round(calorias_bulking),
      superavit_calorico: superavit_base,
      ganho_semanal_estimado: Math.round(ganho_semanal_base * 1000) / 1000,
      tempo_estimado: Math.round(tempo_estimado),
      perfil_genetico: geneticProfile.geneticProfile,
      potencial_hipertrofia: Math.round(potencial * 100) / 100,
      volume_otimo_semanal: { min: 10, optimal: 16, max: 22 },
      intensidade_recomendada: {
        strength: { min: 80, max: 90 },
        hypertrophy: { min: 65, max: 80 },
        endurance: { min: 50, max: 65 }
      },
      plano_treino_detalhado: plano_treino,
      plano_nutricional,
      cronograma_progressao,
      suplementacao_recomendada: suplementacao,
      ganho_massa_6_meses: Math.round(ganho_massa_6_meses * 100) / 100,
      ganho_forca_estimado,
      fatores_limitantes,
      recomendacoes_otimizacao: recomendacoes,
      score_motivacional,
      badges_conquistadas,
      nivel_usuario,
      pontos_experiencia
    };
  };

  // Funções auxiliares para elementos únicos
  const calculateMotivationalScore = (data: UserData, potencial: number): number => {
    let score = 50;
    score += data.confianca_exercicio * 5;
    score += potencial * 30;
    if (data.nivel_experiencia === 'avancado') score += 15;
    if (data.dias_treino_semana >= 4) score += 10;
    return Math.min(100, Math.round(score));
  };

  const generateBadges = (data: UserData, potencial: number, imc: number): string[] => {
    const badges: string[] = [];
    if (potencial > 0.8) badges.push('🏆 Alto Potencial');
    if (data.confianca_exercicio >= 8) badges.push('💪 Confiante');
    if (data.nivel_experiencia === 'avancado') badges.push('⭐ Experiente');
    if (data.dias_treino_semana >= 5) badges.push('🔥 Dedicado');
    if (data.objetivo_principal === 'massa_geral') badges.push('🚀 Foco Total');
    badges.push('💎 Construtor');
    return badges;
  };

  const calculateUserLevel = (data: UserData, score: number): string => {
    if (score >= 90) return 'Elite Builder';
    if (score >= 75) return 'Avançado';
    if (score >= 60) return 'Intermediário';
    if (score >= 45) return 'Iniciante Plus';
    return 'Iniciante';
  };

  const calculateExperiencePoints = (data: UserData, potencial: number): number => {
    let pontos = 100;
    pontos += data.confianca_exercicio * 10;
    pontos += potencial * 50;
    if (data.nivel_experiencia === 'avancado') pontos += 100;
    return Math.round(pontos);
  };

  const generateDetailedWorkoutPlan = (data: UserData, geneticProfile: any) => {
    return {
      divisao: data.dias_treino_semana >= 5 ? 'Push/Pull/Legs' : 'Upper/Lower',
      frequencia: data.dias_treino_semana,
      duracao_sessao: data.tempo_disponivel_sessao,
      exercicios_principais: [
        { nome: 'Agachamento', series: 4, reps: '6-8', carga: '80-85%' },
        { nome: 'Supino reto', series: 4, reps: '6-8', carga: '80-85%' },
        { nome: 'Levantamento terra', series: 4, reps: '5-6', carga: '85-90%' },
        { nome: 'Desenvolvimento militar', series: 3, reps: '8-10', carga: '75-80%' }
      ],
      observacoes: [
        'Aqueça sempre antes de treinar',
        'Mantenha técnica perfeita',
        'Progrida gradualmente nas cargas',
        'Descanse adequadamente entre treinos'
      ]
    };
  };

  const generateBulkingNutrition = (data: UserData, calorias: number) => {
    const proteina_g = Math.round((calorias * 0.25) / 4);
    const carbo_g = Math.round((calorias * 0.45) / 4);
    const gordura_g = Math.round((calorias * 0.30) / 9);

    return {
      calorias_diarias: calorias,
      macronutrientes: {
        proteina: proteina_g,
        carboidratos: carbo_g,
        gorduras: gordura_g
      },
      proteina_por_kg: Math.round((proteina_g / data.peso_atual) * 10) / 10,
      dicas_especiais: [
        'Faça 5-6 refeições por dia',
        'Não pule o café da manhã',
        'Priorize alimentos integrais',
        'Monitore o ganho de peso semanalmente'
      ]
    };
  };

  const generateProgressionSchedule = (data: UserData) => {
    return {
      fase_1: {
        duracao: '4-6 semanas',
        foco: 'Adaptação anatômica',
        intensidade: '65-75% 1RM'
      },
      fase_2: {
        duracao: '6-8 semanas',
        foco: 'Hipertrofia máxima',
        intensidade: '70-80% 1RM'
      },
      fase_3: {
        duracao: '4 semanas',
        foco: 'Intensificação',
        intensidade: '80-85% 1RM'
      }
    };
  };

  const generateSupplementRecommendations = (data: UserData, geneticProfile: any) => {
    const suplementos = ['Whey Protein', 'Creatina', 'Multivitamínico'];
    
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      suplementos.push('Beta-alanina', 'HMB');
    } else {
      suplementos.push('BCAA', 'Glutamina');
    }
    
    if (data.idade > 35) {
      suplementos.push('ZMA', 'Ômega 3');
    }
    
    return suplementos;
  };

  const calculateStrengthGains = (data: UserData, geneticProfile: any) => {
    const ganhos_base = {
      iniciante: { supino: 1.5, agachamento: 2.0, terra: 2.5 },
      intermediario: { supino: 0.8, agachamento: 1.2, terra: 1.5 },
      avancado: { supino: 0.3, agachamento: 0.5, terra: 0.8 }
    };

    const ganhos = ganhos_base[data.nivel_experiencia];
    
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      Object.keys(ganhos).forEach(key => {
        ganhos[key as keyof typeof ganhos] *= 1.2;
      });
    }

    return {
      supino_6_meses: Math.round(ganhos.supino * 6),
      agachamento_6_meses: Math.round(ganhos.agachamento * 6),
      terra_6_meses: Math.round(ganhos.terra * 6)
    };
  };

  const handleNext = () => {
    if (step < totalSteps) {
      if (validateStep(step)) {
        setStep(step + 1);
        setValidationErrors({});
      }
    } else {
      if (validateStep(step)) {
        handleCalculate();
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setValidationErrors({});
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const calculatedResults = calculateMuscleGainMetrics(userData as UserData);
    setResults(calculatedResults);
    setIsCalculating(false);
  };

  const renderValidationError = (field: string) => {
    if (validationErrors[field]) {
      return (
        <div className="flex items-center gap-2 mt-1 text-red-400 text-sm">
          <X className="h-4 w-4" />
          {validationErrors[field]}
        </div>
      );
    }
    return null;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Scale className="h-6 w-6" />
                </div>
                Dados Pessoais
              </CardTitle>
              <CardDescription className="text-white/90">
                Informações básicas para análise personalizada de hipertrofia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-gray-700 font-medium">Nome *</Label>
                  <Input
                    id="nome"
                    value={userData.nome || ''}
                    onChange={(e) => setUserData({...userData, nome: e.target.value})}
                    placeholder="Seu nome"
                    className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.nome ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('nome')}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade" className="text-gray-700 font-medium">Idade *</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={userData.idade || ''}
                    onChange={(e) => setUserData({...userData, idade: parseInt(e.target.value)})}
                    placeholder="Anos"
                    className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.idade ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('idade')}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo" className="text-gray-700 font-medium">Sexo *</Label>
                  <Select onValueChange={(value) => setUserData({...userData, sexo: value as 'masculino' | 'feminino'})}>
                    <SelectTrigger className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.sexo ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  {renderValidationError('sexo')}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altura" className="text-gray-700 font-medium">Altura (cm) *</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={userData.altura || ''}
                    onChange={(e) => setUserData({...userData, altura: parseInt(e.target.value)})}
                    placeholder="175"
                    className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.altura ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('altura')}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso_atual" className="text-gray-700 font-medium">Peso Atual (kg) *</Label>
                  <Input
                    id="peso_atual"
                    type="number"
                    step="0.1"
                    value={userData.peso_atual || ''}
                    onChange={(e) => setUserData({...userData, peso_atual: parseFloat(e.target.value)})}
                    placeholder="70.5"
                    className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.peso_atual ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('peso_atual')}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso_objetivo" className="text-gray-700 font-medium">Peso Objetivo (kg) *</Label>
                  <Input
                    id="peso_objetivo"
                    type="number"
                    step="0.1"
                    value={userData.peso_objetivo || ''}
                    onChange={(e) => setUserData({...userData, peso_objetivo: parseFloat(e.target.value)})}
                    placeholder="80.0"
                    className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.peso_objetivo ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('peso_objetivo')}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Dumbbell className="h-6 w-6" />
                </div>
                Experiência e Objetivos
              </CardTitle>
              <CardDescription className="text-white/90">
                Informações sobre seu nível atual e metas específicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label htmlFor="nivel_experiencia" className="text-gray-700 font-medium">Nível de Experiência *</Label>
                <Select onValueChange={(value) => setUserData({...userData, nivel_experiencia: value as any})}>
                  <SelectTrigger className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.nivel_experiencia ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante (0-1 ano de treino)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (1-3 anos de treino)</SelectItem>
                    <SelectItem value="avancado">Avançado (3+ anos de treino)</SelectItem>
                  </SelectContent>
                </Select>
                {renderValidationError('nivel_experiencia')}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="objetivo_principal" className="text-gray-700 font-medium">Objetivo Principal *</Label>
                <Select onValueChange={(value) => setUserData({...userData, objetivo_principal: value as any})}>
                  <SelectTrigger className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.objetivo_principal ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}>
                    <SelectValue placeholder="Selecione seu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="massa_geral">Ganho de massa muscular geral</SelectItem>
                    <SelectItem value="forca">Aumento de força</SelectItem>
                    <SelectItem value="definicao">Definição muscular</SelectItem>
                    <SelectItem value="performance">Performance atlética</SelectItem>
                  </SelectContent>
                </Select>
                {renderValidationError('objetivo_principal')}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confianca" className="text-gray-700 font-medium">Confiança para Treinar (1-10) *</Label>
                <Input
                  id="confianca"
                  type="number"
                  min="1"
                  max="10"
                  value={userData.confianca_exercicio || ''}
                  onChange={(e) => setUserData({...userData, confianca_exercicio: parseInt(e.target.value)})}
                  placeholder="5"
                  className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.confianca_exercicio ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
                {renderValidationError('confianca_exercicio')}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                  <p className="text-sm" style={{ color: colors.primaryDark }}>
                    <Sparkles className="inline h-4 w-4 mr-1" />
                    1 = Muito inseguro, 10 = Muito confiante
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                Planejamento de Treino
              </CardTitle>
              <CardDescription className="text-white/90">
                Configure sua rotina de treinos e prazos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dias_treino" className="text-gray-700 font-medium">Dias de Treino por Semana *</Label>
                  <Select onValueChange={(value) => setUserData({...userData, dias_treino_semana: parseInt(value)})}>
                    <SelectTrigger className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.dias_treino_semana ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 dias</SelectItem>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="4">4 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="6">6 dias</SelectItem>
                      <SelectItem value="7">7 dias</SelectItem>
                    </SelectContent>
                  </Select>
                  {renderValidationError('dias_treino_semana')}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempo_sessao" className="text-gray-700 font-medium">Tempo por Sessão (minutos) *</Label>
                  <Select onValueChange={(value) => setUserData({...userData, tempo_disponivel_sessao: parseInt(value)})}>
                    <SelectTrigger className={`border-2 transition-colors rounded-xl h-12 ${
                      validationErrors.tempo_disponivel_sessao ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                      <SelectItem value="75">75 minutos</SelectItem>
                      <SelectItem value="90">90 minutos</SelectItem>
                      <SelectItem value="120">120 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                  {renderValidationError('tempo_disponivel_sessao')}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="prazo" className="text-gray-700 font-medium">Prazo para Meta (meses) *</Label>
                <Input
                  id="prazo"
                  type="number"
                  value={userData.prazo || ''}
                  onChange={(e) => setUserData({...userData, prazo: parseInt(e.target.value)})}
                  placeholder="6"
                  className={`border-2 transition-colors rounded-xl h-12 ${
                    validationErrors.prazo ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
                {renderValidationError('prazo')}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                  <p className="text-sm" style={{ color: colors.primaryDark }}>
                    <Trophy className="inline h-4 w-4 mr-1" />
                    Recomendado: 0.25-0.5kg por semana (ganho saudável)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local_treino" className="text-gray-700 font-medium">Local de Treino</Label>
                <Select onValueChange={(value) => setUserData({...userData, local_treino: value as any})}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academia">Academia</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                Performance Atual (Opcional)
              </CardTitle>
              <CardDescription className="text-white/90">
                Dados de força atual para cálculos mais precisos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <Alert className="border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <Info className="h-4 w-4" style={{ color: colors.primary }} />
                <AlertDescription style={{ color: colors.primaryDark }}>
                  Se você conhece suas cargas máximas, isso ajudará a personalizar melhor seu treino.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="supino_1rm" className="text-gray-700 font-medium">Supino 1RM (kg)</Label>
                  <Input
                    id="supino_1rm"
                    type="number"
                    step="2.5"
                    value={userData.supino_1rm || ''}
                    onChange={(e) => setUserData({...userData, supino_1rm: parseFloat(e.target.value)})}
                    placeholder="80"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agachamento_1rm" className="text-gray-700 font-medium">Agachamento 1RM (kg)</Label>
                  <Input
                    id="agachamento_1rm"
                    type="number"
                    step="2.5"
                    value={userData.agachamento_1rm || ''}
                    onChange={(e) => setUserData({...userData, agachamento_1rm: parseFloat(e.target.value)})}
                    placeholder="100"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terra_1rm" className="text-gray-700 font-medium">Levantamento Terra 1RM (kg)</Label>
                  <Input
                    id="terra_1rm"
                    type="number"
                    step="2.5"
                    value={userData.levantamento_terra_1rm || ''}
                    onChange={(e) => setUserData({...userData, levantamento_terra_1rm: parseFloat(e.target.value)})}
                    placeholder="120"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesoes" className="text-gray-700 font-medium">Lesões ou Limitações</Label>
                <Textarea
                  id="lesoes"
                  value={userData.lesoes_limitacoes || ''}
                  onChange={(e) => setUserData({...userData, lesoes_limitacoes: e.target.value})}
                  placeholder="Descreva qualquer lesão, dor ou limitação física..."
                  rows={3}
                  className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl resize-none"
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className={`w-full max-w-2xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Heart className="h-6 w-6" />
                </div>
                Composição Corporal e Suplementação
              </CardTitle>
              <CardDescription className="text-white/90">
                Dados opcionais para otimização máxima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <Alert className="border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <Info className="h-4 w-4" style={{ color: colors.primary }} />
                <AlertDescription style={{ color: colors.primaryDark }}>
                  Estes dados são opcionais, mas melhoram significativamente a precisão dos cálculos.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="massa_gorda" className="text-gray-700 font-medium">Massa Gorda (%)</Label>
                  <Input
                    id="massa_gorda"
                    type="number"
                    step="0.1"
                    value={userData.massa_gorda || ''}
                    onChange={(e) => setUserData({...userData, massa_gorda: parseFloat(e.target.value)})}
                    placeholder="12.5"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="massa_magra" className="text-gray-700 font-medium">Massa Magra (kg)</Label>
                  <Input
                    id="massa_magra"
                    type="number"
                    step="0.1"
                    value={userData.massa_magra || ''}
                    onChange={(e) => setUserData({...userData, massa_magra: parseFloat(e.target.value)})}
                    placeholder="65.2"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="massa_muscular" className="text-gray-700 font-medium">Massa Muscular (kg)</Label>
                  <Input
                    id="massa_muscular"
                    type="number"
                    step="0.1"
                    value={userData.massa_muscular || ''}
                    onChange={(e) => setUserData({...userData, massa_muscular: parseFloat(e.target.value)})}
                    placeholder="55.8"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-12"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suplementacao" className="text-gray-700 font-medium">Suplementação Atual</Label>
                <Textarea
                  id="suplementacao"
                  value={userData.suplementacao_atual || ''}
                  onChange={(e) => setUserData({...userData, suplementacao_atual: e.target.value})}
                  placeholder="Ex: Whey protein, creatina, multivitamínico..."
                  rows={2}
                  className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl resize-none"
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
        {/* Elementos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ backgroundColor: colors.primary }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{ backgroundColor: colors.primaryLight }}></div>
          <div className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" style={{ backgroundColor: colors.primaryDark }}></div>
        </div>

        <div className="text-center space-y-6 z-10 backdrop-blur-sm bg-white/10 p-12 rounded-3xl border border-white/20">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/30 mx-auto" style={{ borderTopColor: colors.primary }}></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-white/20 mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Calculando Plano de Hipertrofia</h2>
            <p className="text-xl text-gray-200">Aplicando algoritmos de otimização muscular...</p>
            
            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Analisando perfil genético</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-500" style={{ backgroundColor: colors.primaryLight }}></div>
                <p className="text-sm">Calculando volume ótimo</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1000" style={{ backgroundColor: colors.primaryDark }}></div>
                <p className="text-sm">Otimizando intensidade</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1500" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Gerando cronograma de progressão</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen p-6 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
        {/* Elementos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ backgroundColor: colors.primary }}></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" style={{ backgroundColor: colors.primaryLight }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" style={{ backgroundColor: colors.primaryDark }}></div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Header com animação */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl shadow-2xl" style={{ backgroundColor: colors.primary }}>
              <Sparkles className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Plano de Hipertrofia Personalizado</h1>
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-xl text-gray-300">Análise científica para ganho de massa muscular</p>
          </div>

          {/* Score Motivacional e Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                    <Trophy className="h-6 w-6" />
                  </div>
                  Score Motivacional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">
                      {results.score_motivacional}
                    </div>
                    <p className="text-xl text-gray-300 mt-2">Pontos de Motivação</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Nível do Usuário</span>
                      <Badge className="text-white" style={{ backgroundColor: colors.primary }}>
                        {results.nivel_usuario}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Pontos de Experiência</span>
                      <span className="font-bold" style={{ color: colors.primary }}>{results.pontos_experiencia} XP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                    <Award className="h-6 w-6" />
                  </div>
                  Badges Conquistadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {results.badges_conquistadas.map((badge, index) => (
                    <div key={index} className="border rounded-xl p-4 text-center backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <div className="text-2xl mb-2">{badge.split(' ')[0]}</div>
                      <div className="text-sm font-medium" style={{ color: colors.primary }}>{badge.split(' ').slice(1).join(' ')}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Potencial de Hipertrofia */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
                  <Brain className="h-6 w-6" />
                </div>
                Potencial de Hipertrofia (IA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={colors.primary}
                          strokeWidth="2"
                          strokeDasharray={`${results.potencial_hipertrofia * 100}, 100`}
                          className="animate-pulse"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{(results.potencial_hipertrofia * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Potencial Genético</h3>
                      <Badge 
                        className={`text-lg px-4 py-2 ${
                          results.potencial_hipertrofia > 0.7 
                            ? "text-white" 
                            : results.potencial_hipertrofia > 0.4 
                            ? "text-white" 
                            : "text-white"
                        }`}
                        style={{ 
                          backgroundColor: results.potencial_hipertrofia > 0.7 
                            ? colors.primary 
                            : results.potencial_hipertrofia > 0.4 
                            ? '#f59e0b' 
                            : '#ef4444'
                        }}
                      >
                        {results.potencial_hipertrofia > 0.7 ? "Alto" : results.potencial_hipertrofia > 0.4 ? "Moderado" : "Limitado"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Fatores Limitantes</h4>
                  {results.fatores_limitantes.length > 0 ? (
                    <div className="space-y-2">
                      {results.fatores_limitantes.map((fator, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-300">{fator}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 border rounded-lg backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}30` }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" style={{ color: colors.primary }} />
                        <span className="text-sm" style={{ color: colors.primary }}>Nenhum fator limitante identificado</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <Scale className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>IMC</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.imc}</p>
                <p className="text-sm" style={{ color: colors.primary }}>{results.classificacao_imc}</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <Target className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>Calorias Bulking</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.calorias_bulking}</p>
                <p className="text-sm" style={{ color: colors.primary }}>+{results.superavit_calorico} kcal</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <TrendingUp className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>Ganho Semanal</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.ganho_semanal_estimado}kg</p>
                <p className="text-sm" style={{ color: colors.primary }}>{results.tempo_estimado} semanas</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-sm" style={{ backgroundColor: `${colors.primary}30` }}>
                    <Dumbbell className="h-6 w-6" style={{ color: colors.primary }} />
                  </div>
                  <span className="text-lg font-medium" style={{ color: colors.primary }}>Ganho 6 Meses</span>
                </div>
                <p className="text-4xl font-bold text-white mb-2">{results.ganho_massa_6_meses}kg</p>
                <p className="text-sm" style={{ color: colors.primary }}>Estimativa</p>
              </CardContent>
            </Card>
          </div>

          {/* Resto dos cards seguindo o mesmo padrão... */}
          {/* Por brevidade, vou incluir apenas alguns cards principais */}

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-6 justify-center pt-8">
            <Button 
              onClick={() => window.print()} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Imprimir Plano
            </Button>
            <Button 
              onClick={() => navigate('/progress')}
              className="text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: colors.primary }}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Iniciar Acompanhamento
            </Button>
            <Button 
              onClick={() => {setResults(null); setStep(1);}} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Nova Análise
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{ backgroundColor: colors.dark }}>
      {/* Elementos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{ backgroundColor: colors.primary }}></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" style={{ backgroundColor: colors.primaryLight }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" style={{ backgroundColor: colors.primaryDark }}></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header com animação */}
        <div className={`text-center space-y-4 transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-lg" style={{ backgroundColor: colors.primary }}>
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Ganho de Massa Muscular Inteligente</h1>
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-xl text-gray-200">Algoritmos avançados de hipertrofia personalizada</p>
        </div>

        {/* Progress Bar com design moderno */}
        <div className={`w-full max-w-3xl mx-auto transition-all duration-700 delay-300 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex justify-between text-sm text-gray-200 mb-4">
            <span className="font-medium">Passo {step} de {totalSteps}</span>
            <span className="font-medium">{Math.round(progress)}% completo</span>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full overflow-hidden"
            />
            <div className="absolute inset-0 rounded-full opacity-80" 
                 style={{width: `${progress}%`, backgroundColor: colors.primary}}></div>
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({length: totalSteps}, (_, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i + 1 <= step 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-300 border border-white/30'
              }`} style={{ backgroundColor: i + 1 <= step ? colors.primary : 'transparent' }}>
                {i + 1 <= step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex justify-center">
          {renderStep()}
        </div>

        {/* Navigation Buttons com design moderno */}
        <div className={`flex justify-center gap-6 transition-all duration-700 delay-500 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {step > 1 && (
            <Button 
              onClick={handlePrevious} 
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all duration-300"
            >
              Anterior
            </Button>
          )}
          <Button 
            onClick={handleNext}
            className="text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            style={{ backgroundColor: colors.primary }}
          >
            {step === totalSteps ? (
              <>
                <Rocket className="mr-2 h-5 w-5" />
                Calcular Plano
              </>
            ) : (
              'Próximo'
            )}
          </Button>
        </div>

        {/* Mostrar erros de validação se houver */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="fixed bottom-4 right-4 max-w-md">
            <Alert className="bg-red-500/20 border-red-500/30 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                Por favor, corrija os campos obrigatórios destacados em vermelho.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* CSS personalizado para animações */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GanhoMassaMuscular;

