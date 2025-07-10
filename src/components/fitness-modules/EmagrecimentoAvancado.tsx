import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  TrendingDown, 
  Target, 
  Brain, 
  Activity, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Flame,
  Heart,
  Zap,
  Trophy,
  Calendar,
  BarChart3
} from 'lucide-react';
import { 
  GeneticFitnessProfile,
  SuccessPredictionAlgorithm,
  AdaptivePersonalizationEngine,
  HypertrophyAlgorithm,
  AdaptiveNutritionAlgorithm
} from '../../lib/fitness/advanced_fitness_algorithms.js';
import {
  gerarContextoExplicacao,
  gerarExplicacaoFinal,
} from '../../lib/fitness/explicacao';
import { db } from '@/lib/firebase';
import { useProgressStore } from '../../stores/progressStore';
import type { UserData, WeightLossResults } from '@/types/fitness';

const EmagrecimentoAvancado: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<WeightLossResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<{ paragrafo: string; bullets: string[] } | null>(null);
  const { setWeightLoss, setReportData } = useProgressStore();

  const steps = [
    { id: 1, title: 'Dados Pessoais', description: 'Informações básicas' },
    { id: 2, title: 'Objetivos', description: 'Metas de emagrecimento' },
    { id: 3, title: 'Estilo de Vida', description: 'Atividade e preferências' },
    { id: 4, title: 'Histórico', description: 'Experiências anteriores' },
    { id: 5, title: 'Resultados', description: 'Seu plano personalizado' },
  ];

  const handleInputChange = (field: keyof UserData, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const calculateResults = async (): Promise<WeightLossResults> => {
    if (!userData.nome || !userData.idade || !userData.altura || !userData.peso_atual || !userData.peso_objetivo) {
      throw new Error('Dados obrigatórios não preenchidos');
    }

    const completeUserData: UserData = {
      nome: userData.nome,
      idade: userData.idade,
      sexo: userData.sexo || 'masculino',
      altura: userData.altura,
      peso_atual: userData.peso_atual,
      peso_objetivo: userData.peso_objetivo,
      prazo: userData.prazo || 12,
      nivel_atividade: userData.nivel_atividade || 'moderado',
      experiencia_exercicio: userData.experiencia_exercicio || 'iniciante',
      confianca_exercicio: userData.confianca_exercicio || 5,
      historico_dietas: userData.historico_dietas || '',
      restricoes_alimentares: userData.restricoes_alimentares || '',
      horarios_disponiveis: userData.horarios_disponiveis || [],
      preferencias_exercicio: userData.preferencias_exercicio || [],
    };

    // Criar perfil genético
    const geneticProfile = new GeneticFitnessProfile(completeUserData);
    
    // Calcular probabilidade de sucesso
    const successAlgorithm = new SuccessPredictionAlgorithm();
    const probabilidadeSucesso = successAlgorithm.predictWeightLossSuccess(completeUserData);

    // Calcular métricas básicas
    const imc = completeUserData.peso_atual / Math.pow(completeUserData.altura / 100, 2);
    const classificacaoImc = getIMCClassification(imc);
    
    // TMB usando fórmula de Mifflin-St Jeor
    const tmb = completeUserData.sexo === 'masculino'
      ? 10 * completeUserData.peso_atual + 6.25 * completeUserData.altura - 5 * completeUserData.idade + 5
      : 10 * completeUserData.peso_atual + 6.25 * completeUserData.altura - 5 * completeUserData.idade - 161;

    // Fator de atividade
    const fatoresAtividade = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725
    };
    
    const gastoEnergetico = tmb * fatoresAtividade[completeUserData.nivel_atividade];
    
    // Déficit calórico baseado no objetivo
    const pesoParaPerder = completeUserData.peso_atual - completeUserData.peso_objetivo;
    const deficitSemanal = (pesoParaPerder / completeUserData.prazo) * 7700; // 7700 kcal = 1kg
    const deficitDiario = deficitSemanal / 7;
    
    const caloriasDiarias = Math.max(1200, gastoEnergetico - deficitDiario);
    const perdaSemanal = deficitDiario * 7 / 7700;
    const tempoEstimado = pesoParaPerder / perdaSemanal;

    // Gerar plano de treino
    const hypertrophyAlgorithm = new HypertrophyAlgorithm(geneticProfile.geneticProfile, completeUserData.experiencia_exercicio);
    const planoTreino = {
      frequencia_semanal: 4,
      duracao_sessao: 60,
      tipo_principal: 'Cardio + Força',
      exercicios: [
        { nome: 'Caminhada/Corrida', series: 1, repeticoes: '30-45 min', descanso: '-', dificuldade: 'Moderada' },
        { nome: 'Agachamento', series: 3, repeticoes: '12-15', descanso: '60s', dificuldade: 'Moderada' },
        { nome: 'Flexão de braço', series: 3, repeticoes: '8-12', descanso: '60s', dificuldade: 'Moderada' },
        { nome: 'Prancha', series: 3, repeticoes: '30-60s', descanso: '45s', dificuldade: 'Moderada' },
      ],
      intensidade: 'Moderada a Alta'
    };

    const results: WeightLossResults = {
      imc,
      classificacao_imc: classificacaoImc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gastoEnergetico),
      calorias_diarias: Math.round(caloriasDiarias),
      deficit_calorico: Math.round(deficitDiario),
      perda_semanal: Number(perdaSemanal.toFixed(2)),
      tempo_estimado: Math.round(tempoEstimado),
      probabilidade_sucesso: Number(probabilidadeSucesso.toFixed(2)),
      perfil_genetico: geneticProfile.geneticProfile,
      fatores_risco: [],
      recomendacoes_personalizadas: [
        'Mantenha consistência nos treinos',
        'Hidrate-se adequadamente (2-3L/dia)',
        'Durma 7-9 horas por noite',
        'Faça refeições regulares'
      ],
      plano_treino: planoTreino,
      plano_nutricional: {},
      cronograma_adaptativo: {},
      score_motivacional: Math.round(probabilidadeSucesso * 100),
      badges_conquistadas: ['Iniciante Determinado'],
      nivel_usuario: completeUserData.experiencia_exercicio,
      pontos_experiencia: 0
    };

    return results;
  };

  const getIMCClassification = (imc: number): string => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade grau I';
    if (imc < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      setLoading(true);
      try {
        const calculatedResults = await calculateResults();
        setResults(calculatedResults);
        
        // Gerar explicação
        const contexto = gerarContextoExplicacao(calculatedResults, userData as UserData);
        const explicacao = await gerarExplicacaoFinal(contexto);
        setExplanation(explicacao);
        
        // Salvar no store para uso em outras páginas
        setWeightLoss({
          height: userData.altura!,
          currentWeight: userData.peso_atual!,
          targetWeight: userData.peso_objetivo!,
          goalTime: userData.prazo!,
          frequency: 4,
          diet: 'balanceada',
          imc: calculatedResults.imc,
          idealWeight: userData.peso_objetivo!,
          dailyDeficit: calculatedResults.deficit_calorico,
          classificacaoImc: calculatedResults.classificacao_imc,
          tmb: calculatedResults.tmb,
          gastoEnergetico: calculatedResults.gasto_energetico,
          caloriasDiarias: calculatedResults.calorias_diarias,
          perdaSemanal: calculatedResults.perda_semanal,
          tempoEstimado: calculatedResults.tempo_estimado,
        });
        
        setReportData(calculatedResults);
        setCurrentStep(5);
      } catch (error) {
        console.error('Erro ao calcular resultados:', error);
        alert('Erro ao calcular resultados. Verifique os dados informados.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={userData.nome || ''}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Idade</label>
                <input
                  type="number"
                  value={userData.idade || ''}
                  onChange={(e) => handleInputChange('idade', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Sua idade"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sexo</label>
                <select
                  value={userData.sexo || ''}
                  onChange={(e) => handleInputChange('sexo', e.target.value as 'masculino' | 'feminino')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                <input
                  type="number"
                  value={userData.altura || ''}
                  onChange={(e) => handleInputChange('altura', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Sua altura em centímetros"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Peso Atual (kg)</label>
                <input
                  type="number"
                  value={userData.peso_atual || ''}
                  onChange={(e) => handleInputChange('peso_atual', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Seu peso atual"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Peso Objetivo (kg)</label>
                <input
                  type="number"
                  value={userData.peso_objetivo || ''}
                  onChange={(e) => handleInputChange('peso_objetivo', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Seu peso objetivo"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prazo (semanas)</label>
                <input
                  type="number"
                  value={userData.prazo || ''}
                  onChange={(e) => handleInputChange('prazo', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Prazo em semanas"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nível de Atividade</label>
                <select
                  value={userData.nivel_atividade || ''}
                  onChange={(e) => handleInputChange('nivel_atividade', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve</option>
                  <option value="moderado">Moderado</option>
                  <option value="intenso">Intenso</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Experiência com Exercícios</label>
                <select
                  value={userData.experiencia_exercicio || ''}
                  onChange={(e) => handleInputChange('experiencia_exercicio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confiança com Exercícios (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={userData.confianca_exercicio || 5}
                  onChange={(e) => handleInputChange('confianca_exercicio', Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {userData.confianca_exercicio || 5}/10
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Histórico de Dietas</label>
                <textarea
                  value={userData.historico_dietas || ''}
                  onChange={(e) => handleInputChange('historico_dietas', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva suas experiências anteriores com dietas..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Restrições Alimentares</label>
                <textarea
                  value={userData.restricoes_alimentares || ''}
                  onChange={(e) => handleInputChange('restricoes_alimentares', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Alergias, intolerâncias, preferências alimentares..."
                />
              </div>
            </div>
          </div>
        );

      case 5:
        if (!results) return <div>Carregando resultados...</div>;
        
        return (
          <div className="space-y-8">
            {/* Resumo dos Resultados */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Seu Plano Personalizado</h3>
                  <p className="text-gray-600">Baseado em algoritmos científicos avançados</p>
                </div>
              </div>
              
              {explanation && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{explanation.paragrafo}</p>
                </div>
              )}
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{results.imc.toFixed(1)}</div>
                  <div className="text-sm text-blue-600">IMC Atual</div>
                  <div className="text-xs text-gray-600 mt-1">{results.classificacao_imc}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-700">{results.calorias_diarias}</div>
                  <div className="text-sm text-green-600">Calorias/Dia</div>
                  <div className="text-xs text-gray-600 mt-1">Meta diária</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{results.perda_semanal}kg</div>
                  <div className="text-sm text-purple-600">Perda/Semana</div>
                  <div className="text-xs text-gray-600 mt-1">Estimativa</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-orange-700">{(results.probabilidade_sucesso * 100).toFixed(0)}%</div>
                  <div className="text-sm text-orange-600">Sucesso</div>
                  <div className="text-xs text-gray-600 mt-1">Probabilidade</div>
                </CardContent>
              </Card>
            </div>

            {/* Plano de Treino */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Plano de Treino Personalizado
                </CardTitle>
                <CardDescription>
                  {results.plano_treino.frequencia_semanal}x por semana • {results.plano_treino.duracao_sessao} min por sessão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.plano_treino.exercicios.map((exercicio, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{exercicio.nome}</div>
                        <div className="text-sm text-gray-600">
                          {exercicio.series} séries • {exercicio.repeticoes} repetições
                        </div>
                      </div>
                      <Badge variant="outline">{exercicio.dificuldade}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recomendações */}
            {explanation && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Recomendações Personalizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {explanation.bullets.map((bullet, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Emagrecimento Inteligente
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistema avançado de emagrecimento com algoritmos de IA que se adaptam ao seu perfil único
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="text-xs text-center mt-2 max-w-20">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 rounded transition-all ${
                      currentStep > step.id ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {renderStep()}
          </CardContent>
          
          {/* Navigation */}
          <div className="flex justify-between p-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              Anterior
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Calculando...
                </>
              ) : currentStep === 5 ? (
                'Finalizar'
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmagrecimentoAvancado;