import React, { useState } from 'react';

const SimpleDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const HomeSection = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white p-8 rounded-2xl">
        <h1 className="text-4xl font-bold mb-4">🎉 SeuAuge-sys Melhorado!</h1>
        <p className="text-xl opacity-90">
          Sistema completamente renovado com foco na experiência do usuário
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
            🔥
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Interface Redesenhada</h3>
          <p className="text-gray-600">Design moderno e intuitivo com animações suaves</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
            📱
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Responsividade Total</h3>
          <p className="text-gray-600">Funciona perfeitamente em todos os dispositivos</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Performance Otimizada</h3>
          <p className="text-gray-600">Carregamento rápido e animações fluidas</p>
        </div>
      </div>
    </div>
  );

  const DashboardSection = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Melhorado</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 p-6 rounded-xl border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center text-white">
                📈
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">78%</h3>
            <p className="text-gray-600">Progresso Geral</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                🏃
              </div>
              <span className="text-sm text-green-600 font-medium">+3 esta semana</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">24</h3>
            <p className="text-gray-600">Treinos Concluídos</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                🎯
              </div>
              <span className="text-sm text-green-600 font-medium">+5% hoje</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">85%</h3>
            <p className="text-gray-600">Meta do Mês</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                🏆
              </div>
              <span className="text-sm text-green-600 font-medium">+2 novas</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">12</h3>
            <p className="text-gray-600">Conquistas</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2">Continue Sua Jornada! 🚀</h3>
          <p className="opacity-90 mb-4">Você está no caminho certo. Cada treino te aproxima mais do seu objetivo.</p>
          <button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Iniciar Treino Agora
          </button>
        </div>
      </div>
    </div>
  );

  const FitnessSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Fitness Modules Melhorados</h2>
        <p className="text-xl text-gray-600">Módulos especializados com algoritmos científicos avançados</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl">
              🔥
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Emagrecimento Inteligente</h3>
              <p className="text-gray-600">Perda de peso sustentável</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Algoritmos adaptativos que se ajustam ao seu metabolismo para resultados duradouros
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Algoritmos de predição de sucesso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Personalização baseada em metabolismo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Estratégias anti-platô</span>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Iniciar Emagrecimento Inteligente
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl">
              💪
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Ganho de Massa Muscular</h3>
              <p className="text-gray-600">Hipertrofia otimizada</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Ciência aplicada para maximizar o ganho de massa muscular de forma eficiente
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Algoritmos de hipertrofia avançados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Periodização automática</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Análise de potencial genético</span>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Iniciar Ganho de Massa
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl">
              🔄
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Recomposição Corporal</h3>
              <p className="text-gray-600">Transformação completa</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Perca gordura e ganhe músculo simultaneamente com estratégias avançadas
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Ciclagem calórica inteligente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Treino híbrido força + cardio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Timing nutricional otimizado</span>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Iniciar Recomposição
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Performance Atlética</h3>
              <p className="text-gray-600">Máximo desempenho</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Otimização científica para atletas e praticantes de alto nível
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Periodização científica</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Análise de testes de performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-700">Protocolos de recuperação</span>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Iniciar Performance
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SeuAuge-sys</h1>
                <p className="text-xs text-gray-500">Sistema Melhorado</p>
              </div>
            </div>
            
            <div className="flex gap-1">
              {[
                { id: 'home', label: 'Home', icon: '🏠' },
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'fitness', label: 'Fitness Modules', icon: '💪' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && <HomeSection />}
        {activeTab === 'dashboard' && <DashboardSection />}
        {activeTab === 'fitness' && <FitnessSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ✅ Melhorias Implementadas no Sistema Completo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-sm">
                <div className="font-semibold text-gray-800">🏠 Home</div>
                <div className="text-gray-600">Landing page redesenhada</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">📊 Dashboard</div>
                <div className="text-gray-600">Interface moderna e intuitiva</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">💪 Fitness Modules</div>
                <div className="text-gray-600">Módulos científicos avançados</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">🎨 UX/UI</div>
                <div className="text-gray-600">Experiência profissional</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Paleta de cores original mantida: <span className="font-mono">#1ab894, #111828, #ffffff</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleDemo;

