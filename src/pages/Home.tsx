import React from 'react';    
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
    navigate('/auth');
  };

  return (
    <>
    <div className="relative min-h-screen bg-slate-950 text-white py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-600 to-cyan-600 opacity-20" />
      <div className="relative max-w-4xl mx-auto space-y-8 px-4">
        <div className="flex justify-end">
          <Link to="/auth" className="text-primary hover:underline font-medium">
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
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Tudo do plano Premium</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Personal trainer dedicado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Consultas semanais 1:1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Exames laboratoriais</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Coaching comportamental</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Garantia de resultado</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  onClick={() => handlePlanSelect('elite')}
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
    </>
  );
}

export default App;

