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
  RotateCcw,
  Scale,
  Target,
  Brain,
  Activity,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Heart,
  Zap,
  Trophy,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Flame,
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
import { useReportsStore, generateReportSummary } from "../../stores/reportsStore";
import { getUserMetrics } from "../../services/user";
import { useAuth } from "../../contexts/AuthContext";
import type { UserData } from "@/types/fitness";

interface RecompUserData {
  nome: string;
  idade: number;
  sexo: "masculino" | "feminino";
  altura: number;
  peso_atual: number;
  percentual_gordura_atual: number;
  percentual_gordura_objetivo: number;
  peso_objetivo: number;
  prazo: number;
  nivel_atividade: "sedentario" | "leve" | "moderado" | "intenso";
  experiencia_exercicio: "iniciante" | "intermediario" | "avancado";
  confianca_exercicio: number;
  historico_dietas: string;
  restricoes_alimentares: string;
  horarios_disponiveis: string[];
  preferencias_exercicio: string[];
  estrategia: "agressiva" | "moderada" | "conservadora";
  objetivo_prioridade: "perda_gordura" | "ganho_musculo" | "equilibrado";
}

interface RecompResults {
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_diarias: number;
  deficit_surplus_calorico: number;
  perda_gordura_semanal: number;
  ganho_musculo_semanal: number;
  tempo_estimado: number;
  probabilidade_sucesso: number;
  perfil_genetico: any;
  fatores_risco: string[];
  recomendacoes_personalizadas: string[];
  massa_magra_atual: number;
  massa_magra_objetivo: number;
  massa_gorda_atual: number;
  massa_gorda_objetivo: number;
  plano_treino: {
    frequencia_semanal: number;
    duracao_sessao: number;
    tipo_principal: string;
    exercicios: Array<{
      nome: string;
      series: number;
      repeticoes: string;
      descanso: string;
      dificuldade: string;
      tipo: string;
    }>;
    intensidade: string;
    ciclagem: string;
  };
  plano_nutricional: {
    proteinas_g: number;
    carboidratos_g: number;
    gorduras_g: number;
    ciclagem_calorica: Array<{
      dia: string;
      calorias: number;
      tipo: string;
    }>;
  };
  cronograma_adaptativo: any;
  score_motivacional: number;
  badges_conquistadas: string[];
  nivel_usuario: string;
  pontos_experiencia: number;
}

const RecomposicaoCorporal: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<RecompUserData>>({});
  const [results, setResults] = useState<RecompResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<{
    paragrafo: string;
    bullets: string[];
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { setWeightLoss, setReportData } = useProgressStore();
  const { addReport } = useReportsStore();
  const { user } = useAuth();

  // Carregar dados do perfil ao inicializar
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        const metrics = await getUserMetrics();
        if (metrics) {
          const prefilledData: Partial<RecompUserData> = {};

          if (metrics.totalWeight) {
            prefilledData.peso_atual = metrics.totalWeight;
          }

          if (metrics.bmi && metrics.totalWeight) {
            const estimatedHeight = Math.sqrt(
              (metrics.totalWeight / metrics.bmi) * 10000,
            );
            prefilledData.altura = Math.round(estimatedHeight);
          }

          if (user.name) {
            prefilledData.nome = user.name;
          }

          setUserData(prefilledData);
        }
      } catch (error) {
        console.warn("Erro ao carregar dados do perfil:", error);
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
    { id: 2, title: "Composição", description: "Gordura corporal e objetivos" },
    { id: 3, title: "Estilo de Vida", description: "Atividade e estratégia" },
    { id: 4, title: "Histórico", description: "Experiências anteriores" },
    { id: 5, title: "Resultados", description: "Seu plano personalizado" },
  ];

  const handleInputChange = (field: keyof RecompUserData, value: any) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));

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

      if (field === "percentual_gordura_atual" || field === "percentual_gordura_objetivo") {
        if (value < 5) errorMessage = "Percentual mínimo: 5%";
        else if (value > 50) errorMessage = "Percentual máximo: 50%";
      }

      if (field === "prazo") {
        if (value < 8) errorMessage = "Prazo mínimo: 8 semanas";
        else if (value > 104)
          errorMessage = "Prazo máximo: 104 semanas (2 anos)";
      }

      if (field === "confianca_exercicio") {
        if (value < 1 || value > 10)
          errorMessage = "Confiança deve estar entre 1 e 10";
      }

      if (errorMessage) {
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
        return;
      }
    }

    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResults = async (): Promise<RecompResults> => {
    if (
      !userData.nome ||
      !userData.idade ||
      !userData.altura ||
      !userData.peso_atual ||
      !userData.percentual_gordura_atual ||
      !userData.percentual_gordura_objetivo
    ) {
      throw new Error("Dados obrigatórios não preenchidos");
    }

    const completeUserData: RecompUserData = {
      nome: userData.nome,
      idade: userData.idade,
      sexo: userData.sexo || "masculino",
      altura: userData.altura,
      peso_atual: userData.peso_atual,
      percentual_gordura_atual: userData.percentual_gordura_atual,
      percentual_gordura_objetivo: userData.percentual_gordura_objetivo,
      peso_objetivo: userData.peso_objetivo || userData.peso_atual,
      prazo: userData.prazo || 16,
      nivel_atividade: userData.nivel_atividade || "moderado",
      experiencia_exercicio: userData.experiencia_exercicio || "iniciante",
      confianca_exercicio: userData.confianca_exercicio || 5,
      historico_dietas: userData.historico_dietas || "",
      restricoes_alimentares: userData.restricoes_alimentares || "",
      horarios_disponiveis: userData.horarios_disponiveis || [],
      preferencias_exercicio: userData.preferencias_exercicio || [],
      estrategia: userData.estrategia || "moderada",
      objetivo_prioridade: userData.objetivo_prioridade || "equilibrado",
    };

    // Calcular composição corporal atual
    const massaGordaAtual = (completeUserData.peso_atual * completeUserData.percentual_gordura_atual) / 100;
    const massaMagraAtual = completeUserData.peso_atual - massaGordaAtual;

    // Calcular composição corporal objetivo
    const massaGordaObjetivo = (completeUserData.peso_objetivo * completeUserData.percentual_gordura_objetivo) / 100;
    const massaMagraObjetivo = completeUserData.peso_objetivo - massaGordaObjetivo;

    // Adaptar dados para o algoritmo genético
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

    // Calcular probabilidade de sucesso para recomposição
    const successAlgorithm = new SuccessPredictionAlgorithm();
    const probabilidadeSucesso = 0.65 + (completeUserData.confianca_exercicio / 10) * 0.25;

    // Calcular métricas básicas
    const imc = completeUserData.peso_atual / Math.pow(completeUserData.altura / 100, 2);
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

    const gastoEnergetico = tmb * fatoresAtividade[completeUserData.nivel_atividade];

    // Estratégia de recomposição corporal
    const multiplicadorEstrategia = {
      conservadora: 0.15, // 15% déficit/superávit
      moderada: 0.20,     // 20% déficit/superávit
      agressiva: 0.25,    // 25% déficit/superávit
    };

    // Cálculo baseado na prioridade
    let deficitSurplus = 0;
    if (completeUserData.objetivo_prioridade === "perda_gordura") {
      deficitSurplus = -gastoEnergetico * multiplicadorEstrategia[completeUserData.estrategia];
    } else if (completeUserData.objetivo_prioridade === "ganho_musculo") {
      deficitSurplus = gastoEnergetico * multiplicadorEstrategia[completeUserData.estrategia] * 0.5;
    } else {
      // Equilibrado - ciclagem calórica
      deficitSurplus = 0; // Média será zero com ciclagem
    }

    const caloriasDiarias = gastoEnergetico + deficitSurplus;

    // Estimativas de perda de gordura e ganho de músculo
    const gorduraParaPerder = massaGordaAtual - massaGordaObjetivo;
    const musculoParaGanhar = massaMagraObjetivo - massaMagraAtual;

    const perdaGorduraSemanal = Math.abs(deficitSurplus * 7) / 7700; // 7700 kcal = 1kg gordura
    const ganhoMusculoSemanal = 0.1; // Estimativa conservadora para recomposição

    const tempoEstimado = Math.max(
      gorduraParaPerder / perdaGorduraSemanal,
      musculoParaGanhar / ganhoMusculoSemanal
    );

    // Gerar plano de treino híbrido
    const exerciciosRecomp = [
      {
        nome: "Agachamento",
        series: 4,
        repeticoes: "6-8",
        descanso: "2-3min",
        dificuldade: "Alta",
        tipo: "Força",
      },
      {
        nome: "Supino",
        series: 4,
        repeticoes: "6-8",
        descanso: "2-3min",
        dificuldade: "Alta",
        tipo: "Força",
      },
      {
        nome: "Puxada",
        series: 4,
        repeticoes: "8-10",
        descanso: "90s",
        dificuldade: "Alta",
        tipo: "Força",
      },
      {
        nome: "HIIT Bike",
        series: 1,
        repeticoes: "15min",
        descanso: "-",
        dificuldade: "Alta",
        tipo: "Cardio",
      },
      {
        nome: "Plancha",
        series: 3,
        repeticoes: "45-60s",
        descanso: "60s",
        dificuldade: "Moderada",
        tipo: "Core",
      },
      {
        nome: "Burpees",
        series: 3,
        repeticoes: "10-15",
        descanso: "90s",
        dificuldade: "Alta",
        tipo: "Funcional",
      },
    ];

    const planoTreino = {
      frequencia_semanal: 5,
      duracao_sessao: 60,
      tipo_principal: "Híbrido: Força + Cardio",
      exercicios: exerciciosRecomp,
      intensidade: "Alta",
      ciclagem: "Força (3x) + Cardio (2x) por semana",
    };

    // Calcular macronutrientes com ciclagem
    const proteinasG = completeUserData.peso_atual * 2.5; // Alta proteína para recomposição
    const gorduraG = (caloriasDiarias * 0.25) / 9; // 25% das calorias
    const carboidratosG = (caloriasDiarias - (proteinasG * 4) - (gorduraG * 9)) / 4;

    // Ciclagem calórica
    const ciclagemCalorica = [
      { dia: "Segunda", calorias: Math.round(caloriasDiarias * 1.1), tipo: "Alto" },
      { dia: "Terça", calorias: Math.round(caloriasDiarias * 0.9), tipo: "Baixo" },
      { dia: "Quarta", calorias: Math.round(caloriasDiarias * 1.1), tipo: "Alto" },
      { dia: "Quinta", calorias: Math.round(caloriasDiarias * 0.9), tipo: "Baixo" },
      { dia: "Sexta", calorias: Math.round(caloriasDiarias * 1.1), tipo: "Alto" },
      { dia: "Sábado", calorias: Math.round(caloriasDiarias), tipo: "Moderado" },
      { dia: "Domingo", calorias: Math.round(caloriasDiarias), tipo: "Moderado" },
    ];

    const planoNutricional = {
      proteinas_g: Math.round(proteinasG),
      carboidratos_g: Math.round(carboidratosG),
      gorduras_g: Math.round(gorduraG),
      ciclagem_calorica: ciclagemCalorica,
    };

    const results: RecompResults = {
      imc,
      classificacao_imc: classificacaoImc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gastoEnergetico),
      calorias_diarias: Math.round(caloriasDiarias),
      deficit_surplus_calorico: Math.round(deficitSurplus),
      perda_gordura_semanal: Number(perdaGorduraSemanal.toFixed(2)),
      ganho_musculo_semanal: Number(ganhoMusculoSemanal.toFixed(2)),
      tempo_estimado: Math.round(tempoEstimado),
      probabilidade_sucesso: Number(probabilidadeSucesso.toFixed(2)),
      perfil_genetico: geneticProfile.geneticProfile,
      fatores_risco: [],
      recomendacoes_personalizadas: [
        "Mantenha alta ingestão de proteína (2.5g/kg)",
        "Combine treino de força com cardio intenso",
        "Use ciclagem calórica para otimizar resultados",
        "Monitore composição corporal, não apenas peso",
        "Seja paciente - recomposição é um processo lento",
      ],
      massa_magra_atual: Number(massaMagraAtual.toFixed(1)),
      massa_magra_objetivo: Number(massaMagraObjetivo.toFixed(1)),
      massa_gorda_atual: Number(massaGordaAtual.toFixed(1)),
      massa_gorda_objetivo: Number(massaGordaObjetivo.toFixed(1)),
      plano_treino: planoTreino,
      plano_nutricional: planoNutricional,
      cronograma_adaptativo: {},
      score_motivacional: Math.round(probabilidadeSucesso * 100),
      badges_conquistadas: ["Transformador", "Estrategista Corporal"],
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

        // Gerar explicação personalizada
        const explicacao = {
          paragrafo: `Baseado no seu perfil de recomposição corporal, você irá reduzir ${Math.abs(calculatedResults.massa_gorda_atual - calculatedResults.massa_gorda_objetivo).toFixed(1)}kg de gordura e ganhar ${Math.abs(calculatedResults.massa_magra_objetivo - calculatedResults.massa_magra_atual).toFixed(1)}kg de músculo. A estratégia ${userData.estrategia} foi aplicada com foco em ${userData.objetivo_prioridade?.replace('_', ' ')}.`,
          bullets: [
            `Mantenha ${calculatedResults.plano_nutricional.proteinas_g}g de proteína diariamente`,
            `Use ciclagem calórica entre ${Math.min(...calculatedResults.plano_nutricional.ciclagem_calorica.map(c => c.calorias))} e ${Math.max(...calculatedResults.plano_nutricional.ciclagem_calorica.map(c => c.calorias))} calorias`,
            `Treine ${calculatedResults.plano_treino.frequencia_semanal}x por semana combinando força e cardio`,
            `Monitore composição corporal a cada 2 semanas`,
            `Seja consistente por pelo menos ${calculatedResults.tempo_estimado} semanas`,
          ],
        };
        setExplanation(explicacao);

        // Gerar relatório
        if (user) {
          const reportSummary = generateReportSummary('recomposicao', calculatedResults);
          addReport({
            userId: user.uid,
            type: 'recomposicao',
            title: `Recomposição Corporal - ${userData.nome || 'Relatório'}`,
            data: {
              userData: userData as Record<string, any>,
              results: calculatedResults as Record<string, any>,
              explanation: explicacao,
            },
            summary: reportSummary,
          });
        }

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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 25"
                />
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 175"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 70.5"
                />
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 70.0 (pode ser igual)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  % Gordura Atual
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  step="0.1"
                  value={userData.percentual_gordura_atual || ""}
                  onChange={(e) =>
                    handleInputChange("percentual_gordura_atual", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 20.0"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use bioimpedância ou medição por dobras cutâneas
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  % Gordura Objetivo
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  step="0.1"
                  value={userData.percentual_gordura_objetivo || ""}
                  onChange={(e) =>
                    handleInputChange("percentual_gordura_objetivo", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 15.0"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Prazo (semanas)
                </label>
                <input
                  type="number"
                  min="8"
                  max="104"
                  step="1"
                  value={userData.prazo || ""}
                  onChange={(e) =>
                    handleInputChange("prazo", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 16"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recomendado: mínimo 16 semanas para recomposição efetiva
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Estratégia de Recomposição
                </label>
                <select
                  value={userData.estrategia || ""}
                  onChange={(e) =>
                    handleInputChange("estrategia", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="conservadora">Conservadora (Lenta e sustentável)</option>
                  <option value="moderada">Moderada (Equilibrada)</option>
                  <option value="agressiva">Agressiva (R��pida, mais intensa)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Prioridade Inicial
                </label>
                <select
                  value={userData.objetivo_prioridade || ""}
                  onChange={(e) =>
                    handleInputChange("objetivo_prioridade", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="perda_gordura">Perda de Gordura (Primeiro)</option>
                  <option value="ganho_musculo">Ganho de Músculo (Primeiro)</option>
                  <option value="equilibrado">Equilibrado (Simultâneo)</option>
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva suas experiências anteriores com dietas..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Restrições Alimentares
                </label>
                <textarea
                  value={userData.restricoes_alimentares || ""}
                  onChange={(e) =>
                    handleInputChange("restricoes_alimentares", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Seu Plano de Recomposição Corporal
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Transformação simultânea: perda de gordura + ganho de músculo
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

            {/* Composição Corporal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Scale className="w-5 h-5 text-green-500" />
                    Composição Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Massa Magra:</span>
                      <span className="font-bold text-blue-600">{results.massa_magra_atual}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Massa Gorda:</span>
                      <span className="font-bold text-red-600">{results.massa_gorda_atual}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">% Gordura:</span>
                      <span className="font-bold text-orange-600">{userData.percentual_gordura_atual}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Target className="w-5 h-5 text-green-500" />
                    Composição Objetivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Massa Magra:</span>
                      <span className="font-bold text-blue-600">{results.massa_magra_objetivo}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Massa Gorda:</span>
                      <span className="font-bold text-red-600">{results.massa_gorda_objetivo}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">% Gordura:</span>
                      <span className="font-bold text-orange-600">{userData.percentual_gordura_objetivo}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {results.perda_gordura_semanal}kg
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    Perda Gordura/Sem
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {results.ganho_musculo_semanal}kg
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Ganho Músculo/Sem
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.calorias_diarias}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Calorias Médias
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
                </CardContent>
              </Card>
            </div>

            {/* Plano de Treino */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Activity className="w-5 h-5 text-green-500" />
                  Plano de Treino Híbrido
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {results.plano_treino.frequencia_semanal}x por semana • {results.plano_treino.duracao_sessao} min • {results.plano_treino.ciclagem}
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
                          {exercicio.series > 1 ? `${exercicio.series} séries • ` : ''}{exercicio.repeticoes} • {exercicio.descanso}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{exercicio.tipo}</Badge>
                        <Badge variant="outline">{exercicio.dificuldade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ciclagem Calórica */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <RotateCcw className="w-5 h-5 text-purple-500" />
                  Ciclagem Calórica Semanal
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Estratégia avançada para otimizar a recomposição corporal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {results.plano_nutricional.ciclagem_calorica.map((dia, index) => (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg ${
                        dia.tipo === "Alto" 
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          : dia.tipo === "Baixo"
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                          : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {dia.dia}
                      </div>
                      <div className={`text-lg font-bold ${
                        dia.tipo === "Alto" 
                          ? "text-green-700 dark:text-green-300"
                          : dia.tipo === "Baixo"
                          ? "text-red-700 dark:text-red-300"
                          : "text-blue-700 dark:text-blue-300"
                      }`}>
                        {dia.calorias}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {dia.tipo}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Macronutrientes Diários Médios:
                  </div>
                  <div className="flex justify-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{results.plano_nutricional.proteinas_g}g</div>
                      <div className="text-xs text-slate-500">Proteínas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{results.plano_nutricional.carboidratos_g}g</div>
                      <div className="text-xs text-slate-500">Carboidratos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{results.plano_nutricional.gorduras_g}g</div>
                      <div className="text-xs text-slate-500">Gorduras</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recomendações */}
            {explanation && (
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Recomendações Especializadas
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

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
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
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Recomposição Corporal
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Perca gordura e ganhe músculo simultaneamente com estratégias
          científicas avançadas
        </p>

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
                      ? "bg-gradient-to-r from-green-500 to-teal-600 text-white"
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
                      ? "bg-gradient-to-r from-green-500 to-teal-600"
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
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white flex items-center gap-2"
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

export default RecomposicaoCorporal;
