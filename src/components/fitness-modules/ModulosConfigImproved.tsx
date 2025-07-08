import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  RotateCcw, 
  Zap,
  Target,
  Brain,
  Activity,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Award,
  BarChart3,
  Clock,
  Flame,
  Heart,
  Shield
} from 'lucide-react';

const ModulosConfigImproved: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in-up');
  }, []);

  const modules = [
    {
      id: 'emagrecimento',
      title: 'Emagrecimento Inteligente',
      subtitle: 'Perda de peso sustentável',
      description: 'Algoritmos adaptativos que se ajustam ao seu metabolismo para resultados duradouros',
      icon: TrendingDown,
      emoji: '🔥',
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-100',
      borderColor: 'border-red-200',
      progress: 0,
      duration: '8-24 semanas',
      difficulty: 'Iniciante a Avançado',
      features: [
        'Algoritmos de predição de sucesso',
        'Personalização baseada em metabolismo',
        'Estratégias anti-platô',
        'Monitoramento de aderência',
        'Ajustes automáticos de calorias'
      ],
      results: {
        weight: '0.5-1kg por semana',
        fat: '1-2% por mês',
        muscle: 'Preservação total',
        energy: 'Melhora significativa'
      },
      testimonial: {
        name: 'Maria Silva',
        result: 'Perdeu 22kg em 4 meses',
        text: 'Nunca pensei que conseguiria emagrecer de forma tão saudável!'
      }
    },
    {
      id: 'ganho_massa',
      title: 'Ganho de Massa Muscular',
      subtitle: 'Hipertrofia otimizada',
      description: 'Ciência aplicada para maximizar o ganho de massa muscular de forma eficiente',
      icon: TrendingUp,
      emoji: '💪',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      progress: 0,
      duration: '12-48 semanas',
      difficulty: 'Iniciante a Profissional',
      features: [
        'Algoritmos de hipertrofia avançados',
        'Periodização automática',
        'Análise de potencial genético',
        'Otimização de volume e intensidade',
        'Nutrição para máximo anabolismo'
      ],
      results: {
        muscle: '0.5-2kg por mês',
        strength: '10-30% em 12 semanas',
        weight: '1-3kg por mês',
        definition: 'Melhora gradual'
      },
      testimonial: {
        name: 'João Santos',
        result: 'Ganhou 8kg de massa magra',
        text: 'Resultados que nunca consegui antes, de forma científica!'
      }
    },
    {
      id: 'recomposicao',
      title: 'Recomposição Corporal',
      subtitle: 'Transformação completa',
      description: 'Perca gordura e ganhe músculo simultaneamente com estratégias avançadas',
      icon: RotateCcw,
      emoji: '🔄',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-100',
      borderColor: 'border-purple-200',
      progress: 0,
      duration: '16-52 semanas',
      difficulty: 'Intermediário a Avançado',
      features: [
        'Ciclagem calórica inteligente',
        'Treino híbrido força + cardio',
        'Timing nutricional otimizado',
        'Monitoramento de composição corporal',
        'Estratégias anti-catabolismo'
      ],
      results: {
        fat: '-0.5-1% por mês',
        muscle: '+0.2-0.5kg por mês',
        definition: 'Melhora significativa',
        performance: 'Manutenção ou melhora'
      },
      testimonial: {
        name: 'Ana Costa',
        result: 'Transformação completa em 6 meses',
        text: 'Consegui o corpo que sempre sonhei, com saúde!'
      }
    },
    {
      id: 'performance',
      title: 'Performance Atlética',
      subtitle: 'Máximo desempenho',
      description: 'Otimização científica para atletas e praticantes de alto nível',
      icon: Zap,
      emoji: '⚡',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-100',
      borderColor: 'border-orange-200',
      progress: 0,
      duration: '12-52 semanas',
      difficulty: 'Intermediário a Profissional',
      features: [
        'Periodização científica',
        'Análise de testes de performance',
        'Nutrição para atletas',
        'Protocolos de recuperação',
        'Monitoramento de overtraining'
      ],
      results: {
        strength: '5-25% melhora',
        power: '8-30% melhora',
        endurance: '10-40% melhora',
        speed: '3-15% melhora'
      },
      testimonial: {
        name: 'Carlos Oliveira',
        result: 'Melhorou performance em 35%',
        text: 'Quebrei todos os meus recordes pessoais!'
      }
    }
  ];

  const globalStats = [
    { icon: Users, label: 'Usuários Ativos', value: '15.000+', color: 'text-blue-600' },
    { icon: Award, label: 'Taxa de Sucesso', value: '94%', color: 'text-green-600' },
    { icon: Target, label: 'Objetivos Alcançados', value: '50.000+', color: 'text-purple-600' },
    { icon: Star, label: 'Avaliação Média', value: '4.9/5', color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5">
      {/* Header Hero */}
      <div className="relative bg-gradient-to-r from-primary via-primary-light to-emerald-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              Sistema de Fitness Inteligente
            </div>
            
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${animationClass}`}>
              Transforme Seu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                Corpo e Mente
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed ${animationClass} animation-delay-200`}>
              Módulos especializados com algoritmos científicos avançados para cada objetivo específico.
              Resultados comprovados, acompanhamento personalizado.
            </p>
            
            <div className={`flex flex-wrap justify-center gap-4 mt-8 ${animationClass} animation-delay-400`}>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">IA Personalizada</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Baseado em Ciência</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Resultados Comprovados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Globais */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {globalStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Módulos Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Escolha Seu Módulo Ideal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada módulo foi desenvolvido com algoritmos específicos para maximizar seus resultados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((module, index) => {
            const IconComponent = module.icon;
            const isSelected = selectedModule === module.id;
            
            return (
              <div
                key={module.id}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${isSelected ? 'border-primary scale-105' : module.borderColor} overflow-hidden cursor-pointer`}
                onClick={() => setSelectedModule(isSelected ? null : module.id)}
              >
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                
                {/* Header */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${module.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-gray-600 font-medium">{module.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-4xl">{module.emoji}</div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {module.description}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Duração</span>
                      </div>
                      <p className="text-sm text-gray-600">{module.duration}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Nível</span>
                      </div>
                      <p className="text-sm text-gray-600">{module.difficulty}</p>
                    </div>
                  </div>

                  {/* Features Preview */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Características Principais
                    </h4>
                    <div className="space-y-2">
                      {module.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {module.features.length > 3 && (
                        <div className="text-sm text-primary font-medium">
                          +{module.features.length - 3} características adicionais
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className={`bg-gradient-to-r ${module.bgColor} rounded-lg p-4 mb-6`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-800">
                        {module.testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{module.testimonial.name}</p>
                        <p className="text-sm text-gray-600">{module.testimonial.result}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{module.testimonial.text}"</p>
                  </div>

                  {/* Action Button */}
                  <button className={`w-full py-4 px-6 bg-gradient-to-r ${module.color} text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group`}>
                    <Play className="w-5 h-5" />
                    Iniciar {module.title}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Expanded Content */}
                {isSelected && (
                  <div className="border-t border-gray-100 p-8 bg-gray-50 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Resultados Esperados */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Resultados Esperados
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(module.results).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-semibold text-gray-800">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Todas as Features */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />
                          Todas as Características
                        </h4>
                        <div className="space-y-2">
                          {module.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Pronto Para Sua Transformação?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de pessoas que já alcançaram seus objetivos com nossos módulos científicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg">
              Começar Agora
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulosConfigImproved;

