import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PLANS, Plan } from '../data/plans';
import usePlan from '../hooks/usePlan';

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { plan } = usePlan();

  const canUpgrade = (target: Plan) => {
    if (!plan) return true;
    const order = ['A', 'B', 'C'];
    return order.indexOf(target.id) > order.indexOf(plan);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Planos</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Seu plano atual: <span className="font-semibold">{plan || 'A'}</span>
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div key={p.id} className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
              {p.name}
            </h2>
            <span className="text-teal-600 dark:text-teal-400 mb-4 font-medium">
              {p.price}
            </span>
            <ul className="flex-1 space-y-1 text-sm mb-4 list-disc list-inside text-slate-700 dark:text-slate-300">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {plan === p.id ? (
              <button className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-2 rounded-lg cursor-not-allowed" disabled>
                Seu plano atual
              </button>
            ) : (
              <button
                onClick={() => navigate(`/payment?plan=${p.id}`)}
                disabled={!canUpgrade(p)}
                className={`w-full py-2 rounded-lg text-white ${
                  canUpgrade(p)
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                {canUpgrade(p) ? 'Adquirir' : 'Indisponível'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
