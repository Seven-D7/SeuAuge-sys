import React, { useState, useEffect } from 'react';
import { useAchievementsStore } from '../../stores/achievementsStore';
import { useLevelStore } from '../../stores/levelStore';
import AchievementUnlock from './AchievementUnlock';
import { notificationService } from '../../services/notifications';
import toast from 'react-hot-toast';

interface GamificationManagerProps {
  children: React.ReactNode;
}

const GamificationManager: React.FC<GamificationManagerProps> = ({ children }) => {
  const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [lastProcessedAchievement, setLastProcessedAchievement] = useState<string>('');
  
  const { achievements, unlockedAchievements } = useAchievementsStore();
  const { level, xp } = useLevelStore();

  // Previous values to detect changes
  const [prevLevel, setPrevLevel] = useState(level);
  const [prevUnlockedCount, setPrevUnlockedCount] = useState(unlockedAchievements.length);

  // Monitor achievement unlocks
  useEffect(() => {
    if (unlockedAchievements.length > prevUnlockedCount) {
      const newAchievement = unlockedAchievements[unlockedAchievements.length - 1];
      const fullAchievement = achievements.find(a => a.id === newAchievement.achievementId);
      
      if (fullAchievement && fullAchievement.id !== lastProcessedAchievement) {
        setUnlockedAchievement(fullAchievement);
        setShowAchievementModal(true);
        setLastProcessedAchievement(fullAchievement.id);
        
        // Show push notification
        notificationService.showAchievementNotification({
          title: fullAchievement.title,
          description: fullAchievement.description,
          icon: fullAchievement.icon,
          rarity: fullAchievement.rarity || 'common',
          xpReward: fullAchievement.xpReward || 50
        });
      }
    }
    setPrevUnlockedCount(unlockedAchievements.length);
  }, [unlockedAchievements, achievements, prevUnlockedCount, lastProcessedAchievement]);

  // Monitor level changes
  useEffect(() => {
    if (level > prevLevel && prevLevel > 0) {
      const xpGained = 100; // This should come from the level system
      
      // Show level up notification
      notificationService.showLevelUpNotification(level, xpGained);
      
      // Show toast notification with animation
      toast.success(
        `🚀 Parabéns! Você subiu para o nível ${level}!`,
        {
          duration: 5000,
          style: {
            background: 'linear-gradient(45deg, #10b981, #3b82f6)',
            color: 'white',
            fontWeight: 'bold',
          },
        }
      );
    }
    setPrevLevel(level);
  }, [level, prevLevel]);

  // Initialize notification permissions on component mount
  useEffect(() => {
    const initNotifications = async () => {
      if (notificationService.isSupported()) {
        const hasPermission = await notificationService.requestPermission();
        if (hasPermission) {
          // Schedule daily reminders
          await notificationService.scheduleDailyReminders();
        }
      }
    };

    initNotifications();
  }, []);

  // Handle streak notifications
  useEffect(() => {
    const checkStreak = () => {
      const lastLogin = localStorage.getItem('lastLogin');
      const today = new Date().toDateString();
      
      if (lastLogin !== today) {
        const streak = parseInt(localStorage.getItem('loginStreak') || '0');
        if (streak > 0 && streak % 7 === 0) {
          // Show streak notification for every 7 days
          notificationService.showStreakNotification(streak);
        }
        localStorage.setItem('lastLogin', today);
      }
    };

    checkStreak();
  }, []);

  const handleAchievementClose = () => {
    setShowAchievementModal(false);
    setUnlockedAchievement(null);
  };

  const handleAchievementShare = (achievement: any) => {
    // Analytics tracking for social sharing
    if (window.gtag) {
      window.gtag('event', 'achievement_shared', {
        achievement_id: achievement.id,
        achievement_rarity: achievement.rarity,
        share_method: 'social'
      });
    }
    
    toast.success('Conquista compartilhada com sucesso!', {
      icon: '🎉',
      duration: 3000,
    });
  };

  return (
    <>
      {children}
      <AchievementUnlock
        achievement={unlockedAchievement}
        isVisible={showAchievementModal}
        onClose={handleAchievementClose}
        onShare={handleAchievementShare}
      />
    </>
  );
};

export default GamificationManager;
