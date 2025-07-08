import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Crown,
  Zap,
  Users,
  ArrowRight,
  Star,
  Heart,
  Dumbbell,
  UtensilsCrossed,
  Shield,
  TrendingUp,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import PlansSection from '../components/home/PlansSection';

function Home() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/auth?mode=login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-2 rounded-xl">
                <img
  src="/src/assets/icone.png" 
  alt="Logo"
  className="w-8 h-8 object-contain"
/>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Meu Auge
                </h1>
                <p className="text-sm text-gray-600">Transforme Sua Vida</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#planos" className="text-gray-700 hover:text-teal-600 transition-colors">Planos</a>
              <a href="#sobre" className="text-gray-700 hover:text-teal-600 transition-colors">Sobre</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-teal-600 transition-colors">Depoimentos</a>
              <Button onClick={handleStartJourney} className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
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
            <Badge className="bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 border-teal-200 mb-4">
              🏆 #1 em Transformação Corporal
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Alcance Seu
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent block">
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
              className="h-14 px-8 text-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Iniciar Transformação
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">15K+</div>
              <p className="text-gray-600">Vidas Transformadas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">94%</div>
              <p className="text-gray-600">Taxa de Sucesso</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">-18kg</div>
              <p className="text-gray-600">Média de Perda</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">90 dias</div>
              <p className="text-gray-600">Tempo Médio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <PlansSection />

      {/* Benefícios Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Por Que Escolher o
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent"> Meu Auge?</span>
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
              <div className="bg-gradient-to-r from-teal-100 to-emerald-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="w-8 h-8 text-teal-600" />
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
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent"> Transformação</span>
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
      <section className="py-20 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Alcançar Meu Auge?
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
              className="h-14 px-8 text-lg bg-white text-teal-600 hover:bg-gray-50"
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-2 rounded-xl">
                  <Crown className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">Meu Auge</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transformando vidas através da ciência e do acompanhamento humano personalizado.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                  <span className="text-sm">@</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Planos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Gratuito</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Essencial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium</a></li>
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
                  <a href="mailto:contato@seuauge.com" className="hover:text-teal-400 transition-colors">contato@seuauge.com</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Meu Auge. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
