import React, { useState } from 'react';
import { Users, DollarSign, ShoppingBag, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import EmailConfigDiagnostic from '../components/Admin/EmailConfigDiagnostic';

const AdminDashboard: React.FC = () => {
  const [showEmailDiagnostic, setShowEmailDiagnostic] = useState(false);

  // Esses valores podem ser obtidos do banco de dados futuramente
  const stats = [
    { icon: Users, label: 'Usuários Ativos', value: 1200, color: 'bg-primary' },
    { icon: DollarSign, label: 'Receita Mensal', value: 'R$ 15.800', color: 'bg-emerald-600' },
    { icon: ShoppingBag, label: 'Vendas', value: 320, color: 'bg-cyan-600' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-lg p-6 flex items-center space-x-4">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seção de Diagnóstico */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowEmailDiagnostic(!showEmailDiagnostic)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">
                Diagnóstico de Email
              </h2>
              <p className="text-sm text-slate-400">
                Verificar configuração de emails e autenticação
              </p>
            </div>
          </div>
          {showEmailDiagnostic ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showEmailDiagnostic && (
          <div className="px-6 pb-6">
            <EmailConfigDiagnostic />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
