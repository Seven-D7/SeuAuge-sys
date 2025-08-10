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
import {
  Play,
  Timer,
  Target,
  Brain,
  Activity,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  TrendingUp,
  Calendar,
  BarChart3,
  Heart,
  Zap,
  Trophy,
  Wind,
  Mountain,
  Route,
  Watch,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useReportsStore, generateReportSummary } from "../../stores/reportsStore";
import NextStepsSection from "./components/NextStepsSection";

interface RunnerUserData {
  nome: string;
  idade: number;
  sexo: "masculino" | "feminino";
  peso_atual: number;
  altura: number;
  nivel_corrida: "iniciante" | "intermediario" | "avancado" | "elite";
  experiencia_anos: number;
  frequencia_semanal: number;
  distancia_atual: number;
  tempo_5k: string;
  tempo_10k: string;
  tempo_21k: string;
  tempo_42k: string;
  objetivo_principal: "5k" | "10k" | "21k" | "42k" | "trail" | "velocidade" | "resistencia";
  meta_tempo: string;
  prazo_objetivo: number;
  terreno_preferido: "asfalto" | "esteira" | "trilha" | "pista" | "misto";
  lesoes_historico: string;
  limitacoes_tempo: number;
  equipamentos: string[];
  zona_climatica: "tropical" | "temperado" | "frio" | "arido";
}

interface RunningResults {
  perfil_corredor: {
    categoria: string;
    nivel_performance: number;
    potencial_genetico: number;
    pontos_fortes: string[];
    areas_melhoria: string[];
  };
  analise_tempos: {
    pace_5k: string;
    pace_10k: string;
    pace_21k: string;
    pace_42k: string;
    vo2_estimado: number;
    classificacao_idade: string;
  };
  plano_treinamento: {
    duracao_semanas: number;
    periodizacao: string;
    microciclos: Array<{
      semana: number;
      foco: string;
      volume_km: number;
      intensidade: string;
      treinos: Array<{
        dia: string;
        tipo: string;
        distancia: string;
        pace: string;
        descricao: string;
        aquecimento: string;
        principal: string;
        volta_calma: string;
      }>;
    }>;
  };
  dicas_performance: {
    nutricao: string[];
    hidratacao: string[];
    recuperacao: string[];
    equipamentos: string[];
    tecnica: string[];
    mental: string[];
  };
  programa_forca: {
    frequencia: number;
    exercicios: Array<{
      nome: string;
      series: number;
      repeticoes: string;
      beneficio: string;
      tecnica: string;
    }>;
  };
  estrategias_prova: {
    aquecimento: string[];
    largada: string[];
    meio_prova: string[];
    reta_final: string[];
    pos_prova: string[];
  };
  projecoes_tempo: {
    atual: Record<string, string>;
    projetado_4_semanas: Record<string, string>;
    projetado_12_semanas: Record<string, string>;
    projetado_6_meses: Record<string, string>;
  };
  score_performance: number;
  probabilidade_meta: number;
  badges_conquistadas: string[];
}

const CorridaAvancada: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<RunnerUserData>>({});
  const [results, setResults] = useState<RunningResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<{
    paragrafo: string;
    bullets: string[];
  } | null>(null);
  const { addReport } = useReportsStore();
  const { user } = useAuth();

  const steps = [
    { id: 1, title: "Perfil do Corredor", description: "Dados pessoais e físicos" },
    { id: 2, title: "Experiência", description: "Histórico e performance atual" },
    { id: 3, title: "Objetivos", description: "Metas e preferências" },
    { id: 4, title: "Contexto", description: "Limitações e equipamentos" },
    { id: 5, title: "Plano Personalizado", description: "Seu programa de corrida" },
  ];

  const handleInputChange = (field: keyof RunnerUserData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const parseTimeToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; // mm:ss
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]; // hh:mm:ss
    }
    return 0;
  };

  const formatSecondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePace = (timeStr: string, distance: number): string => {
    const totalSeconds = parseTimeToSeconds(timeStr);
    if (totalSeconds === 0) return "N/A";
    
    const paceSeconds = totalSeconds / distance;
    const minutes = Math.floor(paceSeconds / 60);
    const seconds = Math.round(paceSeconds % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const estimateVO2Max = (time5k: string, age: number, sex: string): number => {
    const seconds = parseTimeToSeconds(time5k);
    if (seconds === 0) return 45; // Default estimate
    
    // Fórmula simplificada baseada em Jack Daniels
    const velocity = 5000 / seconds; // m/s
    let vo2 = 15.3 * velocity;
    
    // Ajustes por idade e sexo
    const ageFactor = 1 - (age - 25) * 0.01;
    const sexFactor = sex === "feminino" ? 0.9 : 1.0;
    
    return Math.round(vo2 * ageFactor * sexFactor);
  };

  const calculateResults = (): RunningResults => {
    const completeUserData: RunnerUserData = {
      nome: userData.nome || user?.name || "Corredor",
      idade: userData.idade || 30,
      sexo: userData.sexo || "masculino",
      peso_atual: userData.peso_atual || 70,
      altura: userData.altura || 175,
      nivel_corrida: userData.nivel_corrida || "intermediario",
      experiencia_anos: userData.experiencia_anos || 2,
      frequencia_semanal: userData.frequencia_semanal || 3,
      distancia_atual: userData.distancia_atual || 5,
      tempo_5k: userData.tempo_5k || "25:00",
      tempo_10k: userData.tempo_10k || "52:00",
      tempo_21k: userData.tempo_21k || "1:50:00",
      tempo_42k: userData.tempo_42k || "",
      objetivo_principal: userData.objetivo_principal || "10k",
      meta_tempo: userData.meta_tempo || "22:00",
      prazo_objetivo: userData.prazo_objetivo || 12,
      terreno_preferido: userData.terreno_preferido || "asfalto",
      lesoes_historico: userData.lesoes_historico || "",
      limitacoes_tempo: userData.limitacoes_tempo || 60,
      equipamentos: userData.equipamentos || [],
      zona_climatica: userData.zona_climatica || "tropical",
    };

    // Calcular perfil do corredor
    const vo2Estimado = estimateVO2Max(completeUserData.tempo_5k, completeUserData.idade, completeUserData.sexo);
    const nivelPerformance = Math.min(100, (vo2Estimado / 65) * 100);
    
    const categorias = {
      iniciante: "Corredor Iniciante",
      intermediario: "Corredor Intermediário", 
      avancado: "Corredor Avançado",
      elite: "Corredor Elite"
    };

    const perfilCorredor = {
      categoria: categorias[completeUserData.nivel_corrida],
      nivel_performance: Math.round(nivelPerformance),
      potencial_genetico: Math.round(60 + Math.random() * 35),
      pontos_fortes: getPontosFortes(completeUserData),
      areas_melhoria: getAreasMelhoria(completeUserData),
    };

    // Análise de tempos
    const analiseTempos = {
      pace_5k: calculatePace(completeUserData.tempo_5k, 5),
      pace_10k: calculatePace(completeUserData.tempo_10k, 10),
      pace_21k: calculatePace(completeUserData.tempo_21k, 21.1),
      pace_42k: completeUserData.tempo_42k ? calculatePace(completeUserData.tempo_42k, 42.2) : "N/A",
      vo2_estimado: vo2Estimado,
      classificacao_idade: getClassificacaoIdade(vo2Estimado, completeUserData.idade, completeUserData.sexo),
    };

    // Plano de treinamento
    const planoTreinamento = gerarPlanoTreinamento(completeUserData);

    // Dicas de performance
    const dicasPerformance = {
      nutricao: [
        "Consuma carboidratos 2-3h antes do treino longo",
        "Repositor de carboidratos durante corridas >90min",
        "Proteína 20-30g até 30min pós-treino",
        "Hidrate com eletrólitos em dias quentes",
        "Evite alimentos novos no dia da prova"
      ],
      hidratacao: [
        "2-3L de água por dia, mais em treinos intensos",
        "Monitor a cor da urina (amarelo claro ideal)",
        "200-300ml a cada 15-20min durante a corrida",
        "Reponha 150% do peso perdido pós-treino",
        "Eletrólitos em treinos >60min"
      ],
      recuperacao: [
        "7-9h de sono por noite, especialmente pré-competição",
        "Dia de descanso completo por semana",
        "Massage ou foam roller 2-3x por semana",
        "Banho de gelo pós-treinos intensos",
        "Alongamento dinâmico pré, estático pós-treino"
      ],
      equipamentos: [
        "Tênis específico para seu tipo de pisada",
        "Troca de tênis a cada 600-800km",
        "Roupas técnicas que não causem atrito",
        "Relógio GPS para controle de pace",
        "Cinto de hidratação para treinos longos"
      ],
      tecnica: [
        "Cadência de 180 passos por minuto",
        "Aterrissagem no metatarso, não no calcanhar",
        "Postura ereta, olhar 20m à frente",
        "Braços relaxados, cotovelos 90°",
        "Respiração ritmada (2:2 ou 3:2)"
      ],
      mental: [
        "Visualização positiva da prova",
        "Divisão da prova em segmentos menores",
        "Mantras motivacionais preparados",
        "Estratégia para momentos difíceis",
        "Celebração de pequenas conquistas"
      ]
    };

    // Programa de força
    const programaForca = {
      frequencia: 2,
      exercicios: [
        {
          nome: "Agachamento",
          series: 3,
          repeticoes: "12-15",
          beneficio: "Fortalece quadríceps e glúteos",
          tecnica: "Pés paralelos, joelhos alinhados com pés"
        },
        {
          nome: "Levantamento terra",
          series: 3,
          repeticoes: "10-12",
          beneficio: "Fortalece cadeia posterior",
          tecnica: "Barra próxima ao corpo, costas retas"
        },
        {
          nome: "Panturrilha",
          series: 3,
          repeticoes: "15-20",
          beneficio: "Melhora propulsão e previne lesões",
          tecnica: "Movimento controlado, pausa no topo"
        },
        {
          nome: "Prancha lateral",
          series: 3,
          repeticoes: "30-60s",
          beneficio: "Estabilidade do core",
          tecnica: "Corpo alinhado, quadril elevado"
        },
        {
          nome: "Afundo",
          series: 3,
          repeticoes: "10 cada perna",
          beneficio: "Equilíbrio e força unilateral",
          tecnica: "Joelho não ultrapassa ponta do pé"
        }
      ]
    };

    // Estratégias de prova
    const estrategiasProva = {
      aquecimento: [
        "10-15min de trote leve",
        "Exercícios educativos (skipping, anfersen)",
        "3-4 tiros de 50m crescentes",
        "Alongamento dinâmico",
        "Hidratação leve"
      ],
      largada: [
        "Posicionamento adequado ao pace objetivo",
        "Primeiros 2km 10-15s mais lentos que o pace",
        "Economia de energia no início",
        "Evitar movimentos bruscos",
        "Manter calma no pelotão"
      ],
      meio_prova: [
        "Manter pace planejado",
        "Hidratação nos pontos programados",
        "Monitorar sensações corporais",
        "Usar outros corredores como referência",
        "Manter foco no presente"
      ],
      reta_final: [
        "Acelerar gradualmente últimos 20% da prova",
        "Usar reservas mentais preparadas",
        "Postura ereta, braços ativos",
        "Foco em cada 100m",
        "Sprint final se possível"
      ],
      pos_prova: [
        "Trote de volta à calma 10-15min",
        "Hidratação imediata",
        "Alongamento suave",
        "Análise da performance",
        "Descanso ativo nos dias seguintes"
      ]
    };

    // Projeções de tempo
    const metaSegundos = parseTimeToSeconds(completeUserData.meta_tempo);
    const tempoAtual5k = parseTimeToSeconds(completeUserData.tempo_5k);
    const melhoriaPossivel = Math.min(0.15, (completeUserData.prazo_objetivo / 52) * 0.2); // Até 15% melhoria/ano

    const projecoesTempos = {
      atual: {
        "5K": completeUserData.tempo_5k,
        "10K": completeUserData.tempo_10k,
        "21K": completeUserData.tempo_21k,
        "42K": completeUserData.tempo_42k || "N/A"
      },
      projetado_4_semanas: {
        "5K": formatSecondsToTime(Math.round(tempoAtual5k * (1 - melhoriaPossivel * 0.25))),
        "10K": formatSecondsToTime(Math.round(parseTimeToSeconds(completeUserData.tempo_10k) * (1 - melhoriaPossivel * 0.25))),
        "21K": formatSecondsToTime(Math.round(parseTimeToSeconds(completeUserData.tempo_21k) * (1 - melhoriaPossivel * 0.25))),
        "42K": "N/A"
      },
      projetado_12_semanas: {
        "5K": formatSecondsToTime(Math.round(tempoAtual5k * (1 - melhoriaPossivel * 0.75))),
        "10K": formatSecondsToTime(Math.round(parseTimeToSeconds(completeUserData.tempo_10k) * (1 - melhoriaPossivel * 0.75))),
        "21K": formatSecondsToTime(Math.round(parseTimeToSeconds(completeUserData.tempo_21k) * (1 - melhoriaPossivel * 0.75))),
        "42K": "N/A"
      },
      projetado_6_meses: {
        "5K": formatSecondsToTime(Math.round(tempoAtual5k * (1 - melhoriaPossivel))),
        "10K": formatSecondsToTime(Math.round(parseTimeToSeconds(completeUserData.tempo_10k) * (1 - melhoriaPossivel))),
        "21K": formatSecondsToTime(Math.round(parseTimeToSeconds(completeUserData.tempo_21k) * (1 - melhoriaPossivel))),
        "42K": formatSecondsToTime(Math.round(parseTimeToSeconds(completeUserData.tempo_21k) * 2.1 * (1 - melhoriaPossivel)))
      }
    };

    const scorePerformance = Math.round((nivelPerformance + (completeUserData.experiencia_anos * 5) + (completeUserData.frequencia_semanal * 10)) / 3);
    const probabilidadeMeta = Math.min(95, Math.max(15, 100 - Math.abs(metaSegundos - tempoAtual5k) / tempoAtual5k * 200));

    return {
      perfil_corredor: perfilCorredor,
      analise_tempos: analiseTempos,
      plano_treinamento: planoTreinamento,
      dicas_performance: dicasPerformance,
      programa_forca: programaForca,
      estrategias_prova: estrategiasProva,
      projecoes_tempo: projecoesTempos,
      score_performance: Math.min(100, scorePerformance),
      probabilidade_meta: Math.round(probabilidadeMeta),
      badges_conquistadas: ["Corredor Dedicado", "Metas Claras"],
    };
  };

  const getPontosFortes = (userData: RunnerUserData): string[] => {
    const pontos = [];
    if (userData.frequencia_semanal >= 4) pontos.push("Alta frequência de treinos");
    if (userData.experiencia_anos >= 3) pontos.push("Experiência sólida");
    if (userData.nivel_corrida === "avancado" || userData.nivel_corrida === "elite") pontos.push("Nível técnico elevado");
    if (userData.limitacoes_tempo >= 60) pontos.push("Tempo adequado para treinos");
    return pontos.length > 0 ? pontos : ["Motivação para melhorar", "Comprometimento com objetivos"];
  };

  const getAreasMelhoria = (userData: RunnerUserData): string[] => {
    const areas = [];
    if (userData.frequencia_semanal < 3) areas.push("Aumento da frequência de treinos");
    if (userData.experiencia_anos < 2) areas.push("Desenvolvimento de base aeróbia");
    if (!userData.equipamentos.includes("GPS")) areas.push("Controle de pace com tecnologia");
    if (userData.lesoes_historico) areas.push("Prevenção de lesões");
    return areas.length > 0 ? areas : ["Variação de treinos", "Trabalho de força"];
  };

  const getClassificacaoIdade = (vo2: number, idade: number, sexo: string): string => {
    const referencias = {
      masculino: {
        20: { excelente: 60, bom: 52, regular: 45 },
        30: { excelente: 58, bom: 50, regular: 43 },
        40: { excelente: 56, bom: 48, regular: 41 },
        50: { excelente: 54, bom: 46, regular: 39 }
      },
      feminino: {
        20: { excelente: 56, bom: 47, regular: 40 },
        30: { excelente: 54, bom: 45, regular: 38 },
        40: { excelente: 52, bom: 43, regular: 36 },
        50: { excelente: 50, bom: 41, regular: 34 }
      }
    };

    const faixaIdade = idade < 25 ? 20 : idade < 35 ? 30 : idade < 45 ? 40 : 50;
    const ref = referencias[sexo][faixaIdade];

    if (vo2 >= ref.excelente) return "Excelente";
    if (vo2 >= ref.bom) return "Bom";
    if (vo2 >= ref.regular) return "Regular";
    return "Abaixo da média";
  };

  const gerarPlanoTreinamento = (userData: RunnerUserData) => {
    const microciclos = [];
    const semanas = Math.min(16, userData.prazo_objetivo);

    for (let i = 1; i <= Math.min(4, semanas); i++) {
      const volumeBase = userData.distancia_atual * userData.frequencia_semanal;
      const incremento = i * 0.1;
      
      microciclos.push({
        semana: i,
        foco: i <= 2 ? "Base Aeróbica" : i === 3 ? "Desenvolvimento" : "Intensidade",
        volume_km: Math.round(volumeBase * (1 + incremento)),
        intensidade: i <= 2 ? "Baixa-Moderada" : i === 3 ? "Moderada" : "Moderada-Alta",
        treinos: gerarTreinosSemana(userData, i)
      });
    }

    return {
      duracao_semanas: semanas,
      periodizacao: "Linear com picos de intensidade",
      microciclos: microciclos
    };
  };

  const gerarTreinosSemana = (userData: RunnerUserData, semana: number) => {
    const paceBasico = calculatePace(userData.tempo_5k, 5);
    const paceTemporun = userData.tempo_10k ? calculatePace(userData.tempo_10k, 10) : paceBasico;
    
    return [
      {
        dia: "Segunda",
        tipo: "Descanso ou Cross-training",
        distancia: "0-5km",
        pace: "N/A",
        descricao: "Descanso ativo, natação ou bike",
        aquecimento: "5min caminhada",
        principal: "30-45min atividade alternativa",
        volta_calma: "5min alongamento"
      },
      {
        dia: "Terça",
        tipo: "Treino de Velocidade",
        distancia: "6-8km",
        pace: paceBasico,
        descricao: "Intervalados para melhorar VO2",
        aquecimento: "15min trote leve",
        principal: "6x400m (r:90s) + 10min regenerativo",
        volta_calma: "10min trote + alongamento"
      },
      {
        dia: "Quarta",
        tipo: "Treino Regenerativo",
        distancia: `${userData.distancia_atual}km`,
        pace: "Confortável",
        descricao: "Corrida leve para recuperação",
        aquecimento: "5min caminhada",
        principal: `${userData.distancia_atual}km pace confortável`,
        volta_calma: "5min caminhada + alongamento"
      },
      {
        dia: "Quinta",
        tipo: "Treino de Ritmo",
        distancia: "8-10km",
        pace: paceTemporun,
        descricao: "Treino no pace da prova",
        aquecimento: "15min progressivo",
        principal: "20-30min no pace objetivo",
        volta_calma: "10min regenerativo"
      },
      {
        dia: "Sexta",
        tipo: "Descanso",
        distancia: "0km",
        pace: "N/A",
        descricao: "Descanso completo",
        aquecimento: "N/A",
        principal: "Descanso total",
        volta_calma: "Alongamento leve (opcional)"
      },
      {
        dia: "Sábado",
        tipo: "Treino Longo",
        distancia: `${Math.round(userData.distancia_atual * 1.5 + semana)}km`,
        pace: "Aeróbico",
        descricao: "Desenvolvimento da resistência",
        aquecimento: "10min muito leve",
        principal: `${Math.round(userData.distancia_atual * 1.5 + semana)}km pace aeróbico`,
        volta_calma: "15min caminhada + alongamento"
      },
      {
        dia: "Domingo",
        tipo: "Recuperação Ativa",
        distancia: `${Math.round(userData.distancia_atual * 0.6)}km`,
        pace: "Muito leve",
        descricao: "Corrida muito leve",
        aquecimento: "5min caminhada",
        principal: `${Math.round(userData.distancia_atual * 0.6)}km muito leve`,
        volta_calma: "10min alongamento"
      }
    ];
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      setLoading(true);
      try {
        const calculatedResults = calculateResults();
        setResults(calculatedResults);

        // Gerar explicação personalizada
        const explicacao = {
          paragrafo: `Baseado no seu perfil de corredor ${userData.nivel_corrida}, com VO2 estimado de ${calculatedResults.analise_tempos.vo2_estimado} ml/kg/min e objetivo de ${userData.objetivo_principal}, criamos um plano científico personalizado. Seu score de performance é ${calculatedResults.score_performance}/100 com ${calculatedResults.probabilidade_meta}% de probabilidade de atingir sua meta.`,
          bullets: [
            `Treine ${calculatedResults.plano_treinamento.microciclos[0]?.volume_km || 25}km por semana inicialmente`,
            `Foque em ${calculatedResults.perfil_corredor.areas_melhoria[0] || 'desenvolvimento técnico'}`,
            `Siga ${calculatedResults.programa_forca.frequencia}x por semana o programa de força`,
            `Monitore seu pace: atual ${calculatedResults.analise_tempos.pace_5k}/km nos 5K`,
            `Projeção de melhoria: ${calculatedResults.projecoes_tempo.projetado_12_semanas["5K"]} em 12 semanas`
          ],
        };
        setExplanation(explicacao);

        // Gerar relatório
        if (user) {
          const reportSummary = generateReportSummary('corrida', calculatedResults);
          addReport({
            userId: user.uid,
            type: 'corrida',
            title: `Corrida Avançada - ${userData.nome || user?.name || 'Relatório'}`,
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
                  value={userData.nome || user?.name || ""}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Idade
                </label>
                <input
                  type="number"
                  min="16"
                  max="80"
                  value={userData.idade || ""}
                  onChange={(e) => handleInputChange("idade", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sexo
                </label>
                <select
                  value={userData.sexo || ""}
                  onChange={(e) => handleInputChange("sexo", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  min="40"
                  max="150"
                  step="0.1"
                  value={userData.peso_atual || ""}
                  onChange={(e) => handleInputChange("peso_atual", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 70.0"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  min="140"
                  max="220"
                  value={userData.altura || ""}
                  onChange={(e) => handleInputChange("altura", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 175"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nível na Corrida
                </label>
                <select
                  value={userData.nivel_corrida || ""}
                  onChange={(e) => handleInputChange("nivel_corrida", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante (até 1 ano)</option>
                  <option value="intermediario">Intermediário (1-3 anos)</option>
                  <option value="avancado">Avançado (3+ anos)</option>
                  <option value="elite">Elite/Competitivo</option>
                </select>
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
                  Anos de Experiência
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={userData.experiencia_anos || ""}
                  onChange={(e) => handleInputChange("experiencia_anos", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Frequência Semanal (treinos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={userData.frequencia_semanal || ""}
                  onChange={(e) => handleInputChange("frequencia_semanal", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 3"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Distância Atual Típica (km)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.5"
                  value={userData.distancia_atual || ""}
                  onChange={(e) => handleInputChange("distancia_atual", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 5.0"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Terreno Preferido
                </label>
                <select
                  value={userData.terreno_preferido || ""}
                  onChange={(e) => handleInputChange("terreno_preferido", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="asfalto">Asfalto/Rua</option>
                  <option value="esteira">Esteira</option>
                  <option value="trilha">Trilha</option>
                  <option value="pista">Pista de atletismo</option>
                  <option value="misto">Misto</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Tempos Pessoais (formato mm:ss ou hh:mm:ss)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Melhor Tempo 5K
                  </label>
                  <input
                    type="text"
                    value={userData.tempo_5k || ""}
                    onChange={(e) => handleInputChange("tempo_5k", e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 25:00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Melhor Tempo 10K (opcional)
                  </label>
                  <input
                    type="text"
                    value={userData.tempo_10k || ""}
                    onChange={(e) => handleInputChange("tempo_10k", e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 52:00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Melhor Tempo 21K (opcional)
                  </label>
                  <input
                    type="text"
                    value={userData.tempo_21k || ""}
                    onChange={(e) => handleInputChange("tempo_21k", e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 1:50:00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Melhor Tempo 42K (opcional)
                  </label>
                  <input
                    type="text"
                    value={userData.tempo_42k || ""}
                    onChange={(e) => handleInputChange("tempo_42k", e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 3:45:00"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Objetivo Principal
                </label>
                <select
                  value={userData.objetivo_principal || ""}
                  onChange={(e) => handleInputChange("objetivo_principal", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="5k">Melhorar tempo nos 5K</option>
                  <option value="10k">Melhorar tempo nos 10K</option>
                  <option value="21k">Meia Maratona (21K)</option>
                  <option value="42k">Maratona (42K)</option>
                  <option value="trail">Trail Running</option>
                  <option value="velocidade">Velocidade/Sprint</option>
                  <option value="resistencia">Resistência/Ultra</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Meta de Tempo
                </label>
                <input
                  type="text"
                  value={userData.meta_tempo || ""}
                  onChange={(e) => handleInputChange("meta_tempo", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 22:00 (para 5K)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Prazo para Objetivo (semanas)
                </label>
                <input
                  type="number"
                  min="4"
                  max="52"
                  value={userData.prazo_objetivo || ""}
                  onChange={(e) => handleInputChange("prazo_objetivo", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 12"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Zona Climática
                </label>
                <select
                  value={userData.zona_climatica || ""}
                  onChange={(e) => handleInputChange("zona_climatica", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="tropical">Tropical (quente e úmido)</option>
                  <option value="temperado">Temperado (moderado)</option>
                  <option value="frio">Frio (baixas temperaturas)</option>
                  <option value="arido">Árido (seco)</option>
                </select>
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
                  Tempo Disponível por Treino (minutos)
                </label>
                <input
                  type="number"
                  min="20"
                  max="180"
                  value={userData.limitacoes_tempo || ""}
                  onChange={(e) => handleInputChange("limitacoes_tempo", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 60"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Equipamentos Disponíveis (selecione todos que possui)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Relógio GPS", "Monitor Cardíaco", "Esteira", "Fones", "Cinto Hidratação", "Tênis Específico"].map((equip) => (
                    <label key={equip} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userData.equipamentos?.includes(equip) || false}
                        onChange={(e) => {
                          const equipamentos = userData.equipamentos || [];
                          if (e.target.checked) {
                            handleInputChange("equipamentos", [...equipamentos, equip]);
                          } else {
                            handleInputChange("equipamentos", equipamentos.filter(e => e !== equip));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{equip}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Histórico de Lesões
                </label>
                <textarea
                  value={userData.lesoes_historico || ""}
                  onChange={(e) => handleInputChange("lesoes_historico", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva lesões anteriores, limitações ou dores recorrentes..."
                />
              </div>
            </div>
          </div>
        );

      case 5:
        if (!results) return <div>Carregando resultados...</div>;

        return (
          <div className="space-y-8">
            {/* Header dos Resultados */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Seu Plano de Corrida Personalizado
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {results.perfil_corredor.categoria} • Performance científica
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

            {/* Métricas de Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {results.analise_tempos.vo2_estimado}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    VO2 Máx
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {results.analise_tempos.classificacao_idade}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.analise_tempos.pace_5k}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Pace 5K
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    min/km
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {results.score_performance}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Score Performance
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    /100 pontos
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {results.probabilidade_meta}%
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Chance Meta
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Probabilidade
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projeções de Tempo */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Projeções de Melhoria
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Evolução esperada dos seus tempos com treinamento consistente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Distância</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Atual</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">4 Semanas</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">12 Semanas</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">6 Meses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(results.projecoes_tempo.atual).map((distancia) => (
                        <tr key={distancia} className="border-b border-slate-100 dark:border-slate-700">
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{distancia}</td>
                          <td className="text-center py-3 px-4 text-slate-600 dark:text-slate-400">
                            {results.projecoes_tempo.atual[distancia]}
                          </td>
                          <td className="text-center py-3 px-4 text-blue-600 dark:text-blue-400">
                            {results.projecoes_tempo.projetado_4_semanas[distancia]}
                          </td>
                          <td className="text-center py-3 px-4 text-green-600 dark:text-green-400">
                            {results.projecoes_tempo.projetado_12_semanas[distancia]}
                          </td>
                          <td className="text-center py-3 px-4 font-bold text-purple-600 dark:text-purple-400">
                            {results.projecoes_tempo.projetado_6_meses[distancia]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Plano de Treinamento */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Plano de Treinamento Semanal
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {results.plano_treinamento.periodizacao} • {results.plano_treinamento.duracao_semanas} semanas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.plano_treinamento.microciclos.map((microciclo, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Semana {microciclo.semana} - {microciclo.foco}
                        </h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">{microciclo.volume_km}km</Badge>
                          <Badge variant="outline">{microciclo.intensidade}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {microciclo.treinos.slice(0, 6).map((treino, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-900 dark:text-white text-sm">
                                {treino.dia}
                              </span>
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                {treino.distancia}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                              {treino.tipo}
                            </div>
                            <div className="text-xs text-slate-700 dark:text-slate-300">
                              {treino.descricao}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dicas de Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Dicas de Nutrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.dicas_performance.nutricao.map((dica, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{dica}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Dicas de Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.dicas_performance.tecnica.map((dica, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{dica}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Programa de Força */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Activity className="w-5 h-5 text-red-500" />
                  Programa de Força Complementar
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {results.programa_forca.frequencia}x por semana, focado em prevenção e performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.programa_forca.exercicios.map((exercicio, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {exercicio.nome}
                        </span>
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          {exercicio.series}x {exercicio.repeticoes}
                        </span>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                        ✓ {exercicio.beneficio}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {exercicio.tecnica}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estratégias de Prova */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Route className="w-5 h-5 text-orange-500" />
                  Estratégias de Prova
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Guia completo para o dia da competição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">🏃‍♂️ Aquecimento</h4>
                    <div className="space-y-2">
                      {results.estrategias_prova.aquecimento.map((estrategia, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {estrategia}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">🚀 Largada</h4>
                    <div className="space-y-2">
                      {results.estrategias_prova.largada.map((estrategia, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {estrategia}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">🎯 Reta Final</h4>
                    <div className="space-y-2">
                      {results.estrategias_prova.reta_final.map((estrategia, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {estrategia}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recomendações Finais */}
            {explanation && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <Star className="w-5 h-5 text-yellow-500" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Corrida Avançada
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Programa científico personalizado para corredores iniciantes a profissionais
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
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
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
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600"
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
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analisando...
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

export default CorridaAvancada;
