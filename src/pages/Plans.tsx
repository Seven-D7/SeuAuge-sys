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
    const order = ["A", "B", "C", "D"];
    return order.indexOf(target.id) > order.indexOf(plan);
  };

  const handlePlanSubscription = async (selectedPlan: Plan) => {
    if (selectedPlan.id === "A") {
      // Plano gratuito - redirecionar para dashboard
      navigate("/dashboard");
      return;
    }

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
      case "A":
        return null;
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
      case "A":
        return "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900";
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transforme sua jornada de bem-estar com acesso completo à nossa
            plataforma
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
            <span className="mr-2">🎯</span>
            Seu plano atual:{" "}
            <span className="font-bold ml-1">
              {PLANS.find((p) => p.id === (plan || "A"))?.name}
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PLANS.map((p) => {
            const Icon = getPlanIcon(p.id);
            const isCurrentPlan = plan === p.id;
            const canUpgradeToThis = canUpgrade(p);

            return (
              <div
                key={p.id}
                className={`relative bg-gradient-to-br ${getPlanGradient(p.id)} rounded-2xl p-6 border-2 ${getBorderColor(p.id, p.isPopular)} transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  p.isPopular
                    ? "ring-2 ring-yellow-400 dark:ring-yellow-500 ring-offset-2 dark:ring-offset-slate-900"
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {p.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      {p.badge}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    {Icon}
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white ml-2">
                      {p.name}
                    </h2>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {p.period}
                  </div>

                  {/* Pricing */}
                  <div className="mb-2">
                    {p.originalPrice && (
                      <div className="text-sm text-slate-500 line-through">
                        {p.originalPrice}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {p.price}
                    </div>
                    {p.monthlyPrice && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {p.monthlyPrice}
                      </div>
                    )}
                    {p.savings && (
                      <div className="inline-block bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium mt-1">
                        {p.savings}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center">
                  {p.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Discount Badge */}
                {p.discount && (
                  <div className="mb-4 text-center">
                    <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🛍️ {p.discount} de desconto na loja
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <button
                      className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-3 rounded-xl cursor-not-allowed font-medium"
                      disabled
                    >
                      ✓ Seu plano atual
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePlanSubscription(p)}
                      disabled={!canUpgradeToThis || loadingPlan === p.id}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                        canUpgradeToThis
                          ? p.isPopular
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-slate-400 cursor-not-allowed text-slate-600"
                      }`}
                    >
                      {loadingPlan === p.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : canUpgradeToThis ? (
                        p.id === "A" ? (
                          "Acessar Grátis"
                        ) : (
                          "Assinar Agora"
                        )
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

        {/* Extra Info */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              🎯 Por que escolher o Meu Auge?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Conteúdo Sempre Atualizado
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Novos treinos e receitas toda semana para manter sua motivação
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Acesso Antecipado
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Seja o primeiro a testar novos recursos e aplicativos
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Suporte Especializado
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Nutricionistas I.A e treinadores para te ajudar
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
