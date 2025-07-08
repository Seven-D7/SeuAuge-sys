import React, { useState } from 'react';
import { Home, Activity, Settings, User } from 'lucide-react';
import DashboardImproved from './pages/DashboardImproved';
import ModulosConfigImproved from './components/fitness-modules/ModulosConfigImproved';
import HomeImproved from './pages/HomeImproved';

const DemoApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigation = [
    { id: 'home', label: 'Home', icon: Home, component: HomeImproved },
    { id: 'dashboard', label: 'Dashboard', icon: User, component: DashboardImproved },
    { id: 'fitness', label: 'Fitness Modules', icon: Activity, component: ModulosConfigImproved }
  ];

  const CurrentComponent = navigation.find(nav => nav.id === currentPage)?.component || HomeImproved;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SeuAuge-sys</h1>
                <p className="text-xs text-gray-500">Sistema Melhorado</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navigation.map((nav) => {
                const IconComponent = nav.icon;
                const isActive = currentPage === nav.id;
                
                return (
                  <button
                    key={nav.id}
                    onClick={() => setCurrentPage(nav.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <CurrentComponent />
      </main>

      {/* Footer Info */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🎉 Sistema SeuAuge-sys Completamente Melhorado!
            </h3>
            <p className="text-gray-600 mb-4">
              Navegue pelas abas acima para ver todas as melhorias implementadas:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200">
                ✨ Interface redesenhada
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200">
                🎨 Animações e microinterações
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200">
                📱 Responsividade completa
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200">
                🚀 Performance otimizada
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200">
                🎯 UX/UI profissional
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Paleta de cores original mantida: #1ab894, #111828, #ffffff
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoApp;

