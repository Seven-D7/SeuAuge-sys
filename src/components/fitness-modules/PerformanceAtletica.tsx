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
  Trophy, 
  Calendar,
  Scale,
  TrendingUp,
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
  
  // Modalidade esportiva (obrigatórios)
  modalidade_principal: string;
  nivel_competitivo: 'recreativo' | 'amador' | 'semi_profissional' | 'profissional';
  anos_experiencia: number;
  confianca_performance: number; // 1-10
  
  // Dados de treino (obrigatórios)
  dias_treino_semana: number;
  tempo_disponivel_sessao: number;
  
  // Dados opcionais
  posicao_funcao?: string;
  objetivo_especifico?: 'velocidade' | 'resistencia' | 'forca' | 'agilidade' | 'coordenacao';
  lesoes_limitacoes?: string;
  suplementacao_atual?: string;
  
  // Dados de performance atual (opcionais)
  vo2_max?: number;
  frequencia_cardiaca_repouso?: number;
  tempo_corrida_5km?: number;
  salto_vertical?: number;
  teste_agilidade?: number;
}

interface PerformanceResults {
  // Métricas calculadas
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_performance: number;
  
  // Análise de performance
  perfil_atletico: any;
  potencial_performance: number;
  areas_melhoria: string[];
  pontos_fortes: string[];
  
  // Planos personalizados
  plano_treino_especifico: any;
  plano_nutricional_performance: any;
  cronograma_periodizacao: any;
  suplementacao_recomendada: string[];
  
  // Predições
  melhoria_performance_3_meses: any;
  metas_especificas: any;
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

const PerformanceAtletica: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<PerformanceResults | null>(null);
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
        break;
        
      case 2:
        if (!userData.modalidade_principal?.trim()) errors.modalidade_principal = 'Modalidade é obrigatória';
        if (!userData.nivel_competitivo) errors.nivel_competitivo = 'Nível competitivo é obrigatório';
        if (!userData.anos_experiencia || userData.anos_experiencia < 0 || userData.anos_experiencia > 50) {
          errors.anos_experiencia = 'Anos de experiência deve estar entre 0 e 50';
        }
        if (!userData.confianca_performance || userData.confianca_performance < 1 || userData.confianca_performance > 10) {
          errors.confianca_performance = 'Confiança deve estar entre 1 e 10';
        }
        break;
        
      case 3:
        if (!userData.dias_treino_semana || userData.dias_treino_semana < 2 || userData.dias_treino_semana > 7) {
          errors.dias_treino_semana = 'Dias de treino deve estar entre 2 e 7';
        }
        if (!userData.tempo_disponivel_sessao || userData.tempo_disponivel_sessao < 30 || userData.tempo_disponivel_sessao > 300) {
          errors.tempo_disponivel_sessao = 'Tempo por sessão deve estar entre 30 e 300 minutos';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculatePerformanceMetrics = (data: UserData): PerformanceResults => {
    // 1. Métricas básicas
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_imc = '';
    if (imc < 18.5) classificacao_imc = 'Abaixo do peso - Pode afetar performance';
    else if (imc < 25) classificacao_imc = 'Peso normal - Ideal para performance';
    else if (imc < 30) classificacao_imc = 'Sobrepeso - Pode limitar performance';
    else classificacao_imc = 'Obesidade - Limitação significativa';

    // 2. TMB
    let tmb: number;
    if (data.sexo === 'masculino') {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5;
    } else {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    }

    // 3. Gasto energético para atletas
    const fator_atividade = {
      2: 1.6, 3: 1.7, 4: 1.8, 5: 1.9, 6: 2.0, 7: 2.2
    };
    const fator = fator_atividade[data.dias_treino_semana as keyof typeof fator_atividade] || 1.8;
    const gasto_energetico = tmb * fator;

    // 4. Perfil atlético
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: 'atleta'
    });

    // 5. Potencial de performance
    let potencial = 0.5;
    
    if (data.idade < 25) potencial += 0.2;
    else if (data.idade > 35) potencial -= 0.1;
    
    if (data.nivel_competitivo === 'profissional') potencial += 0.2;
    else if (data.nivel_competitivo === 'semi_profissional') potencial += 0.1;
    
    if (data.anos_experiencia > 5) potencial += 0.1;
    if (data.confianca_performance >= 8) potencial += 0.1;
    if (geneticProfile.geneticProfile.enduranceScore >= 4) potencial += 0.1;
    
    potencial = Math.min(potencial, 1.0);

    // 6. Áreas de melhoria e pontos fortes
    const areas_melhoria: string[] = [];
    const pontos_fortes: string[] = [];
    
    if (imc > 25) areas_melhoria.push('Composição corporal');
    if (data.confianca_performance < 7) areas_melhoria.push('Confiança mental');
    if (data.anos_experiencia < 2) areas_melhoria.push('Experiência técnica');
    
    if (data.nivel_competitivo === 'profissional') pontos_fortes.push('Alto nível competitivo');
    if (data.confianca_performance >= 8) pontos_fortes.push('Confiança elevada');
    if (geneticProfile.geneticProfile.enduranceScore >= 4) pontos_fortes.push('Boa capacidade aeróbica');

    // 7. Elementos únicos
    const score_motivacional = calculateMotivationalScore(data, potencial);
    const badges_conquistadas = generateBadges(data, potencial, imc);
    const nivel_usuario = calculateUserLevel(data, score_motivacional);
    const pontos_experiencia = calculateExperiencePoints(data, potencial);

    // 8. Planos detalhados
    const plano_treino = generatePerformanceTrainingPlan(data);
    const plano_nutricional = generatePerformanceNutrition(data, gasto_energetico);
    const cronograma = generatePeriodizationSchedule(data);
    const suplementacao = generatePerformanceSupplements(data);
    const melhoria_3_meses = calculatePerformanceImprovement(data);
    const metas = generateSpecificGoals(data);

    // 9. Fatores limitantes e recomendações
    const fatores_limitantes: string[] = [];
    const recomendacoes: string[] = [];
    
    if (data.idade > 35) fatores_limitantes.push('Idade - recuperação mais lenta');
    if (imc > 25) fatores_limitantes.push('Excesso de peso corporal');
    if (data.dias_treino_semana < 4) fatores_limitantes.push('Volume de treino insuficiente');
    
    if (geneticProfile.geneticProfile.dominantType === 'endurance') {
      recomendacoes.push('Foque em esportes de resistência');
      recomendacoes.push('Desenvolva capacidade aeróbica máxima');
    } else {
      recomendacoes.push('Priorize treinos de força e potência');
      recomendacoes.push('Trabalhe explosão e velocidade');
    }

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_imc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gasto_energetico),
      calorias_performance: Math.round(gasto_energetico + 200), // Leve superávit para performance
      perfil_atletico: geneticProfile.geneticProfile,
      potencial_performance: Math.round(potencial * 100) / 100,
      areas_melhoria,
      pontos_fortes,
      plano_treino_especifico: plano_treino,
      plano_nutricional_performance: plano_nutricional,
      cronograma_periodizacao: cronograma,
      suplementacao_recomendada: suplementacao,
      melhoria_performance_3_meses: melhoria_3_meses,
      metas_especificas: metas,
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
    score += data.confianca_performance * 5;
    score += potencial * 30;
    if (data.nivel_competitivo === 'profissional') score += 20;
    if (data.anos_experiencia >= 5) score += 10;
    return Math.min(100, Math.round(score));
  };

  const generateBadges = (data: UserData, potencial: number, imc: number): string[] => {
    const badges: string[] = [];
    if (potencial > 0.8) badges.push('🏆 Alto Potencial');
    if (data.confianca_performance >= 8) badges.push('💪 Confiante');
    if (data.nivel_competitivo === 'profissional') badges.push('⭐ Profissional');
    if (data.anos_experiencia >= 10) badges.push('🔥 Veterano');
    if (data.dias_treino_semana >= 6) badges.push('🚀 Dedicado');
    badges.push('⚡ Atleta');
    return badges;
  };

  const calculateUserLevel = (data: UserData, score: number): string => {
    if (score >= 90) return 'Elite Athlete';
    if (score >= 75) return 'Avançado';
    if (score >= 60) return 'Intermediário';
    if (score >= 45) return 'Iniciante Plus';
    return 'Iniciante';
  };

  const calculateExperiencePoints = (data: UserData, potencial: number): number => {
    let pontos = 100;
    pontos += data.confianca_performance * 10;
    pontos += potencial * 50;
    pontos += data.anos_experiencia * 5;
    if (data.nivel_competitivo === 'profissional') pontos += 150;
    return Math.round(pontos);
  };

  const generatePerformanceTrainingPlan = (data: UserData) => {
    return {
      tipo_periodizacao: data.nivel_competitivo === 'profissional' ? 'Periodização Complexa' : 'Periodização Linear',
      frequencia: data.dias_treino_semana,
      duracao_sessao: data.tempo_disponivel_sessao,
      fases_treino: [
        { nome: 'Base Aeróbica', duracao: '4-6 semanas', intensidade: '60-70% FCmax' },
        { nome: 'Desenvolvimento', duracao: '6-8 semanas', intensidade: '70-85% FCmax' },
        { nome: 'Pico', duracao: '2-3 semanas', intensidade: '85-95% FCmax' },
        { nome: 'Recuperação', duracao: '1-2 semanas', intensidade: '50-60% FCmax' }
      ],
      exercicios_especificos: [
        'Treinos específicos da modalidade',
        'Trabalho de força funcional',
        'Treino de velocidade/agilidade',
        'Recuperação ativa'
      ]
    };
  };

  const generatePerformanceNutrition = (data: UserData, calorias: number) => {
    const proteina_g = Math.round((calorias * 0.20) / 4); // 20% proteína para atletas
    const carbo_g = Math.round((calorias * 0.55) / 4);    // 55% carboidratos
    const gordura_g = Math.round((calorias * 0.25) / 9);  // 25% gorduras

    return {
      calorias_diarias: calorias,
      macronutrientes: {
        proteina: proteina_g,
        carboidratos: carbo_g,
        gorduras: gordura_g
      },
      hidratacao: '40-50ml por kg de peso corporal',
      timing_nutricional: {
        pre_treino: 'Carboidratos 1-2h antes',
        durante_treino: 'Hidratação + eletrólitos',
        pos_treino: 'Proteína + carboidratos em 30min'
      }
    };
  };

  const generatePeriodizationSchedule = (data: UserData) => {
    return {
      macrociclo: '12 meses',
      mesociclos: [
        { nome: 'Preparação Geral', duracao: '8-12 semanas' },
        { nome: 'Preparação Específica', duracao: '6-8 semanas' },
        { nome: 'Competitivo', duracao: '4-6 semanas' },
        { nome: 'Transição', duracao: '2-4 semanas' }
      ],
      avaliacao_frequencia: 'A cada 4 semanas'
    };
  };

  const generatePerformanceSupplements = (data: UserData) => {
    const suplementos = ['Whey Protein', 'Creatina', 'Multivitamínico', 'Eletrólitos'];
    
    if (data.nivel_competitivo === 'profissional') {
      suplementos.push('Beta-alanina', 'Citrulina', 'Cafeína');
    }
    
    if (data.modalidade_principal.toLowerCase().includes('resistencia') || 
        data.modalidade_principal.toLowerCase().includes('corrida')) {
      suplementos.push('Carboidrato em gel', 'BCAA');
    }
    
    return suplementos;
  };

  const calculatePerformanceImprovement = (data: UserData) => {
    return {
      vo2_max: '+5-15%',
      forca: '+10-25%',
      velocidade: '+3-8%',
      resistencia: '+8-20%',
      agilidade: '+5-12%'
    };
  };

  const generateSpecificGoals = (data: UserData) => {
    return {
      curto_prazo: [
        'Melhorar técnica específica',
        'Aumentar volume de treino',
        'Otimizar recuperação'
      ],
      medio_prazo: [
        'Atingir pico de forma',
        'Competir em nível superior',
        'Reduzir tempo de prova/melhorar marca'
      ],
      longo_prazo: [
        'Manter performance consistente',
        'Prevenir lesões',
        'Longevidade esportiva'
      ]
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
    const calculatedResults = calculatePerformanceMetrics(userData as UserData);
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
                Informações básicas para análise de performance atlética
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
                  <Trophy className="h-6 w-6" />
                </div>
                Modalidade Esportiva
              </CardTitle>
              <CardDescription className="text-white/90">
                Informações sobre sua modalidade e nível competitivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
              <div className="space-y-3">
                <Label htmlFor="modalidade" className="text-gray-700 font-medium">Modalidade Principal *</Label>
                <Input
                  id="modalidade"
                  value={userData.modalidade_principal || ''}
                  onChange={(e) => setUserData({...userData, modalidade_principal: e.target.value})}
                  placeholder="Ex: Futebol, Corrida, Natação, Tênis..."
                  className={`border-2 transition-colors rounded-xl h-14 ${
                    validationErrors.modalidade_principal ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
                {renderValidationError('modalidade_principal')}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="nivel_competitivo" className="text-gray-700 font-medium">Nível Competitivo *</Label>
                <Select onValueChange={(value) => setUserData({...userData, nivel_competitivo: value as any})}>
                  <SelectTrigger className={`border-2 transition-colors rounded-xl h-14 ${
                    validationErrors.nivel_competitivo ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recreativo">Recreativo</SelectItem>
                    <SelectItem value="amador">Amador</SelectItem>
                    <SelectItem value="semi_profissional">Semi-profissional</SelectItem>
                    <SelectItem value="profissional">Profissional</SelectItem>
                  </SelectContent>
                </Select>
                {renderValidationError('nivel_competitivo')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="anos_experiencia" className="text-gray-700 font-medium">Anos de Experiência *</Label>
                  <Input
                    id="anos_experiencia"
                    type="number"
                    step="0.5"
                    value={userData.anos_experiencia || ''}
                    onChange={(e) => setUserData({...userData, anos_experiencia: parseFloat(e.target.value)})}
                    placeholder="2.5"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.anos_experiencia ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('anos_experiencia')}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confianca" className="text-gray-700 font-medium">Confiança na Performance (1-10) *</Label>
                  <Input
                    id="confianca"
                    type="number"
                    min="1"
                    max="10"
                    value={userData.confianca_performance || ''}
                    onChange={(e) => setUserData({...userData, confianca_performance: parseInt(e.target.value)})}
                    placeholder="7"
                    className={`border-2 transition-colors rounded-xl h-14 ${
                      validationErrors.confianca_performance ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                    }`}
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                  {renderValidationError('confianca_performance')}
                </div>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <p className="text-sm" style={{ color: colors.primaryDark }}>
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  1 = Muito inseguro, 10 = Extremamente confiante na sua performance
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="posicao" className="text-gray-700 font-medium">Posição/Função (Opcional)</Label>
                <Input
                  id="posicao"
                  value={userData.posicao_funcao || ''}
                  onChange={(e) => setUserData({...userData, posicao_funcao: e.target.value})}
                  placeholder="Ex: Atacante, Meio-campista, Velocista..."
                  className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
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
                  <Calendar className="h-6 w-6" />
                </div>
                Planejamento de Treino
              </CardTitle>
              <CardDescription className="text-white/90">
                Configure sua rotina de treinos para performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
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
                      <SelectItem value="90">90 minutos</SelectItem>
                      <SelectItem value="120">120 minutos</SelectItem>
                      <SelectItem value="180">180 minutos</SelectItem>
                      <SelectItem value="240">240 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                  {renderValidationError('tempo_disponivel_sessao')}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="objetivo_especifico" className="text-gray-700 font-medium">Objetivo Específico (Opcional)</Label>
                <Select onValueChange={(value) => setUserData({...userData, objetivo_especifico: value as any})}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14">
                    <SelectValue placeholder="Selecione o foco principal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="velocidade">Velocidade</SelectItem>
                    <SelectItem value="resistencia">Resistência</SelectItem>
                    <SelectItem value="forca">Força</SelectItem>
                    <SelectItem value="agilidade">Agilidade</SelectItem>
                    <SelectItem value="coordenacao">Coordenação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <p className="text-sm" style={{ color: colors.primaryDark }}>
                  <Trophy className="inline h-4 w-4 mr-1" />
                  Para atletas profissionais, recomendamos 6-7 dias de treino com sessões de 2-4 horas
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
                Dados de Performance (Opcional)
              </CardTitle>
              <CardDescription className="text-white/90">
                Dados atuais para análise mais precisa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-16">
              <Alert className="border" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
                <Info className="h-4 w-4" style={{ color: colors.primary }} />
                <AlertDescription style={{ color: colors.primaryDark }}>
                  Estes dados são opcionais, mas melhoram significativamente a precisão da análise.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <Label htmlFor="vo2_max" className="text-gray-700 font-medium">VO2 Máximo (ml/kg/min)</Label>
                  <Input
                    id="vo2_max"
                    type="number"
                    step="0.1"
                    value={userData.vo2_max || ''}
                    onChange={(e) => setUserData({...userData, vo2_max: parseFloat(e.target.value)})}
                    placeholder="45.0"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="fc_repouso" className="text-gray-700 font-medium">FC Repouso (bpm)</Label>
                  <Input
                    id="fc_repouso"
                    type="number"
                    value={userData.frequencia_cardiaca_repouso || ''}
                    onChange={(e) => setUserData({...userData, frequencia_cardiaca_repouso: parseInt(e.target.value)})}
                    placeholder="60"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="tempo_5km" className="text-gray-700 font-medium">Tempo 5km (minutos)</Label>
                  <Input
                    id="tempo_5km"
                    type="number"
                    step="0.1"
                    value={userData.tempo_corrida_5km || ''}
                    onChange={(e) => setUserData({...userData, tempo_corrida_5km: parseFloat(e.target.value)})}
                    placeholder="25.0"
                    className="border-2 border-gray-200 focus:border-primary transition-colors rounded-xl h-14"
                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="salto_vertical" className="text-gray-700 font-medium">Salto Vertical (cm)</Label>
                  <Input
                    id="salto_vertical"
                    type="number"
                    value={userData.salto_vertical || ''}
                    onChange={(e) => setUserData({...userData, salto_vertical: parseInt(e.target.value)})}
                    placeholder="45"
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
                  placeholder="Ex: Whey protein, creatina, cafeína..."
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
            <h2 className="text-4xl font-bold text-white">Analisando Performance Atlética</h2>
            <p className="text-xl text-gray-200">Aplicando algoritmos de otimização esportiva...</p>
            
            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Analisando perfil atlético</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-500" style={{ backgroundColor: colors.primaryLight }}></div>
                <p className="text-sm">Calculando potencial de performance</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1000" style={{ backgroundColor: colors.primaryDark }}></div>
                <p className="text-sm">Gerando periodização específica</p>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="w-2 h-2 rounded-full animate-pulse animation-delay-1500" style={{ backgroundColor: colors.primary }}></div>
                <p className="text-sm">Otimizando estratégias de treino</p>
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
              <h1 className="text-4xl font-bold">Análise de Performance Atlética</h1>
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-xl text-gray-300">Otimização científica para atletas de alto rendimento</p>
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
                      <span>Nível do Atleta</span>
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
          <div className="flex flex-wrap gap-12 justify-center pt-8">
            <Button 
              onClick={() => window.print()} 
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Imprimir Análise
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
            <h1 className="text-4xl font-bold">Performance Atlética Inteligente</h1>
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-xl text-gray-200">Algoritmos avançados de otimização esportiva</p>
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
                Analisar Performance
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

export default PerformanceAtletica;

