import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Crown, Zap, Star, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { PLANS, Plan } from "../data/plans";
import usePlan from "../hooks/usePlan";
import { useAuth } from "../contexts/AuthContext";
import { redirectToStripeCheckout } from "../services/stripe";

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { plan } = usePlan();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const canUpgrade = (target: Plan) => {
    if (!plan) return true;
    const order = ["B", "C", "D"];
    return order.indexOf(target.id) > order.indexOf(plan);
  };

  const handlePlanSubscription = async (selectedPlan: Plan) => {
    if (!user) {
      toast.error("Faça login para assinar um plano");
      navigate("/auth");
      return;
    }

    try {
      setLoadingPlan(selectedPlan.id);
      toast.loading("Preparando checkout...", { id: "checkout" });

      // Extrair valor numérico do preço
      const priceMatch = selectedPlan.price.match(/\d+/);
      const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

      await redirectToStripeCheckout({
        planId: selectedPlan.id,
        planName: selectedPlan.fullName,
        price: price,
        currency: "BRL",
        userId: user.id,
        userEmail: user.email,
      });

      toast.dismiss("checkout");
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error);
      toast.dismiss("checkout");
      toast.error("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "B":
        return <Zap className="w-5 h-5 text-blue-500" />;
      case "C":
        return <Star className="w-5 h-5 text-purple-500" />;
      case "D":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case "B":
        return "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20";
      case "C":
        return "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20";
      case "D":
        return "from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20";
      default:
        return "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900";
    }
  };

  const getBorderColor = (planId: string, isPopular?: boolean) => {
    if (isPopular) return "border-yellow-400 dark:border-yellow-500";
    switch (planId) {
      case "B":
        return "border-blue-200 dark:border-blue-700";
      case "C":
        return "border-purple-200 dark:border-purple-700";
      case "D":
        return "border-yellow-200 dark:border-yellow-700";
      default:
        return "border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Transforme sua jornada de bem-estar com acesso completo à nossa
            plataforma
          </p>
          <div className="mt-4 inline-flex items-center px-3 sm:px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs sm:text-sm font-medium">
            <span className="mr-1 sm:mr-2">🎯</span>
            <span className="hidden sm:inline">Seu plano atual: </span>
            <span className="sm:hidden">Plano: </span>
            <span className="font-bold ml-1">
              {PLANS.find((p) => p.id === plan)?.name || "Nenhum"}
            </span>
          </div>
        </div>

        {/* Plans Grid - Centralizado e bem alinhado */}
        <div className="flex justify-center mb-8 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl w-full">
            {PLANS.map((p) => {
              const Icon = getPlanIcon(p.id);
              const isCurrentPlan = plan === p.id;
              const canUpgradeToThis = canUpgrade(p);

              return (
                <div
                  key={p.id}
                  className={`relative bg-gradient-to-br ${getPlanGradient(p.id)} rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 ${getBorderColor(p.id, p.isPopular)} transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg ${
                    p.isPopular
                      ? "ring-2 ring-yellow-400 dark:ring-yellow-500 ring-offset-1 sm:ring-offset-2 dark:ring-offset-slate-900 transform scale-[1.02] sm:scale-105"
                      : ""
                  } flex flex-col h-full`}
                >
                  {/* Popular Badge */}
                  {p.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <Crown className="w-3 h-3 mr-1" />
                        {p.badge}
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      {Icon}
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white ml-2">
                        {p.name}
                      </h2>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 sm:mb-3 font-medium">
                      {p.period}
                    </div>

                    {/* Pricing */}
                    <div className="mb-3 sm:mb-4">
                      {p.originalPrice && (
                        <div className="text-xs sm:text-sm text-slate-500 line-through mb-1">
                          {p.originalPrice}
                        </div>
                      )}
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                        {p.price}
                      </div>
                      {p.monthlyPrice && (
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {p.monthlyPrice}
                        </div>
                      )}
                      {p.savings && (
                        <div className="inline-block bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 sm:px-3 py-1 rounded-full text-xs font-medium mt-1 sm:mt-2">
                          {p.savings}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-center leading-relaxed px-2">
                    {p.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
                    {p.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-xs sm:text-sm"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Discount Badge */}
                  {p.discount && (
                    <div className="mb-4 sm:mb-6 text-center">
                      <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                        🛍️ {p.discount} de desconto
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {isCurrentPlan ? (
                      <button
                        className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-not-allowed font-medium flex items-center justify-center text-sm sm:text-base"
                        disabled
                      >
                        ✓ Seu plano atual
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlanSubscription(p)}
                        disabled={!canUpgradeToThis || loadingPlan === p.id}
                        className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center text-sm sm:text-base ${
                          canUpgradeToThis
                            ? p.isPopular
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] sm:hover:scale-105"
                              : "bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] sm:hover:scale-105"
                            : "bg-slate-400 cursor-not-allowed text-slate-600"
                        }`}
                      >
                        {loadingPlan === p.id ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                            <span className="hidden sm:inline">
                              Processando...
                            </span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : canUpgradeToThis ? (
                          <>
                            <span className="hidden sm:inline">
                              Assinar Agora
                            </span>
                            <span className="sm:hidden">Assinar</span>
                          </>
                        ) : (
                          "Indisponível"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extra Info */}
        <div className="text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 dark:border-slate-700 max-w-5xl mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              🎯 Por que escolher o Meu Auge?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
                  Conteúdo Sempre Atualizado
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
                  Novos treinos e receitas toda semana para manter sua motivação
                  em alta
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Star className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
                  Acesso Antecipado
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
                  Seja o primeiro a testar novos recursos e aplicativos
                  exclusivos
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Crown className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
                  Suporte Especializado
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
                  Nutricionistas I.A e treinadores especializados para te ajudar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
