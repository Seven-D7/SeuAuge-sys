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
  RotateCcw, 
  TrendingUp,  
  Activity, 
  Scale,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Sparkles,
  Award,
  Rocket,
  X
} from 'lucide-react';

// Importar algoritmos avançados
import {
  GeneticFitnessProfile
} from '@/lib/fitness/advanced_fitness_algorithms';

interface UserData {
  // Dados básicos (obrigatórios)
  nome: string;
  idade: number;
  sexo: 'masculino' | 'feminino';
  altura: number;
  peso_atual: number;
  
  // Dados específicos para recomposição (obrigatórios)
  gordura_corporal_atual: number;
  gordura_corporal_objetivo: number;
  prazo_meses: number;
  confianca_recomposicao: number; // 1-10
  
  // Dados de treino (obrigatórios)
  nivel_atividade: 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso';
  dias_treino_semana: number;
  tempo_disponivel_sessao: number;
  
  // Dados opcionais
  massa_muscular_atual?: number;
  massa_muscular_objetivo?: number;
  experiencia_treino?: 'iniciante' | 'intermediario' | 'avancado';
  lesoes_limitacoes?: string;
  suplementacao_atual?: string;
  
  // Dados de composição corporal (opcionais)
  circunferencia_cintura?: number;
  circunferencia_quadril?: number;
  massa_magra?: number;
}

interface RecompositionResults {
  // Métricas calculadas
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_recomposicao: number;
  
  // Análise de recomposição
  perfil_corporal: any;
  potencial_recomposicao: number;
  deficit_calorico_recomendado: number;
  perda_gordura_semanal: number;
  ganho_muscular_semanal: number;
  
  // Planos personalizados
  plano_treino_recomposicao: any;
  plano_nutricional_recomposicao: any;
  cronograma_fases: any;
  suplementacao_recomendada: string[];
  
  // Predições
  resultado_3_meses: any;
  resultado_6_meses: any;
  fatores_limitantes: string[];
  recomendacoes_otimizacao: string[];
  
  // Elementos únicos
  score_motivacional: number;
  badges_conquistadas: string[];
  nivel_usuario: string;
  pontos_experiencia: number;
}

interface ValidationErrors {
  [key: string]: string;
}

const RecomposicaoCorporal: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<RecompositionResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // Cores da paleta específica
  const colors = {
    primary: '#1ab894',    // Verde principal
    dark: '#111828',       // Azul escuro
    white: '#ffffff',      // Branco
    primaryLight: '#22d3aa', // Verde mais claro
    primaryDark: '#0f9d7a',  // Verde mais escuro
  };

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
        break;
        
      case 2:
        if (!userData.gordura_corporal_atual || userData.gordura_corporal_atual < 5 || userData.gordura_corporal_atual > 50) {
          errors.gordura_corporal_atual = 'Gordura corporal atual deve estar entre 5% e 50%';
        }
        if (!userData.gordura_corporal_objetivo || userData.gordura_corporal_objetivo < 5 || userData.gordura_corporal_objetivo > 50) {
          errors.gordura_corporal_objetivo = 'Gordura corporal objetivo deve estar entre 5% e 50%';
        }
        if (userData.gordura_corporal_objetivo && userData.gordura_corporal_atual && 
            userData.gordura_corporal_objetivo >= userData.gordura_corporal_atual) {
          errors.gordura_corporal_objetivo = 'Objetivo deve ser menor que o atual para recomposição';
        }
        if (!userData.prazo_meses || userData.prazo_meses < 1 || userData.prazo_meses > 24) {
          errors.prazo_meses = 'Prazo deve estar entre 1 e 24 meses';
        }
        if (!userData.confianca_recomposicao || userData.confianca_recomposicao < 1 || userData.confianca_recomposicao > 10) {
          errors.confianca_recomposicao = 'Confiança deve estar entre 1 e 10';
        }
        break;
        
      case 3:
        if (!userData.nivel_atividade) errors.nivel_atividade = 'Nível de atividade é obrigatório';
        if (!userData.dias_treino_semana || userData.dias_treino_semana < 2 || userData.dias_treino_semana > 7) {
          errors.dias_treino_semana = 'Dias de treino deve estar entre 2 e 7';
        }
        if (!userData.tempo_disponivel_sessao || userData.tempo_disponivel_sessao < 30 || userData.tempo_disponivel_sessao > 180) {
          errors.tempo_disponivel_sessao = 'Tempo por sessão deve estar entre 30 e 180 minutos';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateRecompositionMetrics = (data: UserData): RecompositionResults => {
    // 1. Métricas básicas
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_imc = '';
    if (imc < 18.5) classificacao_imc = 'Abaixo do peso - Foque em ganho muscular';
    else if (imc < 25) classificacao_imc = 'Peso normal - Ideal para recomposição';
    else if (imc < 30) classificacao_imc = 'Sobrepeso - Priorize perda de gordura';
    else classificacao_imc = 'Obesidade - Foque em emagrecimento primeiro';

    // 2. TMB
    let tmb: number;
    if (data.sexo === 'masculino') {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5;
    } else {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    }

    // 3. Gasto energético baseado no nível de atividade
    const fatores_atividade = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      muito_intenso: 1.9
    };
    const fator = fatores_atividade[data.nivel_atividade];
    const gasto_energetico = tmb * fator;

    // 4. Perfil corporal
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: data.nivel_atividade
    });

    // 5. Potencial de recomposição
    let potencial = 0.5;
    
    if (data.idade < 30) potencial += 0.2;
    else if (data.idade > 40) potencial -= 0.1;
    
    if (data.gordura_corporal_atual > 20) potencial += 0.1; // Mais gordura = mais potencial de perda
    if (data.confianca_recomposicao >= 8) potencial += 0.1;
    if (data.dias_treino_semana >= 4) potencial += 0.1;
    if (data.experiencia_treino === 'iniciante') potencial += 0.1; // Iniciantes respondem melhor
    
    potencial = Math.min(potencial, 1.0);

    // 6. Déficit calórico recomendado
    let deficit_base = 300; // Déficit conservador para recomposição
    
    if (data.gordura_corporal_atual > 25) {
      deficit_base = 500; // Mais agressivo para gordura alta
    } else if (data.gordura_corporal_atual < 15) {
      deficit_base = 200; // Mais conservador para gordura baixa
    }
    
    // Ajustar baseado na experiência
    if (data.experiencia_treino === 'iniciante') {
      deficit_base *= 0.8; // Mais conservador para iniciantes
    }
    
    const calorias_recomposicao = gasto_energetico - deficit_base;

    // 7. Estimativas de mudança corporal
    const perda_gordura_semanal = (deficit_base * 7) / 7700; // 1kg gordura = ~7700 kcal
    const ganho_muscular_semanal = data.experiencia_treino === 'iniciante' ? 0.1 : 
                                   data.experiencia_treino === 'intermediario' ? 0.05 : 0.025;

    // 8. Elementos únicos
    const score_motivacional = calculateMotivationalScore(data, potencial);
    const badges_conquistadas = generateBadges(data, potencial, imc);
    const nivel_usuario = calculateUserLevel(data, score_motivacional);
    const pontos_experiencia = calculateExperiencePoints(data, potencial);

    // 9. Planos detalhados
    const plano_treino = generateRecompositionTrainingPlan(data);
    const plano_nutricional = generateRecompositionNutrition(data, calorias_recomposicao);
    const cronograma = generatePhaseSchedule(data);
    const suplementacao = generateRecompositionSupplements(data);
    const resultado_3_meses = calculateResults(data, 3, perda_gordura_semanal, ganho_muscular_semanal);
    const resultado_6_meses = calculateResults(data, 6, perda_gordura_semanal, ganho_muscular_semanal);

    // 10. Fatores limitantes e recomendações
    const fatores_limitantes: string[] = [];
    const recomendacoes: string[] = [];
    
    if (data.idade > 40) fatores_limitantes.push('Idade - metabolismo mais lento');
    if (data.gordura_corporal_atual < 12) fatores_limitantes.push('Gordura corporal muito baixa');
    if (data.dias_treino_semana < 3) fatores_limitantes.push('Frequência de treino insuficiente');
    if (data.confianca_recomposicao < 6) fatores_limitantes.push('Baixa confiança no processo');
    
    recomendacoes.push('Combine treino de força com cardio moderado');
    recomendacoes.push('Mantenha déficit calórico moderado');
    recomendacoes.push('Priorize proteína em todas as refeições');
    recomendacoes.push('Monitore composição corporal, não apenas peso');
    
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      recomendacoes.push('Foque em treinos de força intensos');
    } else {
      recomendacoes.push('Inclua mais atividade cardiovascular');
    }

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_imc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gasto_energetico),
      calorias_recomposicao: Math.round(calorias_recomposicao),
      perfil_corporal: geneticProfile.geneticProfile,
      potencial_recomposicao: Math.round(potencial * 100) / 100,
      deficit_calorico_recomendado: deficit_base,
      perda_gordura_semanal: Math.round(perda_gordura_semanal * 1000) / 1000,
      ganho_muscular_semanal: Math.round(ganho_muscular_semanal * 1000) / 1000,
      plano_treino_recomposicao: plano_treino,
      plano_nutricional_recomposicao: plano_nutricional,
      cronograma_fases: cronograma,
      suplementacao_recomendada: suplementacao,
      resultado_3_meses,
      resultado_6_meses,
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
    score += data.confianca_recomposicao * 5;
    score += potencial * 30;
    if (data.experiencia_treino === 'avancado') score += 15;
    if (data.dias_treino_semana >= 4) score += 10;
    return Math.min(100, Math.round(score));
  };

  const generateBadges = (data: UserData, potencial: number, imc: number): string[] => {
    const badges: string[] = [];
    if (potencial > 0.8) badges.push('🏆 Alto Potencial');
    if (data.confianca_recomposicao >= 8) badges.push('💪 Confiante');
    if (data.experiencia_treino === 'avancado') badges.push('⭐ Experiente');
    if (data.dias_treino_semana >= 5) badges.push('🔥 Dedicado');
    if (data.gordura_corporal_atual > 20) badges.push('🎯 Transformador');
    badges.push('🔄 Recompositor');
    return badges;
  };

  const calculateUserLevel = (data: UserData, score: number): string => {
    if (score >= 90) return 'Elite Recomposer';
    if (score >= 75) return 'Avançado';
    if (score >= 60) return 'Intermediário';
    if (score >= 45) return 'Iniciante Plus';
    return 'Iniciante';
  };

  const calculateExperiencePoints = (data: UserData, potencial: number): number => {
    let pontos = 100;
    pontos += data.confianca_recomposicao * 10;
    pontos += potencial * 50;
    if (data.experiencia_treino === 'avancado') pontos += 100;
    return Math.round(pontos);
  };

  const generateRecompositionTrainingPlan = (data: UserData) => {
    return {
      tipo_treino: 'Recomposição Corporal',
      frequencia: data.dias_treino_semana,
      duracao_sessao: data.tempo_disponivel_sessao,
      divisao_treino: data.dias_treino_semana >= 4 ? 'Upper/Lower + Cardio' : 'Full Body + Cardio',
      fases_treino: [
        { nome: 'Força + Cardio Moderado', series: '3-4', reps: '8-12', cardio: '20-30min' },
        { nome: 'Hipertrofia + HIIT', series: '3-5', reps: '10-15', cardio: '15-25min' },
        { nome: 'Definição + Cardio Intenso', series: '2-4', reps: '12-20', cardio: '30-45min' }
      ],
      exercicios_principais: [
        'Agachamento',
        'Levantamento terra',
        'Supino',
        'Remada',
        'Desenvolvimento',
        'Cardio intervalado'
      ]
    };
  };

  const generateRecompositionNutrition = (data: UserData, calorias: number) => {
    const proteina_g = Math.round((calorias * 0.30) / 4); // 30% proteína para recomposição
    const carbo_g = Math.round((calorias * 0.35) / 4);    // 35% carboidratos
    const gordura_g = Math.round((calorias * 0.35) / 9);  // 35% gorduras

    return {
      calorias_diarias: calorias,
      macronutrientes: {
        proteina: proteina_g,
        carboidratos: carbo_g,
        gorduras: gordura_g
      },
      proteina_por_kg: Math.round((proteina_g / data.peso_atual) * 10) / 10,
      estrategias_nutricionais: [
        'Ciclagem de carboidratos',
        'Janela anabólica pós-treino',
        'Jejum intermitente (opcional)',
        'Refeições frequentes'
      ],
      timing_refeicoes: {
        pre_treino: 'Proteína + carboidratos complexos',
        pos_treino: 'Proteína rápida + carboidratos simples',
        antes_dormir: 'Proteína lenta (caseína)'
      }
    };
  };

  const generatePhaseSchedule = (data: UserData) => {
    return {
      fase_1: {
        nome: 'Adaptação',
        duracao: '4 semanas',
        foco: 'Estabelecer rotina e técnica',
        deficit: 'Moderado (300-400 kcal)'
      },
      fase_2: {
        nome: 'Progressão',
        duracao: '8-12 semanas',
        foco: 'Perda de gordura + ganho muscular',
        deficit: 'Controlado (400-500 kcal)'
      },
      fase_3: {
        nome: 'Refinamento',
        duracao: '4-6 semanas',
        foco: 'Definição final',
        deficit: 'Agressivo (500-600 kcal)'
      },
      fase_4: {
        nome: 'Manutenção',
        duracao: 'Contínua',
        foco: 'Manter resultados',
        deficit: 'Mínimo (200-300 kcal)'
      }
    };
  };

  const generateRecompositionSupplements = (data: UserData) => {
    const suplementos = ['Whey Protein', 'Creatina', 'Multivitamínico', 'Ômega 3'];
    
    if (data.gordura_corporal_atual > 20) {
      suplementos.push('L-Carnitina', 'Cafeína');
    }
    
    if (data.experiencia_treino === 'avancado') {
      suplementos.push('HMB', 'Glutamina');
    }
    
    if (data.idade > 35) {
      suplementos.push('ZMA', 'Coenzima Q10');
    }
    
    return suplementos;
  };

  const calculateResults = (data: UserData, meses: number, perda_gordura_semanal: number, ganho_muscular_semanal: number) => {
    const semanas = meses * 4;
    const perda_gordura_total = perda_gordura_semanal * semanas;
    const ganho_muscular_total = ganho_muscular_semanal * semanas;
    
    const peso_final = data.peso_atual - perda_gordura_total + ganho_muscular_total;
    const gordura_final = Math.max(5, data.gordura_corporal_atual - (perda_gordura_total / data.peso_atual * 100));
    
    return {
      peso_estimado: Math.round(peso_final * 10) / 10,
      gordura_corporal_estimada: Math.round(gordura_final * 10) / 10,
      perda_gordura_kg: Math.round(perda_gordura_total * 10) / 10,
      ganho_muscular_kg: Math.round(ganho_muscular_total * 10) / 10,
      mudanca_composicao: Math.round((perda_gordura_total + ganho_muscular_total) * 10) / 10
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
    const calculatedResults = calculateRecompositionMetrics(userData as UserData);
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
          <Card className={`w-full max-w-7xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Scale className="h-6 w-6" />
                </div>
                Dados Pessoais
              </CardTitle>
              <CardDescription className="text-white/90">
                Informações básicas para análise de recomposição corporal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="nome" className="text-gray-700 font-medium">Nome *</Label>
                  <Input
                    id="nome"
                    value={userData.nome || ''}
                    onChange={(e) => setUserData({...userData, nome: e.target.value})}
                    placeholder="Seu nome"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.nome ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('nome')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="idade" className="text-gray-700 font-medium">Idade *</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={userData.idade || ''}
                    onChange={(e) => setUserData({...userData, idade: parseInt(e.target.value)})}
                    placeholder="Anos"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.idade ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('idade')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="sexo" className="text-gray-700 font-medium text-sm">Sexo *</Label>
                  <Select onValueChange={(value) => setUserData({...userData, sexo: value as 'masculino' | 'feminino'})}>
                    <SelectTrigger className={`border-2 transition-colors rounded-xl h-14 bg-white text-gray-900 font-medium shadow-sm ${
                      validationErrors.sexo ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-primary hover:border-gray-400'
                    }`}>
                      <SelectValue placeholder="Selecione seu sexo" className="text-gray-900 font-medium" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50">
                      <SelectItem value="masculino" className="hover:bg-blue-50 text-gray-900 font-medium text-base py-4 cursor-pointer">
                        👨 Masculino
                      </SelectItem>
                      <SelectItem value="feminino" className="hover:bg-pink-50 text-gray-900 font-medium text-base py-4 cursor-pointer">
                        👩 Feminino
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {renderValidationError('sexo')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="altura" className="text-gray-700 font-medium">Altura (cm) *</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={userData.altura || ''}
                    onChange={(e) => setUserData({...userData, altura: parseInt(e.target.value)})}
                    placeholder="175"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.altura ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('altura')}
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="peso_atual" className="text-gray-700 font-medium">Peso Atual (kg) *</Label>
                  <Input
                    id="peso_atual"
                    type="number"
                    step="0.1"
                    value={userData.peso_atual || ''}
                    onChange={(e) => setUserData({...userData, peso_atual: parseFloat(e.target.value)})}
                    placeholder="70.5"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.peso_atual ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('peso_atual')}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className={`w-full max-w-7xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <RotateCcw className="h-6 w-6" />
                </div>
                Objetivos de Recomposição
              </CardTitle>
              <CardDescription className="text-white/90">
                Defina suas metas de composição corporal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="gordura_atual" className="text-gray-700 font-medium">Gordura Corporal Atual (%) *</Label>
                  <Input
                    id="gordura_atual"
                    type="number"
                    step="0.1"
                    value={userData.gordura_corporal_atual || ''}
                    onChange={(e) => setUserData({...userData, gordura_corporal_atual: parseFloat(e.target.value)})}
                    placeholder="20.0"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.gordura_corporal_atual ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('gordura_corporal_atual')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="gordura_objetivo" className="text-gray-700 font-medium">Gordura Corporal Objetivo (%) *</Label>
                  <Input
                    id="gordura_objetivo"
                    type="number"
                    step="0.1"
                    value={userData.gordura_corporal_objetivo || ''}
                    onChange={(e) => setUserData({...userData, gordura_corporal_objetivo: parseFloat(e.target.value)})}
                    placeholder="15.0"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.gordura_corporal_objetivo ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('gordura_corporal_objetivo')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="prazo" className="text-gray-700 font-medium">Prazo para Meta (meses) *</Label>
                  <Input
                    id="prazo"
                    type="number"
                    value={userData.prazo_meses || ''}
                    onChange={(e) => setUserData({...userData, prazo_meses: parseInt(e.target.value)})}
                    placeholder="6"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.prazo_meses ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('prazo_meses')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confianca" className="text-gray-700 font-medium">Confiança na Recomposição (1-10) *</Label>
                  <Input
                    id="confianca"
                    type="number"
                    min="1"
                    max="10"
                    value={userData.confianca_recomposicao || ''}
                    onChange={(e) => setUserData({...userData, confianca_recomposicao: parseInt(e.target.value)})}
                    placeholder="7"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.confianca_recomposicao ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('confianca_recomposicao')}
                </div>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <p className="text-sm" style={{ color: colors.primaryDark }}>
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  1 = Muito inseguro, 10 = Extremamente confiante no processo de recomposição
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="massa_muscular_atual" className="text-gray-700 font-medium">Massa Muscular Atual (kg) - Opcional</Label>
                  <Input
                    id="massa_muscular_atual"
                    type="number"
                    step="0.1"
                    value={userData.massa_muscular_atual || ''}
                    onChange={(e) => setUserData({...userData, massa_muscular_atual: parseFloat(e.target.value)})}
                    placeholder="45.0"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="massa_muscular_objetivo" className="text-gray-700 font-medium">Massa Muscular Objetivo (kg) - Opcional</Label>
                  <Input
                    id="massa_muscular_objetivo"
                    type="number"
                    step="0.1"
                    value={userData.massa_muscular_objetivo || ''}
                    onChange={(e) => setUserData({...userData, massa_muscular_objetivo: parseFloat(e.target.value)})}
                    placeholder="50.0"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className={`w-full max-w-7xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
                Nível de Atividade e Treino
              </CardTitle>
              <CardDescription className="text-white/90">
                Configure sua rotina de atividades físicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
              <div className="space-y-3">
                <Label htmlFor="nivel_atividade" className="text-gray-700 font-medium">Nível de Atividade Atual *</Label>
                <Select onValueChange={(value) => setUserData({...userData, nivel_atividade: value as any})}>
                  <SelectTrigger className={`border-2 transition-colors rounded-xl h-14 ${
                    validationErrors.nivel_atividade ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value="leve">Leve (exercício leve 1-3 dias/semana)</SelectItem>
                    <SelectItem value="moderado">Moderado (exercício moderado 3-5 dias/semana)</SelectItem>
                    <SelectItem value="intenso">Intenso (exercício intenso 6-7 dias/semana)</SelectItem>
                    <SelectItem value="muito_intenso">Muito Intenso (exercício muito intenso, trabalho físico)</SelectItem>
                  </SelectContent>
                </Select>
                {renderValidationError('nivel_atividade')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="dias_treino" className="text-gray-700 font-medium">Dias de Treino por Semana *</Label>
                  <Select onValueChange={(value) => setUserData({...userData, dias_treino_semana: parseInt(value)})}>
                    <SelectTrigger className={`border-2 transition-colors rounded-xl h-14 ${
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
                <div className="space-y-3">
                  <Label htmlFor="tempo_sessao" className="text-gray-700 font-medium">Tempo por Sessão (minutos) *</Label>
                  <Select onValueChange={(value) => setUserData({...userData, tempo_disponivel_sessao: parseInt(value)})}>
                    <SelectTrigger className={`border-2 transition-colors rounded-xl h-14 ${
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
                <Label htmlFor="experiencia_treino" className="text-gray-700 font-medium">Experiência com Treino (Opcional)</Label>
                <Select onValueChange={(value) => setUserData({...userData, experiencia_treino: value as any})}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14">
                    <SelectValue placeholder="Selecione sua experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante (0-1 ano)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (1-3 anos)</SelectItem>
                    <SelectItem value="avancado">Avançado (3+ anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <p className="text-sm" style={{ color: colors.primaryDark }}>
                  <Target className="inline h-4 w-4 mr-1" />
                  Para recomposição corporal, recomendamos 4-5 dias de treino combinando força e cardio
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className={`w-full max-w-7xl backdrop-blur-lg bg-white/95 border-0 shadow-2xl transition-all duration-700 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <CardHeader style={{ backgroundColor: colors.primary }} className="text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                Informações Adicionais (Opcional)
              </CardTitle>
              <CardDescription className="text-white/90">
                Dados extras para otimização máxima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
              <Alert className="border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <Info className="h-4 w-4" style={{ color: colors.primary }} />
                <AlertDescription style={{ color: colors.primaryDark }}>
                  Estes dados são opcionais, mas melhoram a precisão dos cálculos de recomposição.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="cintura" className="text-gray-700 font-medium">Circunferência Cintura (cm)</Label>
                  <Input
                    id="cintura"
                    type="number"
                    value={userData.circunferencia_cintura || ''}
                    onChange={(e) => setUserData({...userData, circunferencia_cintura: parseInt(e.target.value)})}
                    placeholder="80"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="quadril" className="text-gray-700 font-medium">Circunferência Quadril (cm)</Label>
                  <Input
                    id="quadril"
                    type="number"
                    value={userData.circunferencia_quadril || ''}
                    onChange={(e) => setUserData({...userData, circunferencia_quadril: parseInt(e.target.value)})}
                    placeholder="95"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="massa_magra" className="text-gray-700 font-medium">Massa Magra (kg)</Label>
                  <Input
                    id="massa_magra"
                    type="number"
                    step="0.1"
                    value={userData.massa_magra || ''}
                    onChange={(e) => setUserData({...userData, massa_magra: parseFloat(e.target.value)})}
                    placeholder="55.0"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="space-y-3">
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

              <div className="space-y-3">
                <Label htmlFor="suplementacao" className="text-gray-700 font-medium">Suplementação Atual</Label>
                <Textarea
                  id="suplementacao"
                  value={userData.suplementacao_atual || ''}
                  onChange={(e) => setUserData({...userData, suplementacao_atual: e.target.value})}
                  placeholder="Ex: Whey protein, creatina, termogênico..."
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
            <h2 className="text-4xl font-bold text-white">Calculando Recomposição Corporal</h2>
            <p className="text-xl text-gray-200">Aplicando algoritmos de transformação corporal...</p>
            
            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Analisando composição corporal</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-500" style={{ backgroundColor: colors.primaryLight }}></div>
                <p className="text-sm">Calculando déficit calórico ideal</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1000" style={{ backgroundColor: colors.primaryDark }}></div>
                <p className="text-sm">Otimizando estratégia de recomposição</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1500" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Gerando cronograma personalizado</p>
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
              <h1 className="text-4xl font-bold">Plano de Recomposição Corporal</h1>
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-xl text-gray-300">Transformação científica: perder gordura e ganhar músculo</p>
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

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-6 justify-center pt-8">
            <Button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
              variant="default"
              size="default"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Imprimir Plano
            </Button>
            <Button
              onClick={() => navigate('/progress')}
              className="text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: colors.primary }}
              variant="default"
              size="default"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Iniciar Acompanhamento
            </Button>
            <Button
              onClick={() => {
                setResults(null);
                setStep(1);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
              variant="default"
              size="default"
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
            <h1 className="text-4xl font-bold">Recomposição Corporal Inteligente</h1>
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-xl text-gray-200">Algoritmos avançados de transformação corporal</p>
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
        <div className={`flex justify-center gap-12 transition-all duration-700 delay-500 ${animationStep ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {step > 1 && (
            <Button
              onClick={handlePrevious}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all duration-300"
              variant="default"
              size="default"
            >
              Anterior
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            style={{ backgroundColor: colors.primary }}
            variant="default"
            size="default"
          >
            {step === totalSteps ? (
              <>
                <Rocket className="mr-2 h-5 w-5" />
                Calcular Recomposição
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

    </div>
  );
};

export default RecomposicaoCorporal;

