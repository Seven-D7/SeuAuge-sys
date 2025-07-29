import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Check, Crown, Star, Zap } from "lucide-react";
import { PLANS } from "../../data/plans";

export default function PlansSection() {
  const navigate = useNavigate();

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "B":
        return Zap;
      case "C":
        return Star;
      case "D":
        return Crown;
      default:
        return Star;
    }
  };

  const handlePlanSelect = (planId: string) => {
    navigate(`/plans?selected=${planId}`);
  };

  return (
    <section id="planos" className="py-12 sm:py-16 lg:py-20 px-4 bg-white/5 backdrop-blur-sm border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Escolha Seu
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              {" "}
              Plano
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto px-2">
            Encontre o plano perfeito para sua jornada de transformação. Todos
            os planos incluem garantia de 30 dias.
          </p>
        </div>

        {/* Plans Grid - Centralizado e bem alinhado */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl w-full">
            {PLANS.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 flex flex-col h-full backdrop-blur-md border border-white/20 ${
                    plan.isPopular
                      ? "ring-2 ring-teal-400/50 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 transform scale-[1.02] sm:scale-105"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-400 to-emerald-400 text-white text-center py-2 text-xs sm:text-sm font-medium">
                      🔥 {plan.badge}
                    </div>
                  )}

                  <CardContent
                    className={`p-4 sm:p-6 lg:p-8 flex flex-col h-full ${plan.isPopular ? "pt-8 sm:pt-12" : ""}`}
                  >
                    <div className="text-center mb-6 sm:mb-8">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                          plan.isPopular
                            ? "bg-gradient-to-r from-teal-400/30 to-emerald-400/30 border-teal-400/50"
                            : "bg-white/20 border-white/30"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${plan.isPopular ? "text-teal-200" : "text-white/80"}`}
                        />
                      </div>

                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70 mb-4 leading-relaxed min-h-[2.5rem] sm:min-h-[3rem] px-2">
                        {plan.description}
                      </p>

                      <div className="mb-4 sm:mb-6">
                        <div className="mb-2">
                          {plan.originalPrice && (
                            <span className="text-sm sm:text-base lg:text-lg text-white/50 line-through mr-2">
                              {plan.originalPrice}
                            </span>
                          )}
                          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            {plan.price}
                          </span>
                        </div>
                        {plan.monthlyPrice && (
                          <span className="text-sm sm:text-base text-white/70 font-medium">
                            {plan.monthlyPrice}
                          </span>
                        )}
                        {plan.savings && (
                          <div className="inline-block bg-green-400/20 text-green-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mt-1 sm:mt-2 backdrop-blur-sm border border-green-400/30">
                            {plan.savings}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                      {plan.features
                        .slice(0, 5)
                        .map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-2 sm:gap-3"
                          >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm border border-green-400/30">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-300" />
                            </div>
                            <span className="text-white/80 text-xs sm:text-sm leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                      {plan.features.length > 5 && (
                        <div className="text-white/60 text-xs sm:text-sm text-center pt-2 font-medium">
                          +{plan.features.length - 5} recursos adicionais
                        </div>
                      )}
                    </div>

                    {plan.discount && (
                      <div className="mb-4 sm:mb-6 text-center">
                        <div className="inline-block bg-gradient-to-r from-purple-400/30 to-pink-400/30 text-purple-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm border border-purple-400/30">
                          🛍️ {plan.discount} de desconto
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full h-10 sm:h-12 text-sm sm:text-base lg:text-lg font-medium transition-all duration-200 mt-auto ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] sm:hover:scale-105 border border-teal-400/30"
                          : "bg-white/20 hover:bg-white/30 text-white hover:scale-[1.02] sm:hover:scale-105 backdrop-blur-sm border border-white/30"
                      }`}
                    >
                      Escolher {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg px-4">
            Não tem certeza qual plano escolher?
          </p>
          <Button
            variant="outline"
            className="border-teal-400/50 text-teal-300 hover:bg-teal-400/20 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-medium backdrop-blur-sm"
            onClick={() => navigate("/plans")}
          >
            <span className="hidden sm:inline">Ver Comparação Completa</span>
            <span className="sm:hidden">Ver Comparação</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
