import { useAuth } from '../contexts/AuthContext';
import { PlanTier, hasAccessToContent } from '../types/content';

export const usePlanAccess = () => {
  const { user } = useAuth();
  const userPlan = user?.plan as PlanTier | null;

  const checkAccess = (requiredPlan: PlanTier): boolean => {
    return hasAccessToContent(requiredPlan, userPlan);
  };

  const getUserPlan = (): PlanTier | null => {
    return userPlan;
  };

  const isPremium = (): boolean => {
    return !!userPlan && userPlan !== 'FREE';
  };

  const canAccessContent = (contentPlan: PlanTier): boolean => {
    return checkAccess(contentPlan);
  };

  const getAccessLevel = (): number => {
    const planHierarchy: Record<PlanTier, number> = {
      'FREE': 0,
      'B': 1,
      'C': 2,
      'D': 3
    };
    return userPlan ? planHierarchy[userPlan] : 0;
  };

  const isAdmin = (): boolean => {
    return user?.isAdmin || false;
  };

  return {
    userPlan,
    checkAccess,
    getUserPlan,
    isPremium,
    canAccessContent,
    getAccessLevel,
    isAdmin,
    hasFullAccess: userPlan === 'D' || isAdmin()
  };
};
