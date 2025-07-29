import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import { Achievement } from '../../stores/achievementsStore';
import { designUtils, COMMON_CLASSES } from '../../lib/design-system';

interface AchievementCardProps {
  achievement: Achievement;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isHighlighted = false,
  onClick,
}) => {
  const progressPercentage = Math.min(100, (achievement.currentProgress / achievement.requirement) * 100);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-500/50';
      case 'epic': return 'shadow-purple-500/50';
      case 'legendary': return 'shadow-yellow-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  return (
    <motion.div
      className={`
        relative cursor-pointer overflow-hidden rounded-xl
        ${achievement.isUnlocked 
          ? `${designUtils.glass('light')} ${getRarityGlow(achievement.rarity)}` 
          : designUtils.glass('dark')
        }
        ${isHighlighted ? 'ring-2 ring-primary ring-offset-2 ring-offset-slate-900' : ''}
        transition-all duration-300 hover:scale-105
        ${COMMON_CLASSES.focus}
      `}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Rarity Background Gradient */}
      {achievement.isUnlocked && achievement.rarity !== 'common' && (
        <div className={`
          absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-10
        `} />
      )}

      {/* Content */}
      <div className="relative p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={`
            w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl
            ${achievement.isUnlocked 
              ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg` 
              : 'bg-gray-700 text-gray-500'
            }
          `}>
            {achievement.isUnlocked ? achievement.icon : <Lock className="w-6 h-6" />}
          </div>

          {/* Rarity Badge */}
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold
            ${achievement.isUnlocked 
              ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
              : 'bg-gray-700 text-gray-400'
            }
          `}>
            {achievement.rarity.toUpperCase()}
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className={`
            font-bold text-lg mb-2
            ${achievement.isUnlocked ? 'text-white' : 'text-gray-400'}
          `}>
            {achievement.title}
          </h3>
          <p className={`
            text-sm leading-relaxed
            ${achievement.isUnlocked ? 'text-gray-300' : 'text-gray-500'}
          `}>
            {achievement.description}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className={achievement.isUnlocked ? 'text-gray-300' : 'text-gray-500'}>
              Progresso
            </span>
            <span className={`
              font-semibold
              ${achievement.isUnlocked 
                ? achievement.currentProgress >= achievement.requirement 
                  ? 'text-green-400' 
                  : 'text-gray-300'
                : 'text-gray-500'
              }
            `}>
              {achievement.currentProgress} / {achievement.requirement}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`
                h-full rounded-full
                ${achievement.isUnlocked 
                  ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                  : 'bg-gray-600'
                }
              `}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Reward */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className={`
              w-4 h-4
              ${achievement.isUnlocked ? 'text-yellow-400' : 'text-gray-500'}
            `} />
            <span className={`
              text-sm font-medium
              ${achievement.isUnlocked ? 'text-yellow-400' : 'text-gray-500'}
            `}>
              {achievement.reward.xp} XP
            </span>
          </div>

          {achievement.reward.title && (
            <div className="flex items-center gap-1">
              <Star className={`
                w-4 h-4
                ${achievement.isUnlocked ? 'text-purple-400' : 'text-gray-500'}
              `} />
              <span className={`
                text-xs font-medium
                ${achievement.isUnlocked ? 'text-purple-400' : 'text-gray-500'}
              `}>
                {achievement.reward.title}
              </span>
            </div>
          )}
        </div>

        {/* Unlocked Date */}
        {achievement.isUnlocked && achievement.unlockedAt && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400">
              Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        {/* Completion Glow Effect */}
        {achievement.isUnlocked && (
          <motion.div
            className={`
              absolute inset-0 rounded-xl opacity-0
              bg-gradient-to-br ${getRarityColor(achievement.rarity)}
            `}
            animate={{
              opacity: [0, 0.1, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        )}
      </div>

      {/* Shimmer Effect for Legendary */}
      {achievement.isUnlocked && achievement.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: [-100, 300],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
};

export default AchievementCard;
