import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  Loader2,
  Crown,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { updateUserPlan } from "../services/plan";
import { checkStripePaymentStatus } from "../services/stripe";
import { PLANS } from "../data/plans";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshPlan } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planId = searchParams.get("plan");
  const sessionId = searchParams.get("session_id");
  const isSimulated = searchParams.get("simulated") === "true";

  const plan = PLANS.find((p) => p.id === planId);

  useEffect(() => {
    verifyPaymentAndUpdatePlan();
  }, [sessionId, planId]);

  const verifyPaymentAndUpdatePlan = async () => {
    try {
      setLoading(true);

      if (!planId) {
        throw new Error("Plano não especificado");
      }

      // Modo desenvolvimento ou simulação
      if (isSimulated || import.meta.env.VITE_DEV_MODE === "true") {
        await handleSuccessfulPayment();
        return;
      }

      // Verificar pagamento real no Stripe
      if (sessionId) {
        const paymentStatus = await checkStripePaymentStatus(sessionId);

        if (paymentStatus.status === "completed") {
          await handleSuccessfulPayment();
        } else {
          throw new Error("Pagamento não foi processado corretamente");
        }
      } else {
        throw new Error("ID da sessão não encontrado");
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulPayment = async () => {
    try {
      // Atualizar plano do usuário
      if (planId && planId !== "A") {
        await updateUserPlan(planId);
        await refreshPlan();
      }

      setPaymentVerified(true);
      toast.success(`🎉 Bem-vindo ao ${plan?.name || "novo plano"}!`);
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      throw new Error("Erro ao ativar plano");
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "B":
        return <Zap className="w-12 h-12 text-blue-500" />;
      case "C":
        return <Star className="w-12 h-12 text-purple-500" />;
      case "D":
        return <Crown className="w-12 h-12 text-yellow-500" />;
      default:
        return <CheckCircle className="w-12 h-12 text-green-500" />;
    }
  };

  const getPlanBenefits = (planId: string) => {
    const planData = PLANS.find((p) => p.id === planId);
    return planData?.features.slice(0, 4) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Verificando pagamento...
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Aguarde enquanto confirmamos sua assinatura
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Erro no Pagamento
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              to="/plans"
              className="block w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </Link>
            <Link
              to="/dashboard"
              className="block w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Ir para Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Pagamento Realizado com Sucesso! 🎉
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sua assinatura foi ativada e você já pode aproveitar todos os
            benefícios do seu plano.
          </p>
        </div>

        {/* Plan Details Card */}
        {plan && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex items-center justify-center mb-6">
              {getPlanIcon(plan.id)}
              <div className="ml-4 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {plan.period}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Benefícios */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Seus Benefícios:
                </h3>
                <ul className="space-y-3">
                  {getPlanBenefits(plan.id).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Próximos Passos */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Próximos Passos:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Explore todos os vídeos disponíveis
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Configure suas metas personalizadas
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Aproveite os descontos na loja
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Ir para Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            to="/videos"
            className="flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200"
          >
            Explorar Vídeos
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Precisa de Ajuda?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Nossa equipe está pronta para ajudar você a aproveitar ao máximo
              sua assinatura.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Falar com Suporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
