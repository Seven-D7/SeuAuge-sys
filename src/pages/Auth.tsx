// src/pages/Auth.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage = () => {
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode') || 'login';

  const [authMode, setAuthMode] = React.useState<'login' | 'register'>(mode as 'login' | 'register');

  const toggleMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          <div className="flex justify-center">
            <div className="bg-white/10 p-4 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold leading-snug">
            Transforme Sua Jornada de <br /> Saúde
          </h1>
          <p className="text-emerald-100 text-sm">
            Acesse conteúdo premium de bem-estar, orientação nutricional especializada e uma loja de produtos de saúde selecionados, tudo em uma plataforma.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="w-1/2 bg-slate-900 flex items-center justify-center p-8">
        {authMode === 'login' ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
