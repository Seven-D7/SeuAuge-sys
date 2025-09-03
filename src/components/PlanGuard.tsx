// Componente que restringe acesso conforme o plano do usuário
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PlanTier, hasAccessToContent, getPlanLabel } from "../types/content";
import ContentAccessIndicator from "./Common/ContentAccessIndicator";
import { Button } from "./ui/button";
import { Crown, ArrowRight } from "lucide-react";

const BYPASS_PLAN_GUARD = import.meta.env.VITE_BYPASS_PLAN_GUARD === "true";

interface PlanGuardProps {
  requiredPlan: PlanTier;
  redirectTo?: string;
  children: React.ReactNode;
  showUpgradeUI?: boolean;
  fallbackMessage?: string;
}

const PlanGuard: React.FC<PlanGuardProps> = ({
  requiredPlan,
  redirectTo = "/payment",
  children,
  showUpgradeUI = true,
  fallbackMessage,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const userPlan = user?.plan as PlanTier | null;

  if (BYPASS_PLAN_GUARD) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 safe-area-inset">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const hasAccess = hasAccessToContent(requiredPlan, userPlan);

  if (!hasAccess) {
    console.log("Acesso negado. Plano atual:", userPlan, "Requerido:", requiredPlan);

    if (!showUpgradeUI) {
      return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-950 safe-area-inset">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center space-y-6 overflow-hidden">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-black" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">
              Conteúdo Premium
            </h2>
            <p className="text-gray-300 break-words leading-relaxed">
              {fallbackMessage || `Este conteúdo está disponível no ${getPlanLabel(requiredPlan)} ou superior.`}
            </p>
          </div>

          {/* Access Indicator */}
          <ContentAccessIndicator
            contentPlan={requiredPlan}
            userPlan={userPlan}
            showUpgradeMessage={true}
            className="text-left"
          />

          {/* Actions */}
          <div className="space-y-3 w-full">
            <Button
              onClick={() => window.location.href = redirectTo}
              className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 min-h-[48px] flex items-center justify-center"
            >
              <Crown className="w-4 h-4 mr-2" />
              <span className="truncate">Fazer Upgrade</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full border-white/20 text-white hover:bg-white/10 min-h-[48px] flex items-center justify-center"
            >
              <span className="truncate">Voltar</span>
            </Button>
          </div>

          {/* Current Plan Info */}
          {userPlan && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <p className="text-sm text-gray-400 break-words">
                Seu plano atual: <span className="text-white font-medium break-words">{getPlanLabel(userPlan)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PlanGuard;
