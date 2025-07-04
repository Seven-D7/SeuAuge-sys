// Tela responsável por iniciar o fluxo de pagamento fora da plataforma
import React from 'react';
import { CreditCard, Smartphone, Barcode, ArrowLeft, ExternalLink, Check } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { updateUserPlan } from '../services/plan';
import { useAuth } from '../contexts/AuthContext';

// URL do provedor externo de pagamento
const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || 'https://pagamento.exemplo.com';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { refreshPlan } = useAuth();
  const [search] = useSearchParams();
  const selectedPlan = search.get('plan');

  const handlePay = () => {
    console.log('Redirecionando para o pagamento externo');
    window.open(PAYMENT_URL, '_blank');
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    await updateUserPlan(selectedPlan);
    await refreshPlan();
    navigate('/plans');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pagamento</h1>
      <p className="text-slate-700 dark:text-slate-300">Escolha a forma de pagamento:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
          <Smartphone className="w-8 h-8 text-blue-600 mb-2" />
          <span className="font-medium">PIX</span>
        </div>
        <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
          <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
          <span className="font-medium">Cartão</span>
        </div>
        <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
          <Barcode className="w-8 h-8 text-orange-600 mb-2" />
          <span className="font-medium">Boleto</span>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        O pagamento será realizado em um ambiente externo seguro.
      </p>
      <button
        onClick={handlePay}
        className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
      >
        <ExternalLink className="w-4 h-4 mr-2" /> Realizar Pagamento
      </button>
      <button
        onClick={handleConfirm}
        className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
      >
        <Check className="w-4 h-4 mr-2" /> Já paguei
      </button>
      <Link to="/store" className="inline-flex items-center text-primary hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a loja
      </Link>
    </div>
  );
};

export default Payment;
