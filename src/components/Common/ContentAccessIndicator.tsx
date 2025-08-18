import React from 'react';
import { Lock, Crown, CheckCircle, AlertCircle } from 'lucide-react';
import { PlanTier, hasAccessToContent, getPlanLabel } from '../../types/content';
import PlanBadge from './PlanBadge';

interface ContentAccessIndicatorProps {
  contentPlan: PlanTier;
  userPlan: PlanTier | null;
  className?: string;
  showUpgradeMessage?: boolean;
}

const ContentAccessIndicator: React.FC<ContentAccessIndicatorProps> = ({
  contentPlan,
  userPlan,
  className = '',
  showUpgradeMessage = false
}) => {
  const hasAccess = hasAccessToContent(contentPlan, userPlan);

  if (hasAccess) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-green-500 text-sm font-medium">Acesso liberado</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 text-amber-500" />
        <span className="text-amber-500 text-sm font-medium">Conteúdo Premium</span>
        <PlanBadge planTier={contentPlan} size="sm" />
      </div>
      
      {showUpgradeMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium mb-1">
                Este conteúdo requer o {getPlanLabel(contentPlan)} ou superior
              </p>
              <p className="text-amber-700">
                {!userPlan 
                  ? "Faça upgrade para acessar este conteúdo exclusivo."
                  : `Seu plano atual: ${getPlanLabel(userPlan)}. Faça upgrade para ter acesso.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAccessIndicator;
