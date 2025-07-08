import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RotateCcw, 
  TrendingDown, 
  TrendingUp, 
  Brain, 
  Activity, 
  Calendar,
  Zap,
  Heart,
  Scale,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3
} from 'lucide-react';

// Importar algoritmos avançados
import {
  GeneticFitnessProfile,
  SuccessPredictionAlgorithm,
  HypertrophyAlgorithm,
  AdaptivePersonalizationEngine,
  AdaptiveNutritionAlgorithm
} from './lib/advanced_fitness_algorithms';

interface UserData {
  // Dados básicos
  nome: string;
  idade: number;
  sexo: 'masculino' | 'feminino';
  altura: number;
  peso_atual: number;
  
  // Dados específicos para recomposição
  gordura_corporal_atual: number;
  gordura_corporal_objetivo: number;
  massa_muscular_atual?: number;
  massa_muscular_objetivo?: number;
  prazo_meses: number;
  
  // Experiência e preferências
  nivel_experiencia: 'iniciante' | 'intermediario' | 'avancado';
  dias_treino_semana: number;
  preferencia_cardio: 'baixa' | 'moderada' | 'alta';
  local_treino: 'academia' | 'casa' | 'ambos';
  
  // Dados de bioimpedância (essenciais para recomposição)
  massa_gorda: number;
  massa_magra: number;
  massa_muscular: number;
  hidratacao: number;
  
  // Histórico e limitações
  historico_dietas: string;
  restricoes_alimentares: string;
  lesoes_limitacoes: string;
}

interface RecompositionResults {
  // Análise atual
  imc: number;
  classificacao_imc: string;
  percentual_gordura_atual: number;
  classificacao_gordura: string;
  massa_muscular_relativa: number;
  
  // Metas calculadas
  perda_gordura_kg: number;
  ganho_muscular_kg: number;
  peso_final_estimado: number;
  tempo_estimado_meses: number;
  
  // Estratégia personalizada
  estrategia_recomendada: 'deficit_moderado' | 'manutencao_calorica' | 'ciclagem_calorica';
  calorias_treino: number;
  calorias_descanso: number;
  
  // Análise avançada
  perfil_genetico: any;
  probabilidade_sucesso: number;
  dificuldade_recomposicao: 'baixa' | 'moderada' | 'alta';
  
  // Planos detalhados
  plano_treino_hibrido: any;
  plano_nutricional_ciclico: any;
  cronograma_periodizado: any;
  
  // Predições e monitoramento
  marcos_mensais: any[];
  indicadores_progresso: string[];
  fatores_criticos: string[];
  recomendacoes_otimizacao: string[];
}

const RecomposicaoCorporal: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<RecompositionResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // Algoritmos especializados
  const [successPredictor] = useState(new SuccessPredictionAlgorithm());
  const [adaptiveEngine] = useState(new AdaptivePersonalizationEngine());

  const calculateRecompositionMetrics = (data: UserData): RecompositionResults => {
    // 1. Análise da composição corporal atual
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_imc = '';
    if (imc < 18.5) classificacao_imc = 'Abaixo do peso';
    else if (imc < 25) classificacao_imc = 'Peso normal';
    else if (imc < 30) classificacao_imc = 'Sobrepeso';
    else classificacao_imc = 'Obesidade';

    // 2. Análise do percentual de gordura
    const percentual_gordura = (data.massa_gorda / data.peso_atual) * 100;
    
    let classificacao_gordura = '';
    if (data.sexo === 'masculino') {
      if (percentual_gordura < 6) classificacao_gordura = 'Muito baixo';
      else if (percentual_gordura < 14) classificacao_gordura = 'Atlético';
      else if (percentual_gordura < 18) classificacao_gordura = 'Fitness';
      else if (percentual_gordura < 25) classificacao_gordura = 'Aceitável';
      else classificacao_gordura = 'Alto';
    } else {
      if (percentual_gordura < 16) classificacao_gordura = 'Muito baixo';
      else if (percentual_gordura < 21) classificacao_gordura = 'Atlético';
      else if (percentual_gordura < 25) classificacao_gordura = 'Fitness';
      else if (percentual_gordura < 32) classificacao_gordura = 'Aceitável';
      else classificacao_gordura = 'Alto';
    }

    // 3. Massa muscular relativa (kg de músculo por kg de peso corporal)
    const massa_muscular_relativa = (data.massa_muscular / data.peso_atual) * 100;

    // 4. Perfil genético
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: 'intenso'
    });

    // 5. Algoritmo de hipertrofia para componente muscular
    const hypertrophyAlgorithm = new HypertrophyAlgorithm(
      geneticProfile, 
      data.nivel_experiencia
    );

    // 6. Cálculo das metas
    const gordura_objetivo_kg = (data.gordura_corporal_objetivo / 100) * data.peso_atual;
    const perda_gordura_kg = data.massa_gorda - gordura_objetivo_kg;
    
    // Estimativa de ganho muscular baseada na experiência e genética
    let ganho_muscular_base = 0.5; // kg por mês para iniciante
    if (data.nivel_experiencia === 'intermediario') ganho_muscular_base = 0.25;
    else if (data.nivel_experiencia === 'avancado') ganho_muscular_base = 0.1;
    
    // Ajustar baseado no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      ganho_muscular_base *= 1.2;
    }
    
    // Ajustar baseado na recomposição (mais difícil que bulking puro)
    ganho_muscular_base *= 0.7;
    
    const ganho_muscular_kg = ganho_muscular_base * data.prazo_meses;
    const peso_final_estimado = data.peso_atual - perda_gordura_kg + ganho_muscular_kg;

    // 7. Dificuldade da recomposição
    let dificuldade_score = 0;
    
    // Fatores que aumentam dificuldade
    if (data.nivel_experiencia === 'avancado') dificuldade_score += 2;
    if (percentual_gordura < 15 && data.sexo === 'masculino') dificuldade_score += 2;
    if (percentual_gordura < 20 && data.sexo === 'feminino') dificuldade_score += 2;
    if (data.idade > 35) dificuldade_score += 1;
    if (perda_gordura_kg > 10) dificuldade_score += 1;
    
    const dificuldade_recomposicao = dificuldade_score <= 2 ? 'baixa' : 
                                   dificuldade_score <= 4 ? 'moderada' : 'alta';

    // 8. Estratégia calórica personalizada
    let estrategia: 'deficit_moderado' | 'manutencao_calorica' | 'ciclagem_calorica';
    
    if (percentual_gordura > 20 || dificuldade_recomposicao === 'baixa') {
      estrategia = 'deficit_moderado';
    } else if (dificuldade_recomposicao === 'alta' || data.nivel_experiencia === 'avancado') {
      estrategia = 'ciclagem_calorica';
    } else {
      estrategia = 'manutencao_calorica';
    }

    // 9. Cálculo calórico baseado na estratégia
    const tmb = data.sexo === 'masculino' 
      ? (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5
      : (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    
    const gasto_energetico = tmb * 1.6; // Fator para treino intenso
    
    let calorias_treino, calorias_descanso;
    
    switch (estrategia) {
      case 'deficit_moderado':
        calorias_treino = gasto_energetico - 200;
        calorias_descanso = gasto_energetico - 300;
        break;
      case 'manutencao_calorica':
        calorias_treino = gasto_energetico + 100;
        calorias_descanso = gasto_energetico - 100;
        break;
      case 'ciclagem_calorica':
        calorias_treino = gasto_energetico + 200;
        calorias_descanso = gasto_energetico - 400;
        break;
    }

    // 10. Probabilidade de sucesso
    const probabilidade_sucesso = successPredictor.predictWeightLossSuccess({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      activityLevel: 'intenso'
    }, []);
    
    // Ajustar para recomposição (mais difícil)
    const prob_recomposicao = Math.max(0.1, probabilidade_sucesso * 0.7);

    // 11. Tempo estimado (mais conservador para recomposição)
    const tempo_estimado = Math.max(data.prazo_meses, 
      (perda_gordura_kg / 0.3) / 4.33); // 0.3kg gordura por semana máximo

    // 12. Plano de treino híbrido
    const plano_treino = generateHybridTrainingPlan(data, hypertrophyAlgorithm, estrategia);
    
    // 13. Plano nutricional cíclico
    const nutritionAlgorithm = new AdaptiveNutritionAlgorithm(data, 'recomposition');
    const plano_nutricional = generateCyclicalNutrition(data, calorias_treino, calorias_descanso, estrategia);
    
    // 14. Cronograma periodizado
    const cronograma = generatePeriodizedSchedule(data, estrategia);
    
    // 15. Marcos mensais
    const marcos = generateMonthlyMilestones(data, perda_gordura_kg, ganho_muscular_kg);
    
    // 16. Indicadores de progresso
    const indicadores = [
      'Peso corporal (semanal)',
      'Percentual de gordura (quinzenal)',
      'Medidas corporais (semanal)',
      'Fotos de progresso (semanal)',
      'Performance nos treinos',
      'Qualidade do sono',
      'Níveis de energia'
    ];
    
    // 17. Fatores críticos
    const fatores_criticos = [];
    if (dificuldade_recomposicao === 'alta') {
      fatores_criticos.push('Recomposição avançada - progresso mais lento');
    }
    if (percentual_gordura < 15) {
      fatores_criticos.push('Baixo percentual de gordura - risco de perda muscular');
    }
    if (data.idade > 40) {
      fatores_criticos.push('Idade avançada - recuperação mais lenta');
    }
    
    // 18. Recomendações de otimização
    const recomendacoes = [];
    if (estrategia === 'ciclagem_calorica') {
      recomendacoes.push('Monitore rigorosamente a ciclagem calórica');
      recomendacoes.push('Ajuste carboidratos conforme dias de treino');
    }
    if (dificuldade_recomposicao === 'alta') {
      recomendacoes.push('Considere acompanhamento profissional');
      recomendacoes.push('Seja paciente - resultados levam mais tempo');
    }
    recomendacoes.push('Priorize sono de qualidade (8+ horas)');
    recomendacoes.push('Mantenha consistência no treino e dieta');

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_imc,
      percentual_gordura_atual: Math.round(percentual_gordura * 10) / 10,
      classificacao_gordura,
      massa_muscular_relativa: Math.round(massa_muscular_relativa * 10) / 10,
      perda_gordura_kg: Math.round(perda_gordura_kg * 100) / 100,
      ganho_muscular_kg: Math.round(ganho_muscular_kg * 100) / 100,
      peso_final_estimado: Math.round(peso_final_estimado * 100) / 100,
      tempo_estimado_meses: Math.round(tempo_estimado),
      estrategia_recomendada: estrategia,
      calorias_treino: Math.round(calorias_treino),
      calorias_descanso: Math.round(calorias_descanso),
      perfil_genetico: geneticProfile.geneticProfile,
      probabilidade_sucesso: Math.round(prob_recomposicao * 100) / 100,
      dificuldade_recomposicao,
      plano_treino_hibrido: plano_treino,
      plano_nutricional_ciclico: plano_nutricional,
      cronograma_periodizado: cronograma,
      marcos_mensais: marcos,
      indicadores_progresso: indicadores,
      fatores_criticos,
      recomendacoes_otimizacao: recomendacoes
    };
  };

  const generateHybridTrainingPlan = (data: UserData, algorithm: any, estrategia: string) => {
    // Treino híbrido: força + hipertrofia + cardio estratégico
    const base_plan = {
      frequencia_semanal: data.dias_treino_semana,
      divisao: data.dias_treino_semana >= 5 ? 'Push/Pull/Legs + Cardio' : 'Upper/Lower + Cardio',
      cardio_estrategico: true
    };

    // Distribuição baseada na estratégia
    if (estrategia === 'deficit_moderado') {
      base_plan.cardio_frequencia = '4-5x/semana';
      base_plan.cardio_tipo = 'LISS + 2x HIIT';
      base_plan.forca_hipertrofia = '70% Hipertrofia / 30% Força';
    } else if (estrategia === 'ciclagem_calorica') {
      base_plan.cardio_frequencia = '3-4x/semana';
      base_plan.cardio_tipo = 'HIIT nos dias baixo carbo';
      base_plan.forca_hipertrofia = '60% Hipertrofia / 40% Força';
    } else {
      base_plan.cardio_frequencia = '3x/semana';
      base_plan.cardio_tipo = 'LISS pós-treino';
      base_plan.forca_hipertrofia = '80% Hipertrofia / 20% Força';
    }

    return {
      ...base_plan,
      exemplo_semana: {
        segunda: 'Peito + Tríceps + 20min LISS',
        terca: 'Costas + Bíceps + 15min HIIT',
        quarta: 'Pernas + 20min LISS',
        quinta: 'Ombros + Core + 15min HIIT',
        sexta: 'Treino Full Body',
        sabado: '30min Cardio LISS',
        domingo: 'Descanso ativo'
      },
      observacoes: [
        'Priorize exercícios compostos',
        'Mantenha intensidade alta no treino de força',
        'Cardio estratégico conforme estratégia nutricional',
        'Monitore sinais de overtraining'
      ]
    };
  };

  const generateCyclicalNutrition = (data: UserData, cal_treino: number, cal_descanso: number, estrategia: string) => {
    const nutrition_plan = {
      estrategia,
      calorias_treino: cal_treino,
      calorias_descanso: cal_descanso,
      diferenca_calorica: cal_treino - cal_descanso
    };

    // Macros para dias de treino (mais carboidratos)
    const macros_treino = {
      proteina: Math.round((cal_treino * 0.30) / 4), // 30%
      carboidratos: Math.round((cal_treino * 0.40) / 4), // 40%
      gorduras: Math.round((cal_treino * 0.30) / 9) // 30%
    };

    // Macros para dias de descanso (menos carboidratos, mais gorduras)
    const macros_descanso = {
      proteina: Math.round((cal_descanso * 0.35) / 4), // 35%
      carboidratos: Math.round((cal_descanso * 0.25) / 4), // 25%
      gorduras: Math.round((cal_descanso * 0.40) / 9) // 40%
    };

    return {
      ...nutrition_plan,
      macros_treino,
      macros_descanso,
      timing_carboidratos: {
        pre_treino: '30-40g carboidratos 1h antes',
        pos_treino: '40-50g carboidratos + 25-30g proteína',
        noite_treino: 'Reduzir carboidratos após 18h',
        dia_descanso: 'Carboidratos apenas manhã e almoço'
      },
      suplementacao_ciclica: {
        dias_treino: ['Whey + Dextrose pós-treino', 'Creatina', 'Cafeína pré-treino'],
        dias_descanso: ['Caseína antes dormir', 'Ômega 3', 'Multivitamínico']
      },
      hidratacao: '40ml/kg nos dias de treino, 35ml/kg descanso'
    };
  };

  const generatePeriodizedSchedule = (data: UserData, estrategia: string) => {
    return {
      fase_1: {
        duracao: '4-6 semanas',
        foco: 'Adaptação metabólica',
        estrategia_nutricional: estrategia,
        ajustes: 'Estabelecer rotina e monitorar resposta'
      },
      fase_2: {
        duracao: '6-8 semanas',
        foco: 'Recomposição ativa',
        estrategia_nutricional: estrategia,
        ajustes: 'Otimizar baseado no progresso'
      },
      fase_3: {
        duracao: '4-6 semanas',
        foco: 'Refinamento final',
        estrategia_nutricional: 'Ajuste fino baseado em resultados',
        ajustes: 'Personalização máxima'
      },
      deload: {
        frequencia: 'A cada 6-8 semanas',
        duracao: '1 semana',
        modificacoes: 'Reduzir volume treino 50%, manter calorias'
      },
      avaliacoes: {
        composicao_corporal: 'Quinzenal (bioimpedância)',
        fotos_progresso: 'Semanal',
        medidas_corporais: 'Semanal',
        performance_treino: 'Contínuo'
      }
    };
  };

  const generateMonthlyMilestones = (data: UserData, perda_gordura: number, ganho_muscular: number) => {
    const marcos = [];
    const meses = data.prazo_meses;
    
    for (let i = 1; i <= meses; i++) {
      const perda_mes = (perda_gordura / meses) * i;
      const ganho_mes = (ganho_muscular / meses) * i;
      const peso_estimado = data.peso_atual - perda_mes + ganho_mes;
      const gordura_estimada = data.gordura_corporal_atual - ((perda_gordura / data.peso_atual) * 100 * (i / meses));
      
      marcos.push({
        mes: i,
        peso_estimado: Math.round(peso_estimado * 100) / 100,
        gordura_estimada: Math.round(gordura_estimada * 10) / 10,
        perda_gordura_acumulada: Math.round(perda_mes * 100) / 100,
        ganho_muscular_acumulado: Math.round(ganho_mes * 100) / 100,
        marcos_visuais: i <= 2 ? 'Melhora na definição' : 
                       i <= 4 ? 'Mudanças visíveis significativas' : 
                       'Transformação completa'
      });
    }
    
    return marcos;
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const calculatedResults = calculateRecompositionMetrics(userData as UserData);
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
                <Scale className="h-5 w-5" />
                Dados Pessoais e Metas
              </CardTitle>
              <CardDescription>
                Informações básicas e objetivos de recomposição corporal
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
                  <Label htmlFor="prazo">Prazo (meses)</Label>
                  <Input
                    id="prazo"
                    type="number"
                    value={userData.prazo_meses || ''}
                    onChange={(e) => setUserData({...userData, prazo_meses: parseInt(e.target.value)})}
                    placeholder="6"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Composição Corporal Atual
              </CardTitle>
              <CardDescription>
                Dados de bioimpedância (essenciais para recomposição)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Para recomposição corporal, dados precisos de composição são fundamentais. Use uma balança de bioimpedância ou DEXA scan.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="massa_gorda">Massa Gorda (kg)</Label>
                  <Input
                    id="massa_gorda"
                    type="number"
                    step="0.1"
                    value={userData.massa_gorda || ''}
                    onChange={(e) => setUserData({...userData, massa_gorda: parseFloat(e.target.value)})}
                    placeholder="12.5"
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
                    placeholder="63.0"
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
                <div>
                  <Label htmlFor="hidratacao">Hidratação (%)</Label>
                  <Input
                    id="hidratacao"
                    type="number"
                    step="0.1"
                    value={userData.hidratacao || ''}
                    onChange={(e) => setUserData({...userData, hidratacao: parseFloat(e.target.value)})}
                    placeholder="58.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gordura_atual">% Gordura Atual</Label>
                  <Input
                    id="gordura_atual"
                    type="number"
                    step="0.1"
                    value={userData.gordura_corporal_atual || ''}
                    onChange={(e) => setUserData({...userData, gordura_corporal_atual: parseFloat(e.target.value)})}
                    placeholder="16.5"
                  />
                </div>
                <div>
                  <Label htmlFor="gordura_objetivo">% Gordura Objetivo</Label>
                  <Input
                    id="gordura_objetivo"
                    type="number"
                    step="0.1"
                    value={userData.gordura_corporal_objetivo || ''}
                    onChange={(e) => setUserData({...userData, gordura_corporal_objetivo: parseFloat(e.target.value)})}
                    placeholder="12.0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Experiência e Preferências de Treino
              </CardTitle>
              <CardDescription>
                Configure seu perfil de treinamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nivel_experiencia">Nível de Experiência</Label>
                <Select onValueChange={(value) => setUserData({...userData, nivel_experiencia: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante (0-1 ano)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (1-3 anos)</SelectItem>
                    <SelectItem value="avancado">Avançado (3+ anos)</SelectItem>
                  </SelectContent>
                </Select>
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferencia_cardio">Preferência por Cardio</Label>
                  <Select onValueChange={(value) => setUserData({...userData, preferencia_cardio: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa (mínimo necessário)</SelectItem>
                      <SelectItem value="moderada">Moderada (equilibrado)</SelectItem>
                      <SelectItem value="alta">Alta (gosto de cardio)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="local_treino">Local de Treino</Label>
                <Select onValueChange={(value) => setUserData({...userData, local_treino: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academia">Academia completa</SelectItem>
                    <SelectItem value="casa">Casa (equipamentos limitados)</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Histórico e Limitações
              </CardTitle>
              <CardDescription>
                Informações adicionais para personalização máxima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="historico_dietas">Histórico de Dietas</Label>
                <Input
                  id="historico_dietas"
                  value={userData.historico_dietas || ''}
                  onChange={(e) => setUserData({...userData, historico_dietas: e.target.value})}
                  placeholder="Ex: cutting anterior, dietas restritivas..."
                />
              </div>

              <div>
                <Label htmlFor="restricoes">Restrições Alimentares</Label>
                <Input
                  id="restricoes"
                  value={userData.restricoes_alimentares || ''}
                  onChange={(e) => setUserData({...userData, restricoes_alimentares: e.target.value})}
                  placeholder="Ex: vegetariano, intolerâncias..."
                />
              </div>

              <div>
                <Label htmlFor="lesoes">Lesões ou Limitações</Label>
                <Input
                  id="lesoes"
                  value={userData.lesoes_limitacoes || ''}
                  onChange={(e) => setUserData({...userData, lesoes_limitacoes: e.target.value})}
                  placeholder="Ex: lesão no joelho, problemas nas costas..."
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-800">Calculando Recomposição Corporal</h2>
          <p className="text-gray-600">Analisando estratégias avançadas de body recomposition...</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">✓ Analisando composição corporal atual</p>
            <p className="text-sm text-gray-500">✓ Calculando estratégia calórica ótima</p>
            <p className="text-sm text-gray-500">✓ Gerando plano híbrido de treino</p>
            <p className="text-sm text-gray-500">✓ Criando cronograma periodizado</p>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Plano de Recomposição Corporal</h1>
            <p className="text-gray-600">Estratégia científica para perder gordura e ganhar músculo simultaneamente</p>
          </div>

          {/* Análise de Dificuldade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análise de Viabilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Dificuldade</p>
                  <Badge variant={results.dificuldade_recomposicao === 'baixa' ? "default" : 
                                results.dificuldade_recomposicao === 'moderada' ? "secondary" : "destructive"}>
                    {results.dificuldade_recomposicao.charAt(0).toUpperCase() + results.dificuldade_recomposicao.slice(1)}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Probabilidade de Sucesso</p>
                  <p className="text-lg font-bold">{(results.probabilidade_sucesso * 100).toFixed(0)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tempo Estimado</p>
                  <p className="text-lg font-bold">{results.tempo_estimado_meses} meses</p>
                </div>
              </div>
              
              {results.fatores_criticos.length > 0 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fatores Críticos:</strong>
                    <ul className="list-disc list-inside mt-2">
                      {results.fatores_criticos.map((fator, index) => (
                        <li key={index} className="text-sm">{fator}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Composição Corporal Atual vs Objetivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Composição Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>IMC:</span>
                    <span className="font-medium">{results.imc} ({results.classificacao_imc})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>% Gordura:</span>
                    <span className="font-medium">{results.percentual_gordura_atual}% ({results.classificacao_gordura})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>% Massa Muscular:</span>
                    <span className="font-medium">{results.massa_muscular_relativa}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas de Transformação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Perda de Gordura:</span>
                    <Badge variant="destructive">-{results.perda_gordura_kg}kg</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ganho Muscular:</span>
                    <Badge variant="default">+{results.ganho_muscular_kg}kg</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Peso Final:</span>
                    <span className="font-medium">{results.peso_final_estimado}kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estratégia Calórica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Estratégia Nutricional: {results.estrategia_recomendada.replace('_', ' ').toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Calorias por Tipo de Dia</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span>Dias de Treino:</span>
                      <span className="font-bold text-green-700">{results.calorias_treino} kcal</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Dias de Descanso:</span>
                      <span className="font-bold text-blue-700">{results.calorias_descanso} kcal</span>
                    </div>
                    <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                      <span>Diferença:</span>
                      <span className="font-bold text-purple-700">{results.calorias_treino - results.calorias_descanso} kcal</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Macronutrientes</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Dias de Treino:</strong>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        <li>Proteína: {results.plano_nutricional_ciclico.macros_treino.proteina}g (30%)</li>
                        <li>Carboidratos: {results.plano_nutricional_ciclico.macros_treino.carboidratos}g (40%)</li>
                        <li>Gorduras: {results.plano_nutricional_ciclico.macros_treino.gorduras}g (30%)</li>
                      </ul>
                    </div>
                    <div className="text-sm">
                      <strong>Dias de Descanso:</strong>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        <li>Proteína: {results.plano_nutricional_ciclico.macros_descanso.proteina}g (35%)</li>
                        <li>Carboidratos: {results.plano_nutricional_ciclico.macros_descanso.carboidratos}g (25%)</li>
                        <li>Gorduras: {results.plano_nutricional_ciclico.macros_descanso.gorduras}g (40%)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano de Treino Híbrido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Plano de Treino Híbrido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Estrutura Semanal</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Frequência:</strong> {results.plano_treino_hibrido.frequencia_semanal}x/semana</li>
                    <li>• <strong>Divisão:</strong> {results.plano_treino_hibrido.divisao}</li>
                    <li>• <strong>Cardio:</strong> {results.plano_treino_hibrido.cardio_frequencia}</li>
                    <li>• <strong>Tipo Cardio:</strong> {results.plano_treino_hibrido.cardio_tipo}</li>
                    <li>• <strong>Força/Hipertrofia:</strong> {results.plano_treino_hibrido.forca_hipertrofia}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Exemplo de Semana</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(results.plano_treino_hibrido.exemplo_semana).map(([dia, treino]) => (
                      <div key={dia} className="flex justify-between">
                        <span className="capitalize font-medium">{dia}:</span>
                        <span className="text-gray-600">{treino}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timing Nutricional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timing Nutricional Estratégico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Timing de Carboidratos</h4>
                  <div className="space-y-3">
                    {Object.entries(results.plano_nutricional_ciclico.timing_carboidratos).map(([momento, instrucao]) => (
                      <div key={momento} className="border-l-2 border-purple-200 pl-3">
                        <p className="font-medium text-sm capitalize">{momento.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-600">{instrucao}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Suplementação Cíclica</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm text-green-700">Dias de Treino:</p>
                      <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                        {results.plano_nutricional_ciclico.suplementacao_ciclica.dias_treino.map((supl: string, index: number) => (
                          <li key={index}>{supl}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-blue-700">Dias de Descanso:</p>
                      <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                        {results.plano_nutricional_ciclico.suplementacao_ciclica.dias_descanso.map((supl: string, index: number) => (
                          <li key={index}>{supl}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marcos Mensais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Marcos de Progresso Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.marcos_mensais.slice(0, 6).map((marco, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                    <h5 className="font-semibold text-purple-800">Mês {marco.mes}</h5>
                    <div className="space-y-1 text-sm mt-2">
                      <p>Peso: <span className="font-medium">{marco.peso_estimado}kg</span></p>
                      <p>Gordura: <span className="font-medium">{marco.gordura_estimada}%</span></p>
                      <p className="text-xs text-gray-600">{marco.marcos_visuais}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Indicadores de Progresso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Monitoramento e Indicadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Indicadores de Progresso</h4>
                  <div className="space-y-2">
                    {results.indicadores_progresso.map((indicador, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{indicador}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Recomendações de Otimização</h4>
                  <div className="space-y-2">
                    {results.recomendacoes_otimizacao.map((recomendacao, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                        <Info className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{recomendacao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cronograma Periodizado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma Periodizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(results.cronograma_periodizado).filter(([key]) => key.startsWith('fase')).map(([fase, dados]: [string, any]) => (
                  <div key={fase} className="p-4 border rounded-lg">
                    <h5 className="font-semibold capitalize">{fase.replace('_', ' ')}: {dados.duracao}</h5>
                    <p className="text-sm text-gray-600 mt-1">{dados.foco}</p>
                    <p className="text-xs text-gray-500 mt-2">{dados.ajustes}</p>
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Recomposição Corporal Inteligente</h1>
          <p className="text-gray-600">Perca gordura e ganhe músculo simultaneamente com ciência</p>
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
            {step === totalSteps ? 'Calcular Plano' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecomposicaoCorporal;

