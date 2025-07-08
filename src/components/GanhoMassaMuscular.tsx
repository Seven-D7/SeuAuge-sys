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
  TrendingUp, 
  Dumbbell, 
  Brain, 
  Activity, 
  Calendar,
  Zap,
  Heart,
  Scale,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  BarChart3
} from 'lucide-react';

// Importar algoritmos avançados
import {
  GeneticFitnessProfile,
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
  peso_objetivo: number;
  prazo: number;
  
  // Dados específicos para hipertrofia
  nivel_experiencia: 'iniciante' | 'intermediario' | 'avancado';
  objetivo_principal: 'massa_geral' | 'forca' | 'definicao' | 'performance';
  dias_treino_semana: number;
  tempo_disponivel_sessao: number;
  local_treino: 'academia' | 'casa' | 'ambos';
  
  // Preferências e limitações
  grupos_musculares_foco: string[];
  lesoes_limitacoes: string;
  suplementacao_atual: string;
  experiencia_musculacao: number; // anos
  
  // Dados de composição corporal
  massa_gorda?: number;
  massa_magra?: number;
  massa_muscular?: number;
  
  // Dados de performance atual
  supino_1rm?: number;
  agachamento_1rm?: number;
  levantamento_terra_1rm?: number;
}

interface MuscleGainResults {
  // Métricas calculadas
  imc: number;
  classificacao_imc: string;
  tmb: number;
  gasto_energetico: number;
  calorias_bulking: number;
  superavit_calorico: number;
  ganho_semanal_estimado: number;
  tempo_estimado: number;
  
  // Análise avançada
  perfil_genetico: any;
  potencial_hipertrofia: number;
  volume_otimo_semanal: any;
  intensidade_recomendada: any;
  
  // Planos personalizados
  plano_treino_detalhado: any;
  plano_nutricional: any;
  cronograma_progressao: any;
  suplementacao_recomendada: string[];
  
  // Predições
  ganho_massa_6_meses: number;
  ganho_forca_estimado: any;
  fatores_limitantes: string[];
  recomendacoes_otimizacao: string[];
}

const GanhoMassaMuscular: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [results, setResults] = useState<MuscleGainResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Algoritmos especializados
  const [adaptiveEngine] = useState(new AdaptivePersonalizationEngine());

  const calculateMuscleGainMetrics = (data: UserData): MuscleGainResults => {
    // 1. Métricas básicas
    const altura_m = data.altura / 100;
    const imc = data.peso_atual / (altura_m * altura_m);
    
    let classificacao_imc = '';
    if (imc < 18.5) classificacao_imc = 'Abaixo do peso - Ideal para bulking';
    else if (imc < 25) classificacao_imc = 'Peso normal - Ótimo para ganho muscular';
    else if (imc < 30) classificacao_imc = 'Sobrepeso - Recomenda-se recomposição corporal';
    else classificacao_imc = 'Obesidade - Priorize emagrecimento primeiro';

    // 2. TMB com fórmula Mifflin-St Jeor
    let tmb: number;
    if (data.sexo === 'masculino') {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) + 5;
    } else {
      tmb = (10 * data.peso_atual) + (6.25 * data.altura) - (5 * data.idade) - 161;
    }

    // 3. Gasto energético ajustado para treino de força
    const fator_atividade_treino = {
      3: 1.5,  // 3 dias/semana
      4: 1.6,  // 4 dias/semana
      5: 1.7,  // 5 dias/semana
      6: 1.8   // 6+ dias/semana
    };
    const fator = fator_atividade_treino[Math.min(data.dias_treino_semana, 6) as keyof typeof fator_atividade_treino] || 1.5;
    const gasto_energetico = tmb * fator;

    // 4. Perfil genético e potencial
    const geneticProfile = new GeneticFitnessProfile({
      age: data.idade,
      sex: data.sexo,
      height: data.altura,
      weight: data.peso_atual,
      activityLevel: 'intenso' // Assumindo treino intenso para hipertrofia
    });

    // 5. Algoritmo de hipertrofia personalizado
    const hypertrophyAlgorithm = new HypertrophyAlgorithm(
      geneticProfile, 
      data.nivel_experiencia
    );

    // 6. Superávit calórico personalizado
    let superavit_base = 300; // Superávit conservador
    
    // Ajustar baseado no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      superavit_base = 400; // Melhor resposta a superávit maior
    }
    
    // Ajustar baseado na experiência
    if (data.nivel_experiencia === 'iniciante') {
      superavit_base = 500; // Iniciantes ganham músculo mais facilmente
    } else if (data.nivel_experiencia === 'avancado') {
      superavit_base = 200; // Avançados precisam ser mais conservadores
    }
    
    // Ajustar baseado na idade
    if (data.idade > 35) {
      superavit_base *= 0.8; // Metabolismo mais lento
    }
    
    // Ajustar baseado no IMC
    if (imc > 25) {
      superavit_base *= 0.7; // Reduzir ganho de gordura
    }

    const calorias_bulking = gasto_energetico + superavit_base;
    
    // 7. Estimativas de ganho
    let ganho_semanal_base = 0.25; // kg por semana (conservador)
    
    if (data.nivel_experiencia === 'iniciante') {
      ganho_semanal_base = 0.5; // Iniciantes ganham mais rápido
    } else if (data.nivel_experiencia === 'avancado') {
      ganho_semanal_base = 0.1; // Avançados ganham mais devagar
    }
    
    // Ajustar baseado no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      ganho_semanal_base *= 1.2;
    }

    const peso_a_ganhar = data.peso_objetivo - data.peso_atual;
    const tempo_estimado = peso_a_ganhar / ganho_semanal_base;

    // 8. Volume ótimo e intensidade
    const volume_otimo = hypertrophyAlgorithm.calculateOptimalVolume('chest'); // Volume base
    const intensidade_recomendada = hypertrophyAlgorithm.calculateOptimalIntensity();

    // 9. Potencial de hipertrofia (0-1)
    let potencial = 0.5; // Base
    
    // Fatores que aumentam o potencial
    if (data.idade < 30) potencial += 0.2;
    if (data.sexo === 'masculino') potencial += 0.1;
    if (data.nivel_experiencia === 'iniciante') potencial += 0.2;
    if (geneticProfile.geneticProfile.powerScore >= 4) potencial += 0.1;
    
    potencial = Math.min(potencial, 1.0);

    // 10. Fatores limitantes
    const fatores_limitantes: string[] = [];
    if (data.idade > 40) fatores_limitantes.push('Idade avançada - recuperação mais lenta');
    if (imc > 25) fatores_limitantes.push('Excesso de gordura corporal');
    if (data.dias_treino_semana < 3) fatores_limitantes.push('Frequência de treino insuficiente');
    if (data.tempo_disponivel_sessao < 45) fatores_limitantes.push('Tempo de treino limitado');
    if (data.nivel_experiencia === 'avancado') fatores_limitantes.push('Nível avançado - ganhos mais lentos');

    // 11. Recomendações de otimização
    const recomendacoes: string[] = [];
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      recomendacoes.push('Foque em exercícios compostos pesados (agachamento, supino, terra)');
      recomendacoes.push('Use cargas de 75-85% 1RM para hipertrofia');
    } else {
      recomendacoes.push('Inclua mais volume com cargas moderadas (65-75% 1RM)');
      recomendacoes.push('Priorize tempo sob tensão e conexão mente-músculo');
    }
    
    if (data.nivel_experiencia === 'iniciante') {
      recomendacoes.push('Foque na técnica perfeita antes de aumentar cargas');
      recomendacoes.push('Progrida gradualmente - aumente 2.5kg por semana');
    }
    
    if (potencial < 0.6) {
      recomendacoes.push('Considere periodização avançada');
      recomendacoes.push('Otimize recuperação com sono de qualidade (8h+)');
    }

    // 12. Plano de treino detalhado
    const plano_treino = generateDetailedWorkoutPlan(data, hypertrophyAlgorithm, geneticProfile);
    
    // 13. Plano nutricional para bulking
    const nutritionAlgorithm = new AdaptiveNutritionAlgorithm(data, 'muscle_gain');
    const plano_nutricional = generateBulkingNutrition(data, calorias_bulking);
    
    // 14. Cronograma de progressão
    const cronograma_progressao = generateProgressionSchedule(data, hypertrophyAlgorithm);
    
    // 15. Suplementação recomendada
    const suplementacao = generateSupplementRecommendations(data, geneticProfile);
    
    // 16. Predições de longo prazo
    const ganho_massa_6_meses = ganho_semanal_base * 24; // 6 meses
    const ganho_forca_estimado = calculateStrengthGains(data, geneticProfile);

    return {
      imc: Math.round(imc * 10) / 10,
      classificacao_imc,
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gasto_energetico),
      calorias_bulking: Math.round(calorias_bulking),
      superavit_calorico: superavit_base,
      ganho_semanal_estimado: Math.round(ganho_semanal_base * 1000) / 1000,
      tempo_estimado: Math.round(tempo_estimado),
      perfil_genetico: geneticProfile.geneticProfile,
      potencial_hipertrofia: Math.round(potencial * 100) / 100,
      volume_otimo_semanal: volume_otimo,
      intensidade_recomendada,
      plano_treino_detalhado: plano_treino,
      plano_nutricional,
      cronograma_progressao,
      suplementacao_recomendada: suplementacao,
      ganho_massa_6_meses: Math.round(ganho_massa_6_meses * 100) / 100,
      ganho_forca_estimado,
      fatores_limitantes,
      recomendacoes_otimizacao: recomendacoes
    };
  };

  const generateDetailedWorkoutPlan = (data: UserData, algorithm: any, geneticProfile: any) => {
    const workoutPlan = algorithm.generateWorkoutPlan('hypertrophy', data.dias_treino_semana);
    
    // Personalizar baseado nas preferências
    const exercicios_por_grupo = {
      peito: [
        { nome: 'Supino reto', series: 4, reps: '6-8', carga: '80-85%' },
        { nome: 'Supino inclinado', series: 3, reps: '8-10', carga: '75-80%' },
        { nome: 'Crucifixo', series: 3, reps: '10-12', carga: '70-75%' }
      ],
      costas: [
        { nome: 'Levantamento terra', series: 4, reps: '5-6', carga: '85-90%' },
        { nome: 'Puxada alta', series: 4, reps: '8-10', carga: '75-80%' },
        { nome: 'Remada curvada', series: 3, reps: '8-10', carga: '75-80%' }
      ],
      pernas: [
        { nome: 'Agachamento', series: 4, reps: '6-8', carga: '80-85%' },
        { nome: 'Leg press', series: 3, reps: '10-12', carga: '70-75%' },
        { nome: 'Stiff', series: 3, reps: '8-10', carga: '75-80%' }
      ],
      ombros: [
        { nome: 'Desenvolvimento militar', series: 4, reps: '6-8', carga: '80-85%' },
        { nome: 'Elevação lateral', series: 3, reps: '10-12', carga: '70-75%' },
        { nome: 'Elevação posterior', series: 3, reps: '12-15', carga: '65-70%' }
      ],
      bracos: [
        { nome: 'Rosca direta', series: 3, reps: '8-10', carga: '75-80%' },
        { nome: 'Tríceps testa', series: 3, reps: '8-10', carga: '75-80%' },
        { nome: 'Martelo', series: 3, reps: '10-12', carga: '70-75%' }
      ]
    };

    // Ajustar baseado no local de treino
    if (data.local_treino === 'casa') {
      // Adaptar exercícios para casa
      exercicios_por_grupo.peito = [
        { nome: 'Flexão de braço', series: 4, reps: '8-12', carga: 'Peso corporal' },
        { nome: 'Flexão inclinada', series: 3, reps: '10-15', carga: 'Peso corporal' },
        { nome: 'Flexão com halteres', series: 3, reps: '10-12', carga: 'Halteres' }
      ];
    }

    return {
      divisao: data.dias_treino_semana >= 5 ? 'Push/Pull/Legs' : 'Upper/Lower',
      frequencia: data.dias_treino_semana,
      duracao_sessao: data.tempo_disponivel_sessao,
      exercicios_por_grupo,
      descanso_entre_series: workoutPlan.restBetweenSets,
      progressao: workoutPlan.progression,
      observacoes: [
        'Aqueça sempre antes de treinar',
        'Mantenha técnica perfeita',
        'Progrida gradualmente nas cargas',
        'Descanse adequadamente entre treinos'
      ]
    };
  };

  const generateBulkingNutrition = (data: UserData, calorias: number) => {
    // Distribuição otimizada para ganho muscular
    const proteina_percent = 0.25; // 25% proteína (2g/kg peso)
    const carbo_percent = 0.45;    // 45% carboidratos
    const gordura_percent = 0.30;  // 30% gorduras

    const proteina_g = Math.round((calorias * proteina_percent) / 4);
    const carbo_g = Math.round((calorias * carbo_percent) / 4);
    const gordura_g = Math.round((calorias * gordura_percent) / 9);

    // Timing nutricional otimizado
    const timing_refeicoes = {
      pre_treino: {
        timing: '60-90 min antes',
        macros: 'Carboidratos + Proteína moderada',
        exemplo: 'Aveia com whey protein e banana'
      },
      pos_treino: {
        timing: '30-60 min depois',
        macros: 'Carboidratos + Proteína rápida',
        exemplo: 'Whey protein + dextrose ou batata doce'
      },
      antes_dormir: {
        timing: '1-2h antes de dormir',
        macros: 'Proteína lenta + Gorduras',
        exemplo: 'Caseína ou queijo cottage com oleaginosas'
      }
    };

    return {
      calorias_diarias: calorias,
      macronutrientes: {
        proteina: proteina_g,
        carboidratos: carbo_g,
        gorduras: gordura_g
      },
      proteina_por_kg: Math.round((proteina_g / data.peso_atual) * 10) / 10,
      timing_refeicoes,
      alimentos_recomendados: {
        proteinas: ['Frango', 'Carne vermelha magra', 'Peixes', 'Ovos', 'Whey protein'],
        carboidratos: ['Arroz', 'Batata doce', 'Aveia', 'Quinoa', 'Frutas'],
        gorduras: ['Abacate', 'Oleaginosas', 'Azeite', 'Salmão', 'Gema de ovo']
      },
      hidratacao: '35-40ml por kg de peso corporal',
      dicas_especiais: [
        'Faça 5-6 refeições por dia',
        'Não pule o café da manhã',
        'Priorize alimentos integrais',
        'Monitore o ganho de peso semanalmente'
      ]
    };
  };

  const generateProgressionSchedule = (data: UserData, algorithm: any) => {
    const progression = algorithm.calculateProgression();
    
    return {
      fase_1: {
        duracao: '4-6 semanas',
        foco: 'Adaptação anatômica',
        volume: 'Moderado',
        intensidade: '65-75% 1RM',
        progressao: 'Aumento gradual de volume'
      },
      fase_2: {
        duracao: '6-8 semanas',
        foco: 'Hipertrofia máxima',
        volume: 'Alto',
        intensidade: '70-80% 1RM',
        progressao: 'Aumento de carga e volume'
      },
      fase_3: {
        duracao: '4 semanas',
        foco: 'Intensificação',
        volume: 'Moderado',
        intensidade: '80-85% 1RM',
        progressao: 'Foco em cargas máximas'
      },
      deload: {
        frequencia: 'A cada 4-6 semanas',
        duracao: '1 semana',
        reducao: '40-50% do volume normal'
      },
      avaliacoes: {
        peso_corporal: 'Semanal',
        medidas_corporais: 'Quinzenal',
        fotos_progresso: 'Mensal',
        testes_forca: 'A cada 6-8 semanas'
      }
    };
  };

  const generateSupplementRecommendations = (data: UserData, geneticProfile: any) => {
    const suplementos_basicos = ['Whey Protein', 'Creatina', 'Multivitamínico'];
    const suplementos_opcionais = [];

    // Baseado no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      suplementos_opcionais.push('Beta-alanina', 'HMB');
    } else {
      suplementos_opcionais.push('BCAA', 'Glutamina');
    }

    // Baseado na idade
    if (data.idade > 35) {
      suplementos_opcionais.push('ZMA', 'Ômega 3');
    }

    // Baseado na experiência
    if (data.nivel_experiencia === 'avancado') {
      suplementos_opcionais.push('Citrulina', 'Pré-treino');
    }

    return [...suplementos_basicos, ...suplementos_opcionais];
  };

  const calculateStrengthGains = (data: UserData, geneticProfile: any) => {
    // Estimativas baseadas em nível de experiência
    const ganhos_base = {
      iniciante: { supino: 1.5, agachamento: 2.0, terra: 2.5 }, // kg por mês
      intermediario: { supino: 0.8, agachamento: 1.2, terra: 1.5 },
      avancado: { supino: 0.3, agachamento: 0.5, terra: 0.8 }
    };

    const ganhos = ganhos_base[data.nivel_experiencia];
    
    // Ajustar baseado no perfil genético
    if (geneticProfile.geneticProfile.dominantType === 'power') {
      Object.keys(ganhos).forEach(key => {
        ganhos[key as keyof typeof ganhos] *= 1.2;
      });
    }

    return {
      supino_6_meses: Math.round(ganhos.supino * 6),
      agachamento_6_meses: Math.round(ganhos.agachamento * 6),
      terra_6_meses: Math.round(ganhos.terra * 6)
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
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const calculatedResults = calculateMuscleGainMetrics(userData as UserData);
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
                Informações básicas para análise personalizada
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
                    placeholder="80.0"
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
                <Dumbbell className="h-5 w-5" />
                Experiência e Objetivos
              </CardTitle>
              <CardDescription>
                Informações sobre seu nível atual e metas específicas
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
                    <SelectItem value="iniciante">Iniciante (0-1 ano de treino)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (1-3 anos de treino)</SelectItem>
                    <SelectItem value="avancado">Avançado (3+ anos de treino)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="objetivo_principal">Objetivo Principal</Label>
                <Select onValueChange={(value) => setUserData({...userData, objetivo_principal: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="massa_geral">Ganho de massa muscular geral</SelectItem>
                    <SelectItem value="forca">Aumento de força</SelectItem>
                    <SelectItem value="definicao">Definição muscular</SelectItem>
                    <SelectItem value="performance">Performance atlética</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experiencia_anos">Anos de Musculação</Label>
                  <Input
                    id="experiencia_anos"
                    type="number"
                    step="0.5"
                    value={userData.experiencia_musculacao || ''}
                    onChange={(e) => setUserData({...userData, experiencia_musculacao: parseFloat(e.target.value)})}
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="prazo">Prazo para Meta (meses)</Label>
                  <Input
                    id="prazo"
                    type="number"
                    value={userData.prazo || ''}
                    onChange={(e) => setUserData({...userData, prazo: parseInt(e.target.value)})}
                    placeholder="6"
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
                <Calendar className="h-5 w-5" />
                Planejamento de Treino
              </CardTitle>
              <CardDescription>
                Configure sua rotina de treinos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dias_treino">Dias de Treino por Semana</Label>
                  <Select onValueChange={(value) => setUserData({...userData, dias_treino_semana: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="4">4 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="6">6 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tempo_sessao">Tempo por Sessão (minutos)</Label>
                  <Select onValueChange={(value) => setUserData({...userData, tempo_disponivel_sessao: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                      <SelectItem value="75">75 minutos</SelectItem>
                      <SelectItem value="90">90 minutos</SelectItem>
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
                    <SelectItem value="academia">Academia</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Grupos Musculares de Foco (selecione até 3)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core'].map((grupo) => (
                    <label key={grupo} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const grupos = userData.grupos_musculares_foco || [];
                          if (e.target.checked && grupos.length < 3) {
                            setUserData({...userData, grupos_musculares_foco: [...grupos, grupo]});
                          } else if (!e.target.checked) {
                            setUserData({...userData, grupos_musculares_foco: grupos.filter(g => g !== grupo)});
                          }
                        }}
                        disabled={(userData.grupos_musculares_foco?.length || 0) >= 3 && !(userData.grupos_musculares_foco?.includes(grupo))}
                      />
                      <span className="text-sm">{grupo}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Atual (Opcional)
              </CardTitle>
              <CardDescription>
                Dados de força atual para cálculos mais precisos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Se você conhece suas cargas máximas, isso ajudará a personalizar melhor seu treino.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="supino_1rm">Supino 1RM (kg)</Label>
                  <Input
                    id="supino_1rm"
                    type="number"
                    step="2.5"
                    value={userData.supino_1rm || ''}
                    onChange={(e) => setUserData({...userData, supino_1rm: parseFloat(e.target.value)})}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="agachamento_1rm">Agachamento 1RM (kg)</Label>
                  <Input
                    id="agachamento_1rm"
                    type="number"
                    step="2.5"
                    value={userData.agachamento_1rm || ''}
                    onChange={(e) => setUserData({...userData, agachamento_1rm: parseFloat(e.target.value)})}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="terra_1rm">Levantamento Terra 1RM (kg)</Label>
                  <Input
                    id="terra_1rm"
                    type="number"
                    step="2.5"
                    value={userData.levantamento_terra_1rm || ''}
                    onChange={(e) => setUserData({...userData, levantamento_terra_1rm: parseFloat(e.target.value)})}
                    placeholder="120"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lesoes">Lesões ou Limitações</Label>
                <Textarea
                  id="lesoes"
                  value={userData.lesoes_limitacoes || ''}
                  onChange={(e) => setUserData({...userData, lesoes_limitacoes: e.target.value})}
                  placeholder="Descreva qualquer lesão, dor ou limitação física..."
                  rows={3}
                />
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
                Composição Corporal e Suplementação
              </CardTitle>
              <CardDescription>
                Dados opcionais para otimização máxima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="massa_gorda">Massa Gorda (%)</Label>
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
                    placeholder="65.2"
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
                    placeholder="55.8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="suplementacao">Suplementação Atual</Label>
                <Textarea
                  id="suplementacao"
                  value={userData.suplementacao_atual || ''}
                  onChange={(e) => setUserData({...userData, suplementacao_atual: e.target.value})}
                  placeholder="Ex: Whey protein, creatina, multivitamínico..."
                  rows={2}
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-800">Calculando Plano de Hipertrofia</h2>
          <p className="text-gray-600">Aplicando algoritmos de otimização muscular...</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">✓ Analisando perfil genético</p>
            <p className="text-sm text-gray-500">✓ Calculando volume ótimo</p>
            <p className="text-sm text-gray-500">✓ Otimizando intensidade</p>
            <p className="text-sm text-gray-500">✓ Gerando cronograma de progressão</p>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Plano de Hipertrofia Personalizado</h1>
            <p className="text-gray-600">Análise científica para ganho de massa muscular</p>
          </div>

          {/* Potencial de Hipertrofia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Potencial de Hipertrofia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span>Potencial Genético</span>
                    <span className="font-bold">{(results.potencial_hipertrofia * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={results.potencial_hipertrofia * 100} className="h-3" />
                </div>
                <Badge variant={results.potencial_hipertrofia > 0.7 ? "default" : results.potencial_hipertrofia > 0.5 ? "secondary" : "outline"}>
                  {results.potencial_hipertrofia > 0.7 ? "Alto" : results.potencial_hipertrofia > 0.5 ? "Moderado" : "Limitado"}
                </Badge>
              </div>
              
              {results.fatores_limitantes.length > 0 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fatores Limitantes:</strong>
                    <ul className="list-disc list-inside mt-2">
                      {results.fatores_limitantes.map((fator, index) => (
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
                <p className="text-xs text-gray-600">{results.classificacao_imc}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Calorias Bulking</span>
                </div>
                <p className="text-2xl font-bold">{results.calorias_bulking}</p>
                <p className="text-xs text-gray-600">+{results.superavit_calorico} kcal</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Ganho Semanal</span>
                </div>
                <p className="text-2xl font-bold">{results.ganho_semanal_estimado}kg</p>
                <p className="text-xs text-gray-600">{results.tempo_estimado} semanas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Ganho 6 Meses</span>
                </div>
                <p className="text-2xl font-bold">{results.ganho_massa_6_meses}kg</p>
                <p className="text-xs text-gray-600">Estimativa</p>
              </CardContent>
            </Card>
          </div>

          {/* Perfil Genético */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Análise Genética
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

          {/* Volume e Intensidade Ótimos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Volume Ótimo Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Mínimo:</span>
                    <span className="font-medium">{results.volume_otimo_semanal.min} sets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ótimo:</span>
                    <span className="font-medium">{results.volume_otimo_semanal.optimal} sets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Máximo:</span>
                    <span className="font-medium">{results.volume_otimo_semanal.max} sets</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Intensidade Recomendada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Força:</span>
                    <span className="font-medium">{results.intensidade_recomendada.strength.min}-{results.intensidade_recomendada.strength.max}% 1RM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hipertrofia:</span>
                    <span className="font-medium">{results.intensidade_recomendada.hypertrophy.min}-{results.intensidade_recomendada.hypertrophy.max}% 1RM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resistência:</span>
                    <span className="font-medium">{results.intensidade_recomendada.endurance.min}-{results.intensidade_recomendada.endurance.max}% 1RM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plano de Treino Detalhado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Plano de Treino Detalhado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Estrutura</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Divisão:</strong> {results.plano_treino_detalhado.divisao}</li>
                    <li>• <strong>Frequência:</strong> {results.plano_treino_detalhado.frequencia}x/semana</li>
                    <li>• <strong>Duração:</strong> {results.plano_treino_detalhado.duracao_sessao} min</li>
                    <li>• <strong>Descanso:</strong> {results.plano_treino_detalhado.descanso_entre_series.min}-{results.plano_treino_detalhado.descanso_entre_series.max}s</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Progressão</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Peso:</strong> +{results.plano_treino_detalhado.progressao.weightIncrease}kg/{results.plano_treino_detalhado.progressao.frequency}</li>
                    <li>• <strong>Volume:</strong> +{results.plano_treino_detalhado.progressao.volumeIncrease}%/mês</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Exercícios por Grupo Muscular</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(results.plano_treino_detalhado.exercicios_por_grupo).map(([grupo, exercicios]: [string, any]) => (
                    <div key={grupo} className="border rounded-lg p-3">
                      <h5 className="font-medium capitalize mb-2">{grupo}</h5>
                      <div className="space-y-1">
                        {exercicios.slice(0, 3).map((exercicio: any, index: number) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{exercicio.nome}</span>
                            <br />
                            <span className="text-gray-600">{exercicio.series}x{exercicio.repeticoes}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plano Nutricional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Plano Nutricional para Bulking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Macronutrientes Diários</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Proteínas:</span>
                      <span className="font-medium">{results.plano_nutricional.macronutrientes.proteina}g ({results.plano_nutricional.proteina_por_kg}g/kg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carboidratos:</span>
                      <span className="font-medium">{results.plano_nutricional.macronutrientes.carboidratos}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gorduras:</span>
                      <span className="font-medium">{results.plano_nutricional.macronutrientes.gorduras}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hidratação:</span>
                      <span className="font-medium">{results.plano_nutricional.hidratacao}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Timing Nutricional</h4>
                  <div className="space-y-3">
                    <div className="border-l-2 border-green-200 pl-3">
                      <p className="font-medium text-sm">Pré-treino ({results.plano_nutricional.timing_refeicoes.pre_treino.timing})</p>
                      <p className="text-xs text-gray-600">{results.plano_nutricional.timing_refeicoes.pre_treino.exemplo}</p>
                    </div>
                    <div className="border-l-2 border-blue-200 pl-3">
                      <p className="font-medium text-sm">Pós-treino ({results.plano_nutricional.timing_refeicoes.pos_treino.timing})</p>
                      <p className="text-xs text-gray-600">{results.plano_nutricional.timing_refeicoes.pos_treino.exemplo}</p>
                    </div>
                    <div className="border-l-2 border-purple-200 pl-3">
                      <p className="font-medium text-sm">Antes de dormir ({results.plano_nutricional.timing_refeicoes.antes_dormir.timing})</p>
                      <p className="text-xs text-gray-600">{results.plano_nutricional.timing_refeicoes.antes_dormir.exemplo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cronograma de Progressão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma de Progressão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800">Fase 1: {results.cronograma_progressao.fase_1.duracao}</h5>
                  <p className="text-sm text-green-700 mt-1">{results.cronograma_progressao.fase_1.foco}</p>
                  <p className="text-xs text-green-600 mt-2">Intensidade: {results.cronograma_progressao.fase_1.intensidade}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800">Fase 2: {results.cronograma_progressao.fase_2.duracao}</h5>
                  <p className="text-sm text-blue-700 mt-1">{results.cronograma_progressao.fase_2.foco}</p>
                  <p className="text-xs text-blue-600 mt-2">Intensidade: {results.cronograma_progressao.fase_2.intensidade}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold text-purple-800">Fase 3: {results.cronograma_progressao.fase_3.duracao}</h5>
                  <p className="text-sm text-purple-700 mt-1">{results.cronograma_progressao.fase_3.foco}</p>
                  <p className="text-xs text-purple-600 mt-2">Intensidade: {results.cronograma_progressao.fase_3.intensidade}</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <h5 className="font-semibold text-yellow-800">Deload: {results.cronograma_progressao.deload.frequencia}</h5>
                <p className="text-sm text-yellow-700">Redução de {results.cronograma_progressao.deload.reducao} por {results.cronograma_progressao.deload.duracao}</p>
              </div>
            </CardContent>
          </Card>

          {/* Predições de Força */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predições de Ganho de Força (6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Supino</p>
                  <p className="text-2xl font-bold text-blue-600">+{results.ganho_forca_estimado.supino_6_meses}kg</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Agachamento</p>
                  <p className="text-2xl font-bold text-green-600">+{results.ganho_forca_estimado.agachamento_6_meses}kg</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Levantamento Terra</p>
                  <p className="text-2xl font-bold text-purple-600">+{results.ganho_forca_estimado.terra_6_meses}kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suplementação Recomendada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Suplementação Recomendada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {results.suplementacao_recomendada.map((suplemento, index) => (
                  <Badge key={index} variant="outline" className="justify-center p-2">
                    {suplemento}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendações de Otimização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recomendações de Otimização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recomendacoes_otimizacao.map((recomendacao, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recomendacao}</span>
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Ganho de Massa Muscular Inteligente</h1>
          <p className="text-gray-600">Algoritmos avançados de hipertrofia personalizada</p>
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

export default GanhoMassaMuscular;

