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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Lado esquerdo - Hero section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 flex items-center justify-center p-6 sm:p-8 min-h-[40vh] lg:min-h-screen">
        <div className="text-center max-w-md space-y-4 lg:space-y-6">
          <div className="flex justify-center">
            <div className="bg-slate-900 p-3 sm:p-4 rounded-full shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-slate-900">
            Transforme Sua Jornada de <br className="hidden sm:block" />
            <span className="sm:hidden">Saúde</span>
            <span className="hidden sm:inline">Saúde</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base px-4 lg:px-0">
            Acesse conteúdo premium de bem-estar, orientação nutricional especializada e uma loja de produtos de saúde selecionados, tudo em uma plataforma.
          </p>
        </div>
      </div>

      {/* Lado direito - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen border-l border-slate-200">
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
