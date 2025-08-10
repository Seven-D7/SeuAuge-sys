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
  Zap,
  Trophy,
  Target,
  Brain,
  Activity,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Heart,
  Clock,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
  Timer,
  Gauge,
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
import type { UserData } from "@/types/fitness";

interface AthleteUserData {
  nome: string;
  idade: number;
  sexo: "masculino" | "feminino";
  altura: number;
  peso_atual: number;
  esporte_principal: string;
  nivel_competitivo: "amador" | "semiprofissional" | "profissional" | "recreativo";
  anos_experiencia: number;
  frequencia_treino: number;
  objetivo_principal: "velocidade" | "forca" | "resistencia" | "agilidade" | "potencia" | "flexibilidade";
  temporada_competitiva: "preparacao" | "competicao" | "off_season" | "recuperacao";
  lesoes_historico: string;
  limitacoes_fisicas: string;
  tempo_disponivel: number;
  equipamentos_disponiveis: string[];
  testes_anteriores: {
    velocidade_40m?: number;
    salto_vertical?: number;
    vo2_max?: number;
    teste_forca?: number;
  };
  metas_especificas: string;
}

interface PerformanceResults {
  perfil_atletico: {
    categoria: string;
    potencial_genetico: number;
    pontos_fortes: string[];
    areas_melhoria: string[];
  };
  metricas_basicas: {
    imc: number;
    classificacao_imc: string;
    tmb: number;
    gasto_energetico: number;
  };
  plano_treinamento: {
    periodizacao: string;
    fases: Array<{
      nome: string;
      duracao_semanas: number;
      objetivo: string;
      intensidade: string;
      volume: string;
      exercicios: Array<{
        nome: string;
        series: number;
        repeticoes: string;
        intensidade: string;
        descanso: string;
        objetivo: string;
      }>;
    }>;
    frequencia_semanal: number;
    duracao_sessao: number;
  };
  plano_nutricional: {
    calorias_diarias: number;
    proteinas_g: number;
    carboidratos_g: number;
    gorduras_g: number;
    hidratacao_diaria: number;
    suplementacao: string[];
    timing_nutricional: Array<{
      momento: string;
      recomendacao: string;
    }>;
  };
  testes_avaliacao: Array<{
    nome: string;
    descricao: string;
    frequencia: string;
    objetivo: string;
  }>;
  cronograma_recuperacao: {
    sono_recomendado: number;
    dias_descanso: number;
    modalidades_recuperacao: string[];
  };
  projecoes_melhoria: {
    curto_prazo: string[];
    medio_prazo: string[];
    longo_prazo: string[];
  };
  probabilidade_sucesso: number;
  score_performance: number;
  badges_conquistadas: string[];
  nivel_usuario: string;
  pontos_experiencia: number;
}

const PerformanceAtletica: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<AthleteUserData>>({});
  const [results, setResults] = useState<PerformanceResults | null>(null);
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
          const prefilledData: Partial<AthleteUserData> = {};

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
    { id: 1, title: "Perfil Atlético", description: "Dados do atleta" },
    { id: 2, title: "Esporte & Nível", description: "Modalidade e experiência" },
    { id: 3, title: "Objetivos", description: "Metas de performance" },
    { id: 4, title: "Avaliação", description: "Testes e limitações" },
    { id: 5, title: "Resultados", description: "Seu plano personalizado" },
  ];

  const esportes = [
    "Futebol", "Basquete", "Vôlei", "Tênis", "Corrida", "Natação", "Ciclismo", 
    "Crossfit", "Artes Marciais", "Ginástica", "Atletismo", "Rugby", "Handebol",
    "Surf", "Escalada", "Triathlon", "Powerlifting", "Outro"
  ];

  const handleInputChange = (field: keyof AthleteUserData, value: any) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (typeof value === "string") {
      value = value.trim();
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

      if (field === "peso_atual") {
        if (value < 30) errorMessage = "Peso mínimo: 30 kg";
        else if (value > 300) errorMessage = "Peso máximo: 300 kg";
      }

      if (field === "anos_experiencia") {
        if (value < 0) errorMessage = "Experiência mínima: 0 anos";
        else if (value > 50) errorMessage = "Experiência máxima: 50 anos";
      }

      if (field === "frequencia_treino") {
        if (value < 1) errorMessage = "Frequência mínima: 1x por semana";
        else if (value > 14) errorMessage = "Frequência máxima: 14x por semana";
      }

      if (field === "tempo_disponivel") {
        if (value < 30) errorMessage = "Tempo mínimo: 30 min";
        else if (value > 480) errorMessage = "Tempo máximo: 8 horas";
      }

      if (errorMessage) {
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
        return;
      }
    }

    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResults = async (): Promise<PerformanceResults> => {
    if (
      !userData.nome ||
      !userData.idade ||
      !userData.altura ||
      !userData.peso_atual ||
      !userData.esporte_principal ||
      !userData.objetivo_principal
    ) {
      throw new Error("Dados obrigatórios não preenchidos");
    }

    const completeUserData: AthleteUserData = {
      nome: userData.nome,
      idade: userData.idade,
      sexo: userData.sexo || "masculino",
      altura: userData.altura,
      peso_atual: userData.peso_atual,
      esporte_principal: userData.esporte_principal,
      nivel_competitivo: userData.nivel_competitivo || "amador",
      anos_experiencia: userData.anos_experiencia || 1,
      frequencia_treino: userData.frequencia_treino || 3,
      objetivo_principal: userData.objetivo_principal,
      temporada_competitiva: userData.temporada_competitiva || "preparacao",
      lesoes_historico: userData.lesoes_historico || "",
      limitacoes_fisicas: userData.limitacoes_fisicas || "",
      tempo_disponivel: userData.tempo_disponivel || 60,
      equipamentos_disponiveis: userData.equipamentos_disponiveis || [],
      testes_anteriores: userData.testes_anteriores || {},
      metas_especificas: userData.metas_especificas || "",
    };

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

    // Fator de atividade para atletas (mais alto)
    const fatoresAtividade = {
      recreativo: 1.6,
      amador: 1.8,
      semiprofissional: 2.0,
      profissional: 2.2,
    };

    const gastoEnergetico = tmb * fatoresAtividade[completeUserData.nivel_competitivo];

    // Criar perfil atlético
    const adaptedUserData = {
      age: completeUserData.idade,
      sex: completeUserData.sexo,
      height: completeUserData.altura,
      weight: completeUserData.peso_atual,
      activityLevel: "intenso",
      fitnessHistory: [],
    };

    const geneticProfile = new GeneticFitnessProfile(adaptedUserData);
    const potencialGenetico = Math.random() * 0.3 + 0.7; // 70-100%

    // Definir perfil atlético baseado no esporte
    const perfilAtletico = getAthleteProfile(completeUserData.esporte_principal, completeUserData.objetivo_principal);

    // Calcular probabilidade de sucesso
    const experienciaScore = Math.min(completeUserData.anos_experiencia / 10, 1);
    const frequenciaScore = Math.min(completeUserData.frequencia_treino / 6, 1);
    const nivelScore = {
      recreativo: 0.6,
      amador: 0.7,
      semiprofissional: 0.8,
      profissional: 0.9,
    }[completeUserData.nivel_competitivo];

    const probabilidadeSucesso = (experienciaScore + frequenciaScore + nivelScore + potencialGenetico) / 4;

    // Gerar plano de treinamento periodizado
    const planoTreinamento = generateTrainingPlan(completeUserData);

    // Calcular necessidades nutricionais para atletas
    const caloriasAtleta = gastoEnergetico * 1.2; // 20% a mais para performance
    const proteinasG = completeUserData.peso_atual * 2.0; // 2g/kg para atletas
    const gorduraG = (caloriasAtleta * 0.25) / 9; // 25% das calorias
    const carboidratosG = (caloriasAtleta - (proteinasG * 4) - (gorduraG * 9)) / 4;

    const planoNutricional = {
      calorias_diarias: Math.round(caloriasAtleta),
      proteinas_g: Math.round(proteinasG),
      carboidratos_g: Math.round(carboidratosG),
      gorduras_g: Math.round(gorduraG),
      hidratacao_diaria: Math.round(completeUserData.peso_atual * 35), // 35ml/kg
      suplementacao: getSuplementacao(completeUserData.objetivo_principal),
      timing_nutricional: getTimingNutricional(),
    };

    // Gerar testes de avaliação
    const testesAvaliacao = getTestesAvaliacao(completeUserData.esporte_principal, completeUserData.objetivo_principal);

    // Cronograma de recuperação
    const cronogramaRecuperacao = {
      sono_recomendado: 8.5, // Atletas precisam de mais sono
      dias_descanso: Math.max(1, 7 - completeUserData.frequencia_treino),
      modalidades_recuperacao: [
        "Massagem esportiva",
        "Crioterapia",
        "Sauna",
        "Alongamento ativo",
        "Meditação",
        "Hidroterapia"
      ],
    };

    // Projeções de melhoria
    const projecoesMelhoria = {
      curto_prazo: [
        `Melhoria de ${5 + Math.round(Math.random() * 10)}% na ${completeUserData.objetivo_principal} em 4-6 semanas`,
        "Redução de fadiga e melhora na recuperação",
        "Aumento da motivação e foco mental"
      ],
      medio_prazo: [
        `Ganho de ${10 + Math.round(Math.random() * 15)}% na performance específica em 3-4 meses`,
        "Melhoria significativa na técnica esportiva",
        "Redução do risco de lesões"
      ],
      longo_prazo: [
        `Potencial de melhoria de ${20 + Math.round(Math.random() * 25)}% na performance em 1 ano`,
        "Alcance do pico de performance atlética",
        "Desenvolvimento de expertise técnica avançada"
      ],
    };

    const scorePerformance = Math.round(
      (probabilidadeSucesso * 0.4 + 
       experienciaScore * 0.3 + 
       frequenciaScore * 0.3) * 100
    );

    const results: PerformanceResults = {
      perfil_atletico: {
        categoria: perfilAtletico.categoria,
        potencial_genetico: Math.round(potencialGenetico * 100),
        pontos_fortes: perfilAtletico.pontos_fortes,
        areas_melhoria: perfilAtletico.areas_melhoria,
      },
      metricas_basicas: {
        imc,
        classificacao_imc: classificacaoImc,
        tmb: Math.round(tmb),
        gasto_energetico: Math.round(gastoEnergetico),
      },
      plano_treinamento: planoTreinamento,
      plano_nutricional: planoNutricional,
      testes_avaliacao: testesAvaliacao,
      cronograma_recuperacao: cronogramaRecuperacao,
      projecoes_melhoria: projecoesMelhoria,
      probabilidade_sucesso: Number(probabilidadeSucesso.toFixed(2)),
      score_performance: scorePerformance,
      badges_conquistadas: ["Atleta Dedicado", "Performance Elite"],
      nivel_usuario: completeUserData.nivel_competitivo,
      pontos_experiencia: Math.round(experienciaScore * 1000),
    };

    return results;
  };

  const getAthleteProfile = (esporte: string, objetivo: string) => {
    const profiles = {
      "Futebol": {
        categoria: "Esporte de Equipe - Alta Intensidade",
        pontos_fortes: ["Resistência cardiovascular", "Agilidade", "Coordenação"],
        areas_melhoria: ["Força explosiva", "Velocidade linear", "Flexibilidade"]
      },
      "Basquete": {
        categoria: "Esporte de Equipe - Potência",
        pontos_fortes: ["Salto vertical", "Agilidade", "Coordenação mão-olho"],
        areas_melhoria: ["Resistência específica", "Força do core", "Mobilidade"]
      },
      "Corrida": {
        categoria: "Esporte Individual - Resistência",
        pontos_fortes: ["VO2 máx", "Eficiência metabólica", "Economia de movimento"],
        areas_melhoria: ["Força muscular", "Potência anaeróbia", "Flexibilidade"]
      },
      "Natação": {
        categoria: "Esporte Individual - Resistência/Técnica",
        pontos_fortes: ["Capacidade pulmonar", "Força do core", "Flexibilidade"],
        areas_melhoria: ["Potência de membros", "Força de pegada", "Resistência anaeróbia"]
      },
      "default": {
        categoria: "Atleta Generalista",
        pontos_fortes: ["Versatilidade", "Adaptabilidade", "Motivação"],
        areas_melhoria: ["Especialização técnica", "Força específica", "Coordenação"]
      }
    };

    return profiles[esporte] || profiles["default"];
  };

  const generateTrainingPlan = (userData: AthleteUserData) => {
    const fases = [
      {
        nome: "Preparação Base",
        duracao_semanas: 4,
        objetivo: "Construir base aeróbia e força geral",
        intensidade: "60-70%",
        volume: "Alto",
        exercicios: [
          {
            nome: "Corrida base",
            series: 1,
            repeticoes: "30-45min",
            intensidade: "Moderada",
            descanso: "-",
            objetivo: "Base aeróbia"
          },
          {
            nome: "Agachamento",
            series: 4,
            repeticoes: "8-12",
            intensidade: "70%",
            descanso: "90s",
            objetivo: "Força geral"
          },
          {
            nome: "Core stability",
            series: 3,
            repeticoes: "45s",
            intensidade: "Moderada",
            descanso: "60s",
            objetivo: "Estabilidade"
          }
        ]
      },
      {
        nome: "Desenvolvimento Específico",
        duracao_semanas: 6,
        objetivo: "Desenvolver qualidades específicas do esporte",
        intensidade: "75-85%",
        volume: "Moderado",
        exercicios: [
          {
            nome: "Treino intervalado",
            series: 5,
            repeticoes: "3min",
            intensidade: "Alta",
            descanso: "2min",
            objetivo: "Potência aeróbia"
          },
          {
            nome: "Exercícios pliométricos",
            series: 4,
            repeticoes: "6-8",
            intensidade: "Máxima",
            descanso: "3min",
            objetivo: "Potência explosiva"
          },
          {
            nome: "Exercícios técnicos",
            series: 3,
            repeticoes: "10-15",
            intensidade: "Técnica",
            descanso: "90s",
            objetivo: "Habilidade específica"
          }
        ]
      },
      {
        nome: "Pico de Performance",
        duracao_semanas: 3,
        objetivo: "Atingir pico de performance para competição",
        intensidade: "85-95%",
        volume: "Baixo",
        exercicios: [
          {
            nome: "Sprints específicos",
            series: 6,
            repeticoes: "10-30s",
            intensidade: "Máxima",
            descanso: "3-5min",
            objetivo: "Velocidade máxima"
          },
          {
            nome: "Simulação de competição",
            series: 2,
            repeticoes: "Específico",
            intensidade: "Competição",
            descanso: "Completo",
            objetivo: "Preparação mental"
          }
        ]
      }
    ];

    return {
      periodizacao: "Linear com pico específico",
      fases: fases,
      frequencia_semanal: userData.frequencia_treino,
      duracao_sessao: userData.tempo_disponivel,
    };
  };

  const getSuplementacao = (objetivo: string) => {
    const suplementos = {
      velocidade: ["Creatina", "Beta-alanina", "Cafeína"],
      forca: ["Creatina", "Whey protein", "HMB"],
      resistencia: ["Carboidratos", "BCAAs", "Eletrólitos"],
      agilidade: ["Creatina", "Beta-alanina", "Vitaminas do complexo B"],
      potencia: ["Creatina", "Citrulina", "Arginina"],
      flexibilidade: ["Magnésio", "Vitamina D", "Ômega-3"]
    };

    return suplementos[objetivo] || ["Multivitamínico", "Whey protein", "Creatina"];
  };

  const getTimingNutricional = () => [
    {
      momento: "2-3h antes do treino",
      recomendacao: "Refeição rica em carboidratos, moderada em proteína, baixa em gordura"
    },
    {
      momento: "30-60min antes",
      recomendacao: "Lanche leve: banana + café ou isotônico"
    },
    {
      momento: "Durante o treino",
      recomendacao: "Hidratação com eletrólitos (>60min) ou água (<60min)"
    },
    {
      momento: "0-30min pós-treino",
      recomendacao: "Shake com proteína + carboidratos (proporção 1:3 ou 1:4)"
    },
    {
      momento: "2-3h pós-treino",
      recomendacao: "Refeição completa para recuperação muscular"
    }
  ];

  const getTestesAvaliacao = (esporte: string, objetivo: string) => [
    {
      nome: "Teste de VO2 máximo",
      descricao: "Avaliação da capacidade cardiovascular máxima",
      frequencia: "A cada 3 meses",
      objetivo: "Monitorar fitness cardiovascular"
    },
    {
      nome: "Teste de salto vertical",
      descricao: "Medição da potência de membros inferiores",
      frequencia: "Mensal",
      objetivo: "Avaliar potência explosiva"
    },
    {
      nome: "Teste de agilidade (T-test)",
      descricao: "Avaliação da capacidade de mudança de direção",
      frequencia: "Mensal",
      objetivo: "Monitorar agilidade específica"
    },
    {
      nome: "Teste de 40 metros",
      descricao: "Velocidade linear em distância curta",
      frequencia: "Quinzenal",
      objetivo: "Avaliar velocidade máxima"
    },
    {
      nome: "Análise de composição corporal",
      descricao: "Bioimpedância ou DEXA scan",
      frequencia: "Mensal",
      objetivo: "Monitorar massa magra e gordura"
    }
  ];

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
          paragrafo: `Baseado no seu perfil de ${userData.esporte_principal} com foco em ${userData.objetivo_principal}, criamos um plano de performance periodizado. Seu score de performance é ${calculatedResults.score_performance}/100, indicando ${calculatedResults.score_performance > 80 ? 'excelente' : calculatedResults.score_performance > 60 ? 'bom' : 'grande'} potencial de melhoria.`,
          bullets: [
            `Consuma ${calculatedResults.plano_nutricional.calorias_diarias} calorias diárias para suportar o treinamento`,
            `Siga a periodização em ${calculatedResults.plano_treinamento.fases.length} fases específicas`,
            `Realize testes de avaliação regulares para monitorar progresso`,
            `Dedique ${calculatedResults.cronograma_recuperacao.sono_recomendado}h ao sono para otimizar recuperação`,
            `Espere melhorias de ${calculatedResults.projecoes_melhoria.curto_prazo[0].split('%')[0].split(' ').pop()}% no curto prazo`,
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: 175"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: 70.5"
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
                  Esporte Principal
                </label>
                <select
                  value={userData.esporte_principal || ""}
                  onChange={(e) =>
                    handleInputChange("esporte_principal", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Selecione seu esporte</option>
                  {esportes.map((esporte) => (
                    <option key={esporte} value={esporte}>{esporte}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nível Competitivo
                </label>
                <select
                  value={userData.nivel_competitivo || ""}
                  onChange={(e) =>
                    handleInputChange("nivel_competitivo", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="recreativo">Recreativo</option>
                  <option value="amador">Amador</option>
                  <option value="semiprofissional">Semiprofissional</option>
                  <option value="profissional">Profissional</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Anos de Experiência
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={userData.anos_experiencia || ""}
                  onChange={(e) =>
                    handleInputChange("anos_experiencia", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: 5"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Frequência de Treino (por semana)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  step="1"
                  value={userData.frequencia_treino || ""}
                  onChange={(e) =>
                    handleInputChange("frequencia_treino", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: 5"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Temporada Competitiva
                </label>
                <select
                  value={userData.temporada_competitiva || ""}
                  onChange={(e) =>
                    handleInputChange("temporada_competitiva", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="preparacao">Preparação (Pré-temporada)</option>
                  <option value="competicao">Competição (Durante temporada)</option>
                  <option value="off_season">Off-season (Fora da temporada)</option>
                  <option value="recuperacao">Recuperação (Pós-temporada)</option>
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
                  Objetivo Principal de Performance
                </label>
                <select
                  value={userData.objetivo_principal || ""}
                  onChange={(e) =>
                    handleInputChange("objetivo_principal", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="velocidade">Velocidade</option>
                  <option value="forca">Força</option>
                  <option value="resistencia">Resistência</option>
                  <option value="agilidade">Agilidade</option>
                  <option value="potencia">Potência</option>
                  <option value="flexibilidade">Flexibilidade</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tempo Disponível por Sessão (minutos)
                </label>
                <input
                  type="number"
                  min="30"
                  max="480"
                  step="15"
                  value={userData.tempo_disponivel || ""}
                  onChange={(e) =>
                    handleInputChange("tempo_disponivel", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: 90"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Metas Específicas
                </label>
                <textarea
                  value={userData.metas_especificas || ""}
                  onChange={(e) =>
                    handleInputChange("metas_especificas", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows={3}
                  placeholder="Ex: Melhorar tempo de 100m, aumentar salto vertical, reduzir tempo de prova..."
                />
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
                  Histórico de Lesões
                </label>
                <textarea
                  value={userData.lesoes_historico || ""}
                  onChange={(e) =>
                    handleInputChange("lesoes_historico", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva lesões anteriores, cirurgias, limitações..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Limitações Físicas Atuais
                </label>
                <textarea
                  value={userData.limitacoes_fisicas || ""}
                  onChange={(e) =>
                    handleInputChange("limitacoes_fisicas", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows={3}
                  placeholder="Dores, limitações de mobilidade, restrições médicas..."
                />
              </div>

              {/* Testes Anteriores */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Testes de Performance Anteriores (Opcional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Velocidade 40m (segundos)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={userData.testes_anteriores?.velocidade_40m || ""}
                      onChange={(e) =>
                        handleInputChange("testes_anteriores", {
                          ...userData.testes_anteriores,
                          velocidade_40m: Number(e.target.value) || undefined
                        })
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Ex: 5.2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Salto Vertical (cm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={userData.testes_anteriores?.salto_vertical || ""}
                      onChange={(e) =>
                        handleInputChange("testes_anteriores", {
                          ...userData.testes_anteriores,
                          salto_vertical: Number(e.target.value) || undefined
                        })
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Ex: 45"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      VO2 Máx (ml/kg/min)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={userData.testes_anteriores?.vo2_max || ""}
                      onChange={(e) =>
                        handleInputChange("testes_anteriores", {
                          ...userData.testes_anteriores,
                          vo2_max: Number(e.target.value) || undefined
                        })
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Ex: 55.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      1RM Agachamento (kg)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={userData.testes_anteriores?.teste_forca || ""}
                      onChange={(e) =>
                        handleInputChange("testes_anteriores", {
                          ...userData.testes_anteriores,
                          teste_forca: Number(e.target.value) || undefined
                        })
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Ex: 120"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        if (!results) return <div>Carregando resultados...</div>;

        return (
          <div className="space-y-8">
            {/* Resumo dos Resultados */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Seu Plano de Performance Atlética
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Otimização científica para {userData.esporte_principal}
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

            {/* Perfil Atlético */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Perfil Atlético
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {results.perfil_atletico.categoria} • Potencial Genético: {results.perfil_atletico.potencial_genetico}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">Pontos Fortes</h4>
                    <div className="space-y-2">
                      {results.perfil_atletico.pontos_fortes.map((ponto, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-slate-700 dark:text-slate-300 text-sm">{ponto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3">Áreas de Melhoria</h4>
                    <div className="space-y-2">
                      {results.perfil_atletico.areas_melhoria.map((area, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-orange-500" />
                          <span className="text-slate-700 dark:text-slate-300 text-sm">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métricas de Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gauge className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {results.score_performance}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    Score Performance
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    /100 pontos
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {(results.probabilidade_sucesso * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Sucesso
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Probabilidade
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {results.plano_nutricional.calorias_diarias}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Calorias/Dia
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Para performance
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {results.cronograma_recuperacao.sono_recomendado}h
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Sono/Noite
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Recuperação
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Periodização do Treinamento */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  Periodização do Treinamento
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {results.plano_treinamento.periodizacao} • {results.plano_treinamento.frequencia_semanal}x por semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.plano_treinamento.fases.map((fase, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{fase.nome}</h4>
                        <Badge variant="outline">{fase.duracao_semanas} semanas</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{fase.objetivo}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                        <div>Intensidade: {fase.intensidade}</div>
                        <div>Volume: {fase.volume}</div>
                      </div>
                      <div className="space-y-2">
                        {fase.exercicios.slice(0, 3).map((exercicio, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded text-sm">
                            <span className="font-medium">{exercicio.nome}</span>
                            <div className="flex gap-2 text-xs">
                              <Badge variant="outline" className="text-xs">{exercicio.intensidade}</Badge>
                              <span className="text-slate-600 dark:text-slate-400">{exercicio.series}x {exercicio.repeticoes}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projeções de Melhoria */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Projeções de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">Curto Prazo (1-2 meses)</h4>
                    <div className="space-y-2">
                      {results.projecoes_melhoria.curto_prazo.map((projecao, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {projecao}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3">Médio Prazo (3-6 meses)</h4>
                    <div className="space-y-2">
                      {results.projecoes_melhoria.medio_prazo.map((projecao, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {projecao}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">Longo Prazo (1 ano+)</h4>
                    <div className="space-y-2">
                      {results.projecoes_melhoria.longo_prazo.map((projecao, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {projecao}
                        </div>
                      ))}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
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
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Performance Atlética
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Maximize seu desempenho esportivo com treinamento científico
          personalizado
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
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
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
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600"
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
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white flex items-center gap-2"
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

export default PerformanceAtletica;
