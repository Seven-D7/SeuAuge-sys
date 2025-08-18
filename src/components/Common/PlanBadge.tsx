import React from 'react';
import { Crown, Lock, Star, Zap } from 'lucide-react';
import { PlanTier, getPlanLabel, getPlanColor } from '../../types/content';

interface PlanBadgeProps {
  planTier: PlanTier;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ 
  planTier, 
  className = '', 
  showIcon = true,
  size = 'md'
}) => {
  const getIcon = () => {
    switch (planTier) {
      case 'FREE':
        return <Star className="w-3 h-3" />;
      case 'B':
        return <Zap className="w-3 h-3" />;
      case 'C':
        return <Crown className="w-3 h-3" />;
      case 'D':
        return <Crown className="w-3 h-3" />;
      default:
        return <Lock className="w-3 h-3" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-1.5 py-0.5 text-xs';
      case 'md':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  const baseClasses = `
    inline-flex items-center gap-1 rounded-full font-semibold
    ${getSizeClasses()}
    ${getPlanColor(planTier)}
    ${className}
  `;

  return (
    <span className={baseClasses}>
      {showIcon && getIcon()}
      {getPlanLabel(planTier)}
    </span>
  );
};

export default PlanBadge;
