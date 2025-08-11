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
  Smile,
  Clock,
  Target,
  Brain,
  Activity,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Calendar,
  Gauge,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useReportsStore, generateReportSummary } from "../../stores/reportsStore";
import NextStepsSection from "./components/NextStepsSection";

interface FlexibilityUserData {
  nome: string;
  idade: number;
  nivel_atividade: "sedentario" | "leve" | "moderado" | "ativo";
  tempo_disponivel: number;
  objetivo_principal: "postura" | "dor" | "performance" | "bem_estar";
  areas_problema: string[];
  nivel_dor: number;
  experiencia_yoga: "nenhuma" | "basica" | "intermediaria" | "avancada";
  preferencias: string[];
  limitacoes: string;
}

interface FlexibilityResults {
  perfil_postural: {
    categoria: string;
    areas_criticas: string[];
    pontuacao_flexibilidade: number;
  };
  programa_personalizado: {
    duracao_semanas: number;
    frequencia_semanal: number;
    sessoes: Array<{
      nome: string;
      duracao: number;
      foco: string;
      exercicios: Array<{
        nome: string;
        duracao: string;
        instrucoes: string;
        beneficios: string;
      }>;
    }>;
  };
  cronograma_diario: {
    manha: string[];
    trabalho: string[];
    noite: string[];
  };
  progressao_estimada: {
    semana_2: string;
    semana_4: string;
    semana_8: string;
    semana_12: string;
  };
  recomendacoes_lifestyle: string[];
  score_bem_estar: number;
}

const FlexibilidadeMobilidade: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<FlexibilityUserData>>({});
  const [results, setResults] = useState<FlexibilityResults | null>(null);
  const [loading, setLoading] = useState(false);
  const { addReport } = useReportsStore();
  const { user } = useAuth();

  const steps = [
    { id: 1, title: "Perfil Pessoal", description: "Dados básicos" },
    { id: 2, title: "Avaliação", description: "Condição atual" },
    { id: 3, title: "Objetivos", description: "Metas e preferências" },
    { id: 4, title: "Resultados", description: "Seu programa personalizado" },
  ];

  const handleInputChange = (field: keyof FlexibilityUserData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResults = (): FlexibilityResults => {
    const completeUserData: FlexibilityUserData = {
      nome: userData.nome || user?.name || "Usuário",
      idade: userData.idade || 30,
      nivel_atividade: userData.nivel_atividade || "leve",
      tempo_disponivel: userData.tempo_disponivel || 15,
      objetivo_principal: userData.objetivo_principal || "bem_estar",
      areas_problema: userData.areas_problema || [],
      nivel_dor: userData.nivel_dor || 0,
      experiencia_yoga: userData.experiencia_yoga || "nenhuma",
      preferencias: userData.preferencias || [],
      limitacoes: userData.limitacoes || "",
    };

    // Calcular perfil postural
    const pontuacaoFlexibilidade = Math.max(20, 100 - (completeUserData.nivel_dor * 10) - (completeUserData.idade * 0.5));
    
    const perfilPostural = {
      categoria: pontuacaoFlexibilidade > 80 ? "Excelente" : 
                 pontuacaoFlexibilidade > 60 ? "Boa" :
                 pontuacaoFlexibilidade > 40 ? "Regular" : "Precisa Atenção",
      areas_criticas: completeUserData.areas_problema.length > 0 
        ? completeUserData.areas_problema 
        : ["Coluna cervical", "Quadril", "Ombros"],
      pontuacao_flexibilidade: Math.round(pontuacaoFlexibilidade),
    };

    // Gerar programa baseado no objetivo
    const programas = {
      postura: {
        nome: "Correção Postural",
        exercicios: [
          {
            nome: "Alongamento de pescoço",
            duracao: "30s cada lado",
            instrucoes: "Incline a cabeça para o lado, segure suavemente",
            beneficios: "Alívio da tensão cervical"
          },
          {
            nome: "Abertura de peito",
            duracao: "45s",
            instrucoes: "Entrelace os dedos atrás das costas e eleve",
            beneficios: "Melhora da postura dos ombros"
          },
          {
            nome: "Flexão lateral da coluna",
            duracao: "30s cada lado",
            instrucoes: "Em pé, incline lateralmente mantendo alinhamento",
            beneficios: "Flexibilidade da coluna lateral"
          },
        ]
      },
      dor: {
        nome: "Alívio de Tensões",
        exercicios: [
          {
            nome: "Rotação suave do quadril",
            duracao: "1 min",
            instrucoes: "Movimentos circulares lentos e controlados",
            beneficios: "Mobilidade do quadril"
          },
          {
            nome: "Gato-vaca",
            duracao: "1 min",
            instrucoes: "Alterne entre arqueamento e flexão da coluna",
            beneficios: "Mobilidade vertebral"
          },
          {
            nome: "Torção sentada",
            duracao: "30s cada lado",
            instrucoes: "Sentado, gire o tronco mantendo quadril fixo",
            beneficios: "Flexibilidade da coluna torácica"
          },
        ]
      },
      performance: {
        nome: "Mobilidade Atlética",
        exercicios: [
          {
            nome: "Agachamento profundo",
            duracao: "1 min",
            instrucoes: "Mantenha a posição de agachamento completo",
            beneficios: "Mobilidade de quadril e tornozelo"
          },
          {
            nome: "Lunge dinâmico",
            duracao: "45s cada perna",
            instrucoes: "Movimento controlado de lunge com rotação",
            beneficios: "Flexibilidade de quadril em movimento"
          },
          {
            nome: "Ponte ativa",
            duracao: "45s",
            instrucoes: "Elevação controlada do quadril",
            beneficios: "Ativação de glúteos e mobilidade"
          },
        ]
      },
      bem_estar: {
        nome: "Relaxamento Total",
        exercicios: [
          {
            nome: "Respiração profunda",
            duracao: "2 min",
            instrucoes: "4 segundos inspirando, 6 expirando",
            beneficios: "Redução do estresse"
          },
          {
            nome: "Postura da criança",
            duracao: "1 min",
            instrucoes: "Ajoelhado, sente nos calcanhares e curve-se",
            beneficios: "Relaxamento da coluna"
          },
          {
            nome: "Alongamento de pernas na parede",
            duracao: "2 min",
            instrucoes: "Deitado, pernas apoiadas na parede",
            beneficios: "Circulação e relaxamento"
          },
        ]
      }
    };

    const programaEscolhido = programas[completeUserData.objetivo_principal];

    const programaPersonalizado = {
      duracao_semanas: 8,
      frequencia_semanal: Math.min(7, Math.floor(completeUserData.tempo_disponivel / 5) + 2),
      sessoes: [
        {
          nome: programaEscolhido.nome,
          duracao: completeUserData.tempo_disponivel,
          foco: completeUserData.objetivo_principal,
          exercicios: programaEscolhido.exercicios,
        },
        {
          nome: "Mobilidade Matinal",
          duracao: 10,
          foco: "energia",
          exercicios: [
            {
              nome: "Movimentos circulares",
              duracao: "30s cada articulação",
              instrucoes: "Ombros, quadril, tornozelos",
              beneficios: "Ativação articular"
            },
            {
              nome: "Alongamento dinâmico",
              duracao: "5 min",
              instrucoes: "Movimentos amplos e controlados",
              beneficios: "Preparação para o dia"
            }
          ]
        }
      ],
    };

    const cronogramaDiario = {
      manha: [
        "5 min de mobilidade articular",
        "Respiração profunda (2 min)",
        "Alongamento dinâmico leve"
      ],
      trabalho: [
        "Pausas de 2 min a cada hora",
        "Rotação de pescoço e ombros",
        "Alongamento de pulsos e dedos"
      ],
      noite: [
        "Programa principal de flexibilidade",
        "Exercícios de relaxamento",
        "Meditação ou respiração (5 min)"
      ]
    };

    const progressaoEstimada = {
      semana_2: "Redução inicial da rigidez, melhor consciência corporal",
      semana_4: "Aumento visível da amplitude de movimento, menos dor",
      semana_8: "Melhora significativa da flexibilidade, postura mais alinhada",
      semana_12: "Flexibilidade consolidada, movimentos mais fluidos"
    };

    const recomendacoesLifestyle = [
      "Mantenha hidratação adequada (2-3L/dia)",
      "Use pausas ativas durante o trabalho",
      "Varie as posições ao sentar/ficar em pé",
      "Pratique respiração consciente",
      "Use calor antes e frio após exercícios intensos"
    ];

    const scoreBemEstar = Math.round(
      (pontuacaoFlexibilidade * 0.4) + 
      (completeUserData.tempo_disponivel * 2) + 
      (10 - completeUserData.nivel_dor) * 5
    );

    return {
      perfil_postural: perfilPostural,
      programa_personalizado: programaPersonalizado,
      cronograma_diario: cronogramaDiario,
      progressao_estimada: progressaoEstimada,
      recomendacoes_lifestyle: recomendacoesLifestyle,
      score_bem_estar: Math.min(100, scoreBemEstar),
    };
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      setLoading(true);
      setTimeout(() => {
        const calculatedResults = calculateResults();
        setResults(calculatedResults);

        // Gerar relatório
        if (user) {
          const reportSummary = generateReportSummary('flexibilidade', calculatedResults);
          addReport({
            userId: user.uid,
            type: 'flexibilidade',
            title: `Flexibilidade & Mobilidade - ${userData.nome || user?.name || 'Relatório'}`,
            data: {
              userData: userData as Record<string, any>,
              results: calculatedResults as Record<string, any>,
            },
            summary: reportSummary,
          });
        }

        setLoading(false);
        setCurrentStep(4);
      }, 1500);
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
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  max="100"
                  value={userData.idade || ""}
                  onChange={(e) => handleInputChange("idade", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ex: 30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nível de Atividade
                </label>
                <select
                  value={userData.nivel_atividade || ""}
                  onChange={(e) => handleInputChange("nivel_atividade", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve</option>
                  <option value="moderado">Moderado</option>
                  <option value="ativo">Muito Ativo</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tempo Disponível (min/dia)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={userData.tempo_disponivel || ""}
                  onChange={(e) => handleInputChange("tempo_disponivel", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ex: 15"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Áreas com Problemas (selecione todas que se aplicam)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Pescoço", "Ombros", "Coluna", "Quadril", "Joelhos", "Tornozelos"].map((area) => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userData.areas_problema?.includes(area) || false}
                        onChange={(e) => {
                          const areas = userData.areas_problema || [];
                          if (e.target.checked) {
                            handleInputChange("areas_problema", [...areas, area]);
                          } else {
                            handleInputChange("areas_problema", areas.filter(a => a !== area));
                          }
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nível de Dor/Desconforto (0-10)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={userData.nivel_dor || 0}
                  onChange={(e) => handleInputChange("nivel_dor", Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  {userData.nivel_dor || 0}/10 - {
                    (userData.nivel_dor || 0) === 0 ? "Sem dor" :
                    (userData.nivel_dor || 0) <= 3 ? "Desconforto leve" :
                    (userData.nivel_dor || 0) <= 6 ? "Dor moderada" :
                    "Dor intensa"
                  }
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Experiência com Yoga/Alongamento
                </label>
                <select
                  value={userData.experiencia_yoga || ""}
                  onChange={(e) => handleInputChange("experiencia_yoga", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="nenhuma">Nenhuma</option>
                  <option value="basica">Básica</option>
                  <option value="intermediaria">Intermediária</option>
                  <option value="avancada">Avançada</option>
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
                  Objetivo Principal
                </label>
                <select
                  value={userData.objetivo_principal || ""}
                  onChange={(e) => handleInputChange("objetivo_principal", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="postura">Melhorar postura</option>
                  <option value="dor">Reduzir dor e tensão</option>
                  <option value="performance">Melhorar performance</option>
                  <option value="bem_estar">Bem-estar e relaxamento</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Limitações ou Restrições
                </label>
                <textarea
                  value={userData.limitacoes || ""}
                  onChange={(e) => handleInputChange("limitacoes", e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Lesões, cirurgias, limitações médicas..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        if (!results) return <div>Carregando resultados...</div>;

        return (
          <div className="space-y-8">
            {/* Header dos Resultados */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Seu Programa de Flexibilidade
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Desenvolvido especialmente para seu perfil
                  </p>
                </div>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gauge className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                    {results.perfil_postural.pontuacao_flexibilidade}
                  </div>
                  <div className="text-sm text-indigo-600 dark:text-indigo-400">
                    Score Flexibilidade
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {results.perfil_postural.categoria}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.programa_personalizado.frequencia_semanal}x
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Por Semana
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {results.programa_personalizado.duracao_semanas} semanas
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {results.score_bem_estar}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Score Bem-estar
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Potencial
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Programa Personalizado */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  Programa Personalizado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.programa_personalizado.sessoes.map((sessao, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{sessao.nome}</h4>
                        <Badge variant="outline">{sessao.duracao} min</Badge>
                      </div>
                      <div className="space-y-3">
                        {sessao.exercicios.map((exercicio, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-900 dark:text-white">{exercicio.nome}</span>
                              <span className="text-sm text-indigo-600 dark:text-indigo-400">{exercicio.duracao}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{exercicio.instrucoes}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">✓ {exercicio.beneficios}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cronograma Diário */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Clock className="w-5 h-5 text-green-500" />
                  Cronograma Diário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3">🌅 Manhã</h4>
                    <div className="space-y-2">
                      {results.cronograma_diario.manha.map((item, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">💼 Trabalho</h4>
                    <div className="space-y-2">
                      {results.cronograma_diario.trabalho.map((item, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">🌙 Noite</h4>
                    <div className="space-y-2">
                      {results.cronograma_diario.noite.map((item, index) => (
                        <div key={index} className="text-sm text-slate-700 dark:text-slate-300">
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progressão Estimada */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Progressão Estimada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Semana 2</h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{results.progressao_estimada.semana_2}</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Semana 4</h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{results.progressao_estimada.semana_4}</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Semana 8</h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{results.progressao_estimada.semana_8}</p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h5 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Semana 12</h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{results.progressao_estimada.semana_12}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recomendações */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Recomendações de Estilo de Vida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.recomendacoes_lifestyle.map((recomendacao, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {recomendacao}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <NextStepsSection />
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
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Smile className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Flexibilidade & Mobilidade
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Sistema completo de melhoria da flexibilidade com análise postural e rotinas personalizadas
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
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
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
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600"
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
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Calculando...
              </>
            ) : currentStep === 4 ? (
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

export default FlexibilidadeMobilidade;
