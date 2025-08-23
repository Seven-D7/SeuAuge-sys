import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Star, 
  Filter, 
  Medal, 
  Crown,
  Zap,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAchievementsStore } from '../../stores/achievementsStore';
import AchievementCard from './AchievementCard';
import ChallengeCard from './ChallengeCard';
import { designUtils, COMMON_CLASSES } from '../../lib/design-system';

const AchievementsSection: React.FC = () => {
  const {
    achievements,
    challenges,
    userStats,
    unlockedTitles,
    currentTitle,
    initializeAchievements,
    getAchievementsByCategory,
    getActiveChallengess,
    getCompletedChallenges,
    getLevelProgress,
    setCurrentTitle,
  } = useAchievementsStore();

  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'stats'>('achievements');
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [challengeFilter, setChallengeFilter] = useState<'active' | 'completed' | 'all'>('active');

  useEffect(() => {
    initializeAchievements();
  }, [initializeAchievements]);

  const levelProgress = getLevelProgress();
  const activeChallenge = getActiveChallengess();
  const completedChallenges = getCompletedChallenges();

  const filteredAchievements = achievements.filter(achievement => {
    if (achievementFilter === 'unlocked' && !achievement.isUnlocked) return false;
    if (achievementFilter === 'locked' && achievement.isUnlocked) return false;
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;
    return true;
  });

  const filteredChallenges = challenges.filter(challenge => {
    if (challengeFilter === 'active' && (!challenge.isActive || challenge.isCompleted)) return false;
    if (challengeFilter === 'completed' && !challenge.isCompleted) return false;
    return true;
  });

  const categories = ['all', 'fitness', 'nutrition', 'mindfulness', 'consistency', 'social', 'learning'];
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Level Progress Card */}
      <motion.div
        className={`
          ${designUtils.glass('primary')}
          rounded-xl p-6 relative overflow-hidden
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${designUtils.gradient('primary')}
                text-white font-bold text-xl shadow-lg
              `}>
                {userStats.currentLevel}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Nível {userStats.currentLevel}
                </h3>
                {currentTitle && (
                  <p className="text-primary-200 text-sm">
                    {currentTitle}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {userStats.totalXP.toLocaleString()} XP
              </p>
              <p className="text-primary-200 text-sm">
                {userStats.xpToNextLevel} XP para o próximo nível
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{unlockedCount}</p>
              <p className="text-primary-200 text-sm">Conquistas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{userStats.currentStreak}</p>
              <p className="text-primary-200 text-sm">Sequência Atual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{userStats.totalVideosWatched}</p>
              <p className="text-primary-200 text-sm">Vídeos Assistidos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{userStats.totalWorkoutsCompleted}</p>
              <p className="text-primary-200 text-sm">Treinos Completos</p>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'achievements', label: 'Conquistas', icon: Trophy },
          { id: 'challenges', label: 'Desafios', icon: Target },
          { id: 'stats', label: 'Estatísticas', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? `${designUtils.gradient('primary')} text-white shadow-lg`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }
                ${COMMON_CLASSES.focus}
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filters - Improved mobile responsiveness */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={achievementFilter}
                onChange={(e) => setAchievementFilter(e.target.value as any)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">🏆 Todas as Conquistas</option>
                <option value="unlocked">✅ Desbloqueadas ({unlockedCount})</option>
                <option value="locked">🔒 Bloqueadas ({achievements.length - unlockedCount})</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">���� Todas as Categorias</option>
                <option value="fitness">🏃‍♀️ Fitness</option>
                <option value="nutrition">🥗 Nutrição</option>
                <option value="mindfulness">🧘‍♀️ Mindfulness</option>
                <option value="consistency">📅 Consistência</option>
                <option value="social">👥 Social</option>
                <option value="learning">📚 Aprendizado</option>
              </select>
            </div>

            {/* Achievement Progress Summary */}
            <div className={`
              ${designUtils.glass('medium')}
              rounded-lg p-4 mb-6
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Medal className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-white">Progresso das Conquistas</h3>
                    <p className="text-gray-400 text-sm">
                      {unlockedCount} de {totalCount} conquistadas ({Math.round((unlockedCount / totalCount) * 100)}%)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-400">{unlockedCount}</p>
                  <p className="text-gray-400 text-sm">Desbloqueadas</p>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhuma conquista encontrada
                </h3>
                <p className="text-gray-400">
                  Ajuste os filtros ou continue progredindo para desbloquear mais conquistas!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Challenge Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={challengeFilter}
                onChange={(e) => setChallengeFilter(e.target.value as any)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Ativos</option>
                <option value="completed">Completados</option>
                <option value="all">Todos</option>
              </select>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onJoin={() => console.log('Joining challenge:', challenge.id)}
                  onClaim={() => console.log('Claiming reward:', challenge.id)}
                />
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum desafio encontrado
                </h3>
                <p className="text-gray-400">
                  {challengeFilter === 'active' 
                    ? 'Não há desafios ativos no momento. Volte em breve!'
                    : 'Nenhum desafio corresponde aos filtros selecionados.'
                  }
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* General Stats */}
              <div className={`${designUtils.glass('medium')} rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-white">Geral</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nível Atual</span>
                    <span className="text-white font-semibold">{userStats.currentLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">XP Total</span>
                    <span className="text-white font-semibold">{userStats.totalXP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tempo Total</span>
                    <span className="text-white font-semibold">{Math.round(userStats.totalTimeSpent / 60)}h</span>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div className={`${designUtils.glass('medium')} rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h3 className="font-semibold text-white">Atividade</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vídeos Assistidos</span>
                    <span className="text-white font-semibold">{userStats.totalVideosWatched}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Treinos Completos</span>
                    <span className="text-white font-semibold">{userStats.totalWorkoutsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sequência Atual</span>
                    <span className="text-white font-semibold">{userStats.currentStreak} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Maior Sequência</span>
                    <span className="text-white font-semibold">{userStats.longestStreak} dias</span>
                  </div>
                </div>
              </div>

              {/* Titles */}
              <div className={`${designUtils.glass('medium')} rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-purple-400" />
                  <h3 className="font-semibold text-white">Títulos</h3>
                </div>
                <div className="space-y-2">
                  {unlockedTitles.length > 0 ? (
                    unlockedTitles.map(title => (
                      <button
                        key={title}
                        onClick={() => setCurrentTitle(title)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                          ${currentTitle === title
                            ? 'bg-purple-400/20 text-purple-300 border border-purple-400/30'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        {title}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Nenhum título desbloqueado ainda
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Join Date */}
            <div className={`${designUtils.glass('medium')} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">Membro desde</span>
                </div>
                <span className="text-white font-semibold">
                  {new Date(userStats.joinDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementsSection;
