import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PLANS } from '../data/plans';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGetPlan = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <h1 className="text-4xl font-bold text-center">Escolha seu plano</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <Card key={p.id} className="bg-slate-900">
              <CardHeader className="text-center">
                <CardTitle className="text-white">{p.name}</CardTitle>
                <CardDescription className="text-primary">{p.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="text-sm space-y-1 list-disc list-inside text-slate-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={handleGetPlan} className="w-full mt-4">
                  Obter Plano
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
