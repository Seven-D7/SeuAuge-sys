import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Barcode,
  ArrowLeft,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { updateUserPlan } from '../services/plan';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || 'https://pagamento.exemplo.com';

const paymentMethods = [
  { icon: Smartphone, color: 'text-blue-600', label: 'PIX' },
  { icon: CreditCard, color: 'text-purple-600', label: 'Cartão' },
  { icon: Barcode, color: 'text-orange-600', label: 'Boleto' },
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { refreshPlan } = useAuth();
  const [search] = useSearchParams();
  const selectedPlan = search.get('plan');

  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePay = () => {
    window.open(PAYMENT_URL, '_blank');
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    setLoadingConfirm(true);
    try {
      await updateUserPlan(selectedPlan);
      await refreshPlan();
      navigate('/plans');
    } catch (error) {
      console.error("Falha ao confirmar o pagamento:", error);
      // Aqui você poderia exibir uma notificação de erro para o usuário
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Pagamento</h1>
        {selectedPlan && (
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Você está adquirindo o <span className="font-semibold text-slate-900 dark:text-white">Plano {selectedPlan}</span>
          </p>
        )}
      </div>

      <div>
        <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">Escolha a forma de pagamento:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paymentMethods.map(({ icon: Icon, color, label }) => (
            <motion.button
              key={label}
              onClick={() => setSelectedMethod(label)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center justify-center px-4 py-6 rounded-xl border 
                transition-all backdrop-blur bg-white/20 dark:bg-slate-800/30 shadow-md
                ${
                  selectedMethod === label
                    ? 'ring-2 ring-primary border-transparent'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              aria-pressed={selectedMethod === label}
            >
              <Icon className={`w-8 h-8 mb-2 ${color}`} />
              <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{label}</span>
            </motion.button>
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
          O pagamento será realizado em um ambiente externo seguro.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePay}
          disabled={!selectedMethod}
          className={`inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-lg transition-colors
            ${
              selectedMethod
                ? 'bg-primary hover:bg-primary-dark text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
        >
          <ExternalLink className="w-4 h-4 mr-2" /> Realizar Pagamento
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          disabled={loadingConfirm}
          className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          {loadingConfirm ? (
            <svg
              className="animate-spin h-4 w-4 mr-2 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          Já paguei
        </motion.button>
      </div>

      <div>
        <Link
          to="/store"
          className="inline-flex items-center text-primary hover:underline text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a loja
        </Link>
      </div>
    </section>
  );
};

export default Payment;
