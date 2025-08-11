import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Target,
  Star,
  Users,
  Clock,
  CheckCircle,
  Lock,
  TrendingUp,
  Calendar,
  Zap,
  Award,
  Crown,
  Flame,
  Filter,
  Search,
  ChevronDown,
  Gift,
  BarChart3
} from 'lucide-react';
import { useAchievementsStore, Achievement, Challenge } from '../stores/achievementsStore';
import { useLevelStore } from '../stores/levelStore';
import { useAuth } from '../contexts/AuthContext';

const Achievements: React.FC = () => {
  const { user } = useAuth();
  const {
    achievements,
    challenges,
    userStats,
    getActiveChallenges,
    getCompletedChallenges,
    initializeAchievements
  } = useAchievementsStore();
  const { levelSystem } = useLevelStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges'>('achievements');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    initializeAchievements();
  }, [initializeAchievements]);

  const categories = [
    { id: 'all', name: 'Todas', icon: Trophy },
    { id: 'fitness', name: 'Fitness', icon: Zap },
    { id: 'nutrition', name: 'Nutrição', icon: Award },
    { id: 'mindfulness', name: 'Mindfulness', icon: Star },
    { id: 'consistency', name: 'Consistência', icon: Calendar },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'learning', name: 'Aprendizado', icon: Target },
    { id: 'special', name: 'Especial', icon: Crown }
  ];

  const rarities = [
    { id: 'all', name: 'Todas', color: 'gray' },
    { id: 'common', name: 'Comum', color: 'gray' },
    { id: 'rare', name: 'Raro', color: 'blue' },
    { id: 'epic', name: 'Épico', color: 'purple' },
    { id: 'legendary', name: 'Lendário', color: 'yellow' }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    const completedMatch = showCompleted ? true : !achievement.isUnlocked;
    const searchMatch = !searchQuery || 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && rarityMatch && completedMatch && searchMatch;
  });

  const activeChallenges = getActiveChallenges();
  const completedChallenges = getCompletedChallenges();
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50';
      case 'rare': return 'border-blue-500/50';
      case 'epic': return 'border-purple-500/50';
      case 'legendary': return 'border-yellow-500/50';
      default: return 'border-gray-500/50';
    }
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => setSelectedAchievement(achievement)}
      className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all duration-200 border-2 ${
        achievement.isUnlocked ? getRarityBorder(achievement.rarity) : 'border-slate-700'
      } ${achievement.isUnlocked ? '' : 'opacity-60'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
          achievement.isUnlocked 
            ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}` 
            : 'bg-slate-700 grayscale'
        }`}>
          {achievement.isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-slate-400" />}
        </div>
        <div className="text-right">
          <span className={`text-xs px-2 py-1 rounded ${
            achievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-400' :
            achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
            achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {achievement.rarity}
          </span>
        </div>
      </div>

      <h3 className={`font-semibold mb-2 ${achievement.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
        {achievement.title}
      </h3>
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
        {achievement.description}
      </p>

      {!achievement.isUnlocked && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Progresso</span>
            <span className="text-white">
              {achievement.currentProgress}/{achievement.requirement}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, (achievement.currentProgress / achievement.requirement) * 100)}%` 
              }}
              className="bg-gradient-to-r from-primary to-emerald-500 rounded-full h-2"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-sm font-medium">
            +{achievement.reward.xp} XP
          </span>
        </div>
        {achievement.isUnlocked && achievement.unlockedAt && (
          <span className="text-xs text-slate-400">
            {new Date(achievement.unlockedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const isCompleted = challenge.isCompleted;
    const isExpired = new Date() > challenge.endDate;
    const timeLeft = Math.max(0, challenge.endDate.getTime() - new Date().getTime());
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-slate-800 rounded-xl p-4 border-2 ${
          isCompleted ? 'border-green-500/50' : 
          isExpired ? 'border-red-500/50' : 'border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isCompleted ? 'bg-green-500' :
              isExpired ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <Target className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{challenge.title}</h3>
              <p className="text-slate-400 text-sm">{challenge.description}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${
            challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
            challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            challenge.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
            'bg-purple-500/20 text-purple-400'
          }`}>
            {challenge.difficulty}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          {challenge.requirements.map((req, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{req.description}</span>
                <span className="text-white">{req.current}/{req.target}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(100, (req.current / req.target) * 100)}%` 
                  }}
                  className={`rounded-full h-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-primary'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">{challenge.participants}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm">+{challenge.rewards.xp} XP</span>
            </div>
          </div>
          {!isCompleted && !isExpired && (
            <div className="text-right">
              <p className="text-xs text-slate-400">Termina em</p>
              <p className="text-white text-sm">
                {daysLeft > 0 ? `${daysLeft}d` : `${hoursLeft}h`}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Conquistas & Desafios
          </h1>
          <p className="text-slate-400">
            Acompanhe seu progresso e desbloqueie recompensas incríveis
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
            <div className="text-xs text-slate-400">Conquistas</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{levelSystem.currentLevel}</div>
            <div className="text-xs text-slate-400">Nível</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{userStats.currentStreak}</div>
            <div className="text-xs text-slate-400">Sequência</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Total XP</span>
          </div>
          <div className="text-2xl font-bold text-white">{userStats.totalXP.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Tempo Total</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.floor(userStats.totalTimeSpent / 60)}h
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Vídeos</span>
          </div>
          <div className="text-2xl font-bold text-white">{userStats.totalVideosWatched}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Recorde</span>
          </div>
          <div className="text-2xl font-bold text-white">{userStats.longestStreak} dias</div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 bg-slate-800 p-1 rounded-lg w-fit"
      >
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'achievements'
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Conquistas ({achievements.length})
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'challenges'
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Desafios ({activeChallenges.length})
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar conquistas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {activeTab === 'achievements' && (
          <>
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {rarities.map(rarity => (
                <option key={rarity.id} value={rarity.id}>
                  {rarity.name}
                </option>
              ))}
            </select>

            {/* Show Completed Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                showCompleted ? 'bg-primary' : 'bg-slate-700'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  showCompleted ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
              <span className="text-slate-300 text-sm">Mostrar completadas</span>
            </label>
          </>
        )}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'achievements' ? (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Active Challenges */}
            {activeChallenges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Desafios Ativos ({activeChallenges.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Challenges */}
            {completedChallenges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Desafios Completados ({completedChallenges.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {completedChallenges.slice(0, 6).map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-md w-full border-2 border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl mb-4 ${
                  selectedAchievement.isUnlocked 
                    ? `bg-gradient-to-br ${getRarityColor(selectedAchievement.rarity)}` 
                    : 'bg-slate-700 grayscale'
                }`}>
                  {selectedAchievement.isUnlocked ? selectedAchievement.icon : <Lock className="w-10 h-10 text-slate-400" />}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedAchievement.title}
                </h2>
                
                <span className={`text-sm px-3 py-1 rounded-full ${
                  selectedAchievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-400' :
                  selectedAchievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                  selectedAchievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {selectedAchievement.rarity}
                </span>

                <p className="text-slate-300 mt-4 mb-6">
                  {selectedAchievement.description}
                </p>

                {!selectedAchievement.isUnlocked && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progresso</span>
                      <span className="text-white">
                        {selectedAchievement.currentProgress}/{selectedAchievement.requirement}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-emerald-500 rounded-full h-3 transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (selectedAchievement.currentProgress / selectedAchievement.requirement) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-700 rounded-lg p-3">
                    <span className="text-slate-300">Recompensa XP</span>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        +{selectedAchievement.reward.xp}
                      </span>
                    </div>
                  </div>

                  {selectedAchievement.reward.title && (
                    <div className="flex items-center justify-between bg-slate-700 rounded-lg p-3">
                      <span className="text-slate-300">Título Desbloqueado</span>
                      <span className="text-primary font-semibold">
                        {selectedAchievement.reward.title}
                      </span>
                    </div>
                  )}

                  {selectedAchievement.isUnlocked && selectedAchievement.unlockedAt && (
                    <div className="flex items-center justify-between bg-slate-700 rounded-lg p-3">
                      <span className="text-slate-300">Desbloqueado em</span>
                      <span className="text-white">
                        {new Date(selectedAchievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
