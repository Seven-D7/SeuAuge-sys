import React, { useState, useEffect } from 'react';
import GuidedTour, { TourStep } from './GuidedTour';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Target, Trophy, Settings, Zap } from 'lucide-react';

interface OnboardingFlowsProps {
  children: React.ReactNode;
}

const OnboardingFlows: React.FC<OnboardingFlowsProps> = ({ children }) => {
  const { user } = useAuth();
  const [activeTour, setActiveTour] = useState<string | null>(null);
  const [tourProgress, setTourProgress] = useState<Record<string, boolean>>({});

  // Load tour progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tourProgress');
    if (saved) {
      setTourProgress(JSON.parse(saved));
    }
  }, []);

  // Save tour progress
  const saveTourProgress = (updatedProgress: Record<string, boolean>) => {
    setTourProgress(updatedProgress);
    localStorage.setItem('tourProgress', JSON.stringify(updatedProgress));
  };

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !tourProgress.welcome) {
      // Show welcome tour for new users
      setTimeout(() => setActiveTour('welcome'), 1000);
    }
  }, [user, tourProgress]);

  // Define tour steps
  const welcomeTourSteps: TourStep[] = [
    {
      id: 'welcome',
      target: 'body',
      title: '🎉 Bem-vindo ao SeuAuge!',
      content: 'Estamos muito felizes em tê-lo conosco! Vamos fazer um tour rápido para você conhecer as principais funcionalidades.',
      position: 'center',
      allowSkip: true,
    },
    {
      id: 'navigation',
      target: '[data-tour="sidebar"]',
      title: '🧭 Navegação Principal',
      content: 'Este é o menu principal. Aqui você pode acessar seus treinos, vídeos, conquistas e muito mais.',
      position: 'right',
      highlightPadding: 12,
    },
    {
      id: 'dashboard',
      target: '[data-tour="dashboard"]',
      title: '📊 Seu Painel',
      content: 'Aqui está seu painel pessoal com estatísticas, progresso e recomendações personalizadas.',
      position: 'bottom',
    },
    {
      id: 'videos',
      target: '[data-tour="videos"]',
      title: '🎥 Biblioteca de Vídeos',
      content: 'Acesse nossa vasta biblioteca de vídeos de exercícios, nutrição e bem-estar.',
      position: 'bottom',
      beforeShow: () => {
        // Navigate to videos if not already there
        if (!window.location.pathname.includes('/videos')) {
          window.history.pushState(null, '', '/videos');
        }
      },
    },
    {
      id: 'achievements',
      target: '[data-tour="achievements"]',
      title: '🏆 Sistema de Conquistas',
      content: 'Ganhe conquistas, suba de nível e desbloqueie badges especiais conforme progride!',
      position: 'left',
    },
    {
      id: 'profile',
      target: '[data-tour="profile"]',
      title: '👤 Seu Perfil',
      content: 'Personalize seu perfil, acompanhe suas metas e veja seu progresso detalhado.',
      position: 'bottom',
    },
    {
      id: 'complete',
      target: 'body',
      title: '🚀 Pronto para Começar!',
      content: 'Agora você conhece o básico! Explore à vontade e lembre-se: estamos aqui para ajudar em sua jornada de transformação.',
      position: 'center',
      component: ({ onNext }) => (
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4"
          >
            <Zap className="w-12 h-12 text-primary mx-auto" />
          </motion.div>
          <button
            onClick={onNext}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Começar Jornada!
          </button>
        </div>
      ),
    },
  ];

  const featureTourSteps: TourStep[] = [
    {
      id: 'workouts',
      target: '[data-tour="workouts"]',
      title: '💪 Treinos Personalizados',
      content: 'Acesse treinos criados especialmente para seu perfil e objetivos.',
      position: 'right',
    },
    {
      id: 'nutrition',
      target: '[data-tour="nutrition"]',
      title: '🥗 Guias de Nutrição',
      content: 'Descubra planos alimentares e receitas saudáveis para potencializar seus resultados.',
      position: 'bottom',
    },
    {
      id: 'progress-tracking',
      target: '[data-tour="progress"]',
      title: '📈 Acompanhamento',
      content: 'Monitore seu progresso com gráficos detalhados e métricas importantes.',
      position: 'left',
    },
    {
      id: 'community',
      target: '[data-tour="community"]',
      title: '👥 Comunidade',
      content: 'Conecte-se com outros usuários, participe de desafios e compartilhe conquistas.',
      position: 'top',
    },
  ];

  const advancedTourSteps: TourStep[] = [
    {
      id: 'goals',
      target: '[data-tour="goals"]',
      title: '🎯 Definir Metas',
      content: 'Configure metas personalizadas e acompanhe seu progresso em tempo real.',
      position: 'right',
    },
    {
      id: 'calendar',
      target: '[data-tour="calendar"]',
      title: '📅 Agenda de Treinos',
      content: 'Organize sua rotina com nossa agenda inteligente de treinos.',
      position: 'bottom',
    },
    {
      id: 'analytics',
      target: '[data-tour="analytics"]',
      title: '📊 Análises Avançadas',
      content: 'Visualize análises detalhadas do seu desempenho e evolução.',
      position: 'left',
    },
    {
      id: 'premium',
      target: '[data-tour="premium"]',
      title: '⭐ Recursos Premium',
      content: 'Desbloqueie funcionalidades exclusivas com nossa assinatura premium.',
      position: 'top',
    },
  ];

  const tours = {
    welcome: welcomeTourSteps,
    features: featureTourSteps,
    advanced: advancedTourSteps,
  };

  const handleTourComplete = (tourId: string) => {
    const updated = { ...tourProgress, [tourId]: true };
    saveTourProgress(updated);
    setActiveTour(null);

    // Auto-start next tour if applicable
    if (tourId === 'welcome' && !tourProgress.features) {
      setTimeout(() => setActiveTour('features'), 2000);
    }
  };

  const handleTourSkip = (tourId: string) => {
    const updated = { ...tourProgress, [tourId]: true };
    saveTourProgress(updated);
    setActiveTour(null);
  };

  const startTour = (tourId: string) => {
    setActiveTour(tourId);
  };

  // Tour launcher component
  const TourLauncher = () => (
    <div className="fixed bottom-4 right-4 z-30">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Tours Disponíveis
        </h4>
        <div className="space-y-2">
          {Object.entries(tours).map(([tourId, steps]) => {
            const isCompleted = tourProgress[tourId];
            const tourNames = {
              welcome: 'Tour de Boas-vindas',
              features: 'Recursos Principais',
              advanced: 'Funcionalidades Avançadas',
            };

            return (
              <button
                key={tourId}
                onClick={() => startTour(tourId)}
                disabled={isCompleted}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  isCompleted
                    ? 'bg-green-50 text-green-600 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{tourNames[tourId as keyof typeof tourNames]}</span>
                  {isCompleted && <Trophy className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {children}
      
      {/* Show tour launcher only if user has completed at least the welcome tour */}
      {user && tourProgress.welcome && (
        <TourLauncher />
      )}

      {/* Active tour */}
      {activeTour && tours[activeTour as keyof typeof tours] && (
        <GuidedTour
          steps={tours[activeTour as keyof typeof tours]}
          isActive={true}
          onComplete={() => handleTourComplete(activeTour)}
          onSkip={() => handleTourSkip(activeTour)}
          showProgress={true}
          allowBackNavigation={true}
          overlay={true}
          theme="primary"
        />
      )}
    </>
  );
};

export default OnboardingFlows;
