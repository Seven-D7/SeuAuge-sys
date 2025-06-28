import React from 'react';
import { CreditCard, Smartphone, Barcode, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Payment: React.FC = () => {
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
      <Link to="/store" className="inline-flex items-center text-teal-600 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a loja
      </Link>
    </div>
  );
};

export default Payment;
