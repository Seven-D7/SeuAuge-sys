import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  RefreshCw, 
  Eye, 
  Heart, 
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  X,
  Settings
} from 'lucide-react';
import { useEnhancedPreferencesStore, useSmartRecommendations } from '../../stores/enhancedPreferencesStore';
import VideoCard from '../Videos/VideoCard';
import ProductCard from '../Products/ProductCard';
import AppCard from '../Apps/AppCard';
import { designUtils, COMMON_CLASSES } from '../../lib/design-system';

interface SmartRecommendationsProps {
  type?: 'videos' | 'products' | 'apps' | 'all';
  maxItems?: number;
  showHeader?: boolean;
  showInsights?: boolean;
  compact?: boolean;
  onItemClick?: (item: any, type: string) => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  type = 'all',
  maxItems = 6,
  showHeader = true,
  showInsights = false,
  compact = false,
  onItemClick,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'products' | 'apps'>('videos');
  
  const { preferences, personalizedContent, getRecommendationInsights } = useEnhancedPreferencesStore();
  const { getRecommendations, refresh, trackInteraction, getSuggestions } = useSmartRecommendations();

  useEffect(() => {
    // Auto-refresh recommendations on mount if they're stale
    const lastUpdated = new Date(personalizedContent.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate > 1) { // Refresh if older than 1 hour
      handleRefresh();
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleItemClick = (item: any, itemType: string) => {
    trackInteraction('view', item.id, itemType);
    onItemClick?.(item, itemType);
  };

  const handleItemLike = (item: any, itemType: string) => {
    trackInteraction('like', item.id, itemType);
  };

  if (!preferences.enableSmartRecommendations) {
    return (
      <div className={`${designUtils.glass('medium')} rounded-xl p-6 text-center`}>
        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Recomendações Inteligentes Desabilitadas
        </h3>
        <p className="text-gray-400 mb-4">
          Ative as recomendações inteligentes nas configurações para ver conteúdo personalizado.
        </p>
        <button
          onClick={() => setShowSettings(true)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            ${designUtils.gradient('primary')}
            text-white transition-all duration-200 hover:scale-105
          `}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Ativar Recomendações
        </button>
      </div>
    );
  }

  const recommendations = getRecommendations(type);
  const suggestions = getSuggestions();
  const insights = showInsights ? getRecommendationInsights() : null;

  const renderRecommendations = (items: any[], itemType: string) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            Nenhuma recomendação disponível no momento
          </p>
        </div>
      );
    }

    const limitedItems = items.slice(0, maxItems);

    return (
      <div className={`
        grid gap-4
        ${compact 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      `}>
        {limitedItems.map((recommendedItem) => {
          const item = recommendedItem.item;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Recommendation Score Badge */}
              {!compact && (
                <div className={`
                  absolute top-2 left-2 z-20 px-2 py-1 rounded-full text-xs font-bold
                  ${recommendedItem.score.category === 'high' 
                    ? 'bg-green-400/80 text-green-900'
                    : recommendedItem.score.category === 'medium'
                      ? 'bg-yellow-400/80 text-yellow-900'
                      : 'bg-gray-400/80 text-gray-900'
                  }
                `}>
                  {Math.round(recommendedItem.score.score * 100)}%
                </div>
              )}

              {/* Personalized Reason Tooltip */}
              <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`
                  bg-black/80 text-white text-xs p-2 rounded-lg max-w-48
                  backdrop-blur-sm border border-white/20
                `}>
                  {recommendedItem.personalizedReason}
                </div>
              </div>

              {/* Item Card */}
              <div onClick={() => handleItemClick(item, itemType)}>
                {itemType === 'videos' && (
                  <VideoCard 
                    video={item} 
                    onClick={() => handleItemClick(item, itemType)}
                  />
                )}
                {itemType === 'products' && (
                  <ProductCard 
                    product={item}
                    onSelect={() => handleItemClick(item, itemType)}
                  />
                )}
                {itemType === 'apps' && (
                  <AppCard 
                    app={item}
                  />
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemLike(item, itemType);
                  }}
                  className={`
                    p-2 rounded-full transition-all duration-200
                    ${designUtils.glass('dark')}
                    hover:scale-110 text-white/70 hover:text-red-400
                  `}
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              p-2 rounded-full
              ${designUtils.gradient('primary')}
            `}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Recomendações Personalizadas
              </h2>
              <p className="text-gray-400 text-sm">
                Baseado no seu perfil e preferências
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${designUtils.glass('medium')}
                hover:bg-white/20 text-white
                ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {showInsights && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${designUtils.glass('medium')}
                  hover:bg-white/20 text-white
                `}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contextual Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`${designUtils.glass('primary')} rounded-lg p-4`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-white">Sugestões para Você</h3>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <p key={index} className="text-primary-100 text-sm">
                • {suggestion}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insights Panel */}
      <AnimatePresence>
        {showSettings && insights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${designUtils.glass('medium')} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Insights de Recomendação
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total de Recomendações</p>
                <p className="text-white font-semibold">{insights.totalRecommendations}</p>
              </div>
              <div>
                <p className="text-gray-400">Objetivo Atual</p>
                <p className="text-white font-semibold">{insights.userProfile.goal}</p>
              </div>
              <div>
                <p className="text-gray-400">Nível</p>
                <p className="text-white font-semibold">{insights.userProfile.level}</p>
              </div>
              <div>
                <p className="text-gray-400">Última Atualização</p>
                <p className="text-white font-semibold">
                  {new Date(insights.lastUpdated).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Tabs (for type='all') */}
      {type === 'all' && (
        <div className="flex gap-2 border-b border-gray-700">
          {[
            { id: 'videos', label: 'Vídeos', icon: Eye },
            { id: 'products', label: 'Produtos', icon: Heart },
            { id: 'apps', label: 'Apps', icon: Target },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="min-h-[200px]">
        {type === 'all' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderRecommendations(recommendations[activeTab] || [], activeTab)}
            </motion.div>
          </AnimatePresence>
        ) : (
          renderRecommendations(recommendations, type)
        )}
      </div>

      {/* Loading State */}
      {isRefreshing && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Atualizando recomendações...</p>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
