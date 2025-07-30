import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Heart,
  ShoppingBag,
  Sparkles,
  Home,
  AppWindow,
  LogOut,
  TrendingUp,
  ShieldCheck,
  Trophy,
  Target,
  User,
  BarChart3,
  Zap,
  Clock,
  Star
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useAchievementsStore } from "../../stores/achievementsStore";
import { useLevelStore } from "../../stores/levelStore";
import { PLANS } from "../../data/plans";
import { storeEnabled } from "../../lib/config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { achievements, userStats } = useAchievementsStore();
  const { levelSystem } = useLevelStore();
  
  const planName = PLANS.find((p) => p.id === user?.plan)?.name ?? "Iniciante";
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  const menuItems = [
    { 
      icon: Home, 
      label: "Início", 
      path: "/dashboard",
      description: "Panorama geral"
    },
    { 
      icon: Play, 
      label: "Vídeos", 
      path: "/videos",
      description: "Biblioteca completa"
    },
    {
      icon: ShoppingBag,
      label: "Loja",
      path: "/store",
      disabled: !storeEnabled,
      description: "Produtos de saúde"
    },
    { 
      icon: Trophy, 
      label: "Conquistas", 
      path: "/achievements",
      description: "Progresso e desafios",
      badge: unlockedAchievements > 0 ? unlockedAchievements.toString() : undefined
    },
    { 
      icon: TrendingUp, 
      label: "Progresso", 
      path: "/progress",
      description: "Métricas e evolução"
    },
    { 
      icon: AppWindow, 
      label: "Apps", 
      path: "/apps",
      description: "Aplicativos fitness"
    },
    { 
      icon: Heart, 
      label: "Favoritos", 
      path: "/favorites",
      description: "Seus conteúdos salvos"
    },
    { 
      icon: Sparkles, 
      label: "Planos", 
      path: "/plans",
      description: "Upgrade sua experiência"
    },
    ...(user?.isAdmin
      ? [{ 
          icon: ShieldCheck, 
          label: "Admin", 
          path: "/admin",
          description: "Painel administrativo"
        }]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed top-0 left-0 h-full w-72 max-w-[85vw] sm:max-w-none overflow-y-auto bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 z-50 lg:translate-x-0 lg:fixed lg:z-auto lg:w-72"
      >
        {/* Logo */}
        <div className="flex items-center px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-800">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                Meu Auge
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                Transforme-se
              </p>
            </div>
          </motion.div>
        </div>

        {/* User Level Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-4 bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-emerald-500 rounded-lg flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Nível {levelSystem.currentLevel}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {levelSystem.currentXP} XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {levelSystem.xpToNextLevel} XP
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                para próximo
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: `${(levelSystem.currentXP / (levelSystem.xpToNextLevel + levelSystem.currentXP)) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-primary to-emerald-500 rounded-full h-2"
            />
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="mt-6 sm:mt-8 px-3 sm:px-4">
          <div className="space-y-1 sm:space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const baseClasses = `
                flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 group text-sm sm:text-base relative
                ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary-dark/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50"
                }
                ${item.disabled ? "pointer-events-none opacity-50" : ""}
              `;

              if (item.disabled) {
                return (
                  <motion.div 
                    key={item.path} 
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    custom={index}
                    className={baseClasses}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-slate-600 dark:text-slate-400" />
                    <div className="flex-1">
                      <span className="font-medium block">{item.label}</span>
                      <span className="text-xs text-slate-400 block">Em breve</span>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  custom={index}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={baseClasses}
                  >
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 ${
                        isActive(item.path) 
                          ? "text-white" 
                          : "text-slate-600 dark:text-slate-400 group-hover:text-primary"
                      }`}
                    />
                    <div className="flex-1">
                      <span className="font-medium block">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 block">
                          {item.description}
                        </span>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {isActive(item.path) && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                    
                    {/* Badge */}
                    {item.badge && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Plan Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mx-3 sm:mx-4 mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                {planName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
                Plano atual
              </p>
            </div>
            {user?.plan !== 'D' && (
              <Link 
                to="/plans" 
                onClick={onClose}
                className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-medium hover:bg-yellow-400 transition-colors"
              >
                Upgrade
              </Link>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mx-3 sm:mx-4 mt-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Estatísticas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {userStats.totalVideosWatched}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Vídeos
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {userStats.currentStreak}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Sequência
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {unlockedAchievements}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Conquistas
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {Math.floor(userStats.totalTimeSpent / 60)}h
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Tempo
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all duration-200 group text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-slate-600 dark:text-slate-400 group-hover:text-red-400" />
            <span className="font-medium">Sair</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
