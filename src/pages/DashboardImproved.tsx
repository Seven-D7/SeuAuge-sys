import React, { useState, useEffect } from 'react';
import { Play, Star, TrendingUp, Users, Award, Zap, Heart, ShoppingBag, Target, Calendar, Activity, BarChart3 } from 'lucide-react';

const DashboardImproved: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const stats = [
    {
      icon: TrendingUp,
      title: 'Progresso Geral',
      value: '78%',
      change: '+12%',
      color: 'from-primary to-primary-light',
      bgColor: 'from-primary/10 to-primary-light/10'
    },
    {
      icon: Activity,
      title: 'Treinos Concluídos',
      value: '24',
      change: '+3 esta semana',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: Target,
      title: 'Meta do Mês',
      value: '85%',
      change: '+5% hoje',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      icon: Award,
      title: 'Conquistas',
      value: '12',
      change: '+2 novas',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-100'
    }
  ];

  const quickActions = [
    {
      icon: Play,
      title: 'Iniciar Treino',
      description: 'Comece seu treino diário',
      color: 'from-primary to-primary-light',
      action: () => console.log('Iniciar treino')
    },
    {
      icon: BarChart3,
      title: 'Ver Progresso',
      description: 'Acompanhe sua evolução',
      color: 'from-blue-500 to-blue-600',
      action: () => console.log('Ver progresso')
    },
    {
      icon: Heart,
      title: 'Favoritos',
      description: 'Seus exercícios favoritos',
      color: 'from-red-500 to-pink-500',
      action: () => console.log('Ver favoritos')
    },
    {
      icon: ShoppingBag,
      title: 'Loja',
      description: 'Produtos de saúde',
      color: 'from-green-500 to-emerald-500',
      action: () => console.log('Abrir loja')
    }
  ];

  const fitnessModules = [
    {
      id: 'emagrecimento',
      title: 'Emagrecimento Inteligente',
      description: 'Perda de peso sustentável com algoritmos adaptativos',
      icon: '🔥',
      progress: 65,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-100'
    },
    {
      id: 'ganho_massa',
      title: 'Ganho de Massa Muscular',
      description: 'Hipertrofia otimizada com ciência e personalização',
      icon: '💪',
      progress: 42,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100'
    },
    {
      id: 'recomposicao',
      title: 'Recomposição Corporal',
      description: 'Perca gordura e ganhe músculo simultaneamente',
      icon: '🔄',
      progress: 78,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-100'
    },
    {
      id: 'performance',
      title: 'Performance Atlética',
      description: 'Otimização científica para máximo desempenho',
      icon: '⚡',
      progress: 33,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-100'
    }
  ];

  const recentActivities = [
    {
      type: 'workout',
      title: 'Treino de Força Completo',
      time: '2 horas atrás',
      icon: '💪',
      color: 'text-green-600'
    },
    {
      type: 'achievement',
      title: 'Nova conquista desbloqueada!',
      time: '1 dia atrás',
      icon: '🏆',
      color: 'text-yellow-600'
    },
    {
      type: 'progress',
      title: 'Meta semanal atingida',
      time: '2 dias atrás',
      icon: '🎯',
      color: 'text-blue-600'
    },
    {
      type: 'nutrition',
      title: 'Plano nutricional atualizado',
      time: '3 dias atrás',
      icon: '🥗',
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Personalizado */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {getGreeting()}, João! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Pronto para mais um dia de transformação?
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {currentTime.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Activity className="w-4 h-4" />
                  Streak: 7 dias
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
                🏆
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-r ${stat.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg ${activeCard === index ? 'scale-110' : ''} transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group p-6 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Módulos de Fitness */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Módulos de Fitness</h2>
            <button className="text-primary hover:text-primary-dark font-medium transition-colors">
              Ver Todos →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fitnessModules.map((module, index) => (
              <div
                key={module.id}
                className={`relative p-6 rounded-xl bg-gradient-to-r ${module.bgColor} border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{module.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{module.progress}%</span>
                </div>
                
                {/* Barra de Progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
                
                <button className={`w-full py-2 px-4 bg-gradient-to-r ${module.color} text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}>
                  Continuar Módulo
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Atividades Recentes</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{activity.title}</h4>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
                <button className="text-primary hover:text-primary-dark transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Motivacional */}
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white text-center shadow-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Continue Sua Jornada! 🚀</h2>
            <p className="text-lg mb-6 opacity-90">
              Você está no caminho certo. Cada treino te aproxima mais do seu objetivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Iniciar Treino Agora
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Ver Plano Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardImproved;

