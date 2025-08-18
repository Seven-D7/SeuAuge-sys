import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PlanTier, hasAccessToContent } from '../../types/content';
import ContentAccessIndicator from './ContentAccessIndicator';

interface InlinePlanGuardProps {
  requiredPlan: PlanTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAccessIndicator?: boolean;
}

const InlinePlanGuard: React.FC<InlinePlanGuardProps> = ({
  requiredPlan,
  children,
  fallback,
  showAccessIndicator = true
}) => {
  const { user } = useAuth();
  const userPlan = user?.plan as PlanTier | null;
  const hasAccess = hasAccessToContent(requiredPlan, userPlan);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessIndicator) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <ContentAccessIndicator
          contentPlan={requiredPlan}
          userPlan={userPlan}
          showUpgradeMessage={true}
        />
      </div>
    );
  }

  return null;
};

export default InlinePlanGuard;
