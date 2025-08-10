import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
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
  BarChart3,
} from "lucide-react";
import {
  GeneticFitnessProfile,
  SuccessPredictionAlgorithm,
  AdaptivePersonalizationEngine,
  HypertrophyAlgorithm,
  AdaptiveNutritionAlgorithm,
} from "../../lib/fitness/advanced_fitness_algorithms.js";
import {
  gerarContextoExplicacao,
  gerarExplicacaoFinal,
} from "../../lib/fitness/explicacao";
import { db } from "../../firebase";
import { useProgressStore } from "../../stores/progressStore";
import { getUserMetrics } from "../../services/user";
import { useAuth } from "../../contexts/AuthContext";
import type { UserData, WeightLossResults } from "@/types/fitness";

const EmagrecimentoAvancado: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<WeightLossResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<{
    paragrafo: string;
    bullets: string[];
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { setWeightLoss, setReportData } = useProgressStore();
  const { user } = useAuth();

  // Carregar dados do perfil ao inicializar
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        const metrics = await getUserMetrics();
        if (metrics) {
          // Pré-preencher dados com base nas métricas do perfil
          const prefilledData: Partial<UserData> = {};

          if (metrics.totalWeight) {
            prefilledData.peso_atual = metrics.totalWeight;
          }

          // Calcular altura estimada a partir do IMC e peso (se disponível)
          if (metrics.bmi && metrics.totalWeight) {
            const estimatedHeight = Math.sqrt(
              (metrics.totalWeight / metrics.bmi) * 10000,
            );
            prefilledData.altura = Math.round(estimatedHeight);
          }

          // Pré-preencher nome do usuário se disponível
          if (user.name) {
            prefilledData.nome = user.name;
          }

          setUserData(prefilledData);
        }
      } catch (error) {
        console.warn("Erro ao carregar dados do perfil:", error);
        // Em caso de erro, apenas pré-preencher o nome se disponível
        if (user?.name) {
          setUserData((prev) => ({ ...prev, nome: user.name }));
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfileData();
  }, [user]);

  const steps = [
    { id: 1, title: "Dados Pessoais", description: "Informações básicas" },
    { id: 2, title: "Objetivos", description: "Metas de emagrecimento" },
    { id: 3, title: "Estilo de Vida", description: "Atividade e preferências" },
    { id: 4, title: "Histórico", description: "Experiências anteriores" },
    { id: 5, title: "Resultados", description: "Seu plano personalizado" },
  ];

  const handleInputChange = (field: keyof UserData, value: any) => {
    // Clear previous error for this field
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Input validation and sanitization
    if (typeof value === "string") {
      value = value.trim();
      if (field === "nome") {
        if (value.length > 50) {
          value = value.slice(0, 50);
        }
        if (value.length < 2 && value.length > 0) {
          setErrors((prev) => ({
            ...prev,
            [field]: "Nome deve ter pelo menos 2 caracteres",
          }));
        }
      }
    }

    if (typeof value === "number") {
      let errorMessage = "";

      if (field === "idade") {
        if (value < 16) errorMessage = "Idade mínima: 16 anos";
        else if (value > 100) errorMessage = "Idade máxima: 100 anos";
      }

      if (field === "altura") {
        if (value < 100) errorMessage = "Altura mínima: 100 cm";
        else if (value > 250) errorMessage = "Altura máxima: 250 cm";
      }

      if (field === "peso_atual" || field === "peso_objetivo") {
        if (value < 30) errorMessage = "Peso mínimo: 30 kg";
        else if (value > 300) errorMessage = "Peso máximo: 300 kg";
      }

      if (field === "prazo") {
        if (value < 4) errorMessage = "Prazo mínimo: 4 semanas";
        else if (value > 104)
          errorMessage = "Prazo máximo: 104 semanas (2 anos)";
      }

      if (field === "confianca_exercicio") {
        if (value < 1 || value > 10)
          errorMessage = "Confiança deve estar entre 1 e 10";
      }

      if (errorMessage) {
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
        return; // Don't update if there's an error
      }
    }

    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResults = async (): Promise<WeightLossResults> => {
    if (
      !userData.nome ||
      !userData.idade ||
      !userData.altura ||
      !userData.peso_atual ||
      !userData.peso_objetivo
    ) {
      throw new Error("Dados obrigatórios não preenchidos");
    }

    const completeUserData: UserData = {
      nome: userData.nome,
      idade: userData.idade,
      sexo: userData.sexo || "masculino",
      altura: userData.altura,
      peso_atual: userData.peso_atual,
      peso_objetivo: userData.peso_objetivo,
      prazo: userData.prazo || 12,
      nivel_atividade: userData.nivel_atividade || "moderado",
      experiencia_exercicio: userData.experiencia_exercicio || "iniciante",
      confianca_exercicio: userData.confianca_exercicio || 5,
      historico_dietas: userData.historico_dietas || "",
      restricoes_alimentares: userData.restricoes_alimentares || "",
      horarios_disponiveis: userData.horarios_disponiveis || [],
      preferencias_exercicio: userData.preferencias_exercicio || [],
    };

    // Adaptar dados para o algoritmo genético (converte PT->EN)
    const adaptedUserData = {
      age: completeUserData.idade,
      sex: completeUserData.sexo,
      height: completeUserData.altura,
      weight: completeUserData.peso_atual,
      activityLevel: completeUserData.nivel_atividade,
      fitnessHistory: [],
    };

    // Criar perfil genético
    const geneticProfile = new GeneticFitnessProfile(adaptedUserData);

    // Calcular probabilidade de sucesso
    const successAlgorithm = new SuccessPredictionAlgorithm();
    const probabilidadeSucesso =
      successAlgorithm.predictWeightLossSuccess(completeUserData);

    // Calcular métricas básicas
    const imc =
      completeUserData.peso_atual / Math.pow(completeUserData.altura / 100, 2);
    const classificacaoImc = getIMCClassification(imc);

    // TMB usando fórmula de Mifflin-St Jeor
    const tmb =
      completeUserData.sexo === "masculino"
        ? 10 * completeUserData.peso_atual +
          6.25 * completeUserData.altura -
          5 * completeUserData.idade +
          5
        : 10 * completeUserData.peso_atual +
          6.25 * completeUserData.altura -
          5 * completeUserData.idade -
          161;

    // Fator de atividade
    const fatoresAtividade = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
    };

    const gastoEnergetico =
      tmb * fatoresAtividade[completeUserData.nivel_atividade];

    // Déficit calórico baseado no objetivo
    const pesoParaPerder =
      completeUserData.peso_atual - completeUserData.peso_objetivo;
    const deficitSemanal = (pesoParaPerder / completeUserData.prazo) * 7700; // 7700 kcal = 1kg
    const deficitDiario = deficitSemanal / 7;

    const caloriasDiarias = Math.max(1200, gastoEnergetico - deficitDiario);
    const perdaSemanal = (deficitDiario * 7) / 7700;
    const tempoEstimado = pesoParaPerder / perdaSemanal;

    // Gerar plano de treino
    const hypertrophyAlgorithm = new HypertrophyAlgorithm(
      geneticProfile.geneticProfile,
      completeUserData.experiencia_exercicio,
    );
    const planoTreino = {
      frequencia_semanal: 4,
      duracao_sessao: 60,
      tipo_principal: "Cardio + Força",
      exercicios: [
        {
          nome: "Caminhada/Corrida",
          series: 1,
          repeticoes: "30-45 min",
          descanso: "-",
          dificuldade: "Moderada",
        },
        {
          nome: "Agachamento",
          series: 3,
          repeticoes: "12-15",
          descanso: "60s",
          dificuldade: "Moderada",
        },
        {
          nome: "Flexão de braço",
          series: 3,
          repeticoes: "8-12",
          descanso: "60s",
          dificuldade: "Moderada",
        },
        {
          nome: "Prancha",
          series: 3,
          repeticoes: "30-60s",
          descanso: "45s",
          dificuldade: "Moderada",
        },
      ],
      intensidade: "Moderada a Alta",
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
        "Mantenha consistência nos treinos",
        "Hidrate-se adequadamente (2-3L/dia)",
        "Durma 7-9 horas por noite",
        "Faça refeições regulares",
      ],
      plano_treino: planoTreino,
      plano_nutricional: {},
      cronograma_adaptativo: {},
      score_motivacional: Math.round(probabilidadeSucesso * 100),
      badges_conquistadas: ["Iniciante Determinado"],
      nivel_usuario: completeUserData.experiencia_exercicio,
      pontos_experiencia: 0,
    };

    return results;
  };

  const getIMCClassification = (imc: number): string => {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade grau I";
    if (imc < 40) return "Obesidade grau II";
    return "Obesidade grau III";
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      setLoading(true);
      try {
        const calculatedResults = await calculateResults();
        setResults(calculatedResults);

        // Gerar explicação
        const contexto = gerarContextoExplicacao(
          calculatedResults,
          userData as UserData,
        );
        const explicacao = await gerarExplicacaoFinal(contexto);
        setExplanation(explicacao);

        // Salvar no store para uso em outras páginas
        setWeightLoss({
          height: userData.altura!,
          currentWeight: userData.peso_atual!,
          targetWeight: userData.peso_objetivo!,
          goalTime: userData.prazo!,
          frequency: 4,
          diet: "balanceada",
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
        console.error("Erro ao calcular resultados:", error);
        alert("Erro ao calcular resultados. Verifique os dados informados.");
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome
                </label>
                <input
                  type="text"
                  value={userData.nome || ""}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:border-transparent ${
                    errors.nome
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 dark:border-slate-600 focus:ring-primary"
                  }`}
                  placeholder="Seu nome completo"
                />
                {errors.nome && (
                  <p className="text-xs text-red-500">{errors.nome}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Idade
                </label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  step="1"
                  value={userData.idade || ""}
                  onChange={(e) =>
                    handleInputChange("idade", Number(e.target.value))
                  }
                  className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:border-transparent ${
                    errors.idade
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 dark:border-slate-600 focus:ring-primary"
                  }`}
                  placeholder="Ex: 25"
                />
                {errors.idade ? (
                  <p className="text-xs text-red-500">{errors.idade}</p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Entre 16 e 100 anos
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sexo
                </label>
                <select
                  value={userData.sexo || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "sexo",
                      e.target.value as "masculino" | "feminino",
                    )
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  step="1"
                  value={userData.altura || ""}
                  onChange={(e) =>
                    handleInputChange("altura", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 175"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Entre 100 e 250 cm
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={userData.peso_atual || ""}
                  onChange={(e) =>
                    handleInputChange("peso_atual", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 70.5"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Entre 30 e 300 kg
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Peso Objetivo (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={userData.peso_objetivo || ""}
                  onChange={(e) =>
                    handleInputChange("peso_objetivo", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 65.0"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Entre 30 e 300 kg
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Prazo (semanas)
                </label>
                <input
                  type="number"
                  min="4"
                  max="104"
                  step="1"
                  value={userData.prazo || ""}
                  onChange={(e) =>
                    handleInputChange("prazo", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 12"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Entre 4 e 104 semanas (2 anos)
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nível de Atividade
                </label>
                <select
                  value={userData.nivel_atividade || ""}
                  onChange={(e) =>
                    handleInputChange("nivel_atividade", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve</option>
                  <option value="moderado">Moderado</option>
                  <option value="intenso">Intenso</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Experiência com Exercícios
                </label>
                <select
                  value={userData.experiencia_exercicio || ""}
                  onChange={(e) =>
                    handleInputChange("experiencia_exercicio", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confiança com Exercícios (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={userData.confianca_exercicio || 5}
                  onChange={(e) =>
                    handleInputChange(
                      "confianca_exercicio",
                      Number(e.target.value),
                    )
                  }
                  className="w-full"
                />
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Histórico de Dietas
                </label>
                <textarea
                  value={userData.historico_dietas || ""}
                  onChange={(e) =>
                    handleInputChange("historico_dietas", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Descreva suas experiências anteriores com dietas..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Restriç��es Alimentares
                </label>
                <textarea
                  value={userData.restricoes_alimentares || ""}
                  onChange={(e) =>
                    handleInputChange("restricoes_alimentares", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
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
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Seu Plano Personalizado
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Baseado em algoritmos científicos avançados
                  </p>
                </div>
              </div>

              {explanation && (
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {explanation.paragrafo}
                  </p>
                </div>
              )}
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {results.imc.toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    IMC Atual
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {results.classificacao_imc}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.calorias_diarias}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Calorias/Dia
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Meta diária
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {results.perda_semanal}kg
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Perda/Semana
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Estimativa
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {(results.probabilidade_sucesso * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Sucesso
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Probabilidade
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plano de Treino */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Activity className="w-5 h-5 text-red-500" />
                  Plano de Treino Personalizado
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {results.plano_treino.frequencia_semanal}x por semana •{" "}
                  {results.plano_treino.duracao_sessao} min por sess��o
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.plano_treino.exercicios.map((exercicio, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {exercicio.nome}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {exercicio.series} séries • {exercicio.repeticoes}{" "}
                          repetições
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
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Recomendações Personalizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {explanation.bullets.map((bullet, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {bullet}
                        </span>
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

  // Mostrar loading enquanto carrega dados do perfil
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Carregando seus dados do perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Emagrecimento Avançado
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Sistema avançado de emagrecimento com algoritmos de IA que se adaptam
          ao seu perfil ��nico
        </p>

        {/* Indicador de dados pré-preenchidos */}
        {(userData.nome || userData.peso_atual || userData.altura) && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✓ Dados do seu perfil foram carregados automaticamente
            </p>
          </div>
        )}
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
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-xs text-center mt-2 max-w-20">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {step.title}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 rounded transition-all ${
                    currentStep > step.id
                      ? "bg-gradient-to-r from-red-500 to-pink-600"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">
            {steps[currentStep - 1]?.title}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {steps[currentStep - 1]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">{renderStep()}</CardContent>

        {/* Navigation */}
        <div className="flex justify-between p-6 border-t border-slate-200 dark:border-slate-700">
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
              "Finalizar"
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
  );
};

export default EmagrecimentoAvancado;
