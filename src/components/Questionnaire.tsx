import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Clock, User, Heart, Dumbbell, UtensilsCrossed, Target, BarChart3 } from 'lucide-react';
import StepOne from './questionnaire/StepOne';
import StepTwo from './questionnaire/StepTwo';
import StepThree from './questionnaire/StepThree';
import StepFour from './questionnaire/StepFour';
import StepFive from './questionnaire/StepFive';
import StepSix from './questionnaire/StepSix';
import StepSeven from './questionnaire/StepSeven';

// Schema de validação para cada etapa
const stepSchemas = {
  1: z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    idade: z.number().min(16, 'Idade mínima 16 anos').max(100, 'Idade máxima 100 anos'),
    sexo: z.enum(['masculino', 'feminino', 'outro']),
    altura: z.number().min(100, 'Altura mínima 100cm').max(250, 'Altura máxima 250cm'),
    peso_atual: z.number().min(30, 'Peso mínimo 30kg').max(300, 'Peso máximo 300kg'),
    peso_objetivo: z.number().min(30, 'Peso mínimo 30kg').max(300, 'Peso máximo 300kg'),
    prazo: z.number().min(4, 'Prazo mínimo 4 semanas').max(52, 'Prazo máximo 52 semanas'),
  }),
  2: z.object({
    condicoes_medicas: z.array(z.string()).optional(),
    medicamentos: z.string().optional(),
    lesoes: z.enum(['nenhuma', 'leves', 'atual']),
    detalhes_lesoes: z.string().optional(),
    acompanhamento_medico: z.enum(['regular', 'esporadico', 'nenhum']),
  }),
  3: z.object({
    tipo_trabalho: z.enum(['sedentario', 'moderado', 'ativo']),
    horarios_exercicio: z.array(z.string()).min(1, 'Selecione pelo menos um horário'),
    nivel_stress: z.number().min(1).max(10),
    qualidade_sono: z.enum(['excelente', 'boa', 'regular', 'ruim']),
    habitos_sociais: z.array(z.string()).optional(),
  }),
  4: z.object({
    nivel_atividade: z.enum(['sedentario', 'iniciante', 'intermediario', 'avancado']),
    tipos_exercicio: z.array(z.string()).min(1, 'Selecione pelo menos um tipo'),
    experiencia_academia: z.enum(['nunca', 'pouca', 'moderada', 'muita']),
    equipamentos: z.array(z.string()).min(1, 'Selecione pelo menos uma opção'),
    local_preferido: z.enum(['casa', 'academia', 'ar_livre', 'combinacao']),
  }),
  5: z.object({
    preferencias_alimentares: z.enum(['onivoro', 'vegetariano', 'vegano', 'pescetariano']),
    restricoes: z.array(z.string()).optional(),
    refeicoes_dia: z.number().min(2).max(8),
    habitos_alimentares: z.array(z.string()).min(1, 'Selecione pelo menos uma opção'),
    orcamento_alimentacao: z.enum(['baixo', 'medio', 'alto']),
    agua_dia: z.number().min(1).max(5),
  }),
  6: z.object({
    motivacao_principal: z.enum(['saude', 'estetica', 'autoestima', 'performance', 'medica']),
    tentativas_anteriores: z.enum(['primeira', 'algumas', 'muitas']),
    maior_dificuldade: z.enum(['tempo', 'motivacao', 'conhecimento', 'disciplina', 'resultados']),
    suporte_social: z.enum(['muito', 'moderado', 'pouco', 'nenhum']),
    expectativas_realistas: z.enum(['sim', 'nao', 'nao_sei']),
  }),
  7: z.object({
    bioimpedancia: z.string().optional(),
    exames_laboratoriais: z.string().optional(),
    cintura: z.number().optional(),
    quadril: z.number().optional(),
    braco: z.number().optional(),
    coxa: z.number().optional(),
    observacoes: z.string().optional(),
  }),
};

const steps = [
  {
    id: 1,
    title: 'Perfil Básico',
    description: 'Informações pessoais e objetivos',
    icon: User,
    duration: '2 min',
    component: StepOne,
  },
  {
    id: 2,
    title: 'Histórico de Saúde',
    description: 'Condições médicas e limitações',
    icon: Heart,
    duration: '3 min',
    component: StepTwo,
  },
  {
    id: 3,
    title: 'Estilo de Vida',
    description: 'Rotina diária e hábitos',
    icon: Clock,
    duration: '3 min',
    component: StepThree,
  },
  {
    id: 4,
    title: 'Experiência Fitness',
    description: 'Atividade física e preferências',
    icon: Dumbbell,
    duration: '4 min',
    component: StepFour,
  },
  {
    id: 5,
    title: 'Alimentação',
    description: 'Hábitos e preferências alimentares',
    icon: UtensilsCrossed,
    duration: '4 min',
    component: StepFive,
  },
  {
    id: 6,
    title: 'Objetivos e Motivação',
    description: 'Motivações e expectativas',
    icon: Target,
    duration: '3 min',
    component: StepSix,
  },
  {
    id: 7,
    title: 'Dados Avançados',
    description: 'Informações opcionais detalhadas',
    icon: BarChart3,
    duration: '2 min',
    component: StepSeven,
  },
];

export interface QuestionnaireProps {
  onComplete?: (data: any) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    mode: 'onChange',
  });

  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps.find(step => step.id === currentStep);
  const StepComponent = currentStepData.component;

  const handleNext = async (data) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const updatedFormData = { ...formData, [`step${currentStep}`]: data };
    setFormData(updatedFormData);

    if (currentStep === steps.length) {
      handleSubmit(updatedFormData);
    } else {
      setCurrentStep(currentStep + 1);
      form.reset();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalData) => {
    setIsSubmitting(true);
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calcular métricas
      const calculatedData = calculateMetrics(finalData);
      
      // Chamar callback de conclusão
      if (onComplete) {
        onComplete({ ...finalData, ...calculatedData });
      }
    } catch (error) {
      console.error('Erro ao processar questionário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateMetrics = (data) => {
    const step1 = data.step1;
    const altura = step1.altura / 100; // converter para metros
    const peso = step1.peso_atual;
    const pesoObjetivo = step1.peso_objetivo;
    const prazo = step1.prazo;
    const idade = step1.idade;
    const sexo = step1.sexo;

    // Calcular IMC
    const imc = peso / (altura * altura);
    
    // Calcular TMB (Taxa Metabólica Basal)
    let tmb;
    if (sexo === 'masculino') {
      tmb = 88.362 + (13.397 * peso) + (4.799 * (altura * 100)) - (5.677 * idade);
    } else {
      tmb = 447.593 + (9.247 * peso) + (3.098 * (altura * 100)) - (4.330 * idade);
    }

    // Calcular déficit calórico
    const diferencaPeso = peso - pesoObjetivo;
    const deficitTotal = diferencaPeso * 7700; // 7700 kcal por kg
    const deficitDiario = deficitTotal / (prazo * 7);
    const perdaSemanal = diferencaPeso / prazo;

    // Fator de atividade baseado no nível
    const step4 = data.step4;
    const fatoresAtividade = {
      sedentario: 1.2,
      iniciante: 1.375,
      intermediario: 1.55,
      avancado: 1.725
    };
    
    const fatorAtividade = fatoresAtividade[step4?.nivel_atividade] || 1.375;
    const gasto = tmb * fatorAtividade;
    const caloriasDiarias = Math.round(gasto - deficitDiario);

    return {
      imc: parseFloat(imc.toFixed(1)),
      classificacao_imc: getIMCClassification(imc),
      tmb: Math.round(tmb),
      gasto_energetico: Math.round(gasto),
      deficit_calorico: Math.round(deficitDiario),
      calorias_diarias: caloriasDiarias,
      perda_semanal: parseFloat(perdaSemanal.toFixed(1)),
      tempo_estimado: prazo,
    };
  };

  const getIMCClassification = (imc) => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade grau I';
    if (imc < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processando seus dados...</h3>
            <p className="text-gray-600 dark:text-gray-300">Gerando seu plano personalizado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Questionário Personalizado
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Responda algumas perguntas para criarmos seu plano ideal
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Etapa {currentStep} de {steps.length}
            </span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {currentStepData.duration}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex space-x-2 p-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center p-3 rounded-lg min-w-[120px] ${
                    isActive
                      ? 'bg-primary/20 dark:bg-primary/30 border-2 border-primary'
                      : isCompleted
                      ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                      : 'bg-gray-100 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-2 ${
                      isActive
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium text-center ${
                      isActive
                        ? 'text-primary' 
                        : isCompleted
                        ? 'text-green-900'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <currentStepData.icon className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StepComponent
              form={form}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoBack={currentStep > 1}
              isLastStep={currentStep === steps.length}
              defaultValues={formData[`step${currentStep}`]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

