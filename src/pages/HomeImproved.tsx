import React, { useState, useEffect } from 'react';

function HomeImproved() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Maria Silva",
      result: "Perdeu 22kg em 4 meses",
      text: "Nunca pensei que conseguiria emagrecer de forma tão saudável. O acompanhamento foi fundamental para manter a motivação!",
      avatar: "M",
      color: "from-pink-400 to-pink-600"
    },
    {
      name: "João Santos", 
      result: "Perdeu 18kg em 3 meses",
      text: "O app é incrível! Consegui seguir o plano mesmo com a correria do trabalho. Recomendo para todos!",
      avatar: "J",
      color: "from-blue-400 to-blue-600"
    },
    {
      name: "Ana Costa",
      result: "Perdeu 15kg em 2 meses", 
      text: "Finalmente encontrei um método que funciona! A equipe é muito atenciosa e os resultados são reais.",
      avatar: "A",
      color: "from-green-400 to-green-600"
    }
  ];

  const benefits = [
    {
      icon: "📈",
      title: "Resultados Científicos",
      description: "Metodologia baseada em estudos científicos com mais de 15.000 casos de sucesso comprovados.",
      color: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600"
    },
    {
      icon: "❤️",
      title: "Acompanhamento Humano", 
      description: "Equipe de nutricionistas, personal trainers e coaches dedicados ao seu sucesso.",
      color: "from-green-100 to-green-200",
      iconColor: "text-green-600"
    },
    {
      icon: "⚡",
      title: "Tecnologia Avançada",
      description: "App inteligente que se adapta ao seu progresso e ajusta automaticamente seu plano.",
      color: "from-purple-100 to-purple-200", 
      iconColor: "text-purple-600"
    },
    {
      icon: "💪",
      title: "Treinos Personalizados",
      description: "Exercícios adaptados ao seu nível, equipamentos disponíveis e preferências pessoais.",
      color: "from-teal-100 to-emerald-200",
      iconColor: "text-teal-600"
    },
    {
      icon: "🍎",
      title: "Nutrição Inteligente",
      description: "Cardápios que consideram suas preferências, restrições e rotina alimentar.",
      color: "from-red-100 to-red-200",
      iconColor: "text-red-600"
    },
    {
      icon: "👥",
      title: "Comunidade Ativa",
      description: "Faça parte de uma comunidade motivadora com pessoas que compartilham seus objetivos.",
      color: "from-indigo-100 to-indigo-200",
      iconColor: "text-indigo-600"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Ideal para começar sua jornada",
      features: [
        "Acesso básico ao app",
        "Treinos básicos",
        "Comunidade",
        "Suporte por email"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Essencial", 
      price: "R$ 49",
      period: "/mês",
      description: "Perfeito para resultados consistentes",
      features: [
        "Tudo do plano Gratuito",
        "Planos personalizados",
        "Acompanhamento nutricional",
        "Suporte prioritário",
        "Relatórios de progresso"
      ],
      popular: true,
      color: "border-primary"
    },
    {
      name: "Premium",
      price: "R$ 99", 
      period: "/mês",
      description: "Máximo resultado com acompanhamento VIP",
      features: [
        "Tudo do plano Essencial",
        "Coach pessoal dedicado",
        "Consultas 1:1",
        "Planos ultra-personalizados",
        "Suporte 24/7",
        "Acesso antecipado a novidades"
      ],
      popular: false,
      color: "border-yellow-400"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Melhorado */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary to-primary-light text-white p-2 rounded-xl shadow-lg">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary">
                  Meu Auge
                </h1>
                <p className="text-sm text-gray-600">Transforme Sua Vida</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#planos" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Planos
              </a>
              <a href="#sobre" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Sobre
              </a>
              <a href="#depoimentos" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Depoimentos
              </a>
              <button className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Começar Agora
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="w-full h-0.5 bg-gray-600 mb-1"></span>
                <span className="w-full h-0.5 bg-gray-600 mb-1"></span>
                <span className="w-full h-0.5 bg-gray-600"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section Melhorado */}
      <section className="pt-24 pb-20 px-4 bg-gradient-to-br from-gray-50 via-white to-teal-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8 animate-fade-in-up">
            <span className="bg-gradient-to-r from-primary/20 to-primary-light/20 text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
              🏆 #1 em Transformação Corporal
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            Alcance Seu
            <span className="text-gradient-primary block animate-fade-in-up animation-delay-400">
              AUGE
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
            Transforme seu corpo e mente com nossos planos personalizados de emagrecimento. 
            Resultados científicos, acompanhamento profissional e a motivação que você precisa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-800">
            <button className="group h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <span>✨</span>
              Iniciar Transformação
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="h-14 px-8 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full transition-all duration-300 transform hover:scale-105">
              📞 Falar com Especialista
            </button>
          </div>

          {/* Stats Melhorados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-1000">
            {[
              { number: "15K+", label: "Vidas Transformadas", color: "text-primary" },
              { number: "94%", label: "Taxa de Sucesso", color: "text-primary-light" },
              { number: "-18kg", label: "Média de Perda", color: "text-primary" },
              { number: "90 dias", label: "Tempo Médio", color: "text-primary-light" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
                  {stat.number}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Section Melhorado */}
      <section id="planos" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Escolha Seu
              <span className="text-gradient-primary"> Plano</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Planos flexíveis para cada momento da sua jornada de transformação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${plan.color} ${plan.popular ? 'scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <span className="text-primary">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary to-primary-light text-white hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl' 
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}>
                    Escolher Plano
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios Section Melhorado */}
      <section id="sobre" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Por Que Escolher o
              <span className="text-gradient-primary"> Meu Auge?</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Metodologia científica comprovada com acompanhamento humano personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group text-center p-8 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className={`bg-gradient-to-r ${benefit.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{benefit.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos Section Melhorado */}
      <section id="depoimentos" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Histórias de
              <span className="text-gradient-primary"> Transformação</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Veja como nossos alunos alcançaram seus objetivos e transformaram suas vidas.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-20 h-20 bg-gradient-to-r ${testimonials[currentTestimonial].color} rounded-full flex items-center justify-center text-white font-bold text-2xl`}>
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <h4 className="font-bold text-xl">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-primary font-medium">{testimonials[currentTestimonial].result}</p>
                </div>
              </div>
              
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              
              <p className="text-gray-700 text-lg italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Melhorado */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-light text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Alcançar Seu Auge?
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Junte-se a mais de 15.000 pessoas que já transformaram suas vidas. 
            Comece hoje mesmo sua jornada rumo ao seu melhor eu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="h-14 px-8 text-lg bg-white text-primary hover:bg-gray-50 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
              👑 Começar Transformação
            </button>
            <button className="h-14 px-8 text-lg border-2 border-white text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-105">
              📞 Falar com Especialista
            </button>
          </div>
        </div>
      </section>

      {/* Footer Melhorado */}
      <footer className="bg-dark text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-primary to-primary-light text-white p-2 rounded-xl">
                  <span className="text-lg font-bold">A</span>
                </div>
                <span className="text-xl font-bold">Meu Auge</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Transformando vidas através da ciência e do acompanhamento humano personalizado.
              </p>
              <div className="flex gap-4">
                {['f', '@', 'in'].map((social, index) => (
                  <div key={index} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                    <span className="text-sm">{social}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-primary">Planos</h4>
              <ul className="space-y-2 text-gray-400">
                {['Gratuito', 'Essencial', 'Premium', 'Comparar Planos'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-primary">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                {['Central de Ajuda', 'Contato', 'WhatsApp', 'FAQ'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-primary">Contato</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <span>📞</span>
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✉️</span>
                  <a href="mailto:contato@seuauge.com" className="hover:text-primary transition-colors">
                    contato@seuauge.com
                  </a>
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

export default HomeImproved;

