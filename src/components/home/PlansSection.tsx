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
    <section id="planos" className="py-20 px-4 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Escolha Seu
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              {" "}
              Plano
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Encontre o plano perfeito para sua jornada de transformação. Todos
            os planos incluem garantia de 30 dias.
          </p>
        </div>

        {/* Plans Grid - Centralizado e bem alinhado */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
            {PLANS.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col h-full ${
                    plan.isPopular
                      ? "ring-2 ring-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50 transform scale-105"
                      : "bg-white"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-center py-2 text-sm font-medium">
                      🔥 {plan.badge}
                    </div>
                  )}

                  <CardContent
                    className={`p-8 flex flex-col h-full ${plan.isPopular ? "pt-12" : ""}`}
                  >
                    <div className="text-center mb-8">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          plan.isPopular
                            ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                            : "bg-gradient-to-r from-gray-100 to-gray-200"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${plan.isPopular ? "text-white" : "text-gray-600"}`}
                        />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed min-h-[3rem]">
                        {plan.description}
                      </p>

                      <div className="mb-6">
                        <div className="mb-2">
                          {plan.originalPrice && (
                            <span className="text-lg text-gray-500 line-through mr-2">
                              {plan.originalPrice}
                            </span>
                          )}
                          <span className="text-4xl font-bold text-gray-900">
                            {plan.price}
                          </span>
                        </div>
                        {plan.monthlyPrice && (
                          <span className="text-gray-600 font-medium">
                            {plan.monthlyPrice}
                          </span>
                        )}
                        {plan.savings && (
                          <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                            {plan.savings}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                      {plan.features
                        .slice(0, 5)
                        .map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                      {plan.features.length > 5 && (
                        <div className="text-gray-500 text-sm text-center pt-2 font-medium">
                          +{plan.features.length - 5} recursos adicionais
                        </div>
                      )}
                    </div>

                    {plan.discount && (
                      <div className="mb-6 text-center">
                        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          🛍️ {plan.discount} de desconto na loja
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full h-12 text-lg font-medium transition-all duration-200 mt-auto ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-900 hover:bg-gray-800 text-white hover:scale-105"
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
          <p className="text-gray-600 mb-4 text-lg">
            Não tem certeza qual plano escolher?
          </p>
          <Button
            variant="outline"
            className="border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-3 text-lg font-medium"
            onClick={() => navigate("/plans")}
          >
            Ver Comparação Completa
          </Button>
        </div>
      </div>
    </section>
  );
}
