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
  Settings,
  Star,
  Flame,
  Crown,
  BarChart3
} from "lucide-react";
import { useAuth } from "../../contexts/SupabaseAuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
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
  const { t } = useLanguage();
  const { achievements, userStats } = useAchievementsStore();
  const { levelSystem } = useLevelStore();

  const planName = PLANS.find((p) => p.id === user?.plan)?.name ?? "Iniciante";
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  // Organização limpa das seções do menu
  const menuSections = [
    {
      title: t('sidebar.sections.main'),
      items: [
        {
          icon: Home,
          label: t('sidebar.menu_items.dashboard'),
          path: "/dashboard"
        },
        {
          icon: Play,
          label: t('sidebar.menu_items.videos'),
          path: "/videos"
        }
      ]
    },
    {
      title: t('sidebar.sections.progress'),
      items: [
        {
          icon: Trophy,
          label: t('sidebar.menu_items.achievements'),
          path: "/achievements",
          badge: unlockedAchievements > 0 ? unlockedAchievements.toString() : undefined
        },
        {
          icon: BarChart3,
          label: t('sidebar.menu_items.progress'),
          path: "/progress"
        }
      ]
    },
    {
      title: t('sidebar.sections.content'),
      items: [
        {
          icon: AppWindow,
          label: t('sidebar.menu_items.apps'),
          path: "/apps"
        },
        {
          icon: Heart,
          label: t('sidebar.menu_items.favorites'),
          path: "/favorites"
        },
        {
          icon: ShoppingBag,
          label: t('sidebar.menu_items.store'),
          path: "/store",
          disabled: !storeEnabled
        }
      ]
    },
    {
      title: t('sidebar.sections.account'),
      items: [
        {
          icon: User,
          label: t('sidebar.menu_items.profile'),
          path: "/profile"
        },
        {
          icon: Sparkles,
          label: t('sidebar.menu_items.plans'),
          path: "/plans"
        },
        ...(user?.isAdmin ? [{
          icon: ShieldCheck,
          label: "Admin",
          path: "/admin"
        }] : [])
      ]
    }
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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden safe-area-inset"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed top-0 left-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-slate-900 border-r border-slate-800 z-50 lg:translate-x-0 lg:static lg:z-auto lg:w-72 flex flex-col safe-area-inset"
      >
        {/* Logo Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex-shrink-0 safe-area-inset-top">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-white truncate">
                Meu Auge
              </h1>
              <p className="text-xs text-slate-400">
                Sua jornada fitness
              </p>
            </div>
          </motion.div>
        </div>

        {/* User Level Card */}
        <div className="p-3 sm:p-4 mx-3 sm:mx-4 mt-4 bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 rounded-xl flex-shrink-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-emerald-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">
                  Nível {levelSystem.currentLevel}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {levelSystem.totalXP} XP total
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-slate-400">
                {levelSystem.xpToNextLevel} XP
              </p>
              <p className="text-xs text-slate-500">
                restantes
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: `${(levelSystem.currentXP / (levelSystem.xpToNextLevel + levelSystem.currentXP)) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-primary to-emerald-500 rounded-full h-1.5 sm:h-2"
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto safe-area-inset-bottom">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3 px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  
                  if (item.disabled) {
                    return (
                      <motion.div 
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                        className="flex items-center px-3 py-2.5 rounded-lg text-slate-500 cursor-not-allowed opacity-50 overflow-hidden"
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium text-sm truncate flex-1">{item.label}</span>
                        <span className="ml-auto text-xs bg-slate-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                          Em breve
                        </span>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden min-h-[44px] ${
                          isActive(item.path)
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mr-3 flex-shrink-0 ${
                            isActive(item.path) 
                              ? "text-white" 
                              : "text-slate-400 group-hover:text-primary"
                          }`}
                        />
                        <span className="font-medium text-sm flex-1 truncate">{item.label}</span>
                        
                        {/* Badge */}
                        {item.badge && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                          >
                            {item.badge}
                          </motion.span>
                        )}
                        
                        {/* Active indicator */}
                        {isActive(item.path) && (
                          <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Plan Status */}
        <div className="p-3 sm:p-4 border-t border-slate-800 space-y-3 sm:space-y-4 flex-shrink-0 safe-area-inset-bottom">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {planName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    Plano atual
                  </p>
                </div>
              </div>
              {user?.plan !== 'D' && (
                <Link 
                  to="/plans" 
                  onClick={onClose}
                  className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-medium hover:bg-yellow-400 transition-colors flex-shrink-0"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800/50 rounded-lg p-3 overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
              Estatísticas
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-sm font-bold text-white">
                  {userStats.currentStreak}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  Dias seguidos
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {unlockedAchievements}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  Conquistas
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-900/20 transition-all duration-200 group min-h-[44px] overflow-hidden"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:text-red-500 flex-shrink-0" />
            <span className="font-medium text-sm truncate">Sair</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
