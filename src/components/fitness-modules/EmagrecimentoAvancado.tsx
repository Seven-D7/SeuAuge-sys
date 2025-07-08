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
  TrendingDown, 
  Target, 
  Brain, 
  Activity, 
  Calendar,
  Zap,
  Heart,
  Scale,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

// Importar algoritmos avançados
import {
  GeneticFitnessProfile,
  SuccessPredictionAlgorithm,
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
  peso_objetivo: number;
  prazo: number;
  
  // Dados avançados
  nivel_atividade: 'sedentario' | 'leve' | 'moderado' | 'intenso';
  experiencia_exercicio: 'iniciante' | 'intermediario' | 'avancado';
  confianca_exercicio: number; // 1-10
  historico_dietas: string;
  restricoes_alimentares: string;
  horarios_disponiveis: string[];
  preferencias_exercicio: string[];
  
  // Dados de composição corporal (opcionais)
  massa_gorda?: number;
  massa_magra?: number;
  massa_muscular?: number;
  hidratacao?: number;
  gordura_visceral?: number;
}

interface WeightLossResults {
  // Métricas calculadas
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_diarias: number;
  deficit_calorico: number;
  perda_semanal: number;
  tempo_estimado: number;
  
  // Predições avançadas
  probabilidade_sucesso: number;
  perfil_genetico: any;
  fatores_risco: string[];
  recomendacoes_personalizadas: string[];
  
  // Plano personalizado
  plano_treino: any;
  plano_nutricional: any;
  cronograma_adaptativo: any;
}

const EmagrecimentoAvancado: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<WeightLossResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([]);

  // Algoritmos avançados
  const [successPredictor] = useState(new SuccessPredictionAlgorithm());
  const [adaptiveEngine] = useState(new AdaptivePersonalizationEngine());

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Cálculos avançados
  const calculateAdvancedMetrics = (data: UserData): WeightLossResults => {
    // 1. Métricas básicas
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_imc = '';
    if (imc < 18.5) classificacao_imc = 'Abaixo do peso';
    else if (imc < 25) classificacao_imc = 'Peso normal';
    else if (imc < 30) classificacao_imc = 'Sobrepeso';
    else if (imc < 35) classificacao_imc = 'Obesidade grau I';
    else if (imc < 40) classificacao_imc = 'Obesidade grau II';
    else classificacao_imc = 'Obesidade grau III';

    // 2. TMB com fórmula Mifflin-St Jeor (mais precisa)
    let tmb: number;
    if (data.sexo === 'masculino') {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5;
    } else {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    }

    // 3. Gasto energético com fatores de atividade refinados
    const fatores_atividade = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725
    };
    const gasto_energetico = tmb * fatores_atividade[data.nivel_atividade];

    // 4. Perfil genético simulado
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: data.nivel_atividade
    });

    // 5. Predição de sucesso
    const probabilidade_sucesso = successPredictor.predictWeightLossSuccess({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      activityLevel: data.nivel_atividade,
      confidence: data.confianca_exercicio
    }, weeklyProgress);

    // 6. Déficit calórico personalizado baseado em múltiplos fatores
    let deficit_base = 500; // Déficit padrão para 0.5kg/semana
    
    // Ajustar baseado na predição de sucesso
    if (probabilidade_sucesso < 0.5) {
      deficit_base = 300; // Déficit menor para melhor aderência
    } else if (probabilidade_sucesso > 0.8) {
      deficit_base = 600; // Pode tolerar déficit maior
    }
    
    // Ajustar baseado no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'endurance') {
      deficit_base *= 1.1; // Melhor resposta a déficit calórico
    }
    
    // Ajustar baseado na idade
    if (data.idade > 40) {
      deficit_base *= 0.9; // Metabolismo mais lento
    }

    const calorias_diarias = Math.max(1200, gasto_energetico - deficit_base);
    const perda_semanal = deficit_base * 7 / 7700; // kg por semana
    const peso_a_perder = data.peso_atual - data.peso_objetivo;
    const tempo_estimado = peso_a_perder / perda_semanal;

    // 7. Identificar fatores de risco
    const fatores_risco: string[] = [];
    if (probabilidade_sucesso < 0.4) {
      fatores_risco.push('Baixa probabilidade de sucesso inicial');
    }
    if (data.idade > 50) {
      fatores_risco.push('Metabolismo mais lento devido à idade');
    }
    if (imc > 35) {
      fatores_risco.push('Obesidade severa - necessário acompanhamento médico');
    }
    if (deficit_base > 600) {
      fatores_risco.push('Déficit calórico alto - risco de perda muscular');
    }

    // 8. Recomendações personalizadas
    const recomendacoes: string[] = [];
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      recomendacoes.push('Foque em treinos de força para preservar massa muscular');
      recomendacoes.push('Inclua exercícios compostos e funcionais');
    } else {
      recomendacoes.push('Priorize exercícios cardiovasculares de baixa intensidade');
      recomendacoes.push('Aumente gradualmente a duração dos treinos');
    }
    
    if (probabilidade_sucesso < 0.6) {
      recomendacoes.push('Comece com metas pequenas e alcançáveis');
      recomendacoes.push('Considere acompanhamento profissional');
    }
    
    if (data.confianca_exercicio < 5) {
      recomendacoes.push('Inicie com exercícios em casa ou caminhadas');
      recomendacoes.push('Busque atividades que você goste');
    }

    // 9. Plano de treino personalizado
    const plano_treino = generatePersonalizedWorkout(data, geneticProfile);
    
    // 10. Plano nutricional adaptativo
    const nutritionAlgorithm = new AdaptiveNutritionAlgorithm(data, 'weight_loss');
    const plano_nutricional = generateNutritionPlan(data, calorias_diarias, nutritionAlgorithm);

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_imc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gasto_energetico),
      calorias_diarias: Math.round(calorias_diarias),
      deficit_calorico: deficit_base,
      perda_semanal: Math.round(perda_semanal * 100) / 100,
      tempo_estimado: Math.round(tempo_estimado),
      probabilidade_sucesso: Math.round(probabilidade_sucesso * 100) / 100,
      perfil_genetico: geneticProfile.geneticProfile,
      fatores_risco,
      recomendacoes_personalizadas: recomendacoes,
      plano_treino,
      plano_nutricional,
      cronograma_adaptativo: generateAdaptiveSchedule(data)
    };
  };

  const generatePersonalizedWorkout = (data: UserData, geneticProfile: any) => {
    const isBeginnerFriendly = data.experiencia_exercicio === 'iniciante' || data.confianca_exercicio < 5;
    
    const baseWorkout = {
      frequencia_semanal: isBeginnerFriendly ? 3 : 4,
      duracao_sessao: isBeginnerFriendly ? 30 : 45,
      tipo_principal: geneticProfile.geneticProfile.dominantType === 'power' ? 'Força + Cardio' : 'Cardio + Força',
      exercicios: []
    };

    if (geneticProfile.geneticProfile.dominantType === 'power') {
      baseWorkout.exercicios = [
        { nome: 'Agachamento', series: 3, repeticoes: '8-12', descanso: '90s' },
        { nome: 'Flexão de braço', series: 3, repeticoes: '6-10', descanso: '90s' },
        { nome: 'Prancha', series: 3, repeticoes: '30-60s', descanso: '60s' },
        { nome: 'Caminhada rápida', series: 1, repeticoes: '20-30min', descanso: '-' }
      ];
    } else {
      baseWorkout.exercicios = [
        { nome: 'Caminhada/Corrida leve', series: 1, repeticoes: '30-45min', descanso: '-' },
        { nome: 'Agachamento', series: 2, repeticoes: '12-15', descanso: '60s' },
        { nome: 'Flexão adaptada', series: 2, repeticoes: '8-12', descanso: '60s' },
        { nome: 'Alongamento', series: 1, repeticoes: '10min', descanso: '-' }
      ];
    }

    return baseWorkout;
  };

  const generateNutritionPlan = (data: UserData, calorias: number, algorithm: any) => {
    // Distribuição de macronutrientes para emagrecimento
    const proteina_percent = 0.30; // 30% proteína para preservar massa muscular
    const carbo_percent = 0.35;    // 35% carboidratos
    const gordura_percent = 0.35;  // 35% gorduras

    const proteina_g = Math.round((calorias * proteina_percent) / 4);
    const carbo_g = Math.round((calorias * carbo_percent) / 4);
    const gordura_g = Math.round((calorias * gordura_percent) / 9);

    const mealTiming = algorithm.generateMealTiming(['07:00', '18:00']); // Exemplo de horários

    return {
      calorias_diarias: calorias,
      macronutrientes: {
        proteina: proteina_g,
        carboidratos: carbo_g,
        gorduras: gordura_g
      },
      distribuicao_refeicoes: mealTiming.mainMeals,
      dicas_personalizadas: [
        'Priorize proteínas magras em todas as refeições',
        'Consuma carboidratos complexos preferencialmente',
        'Inclua gorduras boas como abacate e oleaginosas',
        'Beba pelo menos 2L de água por dia'
      ]
    };
  };

  const generateAdaptiveSchedule = (data: UserData) => {
    return {
      semana_1_2: 'Adaptação - foque na consistência',
      semana_3_4: 'Intensificação gradual',
      semana_5_8: 'Otimização baseada em resultados',
      avaliacoes: 'A cada 2 semanas',
      ajustes_automaticos: 'Baseados no progresso real'
    };
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const calculatedResults = calculateAdvancedMetrics(userData as UserData);
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
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Informações básicas para cálculos personalizados
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
                    placeholder="70.5"
                  />
                </div>
                <div>
                  <Label htmlFor="peso_objetivo">Peso Objetivo (kg)</Label>
                  <Input
                    id="peso_objetivo"
                    type="number"
                    step="0.1"
                    value={userData.peso_objetivo || ''}
                    onChange={(e) => setUserData({...userData, peso_objetivo: parseFloat(e.target.value)})}
                    placeholder="65.0"
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
                <Activity className="h-5 w-5" />
                Perfil de Atividade
              </CardTitle>
              <CardDescription>
                Informações sobre seu nível atual de atividade física
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nivel_atividade">Nível de Atividade Atual</Label>
                <Select onValueChange={(value) => setUserData({...userData, nivel_atividade: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value="leve">Leve (exercício leve 1-3 dias/semana)</SelectItem>
                    <SelectItem value="moderado">Moderado (exercício moderado 3-5 dias/semana)</SelectItem>
                    <SelectItem value="intenso">Intenso (exercício pesado 6-7 dias/semana)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="experiencia">Experiência com Exercícios</Label>
                <Select onValueChange={(value) => setUserData({...userData, experiencia_exercicio: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante (menos de 6 meses)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (6 meses - 2 anos)</SelectItem>
                    <SelectItem value="avancado">Avançado (mais de 2 anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="confianca">Confiança para Exercitar-se (1-10)</Label>
                <Input
                  id="confianca"
                  type="number"
                  min="1"
                  max="10"
                  value={userData.confianca_exercicio || ''}
                  onChange={(e) => setUserData({...userData, confianca_exercicio: parseInt(e.target.value)})}
                  placeholder="5"
                />
                <p className="text-sm text-gray-500 mt-1">
                  1 = Muito inseguro, 10 = Muito confiante
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos e Prazos
              </CardTitle>
              <CardDescription>
                Defina suas metas e expectativas realistas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prazo">Prazo para Atingir o Objetivo (semanas)</Label>
                <Input
                  id="prazo"
                  type="number"
                  value={userData.prazo || ''}
                  onChange={(e) => setUserData({...userData, prazo: parseInt(e.target.value)})}
                  placeholder="12"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recomendado: 0.5-1kg por semana (perda saudável)
                </p>
              </div>

              <div>
                <Label htmlFor="historico">Histórico de Dietas Anteriores</Label>
                <Textarea
                  id="historico"
                  value={userData.historico_dietas || ''}
                  onChange={(e) => setUserData({...userData, historico_dietas: e.target.value})}
                  placeholder="Descreva brevemente suas experiências anteriores com dietas..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="restricoes">Restrições Alimentares</Label>
                <Textarea
                  id="restricoes"
                  value={userData.restricoes_alimentares || ''}
                  onChange={(e) => setUserData({...userData, restricoes_alimentares: e.target.value})}
                  placeholder="Ex: vegetariano, intolerância à lactose, alergias..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Disponibilidade e Preferências
              </CardTitle>
              <CardDescription>
                Informações para personalizar seu plano de treinos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Horários Disponíveis para Exercícios</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Manhã (6h-9h)', 'Meio-dia (11h-14h)', 'Tarde (14h-18h)', 'Noite (18h-22h)'].map((horario) => (
                    <label key={horario} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const horarios = userData.horarios_disponiveis || [];
                          if (e.target.checked) {
                            setUserData({...userData, horarios_disponiveis: [...horarios, horario]});
                          } else {
                            setUserData({...userData, horarios_disponiveis: horarios.filter(h => h !== horario)});
                          }
                        }}
                      />
                      <span className="text-sm">{horario}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferências de Exercício</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Caminhada', 'Corrida', 'Musculação', 'Natação', 'Dança', 'Yoga', 'Ciclismo', 'Exercícios em casa'].map((exercicio) => (
                    <label key={exercicio} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const preferencias = userData.preferencias_exercicio || [];
                          if (e.target.checked) {
                            setUserData({...userData, preferencias_exercicio: [...preferencias, exercicio]});
                          } else {
                            setUserData({...userData, preferencias_exercicio: preferencias.filter(p => p !== exercicio)});
                          }
                        }}
                      />
                      <span className="text-sm">{exercicio}</span>
                    </label>
                  ))}
                </div>
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
                Dados de Composição Corporal (Opcional)
              </CardTitle>
              <CardDescription>
                Se você tem dados de bioimpedância, inclua aqui para maior precisão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Estes dados são opcionais, mas melhoram significativamente a precisão dos cálculos.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="massa_gorda">Massa Gorda (%)</Label>
                  <Input
                    id="massa_gorda"
                    type="number"
                    step="0.1"
                    value={userData.massa_gorda || ''}
                    onChange={(e) => setUserData({...userData, massa_gorda: parseFloat(e.target.value)})}
                    placeholder="15.5"
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
                    placeholder="55.2"
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
                    placeholder="45.8"
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
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-800">Processando Análise Avançada</h2>
          <p className="text-gray-600">Aplicando algoritmos de machine learning...</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">✓ Calculando perfil genético simulado</p>
            <p className="text-sm text-gray-500">✓ Analisando fatores preditivos</p>
            <p className="text-sm text-gray-500">✓ Gerando plano personalizado</p>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Análise Avançada de Emagrecimento</h1>
            <p className="text-gray-600">Plano personalizado baseado em algoritmos científicos</p>
          </div>

          {/* Probabilidade de Sucesso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Predição de Sucesso (IA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span>Probabilidade de Sucesso</span>
                    <span className="font-bold">{(results.probabilidade_sucesso * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={results.probabilidade_sucesso * 100} className="h-3" />
                </div>
                <Badge variant={results.probabilidade_sucesso > 0.7 ? "default" : results.probabilidade_sucesso > 0.4 ? "secondary" : "destructive"}>
                  {results.probabilidade_sucesso > 0.7 ? "Alta" : results.probabilidade_sucesso > 0.4 ? "Moderada" : "Baixa"}
                </Badge>
              </div>
              
              {results.fatores_risco.length > 0 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fatores de Atenção:</strong>
                    <ul className="list-disc list-inside mt-2">
                      {results.fatores_risco.map((fator, index) => (
                        <li key={index} className="text-sm">{fator}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">IMC</span>
                </div>
                <p className="text-2xl font-bold">{results.imc}</p>
                <p className="text-sm text-gray-600">{results.classificacao_imc}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">TMB</span>
                </div>
                <p className="text-2xl font-bold">{results.tmb}</p>
                <p className="text-sm text-gray-600">kcal/dia</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Meta Calórica</span>
                </div>
                <p className="text-2xl font-bold">{results.calorias_diarias}</p>
                <p className="text-sm text-gray-600">kcal/dia</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Perda Semanal</span>
                </div>
                <p className="text-2xl font-bold">{results.perda_semanal}kg</p>
                <p className="text-sm text-gray-600">{results.tempo_estimado} semanas</p>
              </CardContent>
            </Card>
          </div>

          {/* Perfil Genético */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Perfil Genético Simulado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tipo Dominante</p>
                  <Badge variant="outline" className="mt-1">
                    {results.perfil_genetico.dominantType === 'power' ? 'Força/Potência' : 'Resistência'}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Score Potência</p>
                  <p className="text-lg font-bold">{results.perfil_genetico.powerScore}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Score Resistência</p>
                  <p className="text-lg font-bold">{results.perfil_genetico.enduranceScore}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano de Treino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Plano de Treino Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Estrutura Semanal</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Frequência: {results.plano_treino.frequencia_semanal}x por semana</li>
                    <li>• Duração: {results.plano_treino.duracao_sessao} minutos</li>
                    <li>• Foco: {results.plano_treino.tipo_principal}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Exercícios Principais</h4>
                  <div className="space-y-2">
                    {results.plano_treino.exercicios.map((exercicio: any, index: number) => (
                      <div key={index} className="text-sm border-l-2 border-blue-200 pl-2">
                        <span className="font-medium">{exercicio.nome}</span>
                        <span className="text-gray-600 ml-2">
                          {exercicio.series}x{exercicio.repeticoes}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano Nutricional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Plano Nutricional Adaptativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Macronutrientes Diários</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Proteínas:</span>
                      <span className="font-medium">{results.plano_nutricional.macronutrientes.proteina}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carboidratos:</span>
                      <span className="font-medium">{results.plano_nutricional.macronutrientes.carboidratos}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gorduras:</span>
                      <span className="font-medium">{results.plano_nutricional.macronutrientes.gorduras}g</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dicas Personalizadas</h4>
                  <ul className="space-y-1 text-sm">
                    {results.plano_nutricional.dicas_personalizadas.map((dica: string, index: number) => (
                      <li key={index}>• {dica}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendações Personalizadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recomendações Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recomendacoes_personalizadas.map((recomendacao, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recomendacao}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cronograma Adaptativo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma Adaptativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Semanas 1-2:</span>
                  <span className="text-sm">{results.cronograma_adaptativo.semana_1_2}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Semanas 3-4:</span>
                  <span className="text-sm">{results.cronograma_adaptativo.semana_3_4}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Semanas 5-8:</span>
                  <span className="text-sm">{results.cronograma_adaptativo.semana_5_8}</span>
                </div>
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Emagrecimento Inteligente</h1>
          <p className="text-gray-600">Análise avançada com algoritmos de machine learning</p>
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

export default EmagrecimentoAvancado;

