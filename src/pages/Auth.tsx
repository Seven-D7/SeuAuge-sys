import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-emerald-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center max-w-lg">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Transforme Sua Jornada de Saúde</h1>
            <p className="text-xl mb-8 text-primary">
              Acesse conteúdo premium de bem-estar, orientação nutricional especializada e uma loja de produtos de saúde selecionados, tudo em uma plataforma.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Vídeos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50k+</div>
                <div className="text-sm">Membros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm">Produtos</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Seu Auge</span>
                <p className="text-xs text-slate-400">Transforme-se</p>
              </div>
            </div>
          </div>

          {isLogin ? (
            <LoginForm
              onToggleMode={() => {
                setSearchParams({ mode: 'register' });
                setIsLogin(false);
              }}
            />
          ) : (
            <RegisterForm
              onToggleMode={() => {
                setSearchParams({ mode: 'login' });
                setIsLogin(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;