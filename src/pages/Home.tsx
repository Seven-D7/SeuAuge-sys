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
  TrendingUp,
  Sparkles,
  Phone,
  Mail,
  Shield,
  Target,
  Award
} from 'lucide-react';
import PlansSection from '../components/home/PlansSection';

function Home() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/auth?mode=login');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/60 to-emerald-200/60 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/40 to-emerald-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-50/30 to-emerald-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-primary to-emerald-600 text-white p-1.5 sm:p-2 rounded-xl shadow-lg">
                <img
                  src="/src/assets/icone.png"
                  alt="Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  Meu Auge
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Transforme Sua Vida</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <a href="#planos" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium text-sm lg:text-base">Planos</a>
              <a href="#sobre" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium text-sm lg:text-base">Sobre</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium text-sm lg:text-base">Depoimentos</a>
              <Button onClick={handleStartJourney} className="bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base">
                Começar Agora
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button onClick={handleStartJourney} size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm">
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 mb-4 shadow-sm text-xs sm:text-sm">
              🏆 #1 em Transformação Corporal
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-gray-800">
            Alcance Seu
            <span className="bg-gradient-to-r from-primary via-emerald-600 to-emerald-700 bg-clip-text text-transparent block">
              AUGE
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
            Transforme seu corpo e mente com nossos planos personalizados de emagrecimento.
            Resultados científicos, acompanhamento profissional e a motivação que você precisa.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button
              size="lg"
              onClick={handleStartJourney}
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-primary hover:bg-primary-dark text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-emerald-300"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Iniciar Transformação</span>
              <span className="sm:hidden">Iniciar Agora</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto px-2">
            <div className="text-center bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200 hover:bg-white/90 transition-all duration-300 shadow-sm">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">15K+</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Vidas Transformadas</p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200 hover:bg-white/90 transition-all duration-300 shadow-sm">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">94%</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Taxa de Sucesso</p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200 hover:bg-white/90 transition-all duration-300 shadow-sm">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">-18kg</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Média de Perda</p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200 hover:bg-white/90 transition-all duration-300 shadow-sm">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">90 dias</div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Tempo Médio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <div className="relative z-10">
        <PlansSection />
      </div>

      {/* Benefícios Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-800">
              Por Que Escolher o
              <span className="bg-gradient-to-r from-primary to-emerald-700 bg-clip-text text-transparent"> Meu Auge?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Metodologia científica comprovada com acompanhamento humano personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="text-center p-4 sm:p-6 lg:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 shadow-sm">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-slate-300">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-slate-700" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-slate-900">Resultados Científicos</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Metodologia baseada em estudos científicos com mais de 15.000 casos de sucesso comprovados.
              </p>
            </Card>

            <Card className="text-center p-6 sm:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-sm">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-slate-300">
                <Heart className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Acompanhamento Humano</h3>
              <p className="text-slate-600">
                Equipe de nutricionistas, personal trainers e coaches dedicados ao seu sucesso.
              </p>
            </Card>

            <Card className="text-center p-6 sm:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-sm">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-slate-300">
                <Zap className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Tecnologia Avançada</h3>
              <p className="text-slate-600">
                App inteligente que se adapta ao seu progresso e ajusta automaticamente seu plano.
              </p>
            </Card>

            <Card className="text-center p-6 sm:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-sm">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-slate-300">
                <Dumbbell className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Treinos Personalizados</h3>
              <p className="text-slate-600">
                Exercícios adaptados ao seu nível, equipamentos disponíveis e preferências pessoais.
              </p>
            </Card>

            <Card className="text-center p-6 sm:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-sm">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-slate-300">
                <UtensilsCrossed className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Nutrição Inteligente</h3>
              <p className="text-slate-600">
                Cardápios que consideram suas preferências, restrições e rotina alimentar.
              </p>
            </Card>

            <Card className="text-center p-6 sm:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-sm">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-slate-300">
                <Users className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Comunidade Ativa</h3>
              <p className="text-slate-600">
                Faça parte de uma comunidade motivadora com pessoas que compartilham seus objetivos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-slate-50/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-slate-900">
              Histórias de
              <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent"> Transformação</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-2">
              Veja como nossos alunos alcançaram seus objetivos e transformaram suas vidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="p-4 sm:p-6 lg:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-slate-900">Maria Silva</h4>
                  <p className="text-slate-600 text-sm sm:text-base">Perdeu 22kg em 4 meses</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 italic">
                "Nunca pensei que conseguiria emagrecer de forma tão saudável. O acompanhamento foi fundamental para manter a motivação!"
              </p>
            </Card>

            <Card className="p-6 sm:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">João Santos</h4>
                  <p className="text-slate-600">Perdeu 18kg em 3 meses</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 italic">
                "O app é incrível! Consegui seguir o plano mesmo com a correria do trabalho. Recomendo para todos!"
              </p>
            </Card>

            <Card className="p-6 sm:p-8 border-0 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white/90 transition-all duration-300 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Ana Costa</h4>
                  <p className="text-slate-600">Perdeu 15kg em 2 meses</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 italic">
                "Finalmente encontrei um método que funciona! A equipe é muito atenciosa e os resultados são reais."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-slate-900 text-white relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Pronto Para Alcançar Meu Auge?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-2">
            Junte-se a mais de 15.000 pessoas que já transformaram suas vidas.
            Comece hoje mesmo sua jornada rumo ao seu melhor eu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Button
              size="lg"
              variant="secondary"
              onClick={handleStartJourney}
              className="h-11 sm:h-12 lg:h-14 px-5 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg bg-white text-slate-800 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Começar Transformação</span>
              <span className="sm:hidden">Começar Agora</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 sm:h-12 lg:h-14 px-5 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Falar com Especialista</span>
              <span className="sm:hidden">Contato</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 sm:py-12 px-3 sm:px-4 relative z-10 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-1.5 sm:p-2 rounded-xl">
                  <img
                    src="/src/assets/icone.png"
                    alt="Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                  />
                </div>
                <span className="text-lg sm:text-xl font-bold">Meu Auge</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transformando vidas através da ciência e do acompanhamento humano personalizado.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer border border-slate-600">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer border border-slate-600">
                  <span className="text-sm">@</span>
                </div>
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer border border-slate-600">
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
                  <a href="mailto:contato@seuauge.com" className="hover:text-slate-300 transition-colors">contato@seuauge.com</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Meu Auge. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
