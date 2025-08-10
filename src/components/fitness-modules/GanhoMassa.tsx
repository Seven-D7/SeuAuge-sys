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
  Dumbbell,
  TrendingUp,
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
  Plus,
  Scale,
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

interface MassGainUserData {
  nome: string;
  idade: number;
  sexo: "masculino" | "feminino";
  altura: number;
  peso_atual: number;
  peso_objetivo: number;
  prazo: number;
  nivel_atividade: "sedentario" | "leve" | "moderado" | "intenso";
  experiencia_exercicio: "iniciante" | "intermediario" | "avancado";
  confianca_exercicio: number;
  historico_treinos: string;
  restricoes_medicas: string;
  horarios_disponiveis: string[];
  preferencias_exercicio: string[];
  tipo_fisico: "ectomorfo" | "mesomorfo" | "endomorfo";
  objetivo_principal: "massa_magra" | "forca" | "hipertrofia" | "funcional";
}

interface MassGainResults {
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_diarias: number;
  superavit_calorico: number;
  ganho_semanal: number;
  tempo_estimado: number;
  probabilidade_sucesso: number;
  perfil_genetico: any;
  fatores_risco: string[];
  recomendacoes_personalizadas: string[];
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
      grupo_muscular: string;
    }>;
    intensidade: string;
    periodizacao: string;
  };
  plano_nutricional: {
    proteinas_g: number;
    carboidratos_g: number;
    gorduras_g: number;
    distribuicao_refeicoes: string[];
  };
  cronograma_adaptativo: any;
  score_motivacional: number;
  badges_conquistadas: string[];
  nivel_usuario: string;
  pontos_experiencia: number;
}

const GanhoMassa: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<MassGainUserData>>({});
  const [results, setResults] = useState<MassGainResults | null>(null);
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
          const prefilledData: Partial<MassGainUserData> = {};

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
    { id: 2, title: "Objetivos", description: "Metas de ganho de massa" },
    { id: 3, title: "Estilo de Vida", description: "Atividade e preferências" },
    { id: 4, title: "Histórico", description: "Experiências anteriores" },
    { id: 5, title: "Resultados", description: "Seu plano personalizado" },
  ];

  const handleInputChange = (field: keyof MassGainUserData, value: any) => {
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
        return;
      }
    }

    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResults = async (): Promise<MassGainResults> => {
    if (
      !userData.nome ||
      !userData.idade ||
      !userData.altura ||
      !userData.peso_atual ||
      !userData.peso_objetivo
    ) {
      throw new Error("Dados obrigatórios não preenchidos");
    }

    const completeUserData: MassGainUserData = {
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
      historico_treinos: userData.historico_treinos || "",
      restricoes_medicas: userData.restricoes_medicas || "",
      horarios_disponiveis: userData.horarios_disponiveis || [],
      preferencias_exercicio: userData.preferencias_exercicio || [],
      tipo_fisico: userData.tipo_fisico || "mesomorfo",
      objetivo_principal: userData.objetivo_principal || "hipertrofia",
    };

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

    // Calcular probabilidade de sucesso para ganho de massa
    const successAlgorithm = new SuccessPredictionAlgorithm();
    const probabilidadeSucesso = 0.75 + (completeUserData.confianca_exercicio / 10) * 0.2;

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

    // Superávit calórico baseado no objetivo (ganho de massa limpa)
    const pesoParaGanhar =
      completeUserData.peso_objetivo - completeUserData.peso_atual;
    const superavitSemanal = (pesoParaGanhar / completeUserData.prazo) * 7700; // 7700 kcal = 1kg
    const superavitDiario = superavitSemanal / 7;

    // Ajustar superávit baseado no tipo físico
    const multiplicadorTipoFisico = {
      ectomorfo: 1.3, // Precisam de mais calorias
      mesomorfo: 1.0,
      endomorfo: 0.8, // Ganham peso mais facilmente
    };

    const superavitAjustado = superavitDiario * multiplicadorTipoFisico[completeUserData.tipo_fisico];
    const caloriasDiarias = gastoEnergetico + superavitAjustado;
    const ganhoSemanal = (superavitAjustado * 7) / 7700;
    const tempoEstimado = pesoParaGanhar / ganhoSemanal;

    // Gerar plano de treino específico para hipertrofia
    const hypertrophyAlgorithm = new HypertrophyAlgorithm(
      geneticProfile.geneticProfile,
      completeUserData.experiencia_exercicio,
    );

    const exerciciosBase = [
      {
        nome: "Agachamento",
        series: 4,
        repeticoes: "8-12",
        descanso: "90s",
        dificuldade: "Alta",
        grupo_muscular: "Pernas",
      },
      {
        nome: "Supino",
        series: 4,
        repeticoes: "8-12",
        descanso: "90s",
        dificuldade: "Alta",
        grupo_muscular: "Peito",
      },
      {
        nome: "Puxada",
        series: 4,
        repeticoes: "8-12",
        descanso: "90s",
        dificuldade: "Alta",
        grupo_muscular: "Costas",
      },
      {
        nome: "Desenvolvimento",
        series: 3,
        repeticoes: "10-15",
        descanso: "75s",
        dificuldade: "Moderada",
        grupo_muscular: "Ombros",
      },
      {
        nome: "Rosca Bíceps",
        series: 3,
        repeticoes: "10-15",
        descanso: "60s",
        dificuldade: "Moderada",
        grupo_muscular: "Bíceps",
      },
      {
        nome: "Tríceps Pulley",
        series: 3,
        repeticoes: "10-15",
        descanso: "60s",
        dificuldade: "Moderada",
        grupo_muscular: "Tríceps",
      },
    ];

    const planoTreino = {
      frequencia_semanal: completeUserData.experiencia_exercicio === "iniciante" ? 3 : 5,
      duracao_sessao: 75,
      tipo_principal: "Hipertrofia + Força",
      exercicios: exerciciosBase,
      intensidade: "Moderada a Alta",
      periodizacao: "Linear com incremento progressivo",
    };

    // Calcular macronutrientes para ganho de massa
    const proteinasG = completeUserData.peso_atual * 2.2; // 2.2g/kg
    const gorduraG = (caloriasDiarias * 0.25) / 9; // 25% das calorias
    const carboidratosG = (caloriasDiarias - (proteinasG * 4) - (gorduraG * 9)) / 4;

    const planoNutricional = {
      proteinas_g: Math.round(proteinasG),
      carboidratos_g: Math.round(carboidratosG),
      gorduras_g: Math.round(gorduraG),
      distribuicao_refeicoes: [
        "Café da manhã: 25% das calorias",
        "Almoço: 30% das calorias",
        "Lanche pré-treino: 15% das calorias",
        "Pós-treino: 15% das calorias",
        "Jantar: 15% das calorias",
      ],
    };

    const results: MassGainResults = {
      imc,
      classificacao_imc: classificacaoImc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gastoEnergetico),
      calorias_diarias: Math.round(caloriasDiarias),
      superavit_calorico: Math.round(superavitAjustado),
      ganho_semanal: Number(ganhoSemanal.toFixed(2)),
      tempo_estimado: Math.round(tempoEstimado),
      probabilidade_sucesso: Number(probabilidadeSucesso.toFixed(2)),
      perfil_genetico: geneticProfile.geneticProfile,
      fatores_risco: [],
      recomendacoes_personalizadas: [
        "Treine de forma consistente e progressiva",
        "Consuma proteína em todas as refeições",
        "Hidrate-se adequadamente (3-4L/dia)",
        "Durma 8+ horas por noite para recuperação",
        "Monitore o progresso semanalmente",
      ],
      plano_treino: planoTreino,
      plano_nutricional: planoNutricional,
      cronograma_adaptativo: {},
      score_motivacional: Math.round(probabilidadeSucesso * 100),
      badges_conquistadas: ["Futuro Atleta", "Determinado a Crescer"],
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
        const contexto = `${userData.nome} quer ganhar ${(userData.peso_objetivo! - userData.peso_atual!).toFixed(1)}kg de massa muscular em ${userData.prazo} semanas. Perfil: ${userData.tipo_fisico}, experiência ${userData.experiencia_exercicio}.`;
        const explicacao = {
          paragrafo: `Baseado no seu perfil ${userData.tipo_fisico} e experiência ${userData.experiencia_exercicio}, criamos um plano personalizado de ganho de massa. Você precisará de ${calculatedResults.calorias_diarias} calorias diárias (superávit de ${calculatedResults.superavit_calorico} calorias) para ganhar aproximadamente ${calculatedResults.ganho_semanal}kg por semana.`,
          bullets: [
            `Consuma ${calculatedResults.plano_nutricional.proteinas_g}g de proteína diariamente`,
            `Treine ${calculatedResults.plano_treino.frequencia_semanal}x por semana com foco em hipertrofia`,
            `Mantenha consistência por pelo menos ${calculatedResults.tempo_estimado} semanas`,
            "Monitore o progresso através de medidas corporais",
            "Ajuste as calorias se necessário baseado nos resultados",
          ],
        };
        setExplanation(explicacao);

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
                      : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 75.0"
                />
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 16"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tipo Físico
                </label>
                <select
                  value={userData.tipo_fisico || ""}
                  onChange={(e) =>
                    handleInputChange("tipo_fisico", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="ectomorfo">Ectomorfo (Magro, dificuldade para ganhar peso)</option>
                  <option value="mesomorfo">Mesomorfo (Médio, ganha músculo facilmente)</option>
                  <option value="endomorfo">Endomorfo (Largo, ganha peso facilmente)</option>
                </select>
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Experiência com Musculação
                </label>
                <select
                  value={userData.experiencia_exercicio || ""}
                  onChange={(e) =>
                    handleInputChange("experiencia_exercicio", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante (0-1 ano)</option>
                  <option value="intermediario">Intermediário (1-3 anos)</option>
                  <option value="avancado">Avançado (3+ anos)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Objetivo Principal
                </label>
                <select
                  value={userData.objetivo_principal || ""}
                  onChange={(e) =>
                    handleInputChange("objetivo_principal", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="massa_magra">Ganho de Massa Magra</option>
                  <option value="forca">Aumento de Força</option>
                  <option value="hipertrofia">Hipertrofia Muscular</option>
                  <option value="funcional">Condicionamento Funcional</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confiança com Musculação (1-10)
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
                  Histórico de Treinos
                </label>
                <textarea
                  value={userData.historico_treinos || ""}
                  onChange={(e) =>
                    handleInputChange("historico_treinos", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva sua experiência anterior com treinos..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Restrições Médicas
                </label>
                <textarea
                  value={userData.restricoes_medicas || ""}
                  onChange={(e) =>
                    handleInputChange("restricoes_medicas", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Lesões, limitações, condições médicas..."
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Seu Plano de Ganho de Massa
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
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {results.ganho_semanal}kg
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Ganho/Semana
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
                  <Dumbbell className="w-5 h-5 text-blue-500" />
                  Plano de Treino Personalizado
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {results.plano_treino.frequencia_semanal}x por semana •{" "}
                  {results.plano_treino.duracao_sessao} min por sessão •{" "}
                  {results.plano_treino.periodizacao}
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
                          {exercicio.series} séries • {exercicio.repeticoes} repetições • {exercicio.descanso} descanso
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {exercicio.grupo_muscular}
                        </div>
                      </div>
                      <Badge variant="outline">{exercicio.dificuldade}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plano Nutricional */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Scale className="w-5 h-5 text-green-500" />
                  Plano Nutricional
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Macronutrientes otimizados para ganho de massa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.plano_nutricional.proteinas_g}g
                    </div>
                    <div className="text-sm text-red-500">Proteínas</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {results.plano_nutricional.carboidratos_g}g
                    </div>
                    <div className="text-sm text-blue-500">Carboidratos</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {results.plano_nutricional.gorduras_g}g
                    </div>
                    <div className="text-sm text-yellow-500">Gorduras</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Distribuição das Refeições:</h4>
                  {results.plano_nutricional.distribuicao_refeicoes.map((refeicao, index) => (
                    <div key={index} className="text-sm text-slate-600 dark:text-slate-400">
                      • {refeicao}
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

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ganho de Massa Muscular
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Sistema avançado de hipertrofia com algoritmos de IA para maximizar
          seu ganho muscular
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
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
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
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
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
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
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

export default GanhoMassa;
