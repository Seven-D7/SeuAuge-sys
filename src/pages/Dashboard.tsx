import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Zap,
  Users,
  BookOpen,
  ArrowRight,
  Star,
  Trophy,
  Activity,
  Flame,
  Clock,
  ChevronRight,
  Brain,
  Dumbbell,
  Heart,
  Apple
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAchievementsStore } from '../stores/achievementsStore';
import { useLevelStore } from '../stores/levelStore';
import { useProgressStore } from '../stores/progressStore';
import ProductCard from '../components/Products/ProductCard';
import { mockProducts } from '../data/mockData';
import AppCard from '../components/Apps/AppCard';
import { apps } from '../data/apps';
import ComingSoon from '../components/Common/ComingSoon';
import { storeEnabled } from '../lib/config';
import { PLANS } from '../data/plans';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const {
    userStats,
    getActiveChallenges,
    achievements,
    initializeAchievements,
    updateProgress
  } = useAchievementsStore();
  const { levelSystem, checkDailyLogin } = useLevelStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    initializeAchievements();
    checkDailyLogin();
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('dashboard.good_morning'));
    else if (hour < 18) setGreeting(t('dashboard.good_afternoon'));
    else setGreeting(t('dashboard.good_evening'));
  }, [initializeAchievements, checkDailyLogin]);

  const featuredProducts = mockProducts.slice(0, 4);
  const activeChallenges = getActiveChallenges();
  const recentAchievements = achievements.filter(a => a.isUnlocked).slice(0, 3);
  const currentPlan = PLANS.find(p => p.id === user?.plan);

  // Mock AI recommendations
  const aiRecommendations = [
    {
      type: 'workout',
      title: 'Treino HIIT Iniciante',
      description: 'Baseado no seu perfil, este treino é perfeito para você',
      duration: '20 min',
      icon: Dumbbell,
      color: 'bg-blue-500'
    },
    {
      type: 'nutrition',
      title: 'Receita Pós-Treino',
      description: 'Smoothie de proteína para recuperação muscular',
      duration: '5 min',
      icon: Apple,
      color: 'bg-green-500'
    },
    {
      type: 'mindfulness',
      title: 'Meditação Matinal',
      description: 'Comece o dia com foco e tranquilidade',
      duration: '10 min',
      icon: Brain,
      color: 'bg-purple-500'
    }
  ];

  // Quick actions
  const quickActions = [
    { label: 'Iniciar Treino', icon: Play, link: '/videos', color: 'bg-red-500' },
    { label: 'Ver Progresso', icon: TrendingUp, link: '/progress', color: 'bg-blue-500' },
    { label: 'Conquistas', icon: Trophy, link: '/achievements', color: 'bg-yellow-500' },
    { label: 'Aplicativos', icon: Zap, link: '/apps', color: 'bg-purple-500' },
  ];

  const statsCards = [
    {
      title: 'XP Total',
      value: levelSystem.totalXP.toLocaleString(),
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      subtitle: `Nível ${levelSystem.currentLevel}`
    },
    {
      title: 'Vídeos Assistidos',
      value: userStats.totalVideosWatched.toString(),
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      subtitle: 'Este mês'
    },
    {
      title: 'Sequência Atual',
      value: `${userStats.currentStreak} dias`,
      icon: Flame,
      color: 'from-red-500 to-pink-500',
      subtitle: `Recorde: ${userStats.longestStreak} dias`
    },
    {
      title: 'Conquistas',
      value: achievements.filter(a => a.isUnlocked).length.toString(),
      icon: Award,
      color: 'from-purple-500 to-indigo-500',
      subtitle: `${achievements.length} total`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 px-6 py-8 lg:px-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl mb-6 lg:mb-0">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl lg:text-4xl font-bold text-white mb-4"
              >
                {greeting}, {user?.name || 'Guerreiro'}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-white/90 mb-6 leading-relaxed"
              >
                Você está no <span className="font-semibold">{currentPlan?.name || 'Plano Gratuito'}</span>. 
                Continue sua jornada de transformação!
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
              >
                <Link to="/videos" className="bg-white text-primary px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center justify-center text-sm sm:text-base">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Continuar Assistindo
                </Link>
                <Link to="/progress" className="border border-white text-white px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors text-sm sm:text-base flex items-center justify-center">
                  Ver Progresso
                </Link>
              </motion.div>
            </div>

            {/* Level Progress Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Nível {levelSystem.currentLevel}
                </h3>
                <p className="text-white/80 text-sm mb-3">
                  {levelSystem.currentXP}/{levelSystem.xpToNextLevel + levelSystem.currentXP} XP
                </p>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ 
                      width: `${(levelSystem.currentXP / (levelSystem.xpToNextLevel + levelSystem.currentXP)) * 100}%` 
                    }}
                  />
                </div>
                <p className="text-white/70 text-xs mt-2">
                  {levelSystem.xpToNextLevel} XP para próximo nível
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute right-0 top-0 w-1/3 sm:w-1/2 h-full object-cover"
          src="https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Healthy lifestyle"
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white relative overflow-hidden`}
          >
            <div className="relative z-10">
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 opacity-80" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm opacity-90 font-medium">
                {stat.title}
              </p>
              <p className="text-xs opacity-70 mt-1">
                {stat.subtitle}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.1 }}
            >
              <Link
                to={action.link}
                className="block bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg sm:rounded-xl p-4 sm:p-6 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  {action.label}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AI Recommendations */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-400" />
            Recomendações da IA
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {aiRecommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              className="bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-slate-700 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${rec.color} rounded-lg flex items-center justify-center`}>
                  <rec.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                  {rec.duration}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-2">{rec.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{rec.description}</p>
              <div className="flex items-center text-primary text-sm font-medium group-hover:text-emerald-400 transition-colors">
                Começar agora
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Active Challenges & Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Challenges */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Desafios Ativos
            </h2>
            <Link to="/achievements" className="text-primary hover:text-emerald-400 text-sm font-medium">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {activeChallenges.slice(0, 3).map((challenge) => (
              <div key={challenge.id} className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm">{challenge.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mb-3">{challenge.description}</p>
                {challenge.requirements.map((req, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{req.description}</span>
                      <span className="text-white">{req.current}/{req.target}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div 
                        className="bg-primary rounded-full h-1.5 transition-all duration-300"
                        style={{ width: `${Math.min(100, (req.current / req.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400">
                    <Users className="w-3 h-3 inline mr-1" />
                    {challenge.participants} participantes
                  </span>
                  <span className="text-xs text-yellow-400">
                    +{challenge.rewards.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recent Achievements */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Conquistas Recentes
            </h2>
            <Link to="/achievements" className="text-primary hover:text-emerald-400 text-sm font-medium">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <motion.div 
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-yellow-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      achievement.rarity === 'common' ? 'bg-gray-500/20' :
                      achievement.rarity === 'rare' ? 'bg-blue-500/20' :
                      achievement.rarity === 'epic' ? 'bg-purple-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {achievement.title}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        {achievement.description}
                      </p>
                    </div>
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
                    <p className="text-yellow-400 text-xs mt-1">+{achievement.reward.xp} XP</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {recentAchievements.length === 0 && (
              <div className="bg-slate-800 rounded-lg p-6 text-center">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  Complete desafios para desbloquear conquistas!
                </p>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Continue Watching / Progress Charts could go here */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-green-400" />
            Gráfico de Progresso Semanal
          </h2>
        </div>
        <div className="bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div key={day} className="text-center">
                <p className="text-xs text-slate-400 mb-2">{day}</p>
                <div 
                  className={`h-8 rounded ${
                    index < 4 ? 'bg-primary' : 'bg-slate-700'
                  } transition-all duration-300`}
                  style={{ 
                    height: index < 4 ? `${20 + Math.random() * 20}px` : '8px' 
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              <Flame className="w-4 h-4 inline mr-1" />
              4 dias esta semana
            </span>
            <span className="text-primary font-medium">
              Meta: 5 dias
            </span>
          </div>
        </div>
      </motion.section>

      {/* Applications Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            Aplicativos
          </h2>
          <Link to="/apps" className="text-primary hover:text-primary font-medium text-sm sm:text-base flex items-center">
            Ver todos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {apps.slice(0, 4).map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + apps.indexOf(app) * 0.1 }}
            >
              <AppCard app={app} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Health Products Store */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            <span className="hidden sm:inline">Loja de Produtos de Saúde</span>
            <span className="sm:hidden">Loja</span>
          </h2>
          {storeEnabled && (
            <Link to="/store" className="text-primary hover:text-primary font-medium text-sm sm:text-base flex items-center">
              <span className="hidden sm:inline">Ver Todos</span>
              <span className="sm:hidden">Ver +</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
        {storeEnabled ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 + index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <ComingSoon
            title="Em breve"
            description="Nossa loja de produtos estará disponível em breve."
          />
        )}
      </motion.section>
    </div>
  );
};

export default Dashboard;
