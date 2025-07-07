import React from 'react';

export interface ReportProps {
  data: any;
  onBack: () => void;
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Share2, 
  User, 
  Target, 
  TrendingDown, 
  Calendar,
  Dumbbell,
  UtensilsCrossed,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Heart,
  Droplets,
  Clock
} from 'lucide-react';

// Dados de exemplo para o gráfico de progresso
const progressData = [
  { semana: 0, peso: 85, meta: 75 },
  { semana: 2, peso: 83.5, meta: 75 },
  { semana: 4, peso: 82, meta: 75 },
  { semana: 6, peso: 80.5, meta: 75 },
  { semana: 8, peso: 79, meta: 75 },
  { semana: 10, peso: 77.5, meta: 75 },
  { semana: 12, peso: 75, meta: 75 },
];

// Dados para o gráfico de macronutrientes
const macroData = [
  { name: 'Proteínas', value: 30, color: '#3b82f6' },
  { name: 'Carboidratos', value: 40, color: '#10b981' },
  { name: 'Gorduras', value: 30, color: '#f59e0b' },
];

export default function Report({ data, onBack }: ReportProps) {
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Nenhum dado de relatório disponível.</p>
            <Button variant="default" size="sm" onClick={onBack} className="mt-4">
              Voltar ao Questionário
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const step1 = data.step1 || {};
  const metrics = data;

  const getIMCColor = (imc) => {
    if (imc < 18.5) return 'text-blue-600';
    if (imc < 25) return 'text-green-600';
    if (imc < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const generateWorkoutPlan = () => {
    const step4 = data.step4 || {};
    const nivel = step4.nivel_atividade || 'iniciante';
    
    const workouts = {
      sedentario: [
        { dia: 'Segunda', tipo: 'Caminhada', exercicios: ['Caminhada leve - 20 min', 'Alongamento - 10 min'] },
        { dia: 'Quarta', tipo: 'Exercícios básicos', exercicios: ['Agachamento - 2x8', 'Flexão de braço (joelhos) - 2x5'] },
        { dia: 'Sexta', tipo: 'Caminhada', exercicios: ['Caminhada moderada - 25 min', 'Respiração - 5 min'] },
      ],
      iniciante: [
        { dia: 'Segunda', tipo: 'Treino de força', exercicios: ['Agachamento - 3x10', 'Flexão de braço - 3x8', 'Prancha - 3x30s'] },
        { dia: 'Terça', tipo: 'Cardio', exercicios: ['Caminhada rápida - 30 min', 'Polichinelos - 3x15'] },
        { dia: 'Quinta', tipo: 'Treino de força', exercicios: ['Lunges - 3x10', 'Abdominais - 3x15', 'Ponte - 3x12'] },
        { dia: 'Sábado', tipo: 'Atividade livre', exercicios: ['Dança, esporte ou caminhada - 45 min'] },
      ],
      intermediario: [
        { dia: 'Segunda', tipo: 'Treino superior', exercicios: ['Flexão - 4x12', 'Remada - 4x10', 'Desenvolvimento - 4x10'] },
        { dia: 'Terça', tipo: 'HIIT', exercicios: ['Burpees - 4x8', 'Mountain climbers - 4x20', 'Jump squats - 4x12'] },
        { dia: 'Quarta', tipo: 'Treino inferior', exercicios: ['Agachamento - 4x15', 'Afundo - 4x12', 'Stiff - 4x12'] },
        { dia: 'Quinta', tipo: 'Cardio', exercicios: ['Corrida - 40 min', 'Abdominais - 4x20'] },
        { dia: 'Sexta', tipo: 'Treino funcional', exercicios: ['Circuito funcional - 45 min'] },
      ],
      avancado: [
        { dia: 'Segunda', tipo: 'Peito/Tríceps', exercicios: ['Supino - 4x12', 'Inclinado - 4x10', 'Tríceps - 4x12'] },
        { dia: 'Terça', tipo: 'Costas/Bíceps', exercicios: ['Puxada - 4x12', 'Remada - 4x10', 'Bíceps - 4x12'] },
        { dia: 'Quarta', tipo: 'Pernas', exercicios: ['Agachamento - 4x15', 'Leg press - 4x12', 'Panturrilha - 4x20'] },
        { dia: 'Quinta', tipo: 'Ombros/Abs', exercicios: ['Desenvolvimento - 4x12', 'Elevação lateral - 4x12', 'Abdominais - 4x25'] },
        { dia: 'Sexta', tipo: 'HIIT', exercicios: ['Treino intervalado - 30 min'] },
        { dia: 'Sábado', tipo: 'Cardio', exercicios: ['Corrida/Bike - 50 min'] },
      ],
    };

    return workouts[nivel] || workouts.iniciante;
  };

  const generateNutritionPlan = () => {
    const calorias = metrics.calorias_diarias || 2000;
    
    return {
      cafe: {
        calorias: Math.round(calorias * 0.2),
        itens: ['2 fatias de pão integral', '1 ovo mexido', '1 fatia de queijo branco', '1 copo de leite desnatado', '1 fruta']
      },
      lanche1: {
        calorias: Math.round(calorias * 0.1),
        itens: ['1 iogurte natural', '1 colher de granola']
      },
      almoco: {
        calorias: Math.round(calorias * 0.3),
        itens: ['150g de proteína magra', '1 xícara de arroz integral', '1 xícara de feijão', 'Salada verde', '1 colher de azeite']
      },
      lanche2: {
        calorias: Math.round(calorias * 0.1),
        itens: ['1 fatia de pão integral', '1 colher de pasta de amendoim', '1 fruta']
      },
      jantar: {
        calorias: Math.round(calorias * 0.3),
        itens: ['150g de peixe ou frango', '1 batata doce média', 'Legumes refogados', 'Salada de folhas']
      }
    };
  };

  const workoutPlan = generateWorkoutPlan();
  const nutritionPlan = generateNutritionPlan();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Seu Plano Personalizado
            </h1>
            <p className="text-gray-600">
              Baseado em suas respostas, criamos um plano científico para você
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Baixar PDF
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Success Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-12 h-12" />
              <div>
                <h2 className="text-2xl font-bold mb-1">Plano Criado com Sucesso!</h2>
                <p className="opacity-90">
                  Seu plano personalizado está pronto. Siga as recomendações para alcançar seus objetivos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Perfil do Usuário */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{step1.nome || 'Usuário'}</h3>
                <p className="text-gray-600">
                  {step1.idade || 30} anos, {step1.sexo || 'não informado'}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Meta</h3>
                <p className="text-gray-600">
                  Perder {((step1.peso_atual || 80) - (step1.peso_objetivo || 70)).toFixed(1)}kg em {step1.prazo || 12} semanas
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingDown className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Perda Semanal</h3>
                <p className="text-gray-600">
                  {metrics.perda_semanal || 0.8}kg/semana
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg">Tempo Estimado</h3>
                <p className="text-gray-600">
                  {metrics.tempo_estimado || 12} semanas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">IMC Atual</h3>
              <p className={`text-2xl font-bold ${getIMCColor(metrics.imc)}`}>
                {metrics.imc || 25.0}
              </p>
              <p className="text-sm text-gray-600">{metrics.classificacao_imc || 'Peso normal'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-1">Déficit Calórico</h3>
              <p className="text-2xl font-bold text-red-600">
                {metrics.deficit_calorico || 500}
              </p>
              <p className="text-sm text-gray-600">kcal/dia</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <UtensilsCrossed className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Calorias Diárias</h3>
              <p className="text-2xl font-bold text-green-600">
                {metrics.calorias_diarias || 2000}
              </p>
              <p className="text-sm text-gray-600">kcal/dia</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Droplets className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Meta de Água</h3>
              <p className="text-2xl font-bold text-purple-600">
                2.5L
              </p>
              <p className="text-sm text-gray-600">por dia</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Progresso */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Projeção de Progresso</CardTitle>
            <CardDescription>
              Acompanhe sua evolução esperada ao longo das próximas semanas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Peso Projetado"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    name="Meta de Peso"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plano de Treino */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              Seu Plano de Treino Personalizado
            </CardTitle>
            <CardDescription>
              Exercícios selecionados com base no seu nível e preferências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlan.map((workout, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{workout.dia}</CardTitle>
                    <Badge variant="secondary">{workout.tipo}</Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workout.exercicios.map((exercicio, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {exercicio}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plano Nutricional */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              Plano Nutricional Personalizado
            </CardTitle>
            <CardDescription>
              Refeições balanceadas para atingir seus objetivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Distribuição de Macronutrientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-4">Distribuição de Macronutrientes</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {macroData.map((macro, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: macro.color }}
                      />
                      <span className="text-sm">{macro.name}: {macro.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Meta Diária de Calorias</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {metrics.calorias_diarias || 2000}
                  </div>
                  <p className="text-gray-600 mb-6">kcal totais</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Proteínas (30%)</span>
                      <span className="font-semibold">
                        {Math.round((metrics.calorias_diarias || 2000) * 0.3 / 4)}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Carboidratos (40%)</span>
                      <span className="font-semibold">
                        {Math.round((metrics.calorias_diarias || 2000) * 0.4 / 4)}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Gorduras (30%)</span>
                      <span className="font-semibold">
                        {Math.round((metrics.calorias_diarias || 2000) * 0.3 / 9)}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refeições */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(nutritionPlan).map(([refeicao, dados], index) => {
                const nomes = {
                  cafe: 'Café da Manhã',
                  lanche1: 'Lanche da Manhã',
                  almoco: 'Almoço',
                  lanche2: 'Lanche da Tarde',
                  jantar: 'Jantar'
                };
                
                return (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{nomes[refeicao]}</CardTitle>
                      <Badge variant="outline">{dados.calorias} kcal</Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {dados.itens.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dicas Personalizadas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Dicas Personalizadas
            </CardTitle>
            <CardDescription>
              Recomendações específicas para seu perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Droplets className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Hidratação</h4>
                    <p className="text-sm text-blue-700">
                      Beba pelo menos 2,5 litros de água por dia. Comece o dia com um copo de água em jejum.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Horários das Refeições</h4>
                    <p className="text-sm text-green-700">
                      Mantenha intervalos regulares entre as refeições (3-4 horas). Evite comer 3 horas antes de dormir.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Heart className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">Qualidade do Sono</h4>
                    <p className="text-sm text-purple-700">
                      Durma de 7-9 horas por noite. Um sono reparador é essencial para a regulação hormonal.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <Target className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">Consistência</h4>
                    <p className="text-sm text-orange-700">
                      Pequenos passos consistentes são mais eficazes que grandes mudanças esporádicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>
              Como começar sua jornada hoje mesmo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold mb-2">Hoje</h4>
                <p className="text-sm text-gray-600">
                  Faça sua primeira refeição seguindo o plano e beba 2,5L de água.
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-semibold mb-2">Amanhã</h4>
                <p className="text-sm text-gray-600">
                  Inicie seu primeiro treino. Comece devagar e foque na execução correta.
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold mb-2">Esta Semana</h4>
                <p className="text-sm text-gray-600">
                  Siga o plano completo por 7 dias e faça sua primeira pesagem de controle.
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <h4 className="font-semibold mb-2">Próximas Semanas</h4>
                <p className="text-sm text-gray-600">
                  Mantenha a consistência e ajuste o plano conforme sua evolução.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Final */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Pronto para Começar sua Transformação?
            </h2>
            <p className="mb-6 opacity-90">
              Seu plano personalizado está pronto. Agora é hora de colocar em prática!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Baixar Plano Completo (PDF)
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-blue-600">
                <Calendar className="w-5 h-5" />
                Agendar Consultoria
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-75">
              Precisa de ajuda? Nossa equipe está disponível 24/7
            </p>
          </CardContent>
        </Card>

        {/* Botão Voltar */}
        {onBack && (
          <div className="text-center mt-8">
            <Button variant="outline" size="sm" onClick={onBack}>
              Voltar ao Questionário
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

