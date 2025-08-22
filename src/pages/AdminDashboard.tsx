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
    </div>
  );
};

export default AdminDashboard;
