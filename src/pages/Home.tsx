import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PLANS } from '../data/plans';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSelectPlan = (planName: string) => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-600 to-cyan-600 opacity-20" />
      <div className="relative max-w-4xl mx-auto space-y-8 px-4">
        <div className="flex justify-end">
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-center">Comece grátis</h1>
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
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleSelectPlan(p.id)}
                  className="w-full mt-4"
                >
                  Comece Grátis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Garantia */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <Shield className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-medium">Garantia de 30 dias ou seu dinheiro de volta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
