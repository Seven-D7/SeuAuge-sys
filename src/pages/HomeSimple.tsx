import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeSimple() {
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
                <div className="w-8 h-8 bg-white/20 rounded"></div>
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
              <button 
                onClick={handleStartJourney} 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-sm mb-4 inline-block">
              🏆 #1 em Transformação Corporal
            </span>
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
            <button 
              onClick={handleStartJourney}
              className="h-14 px-8 text-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg text-white rounded-lg transition-colors"
            >
              ✨ Iniciar Transformação →
            </button>
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

      {/* Teste de funcionalidade */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Página de Teste
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent"> Funcionando!</span>
          </h2>
          <p className="text-xl text-gray-700">
            Se você está vendo esta mensagem, o React está funcionando corretamente.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomeSimple;

