import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Medal, Award } from 'lucide-react';
import ConfettiAnimation from './ConfettiAnimation';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'milestone' | 'streak' | 'total' | 'special' | 'legendary';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

interface AchievementUnlockProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
  onShare?: (achievement: Achievement) => void;
}

const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  achievement,
  isVisible,
  onClose,
  onShare
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    if (isVisible && achievement) {
      setShowConfetti(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, onClose]);

  if (!achievement) return null;

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bgGradient: 'from-yellow-400 via-orange-500 to-red-500',
          glowColor: 'shadow-yellow-500/50',
          textColor: 'text-yellow-100',
          borderColor: 'border-yellow-300',
          icon: Crown
        };
      case 'epic':
        return {
          bgGradient: 'from-purple-500 via-pink-500 to-red-500',
          glowColor: 'shadow-purple-500/50',
          textColor: 'text-purple-100',
          borderColor: 'border-purple-300',
          icon: Medal
        };
      case 'rare':
        return {
          bgGradient: 'from-blue-500 via-cyan-500 to-teal-500',
          glowColor: 'shadow-blue-500/50',
          textColor: 'text-blue-100',
          borderColor: 'border-blue-300',
          icon: Star
        };
      default:
        return {
          bgGradient: 'from-gray-500 via-slate-500 to-gray-600',
          glowColor: 'shadow-gray-500/50',
          textColor: 'text-gray-100',
          borderColor: 'border-gray-300',
          icon: Trophy
        };
    }
  };

  const rarityConfig = getRarityConfig(achievement.rarity);
  const RarityIcon = rarityConfig.icon;

  const handleShare = (platform: string) => {
    if (onShare) {
      onShare(achievement);
    }
    
    const shareText = `🏆 Acabei de desbloquear a conquista "${achievement.title}" no SeuAuge! 💪`;
    const shareUrl = window.location.origin;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText + ' ' + shareUrl);
        break;
    }
    setShowShareOptions(false);
  };

  return (
    <>
      <ConfettiAnimation
        isVisible={showConfetti}
        onComplete={() => setShowConfetti(false)}
        intensity={achievement.rarity === 'legendary' ? 'heavy' : achievement.rarity === 'epic' ? 'medium' : 'light'}
        duration={achievement.rarity === 'legendary' ? 4000 : 3000}
      />
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative max-w-md w-full bg-gradient-to-br ${rarityConfig.bgGradient} rounded-2xl p-6 shadow-2xl ${rarityConfig.glowColor} border-2 ${rarityConfig.borderColor}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.bgGradient} rounded-2xl blur-xl opacity-30 -z-10`} />
              
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative mx-auto mb-4"
                >
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <span className="text-4xl">{achievement.icon}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full border-2 border-dashed border-white/40"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RarityIcon className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                      {achievement.rarity}
                    </span>
                  </div>
                  <h2 className={`text-2xl font-bold ${rarityConfig.textColor} mb-2`}>
                    Conquista Desbloqueada!
                  </h2>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </motion.div>
              </div>

              {/* Reward */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="bg-white/10 rounded-lg p-3 mb-6 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-semibold">
                    +{achievement.xpReward} XP
                  </span>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareOptions(true)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg backdrop-blur-sm border border-white/30 transition-all duration-200"
                >
                  Compartilhar
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  Fechar
                </motion.button>
              </div>

              {/* Share Options */}
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute inset-x-4 bottom-4 bg-white rounded-lg p-4 shadow-xl"
                  >
                    <h4 className="font-semibold text-gray-800 mb-3 text-center">
                      Compartilhar conquista
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { platform: 'twitter', label: '𝕏', color: 'bg-black' },
                        { platform: 'facebook', label: 'f', color: 'bg-blue-600' },
                        { platform: 'whatsapp', label: '💬', color: 'bg-green-500' },
                        { platform: 'copy', label: '📋', color: 'bg-gray-600' }
                      ].map(({ platform, label, color }) => (
                        <button
                          key={platform}
                          onClick={() => handleShare(platform)}
                          className={`${color} text-white font-bold py-2 px-3 rounded text-sm hover:opacity-80 transition-opacity`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementUnlock;
