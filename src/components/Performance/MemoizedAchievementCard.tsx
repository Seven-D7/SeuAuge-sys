import React, { memo } from 'react';
import AchievementCard from '../Profile/AchievementCard';
import { Achievement } from '../../stores/achievementsStore';

interface MemoizedAchievementCardProps {
  achievement: Achievement;
  isHighlighted?: boolean;
  onClick?: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const MemoizedAchievementCard: React.FC<MemoizedAchievementCardProps> = memo(
  ({ achievement, isHighlighted = false, onClick }) => {
    return (
      <AchievementCard
        achievement={achievement}
        isHighlighted={isHighlighted}
        onClick={onClick}
      />
    );
  },
  // Custom comparison function to optimize re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.achievement.id === nextProps.achievement.id &&
      prevProps.achievement.isUnlocked === nextProps.achievement.isUnlocked &&
      prevProps.achievement.currentProgress === nextProps.achievement.currentProgress &&
      prevProps.isHighlighted === nextProps.isHighlighted
    );
  }
);

MemoizedAchievementCard.displayName = 'MemoizedAchievementCard';

export default MemoizedAchievementCard;
