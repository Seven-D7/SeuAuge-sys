import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Trophy, Target, CheckCircle, Calendar } from 'lucide-react';
import { Challenge } from '../../stores/achievementsStore';
import { designUtils, COMMON_CLASSES } from '../../lib/design-system';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: () => void;
  onClaim?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  onClaim,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'hard': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'extreme': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'weekly': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'monthly': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'special': return 'text-pink-400 bg-pink-400/20 border-pink-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const endDate = new Date(challenge.endDate);
    const timeLeft = endDate.getTime() - now.getTime();

    if (timeLeft <= 0) return 'Expirado';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getOverallProgress = () => {
    const totalProgress = challenge.requirements.reduce((sum, req) => sum + req.current, 0);
    const totalTarget = challenge.requirements.reduce((sum, req) => sum + req.target, 0);
    return totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
  };

  const isCompleted = challenge.isCompleted;
  const isExpired = new Date() > new Date(challenge.endDate);
  const canParticipate = challenge.isActive && !isCompleted && !isExpired;

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl
        ${isCompleted 
          ? designUtils.glass('success')
          : isExpired 
            ? designUtils.glass('error')
            : designUtils.glass('medium')
        }
        transition-all duration-300 hover:scale-105
        ${COMMON_CLASSES.focus}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Status Indicator */}
      <div className={`
        absolute top-0 left-0 right-0 h-1
        ${isCompleted 
          ? 'bg-green-400' 
          : isExpired 
            ? 'bg-red-400' 
            : 'bg-gradient-to-r from-primary to-secondary'
        }
      `} />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white mb-2">
              {challenge.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {/* Status Icon */}
          <div className={`
            ml-4 p-2 rounded-full
            ${isCompleted 
              ? 'bg-green-400/20 text-green-400'
              : isExpired 
                ? 'bg-red-400/20 text-red-400'
                : 'bg-primary/20 text-primary'
            }
          `}>
            {isCompleted ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Target className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium border
            ${getCategoryColor(challenge.category)}
          `}>
            {challenge.category.toUpperCase()}
          </span>
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium border
            ${getDifficultyColor(challenge.difficulty)}
          `}>
            {challenge.difficulty.toUpperCase()}
          </span>
        </div>

        {/* Requirements */}
        <div className="space-y-3 mb-4">
          {challenge.requirements.map((req, index) => {
            const progress = Math.min(100, (req.current / req.target) * 100);
            return (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">{req.description}</span>
                  <span className={`
                    font-semibold
                    ${req.current >= req.target ? 'text-green-400' : 'text-gray-300'}
                  `}>
                    {req.current} / {req.target}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`
                      h-full rounded-full
                      ${req.current >= req.target 
                        ? 'bg-green-400' 
                        : 'bg-gradient-to-r from-primary to-secondary'
                      }
                    `}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{getTimeRemaining()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>{challenge.participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 col-span-2 sm:col-span-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(challenge.endDate).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Recompensas
          </h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-yellow-400 font-medium">
              {challenge.rewards.xp} XP
            </span>
            {challenge.rewards.points && (
              <span className="text-blue-400 font-medium">
                {challenge.rewards.points} Pontos
              </span>
            )}
            {challenge.rewards.badge && (
              <span className="text-purple-400 font-medium">
                Badge: {challenge.rewards.badge}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          {isCompleted ? (
            <button
              onClick={onClaim}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-medium
                bg-green-400 hover:bg-green-500 text-black
                transition-all duration-200 hover:scale-105
                ${COMMON_CLASSES.focus}
              `}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Resgatar Recompensa
            </button>
          ) : canParticipate ? (
            <button
              onClick={onJoin}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-medium
                ${designUtils.gradient('primary')}
                text-white shadow-md hover:shadow-lg
                transition-all duration-200 hover:scale-105
                ${COMMON_CLASSES.focus}
              `}
            >
              Participar do Desafio
            </button>
          ) : (
            <button
              disabled
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-medium
                bg-gray-600 text-gray-400 cursor-not-allowed
                ${COMMON_CLASSES.disabled}
              `}
            >
              {isExpired ? 'Expirado' : 'Indisponível'}
            </button>
          )}
        </div>

        {/* Completion Timestamp */}
        {isCompleted && challenge.completedAt && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400">
              Completado em {new Date(challenge.completedAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>

      {/* Completion Animation */}
      {isCompleted && (
        <motion.div
          className="absolute inset-0 bg-green-400/10 rounded-xl"
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}
    </motion.div>
  );
};

export default ChallengeCard;
