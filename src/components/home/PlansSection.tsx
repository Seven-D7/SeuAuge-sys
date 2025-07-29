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
    <section id="planos" className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 bg-slate-50/80 backdrop-blur-sm border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-slate-900">
            Escolha Seu
            <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {" "}
              Plano
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto px-2">
            Encontre o plano perfeito para sua jornada de transformação. Todos
            os planos incluem garantia de 30 dias.
          </p>
        </div>

        {/* Plans Grid - Centralizado e bem alinhado */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-6xl w-full">
            {PLANS.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] lg:hover:scale-105 flex flex-col h-full backdrop-blur-md border border-white/20 ${
                    plan.isPopular
                      ? "ring-2 ring-teal-400/50 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 transform scale-[1.01] sm:scale-[1.02] lg:scale-105"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-400 to-emerald-400 text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                      🔥 {plan.badge}
                    </div>
                  )}

                  <CardContent
                    className={`p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col h-full ${plan.isPopular ? "pt-6 sm:pt-8 md:pt-12" : ""}`}
                  >
                    <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                          plan.isPopular
                            ? "bg-gradient-to-r from-teal-400/30 to-emerald-400/30 border-teal-400/50"
                            : "bg-white/20 border-white/30"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${plan.isPopular ? "text-teal-200" : "text-white/80"}`}
                        />
                      </div>

                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-white/70 mb-3 sm:mb-4 leading-relaxed min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] px-1 sm:px-2">
                        {plan.description}
                      </p>

                      <div className="mb-3 sm:mb-4 md:mb-6">
                        <div className="mb-1 sm:mb-2">
                          {plan.originalPrice && (
                            <span className="text-xs sm:text-sm md:text-base lg:text-lg text-white/50 line-through mr-1 sm:mr-2">
                              {plan.originalPrice}
                            </span>
                          )}
                          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            {plan.price}
                          </span>
                        </div>
                        {plan.monthlyPrice && (
                          <span className="text-xs sm:text-sm md:text-base text-white/70 font-medium">
                            {plan.monthlyPrice}
                          </span>
                        )}
                        {plan.savings && (
                          <div className="inline-block bg-green-400/20 text-green-200 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium mt-1 sm:mt-2 backdrop-blur-sm border border-green-400/30">
                            {plan.savings}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8 flex-1">
                      {plan.features
                        .slice(0, 5)
                        .map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-2 sm:gap-3"
                          >
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-sm border border-green-400/30">
                              <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-green-300" />
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
                        <div className="inline-block bg-gradient-to-r from-cyan-400/30 to-blue-400/30 text-cyan-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm border border-cyan-400/30">
                          🛍️ {plan.discount} de desconto
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full h-9 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all duration-200 mt-auto ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.01] sm:hover:scale-[1.02] lg:hover:scale-105 border border-teal-400/30"
                          : "bg-white/20 hover:bg-white/30 text-white hover:scale-[1.01] sm:hover:scale-[1.02] lg:hover:scale-105 backdrop-blur-sm border border-white/30"
                      }`}
                    >
                      <span className="hidden sm:inline">Escolher {plan.name}</span>
                      <span className="sm:hidden">Escolher</span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/70 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-4">
            Não tem certeza qual plano escolher?
          </p>
          <Button
            variant="outline"
            className="border-teal-400/50 text-teal-300 hover:bg-teal-400/20 px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base lg:text-lg font-medium backdrop-blur-sm"
            onClick={() => navigate("/plans")}
          >
            <span className="hidden md:inline">Ver Comparação Completa</span>
            <span className="md:hidden">Ver Comparação</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
