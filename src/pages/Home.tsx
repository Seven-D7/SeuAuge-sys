import React from 'react';    
import './Home.css';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Crown, 
  Target, 
  Zap, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Star,
  Trophy,
  Heart,
  Dumbbell,
  UtensilsCrossed,
  Clock,
  Shield,
  TrendingUp,
  Award,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

function App() {
  const handlePlanSelect = (planName) => {
    // Aqui você pode integrar com sua lógica de seleção de plano
    console.log(`Plano selecionado: ${planName}`);
    // Exemplo: redirecionar para página de checkout ou questionário
    // window.location.href = `/checkout?plan=${planName}`;
  };

  const handleStartJourney = () => {
    // Integrar com sua lógica de início da jornada
    console.log('Iniciando jornada');
    // Exemplo: redirecionar para questionário ou cadastro
    // window.location.href = '/questionnaire';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-xl">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Seu Auge
                </h1>
                <p className="text-sm text-gray-600">Transforme Sua Vida</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#planos" className="text-gray-700 hover:text-orange-600 transition-colors">Planos</a>
              <a href="#sobre" className="text-gray-700 hover:text-orange-600 transition-colors">Sobre</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-orange-600 transition-colors">Depoimentos</a>
              <Button onClick={handleStartJourney} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200 mb-4">
              🏆 #1 em Transformação Corporal
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Alcance Seu
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent block">
              AUGE
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transforme seu corpo e mente com nossos planos personalizados de emagrecimento. 
            Resultados científicos, acompanhamento profissional e a motivação que você precisa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={handleStartJourney}
              className="h-14 px-8 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Iniciar Transformação
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-14 px-8 text-lg border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Ver Resultados
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">15K+</div>
              <p className="text-gray-600">Vidas Transformadas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">94%</div>
              <p className="text-gray-600">Taxa de Sucesso</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">-18kg</div>
              <p className="text-gray-600">Média de Perda</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">90 dias</div>
              <p className="text-gray-600">Tempo Médio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Escolha Seu
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"> Plano</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Planos científicos e personalizados para cada objetivo. Todos incluem acompanhamento profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano Essencial */}
            <Card className="relative border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Essencial</CardTitle>
                <CardDescription className="text-lg">Perfeito para iniciantes</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 97</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Plano alimentar personalizado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Treinos para casa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>App de acompanhamento</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Suporte via chat</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Relatórios semanais</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 h-12"
                  variant="outline"
                  onClick={() => handlePlanSelect('essencial')}
                >
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="relative border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 hover:shadow-xl scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1">
                  MAIS POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Premium</CardTitle>
                <CardDescription className="text-lg">Resultados acelerados</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 197</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Tudo do plano Essencial</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Consultoria nutricional mensal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Treinos para academia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Suplementação personalizada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Grupo VIP no WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Ajustes semanais no plano</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={() => handlePlanSelect('premium')}
                >
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>

            {/* Plano Elite */}
            <Card className="relative border-2 border-amber-300 hover:border-amber-400 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Elite</CardTitle>
                <CardDescription className="text-lg">Transformação completa</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 397</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Tudo do plano Premium</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Personal trainer dedicado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Consultas semanais 1:1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Exames laboratoriais</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Coaching comportamental</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Garantia de resultado</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  onClick={() => handlePlanSelect('elite')}
                >
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Garantia */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-full px-6 py-3">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-medium">Garantia de 30 dias ou seu dinheiro de volta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Por Que Escolher o
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"> Seu Auge?</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Metodologia científica comprovada com acompanhamento humano personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Resultados Científicos</h3>
              <p className="text-gray-600">
                Metodologia baseada em estudos científicos com mais de 15.000 casos de sucesso comprovados.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Acompanhamento Humano</h3>
              <p className="text-gray-600">
                Equipe de nutricionistas, personal trainers e coaches dedicados ao seu sucesso.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Tecnologia Avançada</h3>
              <p className="text-gray-600">
                App inteligente que se adapta ao seu progresso e ajusta automaticamente seu plano.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Treinos Personalizados</h3>
              <p className="text-gray-600">
                Exercícios adaptados ao seu nível, equipamentos disponíveis e preferências pessoais.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-red-100 to-red-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <UtensilsCrossed className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Nutrição Inteligente</h3>
              <p className="text-gray-600">
                Cardápios que consideram suas preferências, restrições e rotina alimentar.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Comunidade Ativa</h3>
              <p className="text-gray-600">
                Faça parte de uma comunidade motivadora com pessoas que compartilham seus objetivos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Histórias de
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"> Transformação</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Veja como nossos alunos alcançaram seus objetivos e transformaram suas vidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-lg">Maria Silva</h4>
                  <p className="text-gray-600">Perdeu 22kg em 4 meses</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic">
                "Nunca pensei que conseguiria emagrecer de forma tão saudável. O acompanhamento foi fundamental para manter a motivação!"
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
                <div>
                  <h4 className="font-bold text-lg">João Santos</h4>
                  <p className="text-gray-600">Perdeu 18kg em 3 meses</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic">
                "O app é incrível! Consegui seguir o plano mesmo com a correria do trabalho. Recomendo para todos!"
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-lg">Ana Costa</h4>
                  <p className="text-gray-600">Perdeu 15kg em 2 meses</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic">
                "Finalmente encontrei um método que funciona! A equipe é muito atenciosa e os resultados são reais."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Alcançar Seu Auge?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a mais de 15.000 pessoas que já transformaram suas vidas. 
            Comece hoje mesmo sua jornada rumo ao seu melhor eu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleStartJourney}
              className="h-14 px-8 text-lg bg-white text-orange-600 hover:bg-gray-50"
            >
              <Crown className="w-5 h-5 mr-2" />
              Começar Transformação
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-14 px-8 text-lg border-white text-white hover:bg-white/10"
            >
              <Phone className="w-5 h-5 mr-2" />
              Falar com Especialista
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            ✅ Sem compromisso • ✅ Garantia de 30 dias • ✅ Suporte 24/7
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-xl">
                  <Crown className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">Seu Auge</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transformando vidas através da ciência e do acompanhamento humano personalizado.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-sm">@</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Planos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Essencial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Elite</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comparar Planos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>contato@seuauge.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Seu Auge. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

