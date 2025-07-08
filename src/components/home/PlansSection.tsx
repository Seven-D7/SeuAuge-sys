import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';

export default function PlansSection() {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar sua jornada',
      features: [
        'Acesso a conteúdos básicos',
        'Treinos simples',
        'Comunidade',
        'Suporte por email'
      ],
      buttonText: 'Começar Grátis',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Star
    },
    {
      name: 'Essencial',
      price: 'R$ 29',
      period: '/mês',
      description: 'Para quem quer resultados consistentes',
      features: [
        'Todos os recursos gratuitos',
        'Planos personalizados',
        'Acompanhamento nutricional',
        'Suporte prioritário',
        'Relatórios de progresso'
      ],
      buttonText: 'Escolher Essencial',
      buttonVariant: 'default' as const,
      popular: true,
      icon: Zap
    },
    {
      name: 'Premium',
      price: 'R$ 59',
      period: '/mês',
      description: 'Transformação completa e acelerada',
      features: [
        'Todos os recursos essenciais',
        'Coach pessoal dedicado',
        'Consultas 1:1',
        'Planos ultra-personalizados',
        'Acesso a especialistas',
        'Suporte 24/7'
      ],
      buttonText: 'Escolher Premium',
      buttonVariant: 'default' as const,
      popular: false,
      icon: Crown
    }
  ];

  return (
    <section id="planos" className="py-20 px-4 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Escolha Seu
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent"> Plano</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Encontre o plano perfeito para sua jornada de transformação. 
            Todos os planos incluem garantia de 30 dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'ring-2 ring-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50' 
                    : 'bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-center py-2 text-sm font-medium">
                    🔥 Mais Popular
                  </div>
                )}
                
                <CardContent className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200'
                    }`}>
                      <Icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full h-12 text-lg font-medium transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg'
                        : plan.buttonVariant === 'outline'
                        ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Não tem certeza qual plano escolher? 
          </p>
          <Button variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50">
            Falar com um Especialista
          </Button>
        </div>
      </div>
    </section>
  );
}
